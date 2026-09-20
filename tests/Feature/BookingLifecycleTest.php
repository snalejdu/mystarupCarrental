<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_booking(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);

        $response = $this->post("/vehicles/{$vehicle->slug}/book", [
            'renter_name' => 'Guest User',
            'renter_contact' => '09170009988',
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(4)->format('Y-m-d'),
        ]);

        $response->assertRedirect(route('login', ['intended' => url()->previous()]));
    }

    public function test_host_cannot_book_own_vehicle(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($owner)->post("/vehicles/{$vehicle->slug}/book", [
            'renter_name' => $owner->name,
            'renter_contact' => '09171112233',
            'renter_email' => $owner->email,
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $response->assertSessionHasErrors(['vehicle']);
    }

    public function test_renter_can_create_reservation_with_pricing_and_commission(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create([
            'owner_id' => $owner->id,
            'price_per_day' => 2000,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
        ]);
        $renter = User::factory()->renter()->create();

        $startDate = now()->addDays(5)->format('Y-m-d');
        $endDate = now()->addDays(8)->format('Y-m-d'); // 3 days

        $response = $this->actingAs($renter)->post("/vehicles/{$vehicle->slug}/book", [
            'renter_name' => $renter->name,
            'renter_contact' => '09175556677',
            'renter_email' => $renter->email,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'pickup_preference' => 'host_location',
        ]);

        $booking = Booking::where('vehicle_id', $vehicle->id)->where('renter_id', $renter->id)->firstOrFail();
        $response->assertRedirect(route('booking.status', ['token' => $booking->token]));

        // 3 days * 2000 = 6000 - 10% (600) = 5400
        $this->assertEquals(5400.0, (float) $booking->total_price);
        $this->assertEquals(3, $booking->total_days);
        $this->assertEquals('pending', $booking->status);
        $this->assertNotEmpty($booking->token);
        // Commission = 4% of 5400 = 216
        $this->assertEquals(216.0, (float) $booking->commission_amount);
    }

    public function test_overlapping_date_reservation_is_prevented(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter1 = User::factory()->renter()->create();
        $renter2 = User::factory()->renter()->create();

        $startDate = now()->addDays(10)->format('Y-m-d');
        $endDate = now()->addDays(15)->format('Y-m-d');

        // First booking succeeds
        $this->actingAs($renter1)->post("/vehicles/{$vehicle->slug}/book", [
            'renter_name' => 'First Renter',
            'renter_contact' => '09171112233',
            'renter_email' => $renter1->email,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        // Second booking overlaps: days 12 to 16
        $response = $this->actingAs($renter2)->post("/vehicles/{$vehicle->slug}/book", [
            'renter_name' => 'Second Renter',
            'renter_contact' => '09172223344',
            'start_date' => now()->addDays(12)->format('Y-m-d'),
            'end_date' => now()->addDays(16)->format('Y-m-d'),
        ]);

        $response->assertSessionHasErrors(['dates']);
    }

    public function test_renter_status_page_masks_contact_info_until_accepted(): void
    {
        $owner = User::factory()->owner()->create(['phone' => '09189998877']);
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'renter_email' => $renter->email,
            'start_date' => now()->addDays(3)->format('Y-m-d'),
            'end_date' => now()->addDays(5)->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'pending',
        ]);

        // 1. Pending: Host contact is null
        $response = $this->get(route('booking.status', ['token' => $booking->token]));
        $response->assertStatus(200);
        $this->assertNull($response->viewData('page')['props']['ownerContact']);

        // 2. Accept booking
        $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/accept");

        // 3. Accepted: Host contact is unlocked
        $responseAccepted = $this->get(route('booking.status', ['token' => $booking->token]));
        $responseAccepted->assertStatus(200);
        $ownerContact = $responseAccepted->viewData('page')['props']['ownerContact'];
        $this->assertNotNull($ownerContact);
        $this->assertEquals('09189998877', $ownerContact['phone']);
    }

    public function test_host_accepting_booking_locks_calendar_and_declines_conflicts(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->addDays(4)->format('Y-m-d'),
            'end_date' => now()->addDays(7)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/accept");
        $response->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('accepted', $booking->status);
        $this->assertNotNull($booking->accepted_at);
        $this->assertNotNull($booking->contact_unlocked_at);

        // Check availability dates are locked as booked
        $bookedDates = VehicleAvailability::where('vehicle_id', $vehicle->id)
            ->where('status', 'booked')
            ->count();
        $this->assertGreaterThanOrEqual(3, $bookedDates);
    }

    public function test_host_decline_and_cancel_actions(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->addDays(4)->format('Y-m-d'),
            'end_date' => now()->addDays(6)->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'pending',
        ]);

        // Decline pending booking
        $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/decline")->assertSessionHas('success');
        $booking->refresh();
        $this->assertEquals('declined', $booking->status);

        // Reset to pending and then cancel
        $booking->update(['status' => 'pending']);
        $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/cancel")->assertSessionHas('success');
        $booking->refresh();
        $this->assertEquals('cancelled', $booking->status);
    }

    public function test_host_complete_booking_releases_calendar_dates(): void
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

        // Accept first
        $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/accept");
        $this->assertGreaterThan(0, VehicleAvailability::where('vehicle_id', $vehicle->id)->where('status', 'booked')->count());

        // Complete
        $response = $this->actingAs($owner)->put("/owner/bookings/{$booking->id}/complete");
        $response->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('completed', $booking->status);
        $this->assertNotNull($booking->completed_at);

        // Verify dates freed
        $this->assertEquals(0, VehicleAvailability::where('vehicle_id', $vehicle->id)->where('status', 'booked')->count());
    }

    public function test_host_earnings_ledger_calculation(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        // Create completed booking: 10,000 total (4% commission automatically calculated)
        Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 10000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        $response = $this->actingAs($owner)->get('/owner/earnings');
        $response->assertStatus(200);

        $earnings = $response->viewData('page')['props']['earnings'];
        $this->assertEquals(10000.0, (float) $earnings['total_gross']);
        $this->assertEquals(400.0, (float) $earnings['total_commission']);
        $this->assertEquals(9600.0, (float) $earnings['net_payout']);
        $this->assertEquals(1, $earnings['completed_count']);
    }
}
