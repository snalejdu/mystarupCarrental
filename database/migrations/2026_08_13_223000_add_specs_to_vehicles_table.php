<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('transmission')->default('automatic')->after('model');
            $table->unsignedInteger('seats')->default(5)->after('transmission');
            $table->boolean('has_aircon')->default(true)->after('seats');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['transmission', 'seats', 'has_aircon']);
        });
    }
};
