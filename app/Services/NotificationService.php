<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send SMS & Email notification to host when a new booking request is filed.
     */
    public static function notifyHostNewBooking(Booking $booking): void
    {
        $vehicle = $booking->vehicle;
        $owner = $vehicle->owner;

        if (!$owner) {
            return;
        }

        $message = "RentBohol Host Alert: You have a new rental request for {$vehicle->title} from {$booking->start_date} to {$booking->end_date}. Log in to review & accept!";

        Log::channel('single')->info('SMS & Email Notification to Host', [
            'to_phone' => $owner->phone,
            'to_email' => $owner->email,
            'message' => $message,
            'booking_id' => $booking->id,
        ]);
    }

    /**
     * Send SMS & Email notification to renter when host accepts the booking request.
     */
    public static function notifyRenterBookingAccepted(Booking $booking): void
    {
        $vehicle = $booking->vehicle;
        $owner = $vehicle->owner;

        $hostPhone = $owner->phone ?? '(038) 501-8888';
        $hostName = $owner->name ?? 'Host';

        $message = "RentBohol Trip Confirmed! Your request for {$vehicle->title} was ACCEPTED. Contact Host {$hostName} at {$hostPhone} for pickup details.";

        Log::channel('single')->info('SMS & Email Notification to Renter', [
            'to_phone' => $booking->renter_contact,
            'to_email' => $booking->renter_email,
            'message' => $message,
            'unlocked_host_phone' => $hostPhone,
            'booking_id' => $booking->id,
        ]);
    }
}
