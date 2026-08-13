<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['car', 'van', 'motorbike', 'suv']);
            $table->string('brand');
            $table->string('model');
            $table->decimal('price_per_day', 10, 2);
            $table->string('location');
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->decimal('avg_rating', 3, 1)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->timestamps();

            $table->index(['status', 'location']);
            $table->index(['status', 'type']);
            $table->index('owner_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
