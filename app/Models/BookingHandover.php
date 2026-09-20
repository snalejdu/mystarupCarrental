<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingHandover extends Model
{
    use HasFactory;

    protected $table = 'booking_handovers';

    protected $fillable = [
        'booking_id',
        'checkin_odometer',
        'checkin_fuel',
        'checkin_notes',
        'checkin_verified_at',
        'checkout_odometer',
        'checkout_fuel',
        'checkout_notes',
        'checkout_deposit_refunded',
        'checkout_verified_at',
    ];

    protected $casts = [
        'checkin_verified_at' => 'datetime',
        'checkout_verified_at' => 'datetime',
        'checkout_deposit_refunded' => 'boolean',
    ];

    /**
     * Get the booking this handover inspection belongs to.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
