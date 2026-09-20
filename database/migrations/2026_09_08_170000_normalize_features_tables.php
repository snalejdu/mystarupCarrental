<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations to normalize vehicle features to 3NF.
     *
     * 1. Creates `features` catalog table.
     * 2. Creates `vehicle_feature` pivot table.
     * 3. Seed initial standard Bohol vehicle features.
     * 4. Migrates existing JSON features from `vehicles.features` into `vehicle_feature`.
     */
    public function up(): void
    {
        // 1. Create normalized features table
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('category', 64)->default('general'); // safety, comfort, tech, motorbike
            $table->string('vehicle_type', 32)->default('all'); // all, car, motorbike
            $table->string('icon', 64)->nullable(); // Lucide icon identifier
            $table->timestamps();
        });

        // 2. Create vehicle_feature pivot table
        Schema::create('vehicle_feature', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('feature_id')->constrained('features')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['vehicle_id', 'feature_id']);
            $table->index('vehicle_id');
            $table->index('feature_id');
        });

        // 3. Pre-populate standard features from rentbohol specifications
        $standardFeatures = [
            // Cars / Vans / SUVs
            ['name' => 'ABS Brakes', 'category' => 'safety', 'vehicle_type' => 'car', 'icon' => 'ShieldCheck'],
            ['name' => 'Dual Air Bags', 'category' => 'safety', 'vehicle_type' => 'car', 'icon' => 'ShieldAlert'],
            ['name' => 'Cruise Control', 'category' => 'comfort', 'vehicle_type' => 'car', 'icon' => 'Gauge'],
            ['name' => 'Cold Air Conditioner', 'category' => 'comfort', 'vehicle_type' => 'car', 'icon' => 'Wind'],
            ['name' => 'Bluetooth Audio', 'category' => 'tech', 'vehicle_type' => 'car', 'icon' => 'Radio'],
            ['name' => 'Backup Camera', 'category' => 'safety', 'vehicle_type' => 'car', 'icon' => 'Camera'],
            ['name' => 'Front Dashcam', 'category' => 'safety', 'vehicle_type' => 'car', 'icon' => 'Video'],
            ['name' => 'USB Charging Ports', 'category' => 'tech', 'vehicle_type' => 'all', 'icon' => 'BatteryCharging'],
            ['name' => 'GPS Navigation', 'category' => 'tech', 'vehicle_type' => 'car', 'icon' => 'Compass'],
            ['name' => 'Leather Seats', 'category' => 'comfort', 'vehicle_type' => 'car', 'icon' => 'Armchair'],
            
            // Motorbikes
            ['name' => '2 Clean Helmets Included', 'category' => 'motorbike', 'vehicle_type' => 'motorbike', 'icon' => 'HardHat'],
            ['name' => 'Cell Phone Holder / Mount', 'category' => 'motorbike', 'vehicle_type' => 'motorbike', 'icon' => 'Smartphone'],
            ['name' => 'Rear Top Box / Storage', 'category' => 'motorbike', 'vehicle_type' => 'motorbike', 'icon' => 'Package'],
            ['name' => 'Front Disc Brakes', 'category' => 'safety', 'vehicle_type' => 'motorbike', 'icon' => 'Disc'],
            ['name' => 'Raincoat / Rain Poncho', 'category' => 'motorbike', 'vehicle_type' => 'motorbike', 'icon' => 'CloudRain'],
            ['name' => 'USB Phone Charger Port', 'category' => 'tech', 'vehicle_type' => 'motorbike', 'icon' => 'BatteryCharging'],
            ['name' => 'Anti-Theft Disc Lock', 'category' => 'safety', 'vehicle_type' => 'motorbike', 'icon' => 'Lock'],
        ];

        $now = now();
        foreach ($standardFeatures as $feat) {
            DB::table('features')->updateOrInsert(
                ['slug' => Str::slug($feat['name'])],
                [
                    'name' => $feat['name'],
                    'category' => $feat['category'],
                    'vehicle_type' => $feat['vehicle_type'],
                    'icon' => $feat['icon'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // 4. Migrate any existing JSON features from `vehicles` table into `vehicle_feature`
        $vehicles = DB::table('vehicles')->select('id', 'features')->get();
        foreach ($vehicles as $vehicle) {
            if (empty($vehicle->features)) {
                continue;
            }

            $featureList = json_decode($vehicle->features, true);
            if (!is_array($featureList)) {
                continue;
            }

            foreach ($featureList as $featureName) {
                if (!is_string($featureName) || trim($featureName) === '') {
                    continue;
                }

                $slug = Str::slug(trim($featureName));
                $feature = DB::table('features')->where('slug', $slug)->first();

                if (!$feature) {
                    $featureId = DB::table('features')->insertGetId([
                        'name' => trim($featureName),
                        'slug' => $slug,
                        'category' => 'general',
                        'vehicle_type' => 'all',
                        'icon' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                } else {
                    $featureId = $feature->id;
                }

                DB::table('vehicle_feature')->insertOrIgnore([
                    'vehicle_id' => $vehicle->id,
                    'feature_id' => $featureId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_feature');
        Schema::dropIfExists('features');
    }
};
