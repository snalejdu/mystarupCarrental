<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleAvailability extends Model
{
    protected $table = 'vehicle_availability';

    protected $fillable = [
        'vehicle_id',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the vehicle this availability belongs to.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
