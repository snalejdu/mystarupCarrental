<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('status', ['available', 'booked', 'blocked'])->default('available');
            $table->timestamps();

            $table->unique(['vehicle_id', 'date']);
            $table->index(['vehicle_id', 'date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_availability');
    }
};
