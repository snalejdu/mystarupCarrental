<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('driver_license_path')->nullable()->after('avatar');
            $table->string('driver_license_status', 32)->default('unverified')->after('driver_license_path'); // unverified, pending, verified
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('checkin_odometer', 50)->nullable()->after('status');
            $table->string('checkin_fuel', 50)->nullable()->after('checkin_odometer');
            $table->text('checkin_notes')->nullable()->after('checkin_fuel');
            $table->string('checkout_odometer', 50)->nullable()->after('checkin_notes');
            $table->string('checkout_fuel', 50)->nullable()->after('checkout_odometer');
            $table->boolean('checkout_deposit_refunded')->default(false)->after('checkout_fuel');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['driver_license_path', 'driver_license_status']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'checkin_odometer', 'checkin_fuel', 'checkin_notes',
                'checkout_odometer', 'checkout_fuel', 'checkout_deposit_refunded'
            ]);
        });
    }
};
