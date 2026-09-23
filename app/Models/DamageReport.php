<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DamageReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'reported_by',
        'type',
        'description',
        'location_on_vehicle',
        'photo_path',
        'repair_cost',
        'resolved',
        'resolved_at',
        'resolution_notes',
    ];

    protected $casts = [
        'repair_cost' => 'decimal:2',
        'resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the booking this damage report belongs to.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who reported the damage.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    /**
     * Scope for unresolved damage reports.
     */
    public function scopeUnresolved($query)
    {
        return $query->where('resolved', false);
    }

    /**
     * Scope for new damage (not pre-existing).
     */
    public function scopeNewDamage($query)
    {
        return $query->where('type', 'new_damage');
    }

    /**
     * Mark the damage report as resolved.
     */
    public function markResolved(?string $notes = null): void
    {
        $this->update([
            'resolved' => true,
            'resolved_at' => now(),
            'resolution_notes' => $notes,
        ]);
    }
}
