<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Submit a booking request — PUBLIC, no auth required.
     * Rate-limited per IP at the route level.
     */
    public function store(Request $request, Vehicle $vehicle)
    {
        if (!auth()->check()) {
            return redirect()->route('login', ['intended' => url()->previous()])
                ->with('error', 'Please log in or create an account to reserve this vehicle.');
        }

        $validated = $request->validate([
            'renter_name' => 'required|string|max:255',
            'renter_contact' => 'required|string|max:50',
            'renter_email' => 'nullable|email|max:255',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'pickup_preference' => 'nullable|string',
        ]);

        $user = auth()->user();

        // Prevent host from booking their own vehicle
        if ($vehicle->owner_id === $user->id) {
            return back()->withErrors(['vehicle' => 'You cannot book your own listed vehicle.']);
        }

        // Check vehicle is active
        if ($vehicle->status !== 'active') {
            return back()->withErrors(['vehicle' => 'This vehicle is not currently available.']);
        }

        // Check dates aren't already booked/blocked
        $conflicting = VehicleAvailability::where('vehicle_id', $vehicle->id)
            ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
            ->whereIn('status', ['booked', 'blocked'])
            ->exists();

        if ($conflicting) {
            return back()->withErrors(['dates' => 'Some of the selected dates are not available.']);
        }

        // Check for existing pending/accepted bookings that overlap
        $overlapping = Booking::where('vehicle_id', $vehicle->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->where(function ($q) use ($validated) {
                $q->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                  ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                  ->orWhere(function ($q2) use ($validated) {
                      $q2->where('start_date', '<=', $validated['start_date'])
                         ->where('end_date', '>=', $validated['end_date']);
                  });
            })
            ->exists();

        if ($overlapping) {
            return back()->withErrors(['dates' => 'These dates overlap with an existing booking.']);
        }

        $totalDays = now()->parse($validated['start_date'])->diffInDays(now()->parse($validated['end_date']));
        $withDelivery = ($validated['pickup_preference'] ?? 'host_location') !== 'host_location';
        $quote = $vehicle->calculatePriceQuote($totalDays, $withDelivery);

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $user->id,
            'renter_name' => $validated['renter_name'] ?: $user->name,
            'renter_contact' => $validated['renter_contact'] ?: $user->phone, // Encrypted via model cast
            'renter_email' => $validated['renter_email'] ?: $user->email,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_days' => $totalDays,
            'total_price' => $quote['final_total'],
            'status' => 'pending',
        ]);

        // Send SMS/Email notification alert to host
        \App\Services\NotificationService::notifyHostNewBooking($booking);

        // Log booking attempt for security monitoring
        Log::channel('security')->info('Booking request created', [
            'booking_id' => $booking->id,
            'vehicle_id' => $vehicle->id,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('booking.status', ['token' => $booking->token])
            ->with('success', 'Booking request submitted! The owner will review it shortly.');
    }

    /**
     * Renter status page — accessed via unique UUID token, no auth.
     */
    public function renterStatus(string $token)
    {
        $booking = Booking::where('token', $token)
            ->with(['vehicle' => fn ($q) => $q->with('photos')])
            ->firstOrFail();

        // For renters: show owner contact only after acceptance
        $ownerContact = null;
        if ($booking->isContactUnlocked()) {
            $ownerContact = [
                'name' => $booking->vehicle->owner->name,
                'phone' => $booking->vehicle->owner->phone,
                'email' => $booking->vehicle->owner->email,
            ];
        }

        return Inertia::render('Bookings/RenterStatus', [
            'booking' => [
                'id' => $booking->id,
                'vehicle' => $booking->vehicle,
                'start_date' => $booking->start_date->format('Y-m-d'),
                'end_date' => $booking->end_date->format('Y-m-d'),
                'total_days' => $booking->total_days,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'created_at' => $booking->created_at->toISOString(),
                'token' => $booking->token,
                'can_rate' => $booking->status === 'completed'
                    && !$booking->ratings()->where('rater_type', 'renter')->exists(),
            ],
            'ownerContact' => $ownerContact,
        ]);
    }

    /**
     * Renter submits a rating — accessed via token, no auth.
     */
    public function renterRate(Request $request, string $token)
    {
        $booking = Booking::where('token', $token)->firstOrFail();

        if ($booking->status !== 'completed') {
            return back()->withErrors(['rating' => 'You can only rate completed bookings.']);
        }

        if ($booking->ratings()->where('rater_type', 'renter')->exists()) {
            return back()->withErrors(['rating' => 'You have already rated this booking.']);
        }

        $validated = $request->validate(Rating::rules());

        $booking->ratings()->create([
            'rater_id' => $booking->renter_id ?: auth()->id(),
            'rater_type' => 'renter',
            'rater_identifier' => $booking->renter_name,
            'stars' => $validated['stars'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Update vehicle average rating
        $this->updateVehicleRating($booking->vehicle_id);

        return back()->with('success', 'Thank you for your rating!');
    }

    /**
     * Recalculate vehicle average rating.
     */
    private function updateVehicleRating(int $vehicleId): void
    {
        $vehicle = Vehicle::findOrFail($vehicleId);
        $ratings = Rating::whereHas('booking', fn ($q) => $q->where('vehicle_id', $vehicleId))->get();

        $vehicle->avg_rating = $ratings->avg('stars') ?? 0;
        $vehicle->total_reviews = $ratings->count();
        $vehicle->save();
    }
}
