<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use App\Models\VehiclePhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Database\Eloquent\Model::unguard();

        // 1. Create Admin User
        $admin = User::create([
            'name' => 'RentBohol Admin',
            'email' => 'admin@rentbohol.com',
            'phone' => '09171234567',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 2. Create Owner Users
        $owner1 = User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@boholrentals.ph',
            'phone' => '09189876543',
            'password' => Hash::make('password123'),
            'role' => 'owner',
        ]);

        $owner2 = User::create([
            'name' => 'Pedro Penduko',
            'email' => 'juan@panglaowheels.com',
            'phone' => '09205551234',
            'password' => Hash::make('password123'),
            'role' => 'owner',
        ]);

        // 3. Create Sample Renter User
        $renter = User::create([
            'name' => 'Juan Dela Cruz (Renter)',
            'email' => 'renter@gmail.com',
            'phone' => '09179998877',
            'password' => Hash::make('password123'),
            'role' => 'renter',
        ]);

        // 3. Create Sample Vehicles in Bohol
        $vehiclesData = [
            [
                'owner_id' => $owner1->id,
                'title' => '2024 Toyota Vios 1.5G AT — Tagbilaran Pickup',
                'slug' => 'toyota-vios-tagbilaran-pickup',
                'type' => 'car',
                'brand' => 'Toyota',
                'model' => 'Vios',
                'price_per_day' => 2200,
                'location' => 'Tagbilaran',
                'description' => "Well-maintained 2024 sedan, clean interior, cold AC, automatic transmission. Perfect for island tours around Bohol and Tagbilaran city trips.\n\nIncludes free airport/pier delivery within Tagbilaran City.",
                'status' => 'active',
                'avg_rating' => 4.9,
                'total_reviews' => 12,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'Nissan Urvan NV350 (15-Seater) — Panglao Island',
                'slug' => 'nissan-urvan-nv350-panglao',
                'type' => 'van',
                'brand' => 'Nissan',
                'model' => 'Urvan NV350',
                'price_per_day' => 3800,
                'location' => 'Panglao',
                'description' => "Spacious 15-seater van ideal for family outings and group tours to Chocolate Hills, Loboc River Cruise, and Panglao beaches. Self-drive or with driver optional.",
                'status' => 'active',
                'avg_rating' => 4.8,
                'total_reviews' => 8,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Honda Click 125i Scooter — Alona Beach, Panglao',
                'slug' => 'honda-click-125i-alona-panglao',
                'type' => 'motorbike',
                'brand' => 'Honda',
                'model' => 'Click 125i',
                'price_per_day' => 500,
                'location' => 'Panglao',
                'description' => "Fuel-efficient automatic scooter, perfect for quick rides around Alona Beach and Panglao island. Includes 2 clean helmets and cell phone holder.",
                'status' => 'active',
                'avg_rating' => 5.0,
                'total_reviews' => 19,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Mitsubishi Montero Sport 4x2 AT — Dauis',
                'slug' => 'mitsubishi-montero-sport-dauis',
                'type' => 'suv',
                'brand' => 'Mitsubishi',
                'model' => 'Montero Sport',
                'price_per_day' => 3500,
                'location' => 'Dauis',
                'description' => "Premium 7-seater SUV with high ground clearance for comfortable cross-country drives across Bohol. Leather seats, touchscreen infotainment, push start.",
                'status' => 'active',
                'avg_rating' => 4.7,
                'total_reviews' => 6,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'Yamaha NMAX 155 ABS — Loboc Town Center',
                'slug' => 'yamaha-nmax-155-loboc',
                'type' => 'motorbike',
                'brand' => 'Yamaha',
                'model' => 'NMAX 155',
                'price_per_day' => 700,
                'location' => 'Loboc',
                'description' => "Powerful 155cc max-scooter with ABS. Smooth power delivery for hilly routes heading to Bilar Man-Made Forest and Carmen Chocolate Hills.",
                'status' => 'active',
                'avg_rating' => 4.9,
                'total_reviews' => 5,
            ]
        ];

        $photosMap = [
            'toyota-vios-tagbilaran-pickup' => '/images/demo/vios.png',
            'nissan-urvan-nv350-panglao' => '/images/demo/urvan.png',
            'honda-click-125i-alona-panglao' => '/images/demo/click.png',
            'mitsubishi-montero-sport-dauis' => '/images/demo/montero.png',
            'yamaha-nmax-155-loboc' => '/images/demo/click.png',
        ];

        foreach ($vehiclesData as $vData) {
            $vehicle = Vehicle::create($vData);

            // Add photo
            if (isset($photosMap[$vehicle->slug])) {
                VehiclePhoto::create([
                    'vehicle_id' => $vehicle->id,
                    'path' => $photosMap[$vehicle->slug],
                    'order' => 1,
                    'alt_text' => $vehicle->title,
                ]);
            }

            // Add placeholder availability dates
            for ($i = 0; $i < 30; $i++) {
                $dateStr = now()->addDays($i)->toDateString();
                VehicleAvailability::create([
                    'vehicle_id' => $vehicle->id,
                    'date' => $dateStr,
                    'status' => $i % 7 === 0 ? 'blocked' : 'available',
                ]);
            }
        }

        // 4. Sample Confirmed & Completed Bookings
        $sampleVehicle = Vehicle::first();
        $bookingCompleted = Booking::create([
            'vehicle_id' => $sampleVehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => 'Juan Dela Cruz (Renter)',
            'renter_contact' => '09179998877',
            'renter_email' => 'renter@gmail.com',
            'token' => (string) Str::uuid(),
            'start_date' => now()->subDays(5)->toDateString(),
            'end_date' => now()->subDays(2)->toDateString(),
            'total_days' => 3,
            'total_price' => $sampleVehicle->price_per_day * 3,
            'commission_rate' => 4.00,
            'commission_amount' => ($sampleVehicle->price_per_day * 3) * 0.04,
            'status' => 'completed',
            'contact_unlocked_at' => now()->subDays(5),
            'accepted_at' => now()->subDays(5),
            'completed_at' => now()->subDays(2),
        ]);

        Rating::create([
            'booking_id' => $bookingCompleted->id,
            'rater_type' => 'renter',
            'rater_identifier' => 'Juan Dela Cruz',
            'stars' => 5,
            'comment' => 'Smooth pickup at Tagbilaran pier! Clean Vios with cold AC.',
        ]);

        $bookingAccepted = Booking::create([
            'vehicle_id' => $sampleVehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => 'Juan Dela Cruz (Renter)',
            'renter_contact' => '09179998877',
            'renter_email' => 'renter@gmail.com',
            'token' => (string) Str::uuid(),
            'start_date' => now()->addDays(2)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
            'total_days' => 3,
            'total_price' => $sampleVehicle->price_per_day * 3,
            'commission_rate' => 4.00,
            'commission_amount' => ($sampleVehicle->price_per_day * 3) * 0.04,
            'status' => 'accepted',
            'contact_unlocked_at' => now(),
            'accepted_at' => now(),
        ]);

        \Illuminate\Database\Eloquent\Model::reguard();
    }
}
