<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RenterBookingController extends Controller
{
    /**
     * Display all bookings for the authenticated renter.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Also catch any unlinked guest bookings matching this user's email
        Booking::where('renter_email', $user->email)
            ->whereNull('renter_id')
            ->update(['renter_id' => $user->id]);

        $bookings = Booking::where('renter_id', $user->id)
            ->with(['vehicle' => fn ($q) => $q->with('photos', 'owner')])
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
                    'created_at' => $booking->created_at->toISOString(),
                    'owner_contact' => $booking->isContactUnlocked() ? [
                        'name' => $booking->vehicle->owner->name,
                        'phone' => $booking->vehicle->owner->phone,
                        'email' => $booking->vehicle->owner->email,
                    ] : null,
                    'can_rate' => $booking->status === 'completed'
                        && !$booking->ratings()->where('rater_type', 'renter')->exists(),
                ];
            });

        return Inertia::render('Renter/Bookings', [
            'bookings' => $bookings,
            'renter' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
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
