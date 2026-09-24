<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\DamageReport;
use App\Models\Payment;
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
            'name' => 'RentalHub Admin',
            'email' => 'admin@RentalHub.com',
            'phone' => '09171234567',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'address' => 'Bohol Provincial Capitol Complex, Tagbilaran City, Bohol',
            'date_of_birth' => '1988-04-15',
        ]);

        // 2. Create Primary Demo Owner User (Maria Santos)
        $owner = User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@boholrentals.ph',
            'phone' => '09189876543',
            'password' => Hash::make('password123'),
            'role' => 'owner',
            'address' => 'Poblacion 2, Tagbilaran City, Bohol',
            'emergency_contact_name' => 'Carlos Santos',
            'emergency_contact_phone' => '09191122334',
        ]);

        // 3. Create Sample Renter User (Juan Dela Cruz) - 0 vehicles owned
        $renter = User::create([
            'name' => 'Juan Dela Cruz (Renter)',
            'email' => 'renter@gmail.com',
            'phone' => '09179998877',
            'password' => Hash::make('password123'),
            'role' => 'renter',
            'address' => 'Unit 402, Legaspi Towers, Makati City, Metro Manila',
            'date_of_birth' => '1995-08-20',
            'emergency_contact_name' => 'Maria Dela Cruz',
            'emergency_contact_phone' => '09171112233',
            'driver_license_number' => 'N02-15-894721',
            'driver_license_expiry' => now()->addYears(3)->toDateString(),
            'driver_license_status' => 'verified',
        ]);

        // 4. Create Sample Vehicles in Bohol with Full Production Specs
        // All vehicles are strictly owned by the seeded owner ($owner)
        $vehiclesData = [
            [
                'owner_id' => $owner->id,
                'title' => '2024 Toyota Vios 1.5G AT — Tagbilaran Pickup',
                'slug' => 'toyota-vios-tagbilaran-pickup',
                'type' => 'car',
                'brand' => 'Toyota',
                'model' => 'Vios',
                'year' => 2024,
                'plate_number' => 'GAP 5812',
                'color' => 'Pearl White',
                'vin' => 'JTDFY22B4N0198421',
                'price_per_day' => 2200,
                'location' => 'Tagbilaran',
                'insurance_type' => 'comprehensive',
                'insurance_expiry' => now()->addMonths(10)->toDateString(),
                'minimum_rental_days' => 1,
                'late_fee_per_hour' => 200.00,
                'registration_expiry' => now()->addMonths(8)->toDateString(),
                'description' => "Well-maintained 2024 sedan, clean interior, cold AC, automatic transmission. Perfect for island tours around Bohol and Tagbilaran city trips.\n\nIncludes free airport/pier delivery within Tagbilaran City.",
                'status' => 'active',
                'avg_rating' => 4.9,
                'total_reviews' => 12,
            ],
            [
                'owner_id' => $owner->id,
                'title' => 'Nissan Urvan NV350 (15-Seater) — Panglao Island',
                'slug' => 'nissan-urvan-nv350-panglao',
                'type' => 'van',
                'brand' => 'Nissan',
                'model' => 'Urvan NV350',
                'year' => 2023,
                'plate_number' => 'GAH 9014',
                'color' => 'Silver Metallic',
                'vin' => 'JN6DA20X5P0381924',
                'price_per_day' => 3800,
                'location' => 'Panglao',
                'insurance_type' => 'comprehensive',
                'insurance_expiry' => now()->addMonths(11)->toDateString(),
                'minimum_rental_days' => 1,
                'late_fee_per_hour' => 300.00,
                'registration_expiry' => now()->addMonths(6)->toDateString(),
                'description' => "Spacious 15-seater van ideal for family outings and group tours to Chocolate Hills, Loboc River Cruise, and Panglao beaches. Self-drive or with driver optional.",
                'status' => 'active',
                'avg_rating' => 4.8,
                'total_reviews' => 8,
            ],
            [
                'owner_id' => $owner->id,
                'title' => 'Honda Click 125i Scooter — Alona Beach, Panglao',
                'slug' => 'honda-click-125i-alona-panglao',
                'type' => 'motorbike',
                'brand' => 'Honda',
                'model' => 'Click 125i',
                'year' => 2024,
                'plate_number' => '7104 GB',
                'color' => 'Matte Black',
                'vin' => 'MH1JM3119PK104928',
                'price_per_day' => 500,
                'location' => 'Panglao',
                'insurance_type' => 'third_party',
                'insurance_expiry' => now()->addMonths(9)->toDateString(),
                'minimum_rental_days' => 1,
                'late_fee_per_hour' => 50.00,
                'registration_expiry' => now()->addMonths(7)->toDateString(),
                'description' => "Fuel-efficient automatic scooter, perfect for quick rides around Alona Beach and Panglao island. Includes 2 clean helmets and cell phone holder.",
                'status' => 'active',
                'avg_rating' => 5.0,
                'total_reviews' => 19,
            ],
            [
                'owner_id' => $owner->id,
                'title' => 'Mitsubishi Montero Sport 4x2 AT — Dauis',
                'slug' => 'mitsubishi-montero-sport-dauis',
                'type' => 'suv',
                'brand' => 'Mitsubishi',
                'model' => 'Montero Sport',
                'year' => 2023,
                'plate_number' => 'NAE 4821',
                'color' => 'Jet Black',
                'vin' => 'MMBJRKS10PH029415',
                'price_per_day' => 3500,
                'location' => 'Dauis',
                'insurance_type' => 'comprehensive',
                'insurance_expiry' => now()->addMonths(12)->toDateString(),
                'minimum_rental_days' => 2,
                'late_fee_per_hour' => 350.00,
                'registration_expiry' => now()->addMonths(9)->toDateString(),
                'description' => "Premium 7-seater SUV with high ground clearance for comfortable cross-country drives across Bohol. Leather seats, touchscreen infotainment, push start.",
                'status' => 'active',
                'avg_rating' => 4.7,
                'total_reviews' => 6,
            ],
            [
                'owner_id' => $owner->id,
                'title' => 'Yamaha NMAX 155 ABS — Loboc Town Center',
                'slug' => 'yamaha-nmax-155-loboc',
                'type' => 'motorbike',
                'brand' => 'Yamaha',
                'model' => 'NMAX 155',
                'year' => 2024,
                'plate_number' => '8291 GA',
                'color' => 'Phantom Blue',
                'vin' => 'MH3SG5210PK839102',
                'price_per_day' => 700,
                'location' => 'Loboc',
                'insurance_type' => 'third_party',
                'insurance_expiry' => now()->addMonths(5)->toDateString(),
                'minimum_rental_days' => 1,
                'late_fee_per_hour' => 70.00,
                'registration_expiry' => now()->addMonths(4)->toDateString(),
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

        // 5. Sample Confirmed & Completed Bookings with Real-World Handover Details
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
            'pickup_location' => 'Tagbilaran Seaport Pier 1 Arrival Area',
            'dropoff_location' => 'Tagbilaran Seaport Pier 1 Departure Area',
            'pickup_time' => '09:00:00',
            'dropoff_time' => '17:00:00',
            'owner_notes' => 'Guest arrived via OceanJet ferry from Cebu. Clean handover done.',
            'checkin_odometer' => 12450,
            'checkout_odometer' => 12780,
            'checkin_fuel' => 'Full',
            'checkout_fuel' => 'Full',
            'checkout_deposit_refunded' => true,
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

        // Sample Payments for Completed Booking
        Payment::create([
            'booking_id' => $bookingCompleted->id,
            'payer_id' => $renter->id,
            'type' => 'deposit',
            'method' => 'gcash',
            'amount' => 1000.00,
            'reference_number' => 'GCASH-928471928',
            'status' => 'confirmed',
            'paid_at' => now()->subDays(6),
            'confirmed_by' => $owner->id,
            'notes' => 'Security deposit received via GCash',
        ]);

        Payment::create([
            'booking_id' => $bookingCompleted->id,
            'payer_id' => $renter->id,
            'type' => 'rental',
            'method' => 'gcash',
            'amount' => $bookingCompleted->total_price,
            'reference_number' => 'GCASH-928501239',
            'status' => 'confirmed',
            'paid_at' => now()->subDays(5),
            'confirmed_by' => $owner->id,
            'notes' => 'Full rental fee settled prior to vehicle turnover',
        ]);

        Payment::create([
            'booking_id' => $bookingCompleted->id,
            'payer_id' => $owner->id,
            'type' => 'refund',
            'method' => 'gcash',
            'amount' => 1000.00,
            'reference_number' => 'GCASH-929004812',
            'status' => 'confirmed',
            'paid_at' => now()->subDays(2),
            'confirmed_by' => $owner->id,
            'notes' => 'Security deposit refunded upon spotless vehicle return',
        ]);

        // Sample Damage Report (Pre-existing condition documented)
        DamageReport::create([
            'booking_id' => $bookingCompleted->id,
            'reported_by' => $owner->id,
            'type' => 'pre_existing',
            'description' => 'Minor 2cm hairline paint scratch on rear bumper near trunk handle, noted during pre-trip inspection.',
            'location_on_vehicle' => 'Rear Bumper Center',
            'photo_path' => null,
            'repair_cost' => null,
            'resolved' => true,
            'resolved_at' => now()->subDays(5),
            'resolution_notes' => 'Pre-existing condition documented before trip; renter signed inspection sheet.',
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
            'pickup_location' => 'Panglao-Bohol International Airport (TAG)',
            'dropoff_location' => 'Panglao-Bohol International Airport (TAG)',
            'pickup_time' => '14:00:00',
            'dropoff_time' => '12:00:00',
            'owner_notes' => 'Flight PR 2773 from Manila landing at 13:45. Prepare vehicle with clean child seat.',
            'status' => 'accepted',
            'contact_unlocked_at' => now(),
            'accepted_at' => now(),
        ]);

        Payment::create([
            'booking_id' => $bookingAccepted->id,
            'payer_id' => $renter->id,
            'type' => 'deposit',
            'method' => 'gcash',
            'amount' => 1500.00,
            'reference_number' => 'GCASH-930198451',
            'status' => 'confirmed',
            'paid_at' => now(),
            'confirmed_by' => $owner->id,
            'notes' => 'Reservation deposit confirmed',
        ]);

        // Enforce Seeding Integrity Invariants:
        // 1. Every seeded vehicle MUST have an owner, and that owner must have role 'owner'
        foreach (Vehicle::with('owner')->get() as $vehicle) {
            if (!$vehicle->owner_id || !$vehicle->owner || $vehicle->owner->role !== 'owner') {
                throw new \RuntimeException("Seeded vehicle #{$vehicle->id} ('{$vehicle->title}') must have a valid owner with role 'owner'.");
            }
        }

        // 2. The owner user ($owner) MUST be the only user that has vehicles
        if ($admin->vehicles()->count() !== 0) {
            throw new \RuntimeException("Admin user must not own any vehicles.");
        }
        if ($renter->vehicles()->count() !== 0) {
            throw new \RuntimeException("Renter user must not own any vehicles.");
        }
        if ($owner->vehicles()->count() !== Vehicle::count()) {
            throw new \RuntimeException("All seeded vehicles must belong exclusively to the seeded owner ({$owner->email}).");
        }

        \Illuminate\Database\Eloquent\Model::reguard();
    }
}
