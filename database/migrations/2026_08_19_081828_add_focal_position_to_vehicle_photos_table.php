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
        Schema::table('vehicle_photos', function (Blueprint $table) {
            $table->unsignedTinyInteger('position_x')->default(50)->after('order');
            $table->unsignedTinyInteger('position_y')->default(50)->after('position_x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_photos', function (Blueprint $table) {
            $table->dropColumn(['position_x', 'position_y']);
        });
    }
};
