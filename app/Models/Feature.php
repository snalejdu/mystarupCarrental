<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Feature extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'vehicle_type',
        'icon',
    ];

    /**
     * Vehicles that include this equipment feature.
     */
    public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'vehicle_feature')->withTimestamps();
    }

    /**
     * Scope features applicable to a specific vehicle type.
     */
    public function scopeForVehicleType($query, string $vehicleType)
    {
        return $query->where(function ($q) use ($vehicleType) {
            $q->where('vehicle_type', 'all')
              ->orWhere('vehicle_type', $vehicleType);
        });
    }
}
