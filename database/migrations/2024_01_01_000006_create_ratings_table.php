<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->enum('rater_type', ['owner', 'renter']);
            $table->string('rater_identifier'); // Owner user_id or renter name
            $table->unsignedTinyInteger('stars');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique(['booking_id', 'rater_type']); // One rating per party per booking
            $table->index('booking_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
