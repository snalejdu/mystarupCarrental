<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'renter_id',
        'renter_name',
        'renter_contact',
        'renter_email',
        'start_date',
        'end_date',
        'total_days',
        'total_price',
        'status',
        'pickup_location',
        'dropoff_location',
        'pickup_time',
        'dropoff_time',
        'delivery_address',
        'cancelled_at',
        'declined_at',
        'cancellation_reason',
        'owner_notes',
        'late_fee_charged',
        'checkin_odometer',
        'checkin_fuel',
        'checkin_notes',
        'checkout_odometer',
        'checkout_fuel',
        'checkout_deposit_refunded',
        'contact_unlocked_at',
        'accepted_at',
        'completed_at',
    ];

    /**
     * Get the renter user account if registered.
     */
    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    protected $casts = [
        'renter_contact' => 'encrypted',
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'integer',
        'total_price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'late_fee_charged' => 'decimal:2',
        'checkout_deposit_refunded' => 'boolean',
        'contact_unlocked_at' => 'datetime',
        'accepted_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'declined_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate UUID token on creation
        static::creating(function ($booking) {
            if (empty($booking->token)) {
                $booking->token = Str::uuid()->toString();
            }

            // Auto-calculate commission
            if (empty($booking->commission_rate)) {
                $booking->commission_rate = config('rentbohol.commission_rate', 4);
            }
            if (empty($booking->commission_amount)) {
                $booking->commission_amount = $booking->total_price * ($booking->commission_rate / 100);
            }
        });

        // Automatically sync handover inspections into normalized `booking_handovers` table
        static::saved(function ($booking) {
            $handoverFields = [
                'checkin_odometer', 'checkin_fuel', 'checkin_notes',
                'checkout_odometer', 'checkout_fuel', 'checkout_deposit_refunded'
            ];
            $hasHandoverData = false;
            foreach ($handoverFields as $f) {
                if ($booking->$f !== null) {
                    $hasHandoverData = true;
                    break;
                }
            }

            if ($hasHandoverData) {
                BookingHandover::updateOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'checkin_odometer' => $booking->checkin_odometer,
                        'checkin_fuel' => $booking->checkin_fuel,
                        'checkin_notes' => $booking->checkin_notes,
                        'checkin_verified_at' => ($booking->checkin_odometer || $booking->checkin_fuel) ? now() : null,
                        'checkout_odometer' => $booking->checkout_odometer,
                        'checkout_fuel' => $booking->checkout_fuel,
                        'checkout_deposit_refunded' => (bool) $booking->checkout_deposit_refunded,
                        'checkout_verified_at' => ($booking->checkout_odometer || $booking->checkout_fuel) ? now() : null,
                    ]
                );
            }
        });
    }

    /**
     * Get the handover inspection record (3NF relation).
     */
    public function handover(): HasOne
    {
        return $this->hasOne(BookingHandover::class);
    }

    /**
     * Get the vehicle for this booking.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the ratings for this booking.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get the payments for this booking.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the damage reports for this booking.
     */
    public function damageReports(): HasMany
    {
        return $this->hasMany(DamageReport::class);
    }

    /**
     * Check if contact info should be visible.
     */
    public function isContactUnlocked(): bool
    {
        return $this->status === 'accepted' || $this->status === 'completed';
    }

    /**
     * Get masked renter name for display before acceptance.
     * "John Doe" → "J***n D**"
     */
    public function getMaskedRenterNameAttribute(): string
    {
        return collect(explode(' ', $this->renter_name))
            ->map(function ($part) {
                if (strlen($part) <= 2) return $part[0] . '*';
                return $part[0] . str_repeat('*', strlen($part) - 2) . substr($part, -1);
            })
            ->implode(' ');
    }

    /**
     * Scope for pending bookings.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for confirmed (accepted) bookings.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'accepted');
    }

    /**
     * Scope for completed bookings.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
