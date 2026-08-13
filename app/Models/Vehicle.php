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
        'price_per_day',
        'location',
        'status',
        'avg_rating',
        'total_reviews',
    ];

    protected $casts = [
        'price_per_day' => 'decimal:2',
        'avg_rating' => 'decimal:1',
        'total_reviews' => 'integer',
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
     * Get the route key name for model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
