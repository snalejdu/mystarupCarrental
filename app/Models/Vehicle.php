<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'slug',
        'description',
        'type',
        'brand',
        'model',
        'transmission',
        'seats',
        'has_aircon',
        'price_per_day',
        'security_deposit',
        'fuel_policy',
        'delivery_available',
        'delivery_fee',
        'discount_three_days',
        'discount_weekly',
        'helmets_included',
        'driver_available',
        'location',
        'status',
        'avg_rating',
        'total_reviews',
    ];

    protected $casts = [
        'price_per_day' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'delivery_available' => 'boolean',
        'helmets_included' => 'boolean',
        'driver_available' => 'boolean',
        'discount_three_days' => 'integer',
        'discount_weekly' => 'integer',
        'avg_rating' => 'decimal:1',
        'total_reviews' => 'integer',
        'seats' => 'integer',
        'has_aircon' => 'boolean',
    ];

    /**
     * Get the owner of this vehicle.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the photos for this vehicle.
     */
    public function photos(): HasMany
    {
        return $this->hasMany(VehiclePhoto::class)->orderBy('order');
    }

    /**
     * Get the availability dates for this vehicle.
     */
    public function availability(): HasMany
    {
        return $this->hasMany(VehicleAvailability::class);
    }

    /**
     * Get all bookings for this vehicle.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the primary photo URL.
     */
    public function getPrimaryPhotoAttribute(): ?VehiclePhoto
    {
        return $this->photos->first();
    }

    /**
     * Scope to only active vehicles.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter by location.
     */
    public function scopeInLocation($query, string $location)
    {
        return $query->where('location', $location);
    }

    /**
     * Scope to filter by vehicle type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Calculate price quote with multi-day discounts and optional delivery.
     */
    public function calculatePriceQuote(int $days, bool $withDelivery = false): array
    {
        $baseTotal = $this->price_per_day * $days;
        $discountPercent = 0;

        if ($days >= 7 && $this->discount_weekly > 0) {
            $discountPercent = $this->discount_weekly;
        } elseif ($days >= 3 && $this->discount_three_days > 0) {
            $discountPercent = $this->discount_three_days;
        }

        $discountAmount = ($baseTotal * $discountPercent) / 100;
        $deliveryAmount = ($withDelivery && $this->delivery_available) ? (float) $this->delivery_fee : 0;
        $finalTotal = max(0, $baseTotal - $discountAmount + $deliveryAmount);

        return [
            'days' => $days,
            'price_per_day' => (float) $this->price_per_day,
            'base_total' => (float) $baseTotal,
            'discount_percent' => $discountPercent,
            'discount_amount' => (float) $discountAmount,
            'delivery_amount' => (float) $deliveryAmount,
            'security_deposit' => (float) $this->security_deposit,
            'final_total' => (float) $finalTotal,
        ];
    }

    /**
     * Get the route key name for model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
