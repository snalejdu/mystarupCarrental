<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->decimal('security_deposit', 10, 2)->default(0)->after('price_per_day');
            $table->string('fuel_policy', 64)->default('same_to_same')->after('security_deposit');
            $table->boolean('delivery_available')->default(false)->after('fuel_policy');
            $table->decimal('delivery_fee', 10, 2)->default(0)->after('delivery_available');
            $table->integer('discount_three_days')->default(0)->after('delivery_fee'); // e.g. 5%
            $table->integer('discount_weekly')->default(0)->after('discount_three_days'); // e.g. 10% or 15%
            $table->boolean('helmets_included')->default(false)->after('discount_weekly');
            $table->boolean('driver_available')->default(false)->after('helmets_included');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'security_deposit',
                'fuel_policy',
                'delivery_available',
                'delivery_fee',
                'discount_three_days',
                'discount_weekly',
                'helmets_included',
                'driver_available',
            ]);
        });
    }
};
