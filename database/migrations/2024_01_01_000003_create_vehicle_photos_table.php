<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedSmallInteger('order')->default(0);
            $table->string('alt_text')->nullable();
            $table->timestamps();

            $table->index(['vehicle_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_photos');
    }
};
