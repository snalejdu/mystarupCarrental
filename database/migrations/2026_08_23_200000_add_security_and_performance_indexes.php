<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add targeted indexes for every hot query path identified in controllers.
     *
     * These indexes cover:
     * - Renter booking lookups (renter_id, renter_email)
     * - Date overlap detection for booking collision prevention
     * - Chronological sorting on admin/owner dashboards
     * - Featured vehicle queries (status + avg_rating)
     * - Price-sorted and newest-sorted browse pages
     * - Role-based user counts on admin dashboard
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // RenterBookingController@index: WHERE renter_id = ?
            $table->index('renter_id', 'bookings_renter_id_index');

            // Guest booking auto-linking: WHERE renter_email = ? AND renter_id IS NULL
            $table->index('renter_email', 'bookings_renter_email_index');

            // Overlap detection in BookingController@store: range scan on start/end dates per vehicle
            $table->index(['vehicle_id', 'start_date', 'end_date'], 'bookings_vehicle_date_range_index');

            // Admin & Owner booking lists: ORDER BY created_at DESC
            $table->index('created_at', 'bookings_created_at_index');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            // Home page featured vehicles: WHERE status='active' ORDER BY avg_rating DESC
            $table->index(['status', 'avg_rating'], 'vehicles_status_avg_rating_index');

            // Price-sorted browse: WHERE status='active' ORDER BY price_per_day ASC/DESC
            $table->index(['status', 'price_per_day'], 'vehicles_status_price_index');

            // Newest-first default sort: WHERE status='active' ORDER BY created_at DESC
            $table->index(['status', 'created_at'], 'vehicles_status_created_at_index');
        });

        Schema::table('users', function (Blueprint $table) {
            // Admin dashboard: WHERE role = 'owner' / 'renter' counts
            $table->index('role', 'users_role_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_renter_id_index');
            $table->dropIndex('bookings_renter_email_index');
            $table->dropIndex('bookings_vehicle_date_range_index');
            $table->dropIndex('bookings_created_at_index');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex('vehicles_status_avg_rating_index');
            $table->dropIndex('vehicles_status_price_index');
            $table->dropIndex('vehicles_status_created_at_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_index');
        });
    }
};
