<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to normalize vehicle handover inspections into a dedicated entity (3NF).
     */
    public function up(): void
    {
        Schema::create('booking_handovers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained('bookings')->cascadeOnDelete();
            $table->string('checkin_odometer', 50)->nullable();
            $table->string('checkin_fuel', 50)->nullable();
            $table->text('checkin_notes')->nullable();
            $table->timestamp('checkin_verified_at')->nullable();
            $table->string('checkout_odometer', 50)->nullable();
            $table->string('checkout_fuel', 50)->nullable();
            $table->text('checkout_notes')->nullable();
            $table->boolean('checkout_deposit_refunded')->default(false);
            $table->timestamp('checkout_verified_at')->nullable();
            $table->timestamps();

            $table->index('booking_id');
        });

        // Migrate existing handover data from `bookings`
        $bookingsWithHandover = DB::table('bookings')
            ->whereNotNull('checkin_odometer')
            ->orWhereNotNull('checkin_fuel')
            ->orWhereNotNull('checkin_notes')
            ->orWhereNotNull('checkout_odometer')
            ->orWhereNotNull('checkout_fuel')
            ->get();

        $now = now();
        foreach ($bookingsWithHandover as $booking) {
            DB::table('booking_handovers')->insertOrIgnore([
                'booking_id' => $booking->id,
                'checkin_odometer' => $booking->checkin_odometer ?? null,
                'checkin_fuel' => $booking->checkin_fuel ?? null,
                'checkin_notes' => $booking->checkin_notes ?? null,
                'checkin_verified_at' => ($booking->checkin_odometer || $booking->checkin_fuel) ? $booking->updated_at : null,
                'checkout_odometer' => $booking->checkout_odometer ?? null,
                'checkout_fuel' => $booking->checkout_fuel ?? null,
                'checkout_notes' => null,
                'checkout_deposit_refunded' => (bool) ($booking->checkout_deposit_refunded ?? false),
                'checkout_verified_at' => ($booking->checkout_odometer || $booking->checkout_fuel) ? $booking->updated_at : null,
                'created_at' => $booking->created_at ?? $now,
                'updated_at' => $booking->updated_at ?? $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_handovers');
    }
};
