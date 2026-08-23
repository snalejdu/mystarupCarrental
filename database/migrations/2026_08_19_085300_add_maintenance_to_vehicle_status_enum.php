<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify status column on vehicles to varchar(32) to support 'active', 'inactive', 'maintenance', 'archived'
        try {
            DB::statement("ALTER TABLE vehicles MODIFY COLUMN status VARCHAR(32) NOT NULL DEFAULT 'active'");
        } catch (\Throwable $e) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->string('status', 32)->default('active')->change();
            });
        }
    }

    public function down(): void
    {
        try {
            DB::statement("ALTER TABLE vehicles MODIFY COLUMN status ENUM('active', 'inactive', 'archived') NOT NULL DEFAULT 'active'");
        } catch (\Throwable $e) {
            // fallback
        }
    }
};
