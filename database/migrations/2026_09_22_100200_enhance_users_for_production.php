<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enhance users table for production-grade car rental operations.
     *
     * Adds: residential address, date of birth for age verification,
     * emergency contacts, and driver license details.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('address')->nullable()->after('phone');
            $table->date('date_of_birth')->nullable()->after('address');
            $table->string('emergency_contact_name')->nullable()->after('date_of_birth');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->string('driver_license_number')->nullable()->after('driver_license_path');
            $table->date('driver_license_expiry')->nullable()->after('driver_license_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'address',
                'date_of_birth',
                'emergency_contact_name',
                'emergency_contact_phone',
                'driver_license_number',
                'driver_license_expiry',
            ]);
        });
    }
};
