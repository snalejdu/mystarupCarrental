<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\BookingHandover;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DigitalHandoverTest extends TestCase
{
    use RefreshDatabase;

    public function test_renter_can_update_digital_handover_inspection(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(3)->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($renter)->post("/renter/bookings/{$booking->id}/handover", [
            'checkin_odometer' => '54,320 km',
            'checkin_fuel' => 'Full Tank (100%)',
            'checkin_notes' => 'Tires in good condition, small scratch on passenger door.',
            'checkout_odometer' => '54,580 km',
            'checkout_fuel' => 'Full Tank (100%)',
            'checkout_deposit_refunded' => true,
        ]);

        $response->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('54,320 km', $booking->checkin_odometer);
        $this->assertEquals('54,580 km', $booking->checkout_odometer);
        $this->assertTrue((bool) $booking->checkout_deposit_refunded);

        // Verify normalized 3NF table relation
        $handover = BookingHandover::where('booking_id', $booking->id)->firstOrFail();
        $this->assertEquals('54,320 km', $handover->checkin_odometer);
        $this->assertEquals('54,580 km', $handover->checkout_odometer);
        $this->assertTrue((bool) $handover->checkout_deposit_refunded);
        $this->assertNotNull($handover->checkin_verified_at);
        $this->assertNotNull($handover->checkout_verified_at);
    }

    public function test_host_can_also_update_handover_inspection(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(2)->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($owner)->post("/renter/bookings/{$booking->id}/handover", [
            'checkin_odometer' => '12,000 km',
            'checkin_fuel' => 'Full Tank (100%)',
            'checkin_notes' => 'Host verified at Tagbilaran pier pickup.',
        ]);

        $response->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('12,000 km', $booking->checkin_odometer);
    }

    public function test_unrelated_user_cannot_update_handover(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();
        $stranger = User::factory()->renter()->create();

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(2)->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($stranger)->post("/renter/bookings/{$booking->id}/handover", [
            'checkin_odometer' => '99,999 km',
        ]);

        $response->assertRedirect('/');
        $this->assertDatabaseMissing('booking_handovers', ['booking_id' => $booking->id]);
    }
}
