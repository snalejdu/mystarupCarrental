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
        'alt_text',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    /**
     * Get the vehicle this photo belongs to.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get a signed temporary URL for the photo.
     * Photos are stored outside public root for security.
     */
    public function getUrlAttribute(): string
    {
        if (str_starts_with($this->path, 'http') || str_starts_with($this->path, '/')) {
            return $this->path;
        }

        if (Storage::disk('private')->exists($this->path)) {
            return Storage::disk('private')->temporaryUrl(
                $this->path,
                now()->addMinutes(60)
            );
        }

        return route('vehicle.photo', ['photo' => $this->id]);
    }
}
