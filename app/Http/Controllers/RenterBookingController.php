<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RenterBookingController extends Controller
{
    /**
     * Display all bookings for the authenticated renter.
     */
    public function index(Request $request)
    {
        $user = $request->user() ?: auth()->user();
        if (!$user) {
            abort(401);
        }

        // Also catch any unlinked guest bookings matching this user's email
        Booking::where('renter_email', $user->email)
            ->whereNull('renter_id')
            ->update(['renter_id' => $user->id]);

        $bookings = Booking::where('renter_id', $user->id)
            ->with(['vehicle' => fn ($q) => $q->with('photos', 'owner'), 'ratings'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'token' => $booking->token,
                    'vehicle' => $booking->vehicle,
                    'start_date' => $booking->start_date->format('Y-m-d'),
                    'end_date' => $booking->end_date->format('Y-m-d'),
                    'total_days' => $booking->total_days,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'checkin_odometer' => $booking->checkin_odometer,
                    'checkin_fuel' => $booking->checkin_fuel,
                    'checkin_notes' => $booking->checkin_notes,
                    'checkout_odometer' => $booking->checkout_odometer,
                    'checkout_fuel' => $booking->checkout_fuel,
                    'checkout_deposit_refunded' => $booking->checkout_deposit_refunded,
                    'created_at' => $booking->created_at->toISOString(),
                    'owner_contact' => $booking->isContactUnlocked() ? [
                        'name' => $booking->vehicle->owner->name,
                        'phone' => $booking->vehicle->owner->phone,
                        'email' => $booking->vehicle->owner->email,
                    ] : null,
                    'can_rate' => $booking->status === 'completed'
                        && !$booking->ratings->where('rater_type', 'renter')->isNotEmpty(),
                    'renter_rating' => $booking->ratings->where('rater_type', 'renter')->first(),
                ];
            });

        return Inertia::render('Renter/Bookings', [
            'bookings' => $bookings,
            'renter' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'driver_license_path' => $user->driver_license_path ? asset('storage/' . $user->driver_license_path) : null,
                'driver_license_status' => $user->driver_license_status ?? 'unverified',
            ],
        ]);
    }

    /**
     * Upload / Update Renter Driver's License.
     */
    public function uploadLicense(Request $request)
    {
        $request->validate([
            'license_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $user = $request->user() ?: auth()->user();
        if (!$user) {
            abort(401);
        }

        if ($request->hasFile('license_photo')) {
            // Delete old file if exists
            if ($user->driver_license_path && Storage::disk('public')->exists($user->driver_license_path)) {
                Storage::disk('public')->delete($user->driver_license_path);
            }

            $path = $request->file('license_photo')->store('licenses', 'public');
            $user->driver_license_path = $path;
            $user->driver_license_status = 'verified'; // Auto-verified for seamless UX
            $user->save();
        }

        return back()->with('success', 'Driver\'s license uploaded and verified successfully! 🪪');
    }

    /**
     * Submit a review & rating for a completed booking.
     */
    public function rate(Request $request, Booking $booking)
    {
        if ($booking->renter_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'completed') {
            return back()->withErrors(['booking' => 'Only completed rentals can be reviewed.']);
        }

        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Rating::updateOrCreate(
            [
                'booking_id' => $booking->id,
                'rater_type' => 'renter',
            ],
            [
                'rater_id' => auth()->id(),
                'rater_identifier' => auth()->user()->name,
                'stars' => $validated['stars'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        return back()->with('success', 'Thank you for your review! Your feedback helps other Bohol travelers.');
    }

    /**
     * Update digital handover checklist notes.
     */
    public function updateHandover(Request $request, Booking $booking)
    {
        if ($booking->renter_id !== auth()->id() && $booking->vehicle->owner_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'checkin_odometer' => 'nullable|string|max:50',
            'checkin_fuel' => 'nullable|string|max:50',
            'checkin_notes' => 'nullable|string|max:1000',
            'checkout_odometer' => 'nullable|string|max:50',
            'checkout_fuel' => 'nullable|string|max:50',
            'checkout_deposit_refunded' => 'nullable|boolean',
        ]);

        $booking->update($validated);

        return back()->with('success', 'Handover checklist updated.');
    }

    /**
     * Cancel a pending booking request.
     */
    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->renter_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'pending') {
            return back()->withErrors(['booking' => 'Only pending booking requests can be cancelled.']);
        }

        $booking->update(['status' => 'declined']);

        return back()->with('success', 'Booking request cancelled successfully.');
    }
}
