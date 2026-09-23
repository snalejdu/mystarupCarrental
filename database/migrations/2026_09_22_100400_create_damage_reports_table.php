<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create damage_reports table for vehicle condition tracking.
     *
     * Records pre-existing and new damage with photo evidence, repair costs,
     * and resolution tracking for dispute handling and insurance claims.
     */
    public function up(): void
    {
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('reported_by')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['pre_existing', 'new_damage', 'wear_and_tear']);
            $table->text('description');
            $table->string('location_on_vehicle', 100); // e.g. "Front bumper left side", "Rear door right"
            $table->string('photo_path')->nullable(); // Photo evidence stored on private disk
            $table->decimal('repair_cost', 10, 2)->nullable();
            $table->boolean('resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

            // Indexes for damage tracking queries
            $table->index(['booking_id', 'type'], 'damage_reports_booking_type_index');
            $table->index('reported_by', 'damage_reports_reporter_index');
            $table->index(['resolved', 'created_at'], 'damage_reports_unresolved_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};
