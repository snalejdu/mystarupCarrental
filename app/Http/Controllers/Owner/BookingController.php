<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Rating;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Owner's booking dashboard — all bookings across their vehicles.
     */
    public function index(Request $request)
    {
        $user = $request->user() ?: auth()->user();
        $vehicleIds = $user ? $user->vehicles()->pluck('id') : [];

        $bookings = Booking::whereIn('vehicle_id', $vehicleIds)
            ->with(['vehicle' => fn ($q) => $q->with(['photos' => fn ($p) => $p->orderBy('order')->limit(1)])])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // CRITICAL: Strip contact info from pending bookings at the query result level
        $bookings->getCollection()->transform(function ($booking) {
            if (!$booking->isContactUnlocked()) {
                // Remove contact info entirely — not just hide in UI
                $booking->makeHidden(['renter_contact', 'renter_email']);
                $booking->setAttribute('renter_display_name', $booking->masked_renter_name);
                $booking->setAttribute('renter_contact', null);
                $booking->setAttribute('renter_email', null);
            } else {
                $booking->setAttribute('renter_display_name', $booking->renter_name);
            }
            return $booking;
        });

        return Inertia::render('Owner/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Host Earnings & Commission Statement.
     */
    public function earnings(Request $request)
    {
        $user = $request->user() ?: auth()->user();
        $vehicleIds = $user ? $user->vehicles()->pluck('id') : [];

        $completedBookings = Booking::whereIn('vehicle_id', $vehicleIds)
            ->where('status', 'completed')
            ->with('vehicle:id,title')
            ->orderBy('updated_at', 'desc')
            ->get();

        $totalGrossRevenue = $completedBookings->sum('total_price');
        $totalCommissionPaid = $completedBookings->sum('commission_amount');
        $netPayout = $totalGrossRevenue - $totalCommissionPaid;

        return Inertia::render('Owner/Earnings/Index', [
            'earnings' => [
                'total_gross' => $totalGrossRevenue,
                'total_commission' => $totalCommissionPaid,
                'net_payout' => $netPayout,
                'completed_count' => $completedBookings->count(),
            ],
            'statements' => $completedBookings,
        ]);
    }

    /**
     * View single booking details.
     */
    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);

        $booking->load(['vehicle.photos', 'ratings']);

        // Enforce contact visibility at the data level
        $bookingData = $booking->toArray();
        if (!$booking->isContactUnlocked()) {
            $bookingData['renter_contact'] = null;
            $bookingData['renter_email'] = null;
            $bookingData['renter_display_name'] = $booking->masked_renter_name;
        } else {
            $bookingData['renter_display_name'] = $booking->renter_name;
        }

        $bookingData['can_rate'] = $booking->status === 'completed'
            && !$booking->ratings()->where('rater_type', 'owner')->exists();

        return Inertia::render('Owner/Bookings/Show', [
            'booking' => $bookingData,
        ]);
    }

    /**
     * Accept a booking — unlocks contact info, blocks calendar dates.
     */
    public function accept(Booking $booking)
    {
        Gate::authorize('accept', $booking);

        $booking->update([
            'status' => 'accepted',
            'contact_unlocked_at' => now(),
            'accepted_at' => now(),
        ]);

        // Block dates on the vehicle's availability calendar
        $startDate = $booking->start_date;
        $endDate = $booking->end_date;
        $period = $startDate->toPeriod($endDate);

        foreach ($period as $date) {
            VehicleAvailability::updateOrCreate(
                [
                    'vehicle_id' => $booking->vehicle_id,
                    'date' => $date->format('Y-m-d'),
                ],
                ['status' => 'booked']
            );
        }

        // Decline any other pending bookings that overlap with these dates
        Booking::where('vehicle_id', $booking->vehicle_id)
            ->where('id', '!=', $booking->id)
            ->where('status', 'pending')
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(function ($q2) use ($startDate, $endDate) {
                      $q2->where('start_date', '<=', $startDate)
                         ->where('end_date', '>=', $endDate);
                  });
            })
            ->update(['status' => 'declined']);

        // Send SMS/Email alert to renter with host contact details
        \App\Services\NotificationService::notifyRenterBookingAccepted($booking);

        return back()->with('success', 'Booking accepted! Contact details are now unlocked for both parties.');
    }

    /**
     * Decline a booking.
     */
    public function decline(Booking $booking)
    {
        Gate::authorize('decline', $booking);

        $booking->update(['status' => 'declined']);

        return back()->with('success', 'Booking declined. The dates remain available.');
    }

    /**
     * Mark booking as completed (vehicle returned).
     */
    public function complete(Booking $booking)
    {
        Gate::authorize('complete', $booking);

        $booking->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Free up the dates on the calendar
        VehicleAvailability::where('vehicle_id', $booking->vehicle_id)
            ->whereBetween('date', [$booking->start_date, $booking->end_date])
            ->where('status', 'booked')
            ->update(['status' => 'available']);

        return back()->with('success', 'Booking marked as completed. A commission of ₱' . number_format($booking->commission_amount) . ' has been logged.');
    }

    /**
     * Cancel an accepted or pending booking by host.
     */
    public function cancel(Booking $booking)
    {
        Gate::authorize('decline', $booking);

        $booking->update([
            'status' => 'cancelled',
        ]);

        // Free up dates on the availability calendar if it was booked
        VehicleAvailability::where('vehicle_id', $booking->vehicle_id)
            ->whereBetween('date', [$booking->start_date, $booking->end_date])
            ->where('status', 'booked')
            ->update(['status' => 'available']);

        return back()->with('success', 'Booking cancelled. The dates are now available again on the calendar.');
    }

    /**
     * Owner submits a rating for a completed booking.
     */
    public function rate(Request $request, Booking $booking)
    {
        Gate::authorize('rateAsOwner', $booking);

        if ($booking->ratings()->where('rater_type', 'owner')->exists()) {
            return back()->withErrors(['rating' => 'You have already rated this booking.']);
        }

        $validated = $request->validate(Rating::rules());

        $userId = $request->user()?->id ?? auth()->id();
        $booking->ratings()->create([
            'rater_id' => $userId,
            'rater_type' => 'owner',
            'rater_identifier' => (string) $userId,
            'stars' => $validated['stars'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with('success', 'Rating submitted. Thank you!');
    }
}
