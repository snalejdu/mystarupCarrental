<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RatingsAndReviewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_renter_can_rate_completed_booking_via_token(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'avg_rating' => 0, 'total_reviews' => 0]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        $response = $this->post("/booking/{$booking->token}/rate", [
            'stars' => 5,
            'comment' => 'Awesome car, smooth pickup in Tagbilaran!',
        ]);

        $response->assertSessionHas('success');

        $rating = Rating::where('booking_id', $booking->id)->where('rater_type', 'renter')->firstOrFail();
        $this->assertEquals(5, $rating->stars);
        $this->assertEquals('Awesome car, smooth pickup in Tagbilaran!', $rating->comment);

        // Vehicle stats updated
        $vehicle->refresh();
        $this->assertEquals(5.0, (float) $vehicle->avg_rating);
        $this->assertEquals(1, $vehicle->total_reviews);
    }

    public function test_renter_cannot_rate_pending_or_uncompleted_booking(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(4)->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'pending',
        ]);

        $response = $this->post("/booking/{$booking->token}/rate", [
            'stars' => 5,
            'comment' => 'Premature review attempt',
        ]);

        $response->assertSessionHasErrors(['rating']);
        $this->assertDatabaseMissing('ratings', ['booking_id' => $booking->id]);
    }

    public function test_renter_cannot_rate_same_booking_twice(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        // First rating succeeds
        $this->post("/booking/{$booking->token}/rate", [
            'stars' => 5,
            'comment' => 'First review',
        ])->assertSessionHas('success');

        // Duplicate rating attempt fails
        $response = $this->post("/booking/{$booking->token}/rate", [
            'stars' => 4,
            'comment' => 'Second review attempt',
        ]);

        $response->assertSessionHasErrors(['rating']);
        $this->assertEquals(1, Rating::where('booking_id', $booking->id)->count());
    }

    public function test_host_can_rate_renter_on_completed_rental(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        $response = $this->actingAs($owner)->post("/owner/bookings/{$booking->id}/rate", [
            'stars' => 5,
            'comment' => 'Responsible renter, drove safely and returned clean!',
        ]);

        $response->assertSessionHas('success');

        $rating = Rating::where('booking_id', $booking->id)->where('rater_type', 'owner')->firstOrFail();
        $this->assertEquals(5, $rating->stars);
        $this->assertEquals($owner->id, $rating->rater_id);
    }

    public function test_unauthorized_user_cannot_rate_booking(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();
        $intruder = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        // Intruder attempts to rate another person's booking
        $response = $this->actingAs($intruder)->post("/renter/bookings/{$booking->id}/rate", [
            'stars' => 1,
            'comment' => 'Malicious review attempt',
        ]);

        // Handled as 403 redirecting to home page
        $response->assertRedirect('/');
    }
}
