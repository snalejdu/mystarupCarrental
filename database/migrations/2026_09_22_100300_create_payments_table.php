<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create payments table for financial tracking.
     *
     * Tracks all monetary transactions: deposits, rental payments, late fees,
     * damage charges, refunds, and delivery fees. Supports Philippine payment
     * methods (GCash, Maya, bank transfer, cash).
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('payer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['deposit', 'rental', 'late_fee', 'damage', 'refund', 'delivery_fee']);
            $table->string('method', 32)->default('cash'); // cash, gcash, bank_transfer, credit_card, paymaya
            $table->decimal('amount', 10, 2);
            $table->string('reference_number')->nullable(); // GCash ref, bank txn ID, etc.
            $table->enum('status', ['pending', 'confirmed', 'failed', 'refunded'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for financial queries
            $table->index(['booking_id', 'type'], 'payments_booking_type_index');
            $table->index(['status', 'created_at'], 'payments_status_created_index');
            $table->index('payer_id', 'payments_payer_id_index');
            $table->index('reference_number', 'payments_reference_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
