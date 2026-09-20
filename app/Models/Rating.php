<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = [
        'booking_id',
        'rater_id',
        'rater_type',
        'rater_identifier',
        'stars',
        'comment',
    ];

    protected $casts = [
        'stars' => 'integer',
    ];

    /**
     * Get the user who submitted this rating (3NF relation).
     */
    public function rater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    /**
     * Get the booking this rating belongs to.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Validation rules for stars.
     */
    public static function rules(): array
    {
        return [
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ];
    }
}
