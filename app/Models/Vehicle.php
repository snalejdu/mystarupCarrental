<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

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
        'year',
        'plate_number',
        'color',
        'vin',
        'transmission',
        'seats',
        'has_aircon',
        'distance_limit',
        'fuel_type',
        'features',
        'price_per_day',
        'security_deposit',
        'fuel_policy',
        'delivery_available',
        'delivery_fee',
        'discount_three_days',
        'discount_weekly',
        'minimum_rental_days',
        'late_fee_per_hour',
        'helmets_included',
        'driver_available',
        'insurance_type',
        'insurance_expiry',
        'registration_expiry',
        'location',
        'status',
    ];

    protected $casts = [
        'price_per_day' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'late_fee_per_hour' => 'decimal:2',
        'delivery_available' => 'boolean',
        'helmets_included' => 'boolean',
        'driver_available' => 'boolean',
        'discount_three_days' => 'integer',
        'discount_weekly' => 'integer',
        'minimum_rental_days' => 'integer',
        'year' => 'integer',
        'avg_rating' => 'decimal:1',
        'total_reviews' => 'integer',
        'seats' => 'integer',
        'has_aircon' => 'boolean',
        'features' => 'array',
        'insurance_expiry' => 'date',
        'registration_expiry' => 'date',
    ];

    /**
     * Booted method to maintain automatic synchronization between
     * the cached features array and the normalized `vehicle_feature` pivot table.
     */
    protected static function booted(): void
    {
        static::saving(function (Vehicle $vehicle) {
            if (empty($vehicle->owner_id)) {
                throw new \InvalidArgumentException('A vehicle must have an owner.');
            }

            $owner = $vehicle->relationLoaded('owner') ? $vehicle->owner : User::find($vehicle->owner_id);
            if ($owner && $owner->role !== 'owner') {
                throw new \InvalidArgumentException("Vehicle owner must have the 'owner' role. User #{$owner->id} has role '{$owner->role}'.");
            }
        });

        static::saved(function (Vehicle $vehicle) {
            if ($vehicle->wasChanged('features') || $vehicle->wasRecentlyCreated) {
                $vehicle->syncNormalizedFeatures();
            }
        });
    }

    /**
     * Synchronize feature tags into normalized `features` and `vehicle_feature` tables (3NF).
     */
    public function syncNormalizedFeatures(): void
    {
        $features = $this->features;
        if (!is_array($features)) {
            return;
        }

        $featureIds = [];
        foreach ($features as $featureName) {
            if (!is_string($featureName) || trim($featureName) === '') {
                continue;
            }
            $slug = Str::slug(trim($featureName));
            $feature = Feature::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => trim($featureName),
                    'category' => 'general',
                    'vehicle_type' => $this->type === 'motorbike' ? 'motorbike' : 'car',
                ]
            );
            $featureIds[] = $feature->id;
        }

        $this->featuresRel()->sync($featureIds);
    }

    /**
     * Get the normalized features (3NF relation).
     */
    public function featuresRel(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'vehicle_feature')->withTimestamps();
    }

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
     * Get all payments across all bookings for this vehicle.
     */
    public function payments(): HasManyThrough
    {
        return $this->hasManyThrough(Payment::class, Booking::class);
    }

    /**
     * Check if the vehicle's insurance has expired.
     */
    public function isInsuranceExpired(): bool
    {
        return $this->insurance_expiry !== null && $this->insurance_expiry->isPast();
    }

    /**
     * Check if the vehicle's LTO registration has expired.
     */
    public function isRegistrationExpired(): bool
    {
        return $this->registration_expiry !== null && $this->registration_expiry->isPast();
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
