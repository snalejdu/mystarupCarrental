<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class VehiclePhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'path',
        'order',
        'position_x',
        'position_y',
        'alt_text',
    ];

    protected $casts = [
        'order' => 'integer',
        'position_x' => 'integer',
        'position_y' => 'integer',
    ];

    protected $appends = ['url'];

    /**
     * Get the vehicle this photo belongs to.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function getUrlAttribute(): string
    {
        if (empty($this->path)) {
            return '';
        }

        if (str_starts_with($this->path, 'http') || str_starts_with($this->path, '/')) {
            return $this->path;
        }

        return route('vehicle.photo', ['photo' => $this->id]);
    }
}
