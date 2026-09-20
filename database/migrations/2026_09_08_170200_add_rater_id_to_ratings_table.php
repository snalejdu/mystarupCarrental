<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to normalize rater foreign key integrity in ratings table.
     */
    public function up(): void
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->foreignId('rater_id')->nullable()->after('rater_type')->constrained('users')->nullOnDelete();
            $table->index('rater_id');
        });

        // Populate rater_id for existing ratings
        $ratings = DB::table('ratings')->get();
        foreach ($ratings as $rating) {
            $raterId = null;

            if ($rating->rater_type === 'owner' && is_numeric($rating->rater_identifier)) {
                $userExists = DB::table('users')->where('id', (int) $rating->rater_identifier)->exists();
                if ($userExists) {
                    $raterId = (int) $rating->rater_identifier;
                }
            } elseif ($rating->rater_type === 'renter') {
                $booking = DB::table('bookings')->where('id', $rating->booking_id)->first();
                if ($booking && $booking->renter_id) {
                    $raterId = $booking->renter_id;
                }
            }

            if ($raterId) {
                DB::table('ratings')->where('id', $rating->id)->update(['rater_id' => $raterId]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->dropForeign(['rater_id']);
            $table->dropIndex(['rater_id']);
            $table->dropColumn('rater_id');
        });
    }
};
