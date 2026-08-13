<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Commission Rate
    |--------------------------------------------------------------------------
    |
    | The platform commission rate as a percentage. This is deducted from
    | each confirmed booking's total price. Default: 4% for MVP.
    |
    */
    'commission_rate' => (float) env('COMMISSION_RATE', 4),

    /*
    |--------------------------------------------------------------------------
    | Bohol Locations
    |--------------------------------------------------------------------------
    |
    | Predefined list of municipalities in Bohol where vehicles can be
    | listed for pickup.
    |
    */
    'locations' => [
        'Tagbilaran',
        'Panglao',
        'Dauis',
        'Alburquerque',
        'Baclayon',
        'Loboc',
        'Carmen',
        'Talibon',
        'Tubigon',
        'Jagna',
        'Ubay',
        'Anda',
        'Loon',
        'Calape',
        'Cortes',
        'Sikatuna',
        'Balilihan',
        'Antequera',
        'Maribojoc',
        'Loay',
    ],

    /*
    |--------------------------------------------------------------------------
    | Vehicle Types
    |--------------------------------------------------------------------------
    */
    'vehicle_types' => ['car', 'van', 'motorbike', 'suv'],

    /*
    |--------------------------------------------------------------------------
    | Photo Upload Settings
    |--------------------------------------------------------------------------
    */
    'photos' => [
        'max_size_kb' => 5120, // 5MB
        'max_per_vehicle' => 10,
        'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
        'max_width' => 1200,
        'quality' => 80,
    ],
];
