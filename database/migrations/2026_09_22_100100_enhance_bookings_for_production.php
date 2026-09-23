<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enhance bookings table for production-grade car rental operations.
     *
     * Adds: pickup/dropoff locations and times, cancellation tracking with reasons,
     * host private notes, late fee charges, and delivery address.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Pickup & dropoff logistics
            $table->string('pickup_location')->nullable()->after('end_date');
            $table->string('dropoff_location')->nullable()->after('pickup_location');
            $table->time('pickup_time')->nullable()->after('dropoff_location');
            $table->time('dropoff_time')->nullable()->after('pickup_time');
            $table->string('delivery_address')->nullable()->after('dropoff_time');

            // Cancellation & decline tracking
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');
            $table->timestamp('declined_at')->nullable()->after('cancelled_at');
            $table->string('cancellation_reason')->nullable()->after('declined_at');

            // Host private operations notes
            $table->text('owner_notes')->nullable()->after('cancellation_reason');

            // Late return fee tracking
            $table->decimal('late_fee_charged', 10, 2)->default(0)->after('commission_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'pickup_location',
                'dropoff_location',
                'pickup_time',
                'dropoff_time',
                'delivery_address',
                'cancelled_at',
                'declined_at',
                'cancellation_reason',
                'owner_notes',
                'late_fee_charged',
            ]);
        });
    }
};
