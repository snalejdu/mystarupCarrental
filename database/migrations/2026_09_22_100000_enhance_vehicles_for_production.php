<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enhance vehicles table for production-grade car rental operations.
     *
     * Adds: year, plate number, color, VIN, insurance info, minimum rental days,
     * late fee policy, and LTO registration expiry tracking.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->nullable()->after('model');
            $table->string('plate_number', 20)->nullable()->after('slug');
            $table->string('color', 50)->nullable()->after('brand');
            $table->string('vin', 50)->nullable()->after('color');
            $table->string('insurance_type', 64)->default('comprehensive')->after('driver_available'); // comprehensive, third_party, none
            $table->date('insurance_expiry')->nullable()->after('insurance_type');
            $table->unsignedTinyInteger('minimum_rental_days')->default(1)->after('discount_weekly');
            $table->decimal('late_fee_per_hour', 8, 2)->default(0)->after('minimum_rental_days');
            $table->date('registration_expiry')->nullable()->after('insurance_expiry');

            // Indexes for fleet management queries
            $table->index('plate_number', 'vehicles_plate_number_index');
            $table->unique('vin', 'vehicles_vin_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex('vehicles_plate_number_index');
            $table->dropUnique('vehicles_vin_unique');
            $table->dropColumn([
                'year',
                'plate_number',
                'color',
                'vin',
                'insurance_type',
                'insurance_expiry',
                'minimum_rental_days',
                'late_fee_per_hour',
                'registration_expiry',
            ]);
        });
    }
};
