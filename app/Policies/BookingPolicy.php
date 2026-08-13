<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Only the vehicle owner can view booking details.
     */
    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id;
    }

    /**
     * Only the vehicle owner can accept a booking.
     */
    public function accept(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id
            && $booking->status === 'pending';
    }

    /**
     * Only the vehicle owner can decline a booking.
     */
    public function decline(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id
            && $booking->status === 'pending';
    }

    /**
     * Only the vehicle owner can mark a booking as completed.
     */
    public function complete(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id
            && $booking->status === 'accepted';
    }

    /**
     * Only the vehicle owner can rate on a completed booking.
     */
    public function rateAsOwner(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id
            && $booking->status === 'completed';
    }

    /**
     * Only the vehicle owner can access renter contact info,
     * AND only after they've accepted the booking.
     */
    public function viewContact(User $user, Booking $booking): bool
    {
        return $user->id === $booking->vehicle->owner_id
            && $booking->isContactUnlocked();
    }
}
