<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('renter_name');
            $table->text('renter_contact'); // Encrypted at application level via Eloquent cast
            $table->string('renter_email')->nullable();
            $table->uuid('token')->unique(); // UUID v4 for unguessable renter status page URL
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('total_days');
            $table->decimal('total_price', 10, 2);
            $table->decimal('commission_rate', 5, 2)->default(4.00);
            $table->decimal('commission_amount', 10, 2);
            $table->enum('status', ['pending', 'accepted', 'declined', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('contact_unlocked_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['vehicle_id', 'status']);
            $table->index(['status', 'start_date']);
            $table->index('token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
