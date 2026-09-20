<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_owner_cannot_access_owner_routes(): void
    {
        $renter = User::factory()->renter()->create();

        $this->actingAs($renter)->get('/owner/vehicles')->assertRedirect('/');
        $this->actingAs($renter)->get('/owner/vehicles/create')->assertRedirect('/');
    }

    public function test_owner_can_view_their_vehicles(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($owner)->get('/owner/vehicles');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']);
        $this->assertTrue($vehicles->contains('id', $vehicle->id));
    }

    public function test_owner_can_view_create_vehicle_form(): void
    {
        $owner = User::factory()->owner()->create();

        $response = $this->actingAs($owner)->get('/owner/vehicles/create');

        $response->assertStatus(200);
        $locations = $response->viewData('page')['props']['locations'];
        $vehicleTypes = $response->viewData('page')['props']['vehicleTypes'];

        $this->assertIsArray($locations);
        $this->assertIsArray($vehicleTypes);
    }

    public function test_owner_can_store_vehicle_with_specs_and_features(): void
    {
        $owner = User::factory()->owner()->create();

        $response = $this->actingAs($owner)->post('/owner/vehicles', [
            'title' => 'Toyota Vios 1.5G Sedan',
            'description' => 'Reliable fuel efficient car for touring Bohol.',
            'type' => 'car',
            'brand' => 'Toyota',
            'model' => 'Vios',
            'transmission' => 'automatic',
            'seats' => 5,
            'has_aircon' => true,
            'distance_limit' => '200 km / day',
            'fuel_type' => 'Unleaded Gas',
            'features' => ['ABS Brakes', 'Cold Air Conditioner', 'Bluetooth Audio'],
            'price_per_day' => 2200,
            'security_deposit' => 1500,
            'fuel_policy' => 'same_to_same',
            'delivery_available' => true,
            'delivery_fee' => 300,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'location' => 'Tagbilaran',
        ]);

        $vehicle = Vehicle::where('owner_id', $owner->id)->firstOrFail();
        $response->assertRedirect(route('owner.vehicles.edit', $vehicle));

        $this->assertEquals('200 km / day', $vehicle->distance_limit);
        $this->assertEquals('Unleaded Gas', $vehicle->fuel_type);
        $this->assertContains('ABS Brakes', $vehicle->features);
        $this->assertNotEmpty($vehicle->slug);
    }

    public function test_owner_can_update_vehicle_details(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'price_per_day' => 2000]);

        $response = $this->actingAs($owner)->put("/owner/vehicles/{$vehicle->slug}", [
            'title' => 'Updated Title Luxury Vios',
            'description' => 'Updated description text.',
            'type' => $vehicle->type,
            'brand' => $vehicle->brand,
            'model' => $vehicle->model,
            'transmission' => 'manual',
            'seats' => 5,
            'has_aircon' => true,
            'distance_limit' => 'Unlimited',
            'fuel_type' => 'Diesel',
            'features' => ['Leather Seats'],
            'price_per_day' => 2500,
            'location' => $vehicle->location,
        ]);

        $response->assertSessionHas('success');
        $vehicle->refresh();

        $this->assertEquals('Updated Title Luxury Vios', $vehicle->title);
        $this->assertEquals(2500.0, (float) $vehicle->price_per_day);
        $this->assertEquals('manual', $vehicle->transmission);
    }

    public function test_owner_quick_status_transitions(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);

        // 1. To maintenance
        $this->actingAs($owner)->put("/owner/vehicles/{$vehicle->slug}/status", ['status' => 'maintenance'])
            ->assertSessionHas('success');
        $vehicle->refresh();
        $this->assertEquals('maintenance', $vehicle->status);

        // 2. To inactive
        $this->actingAs($owner)->put("/owner/vehicles/{$vehicle->slug}/status", ['status' => 'inactive'])
            ->assertSessionHas('success');
        $vehicle->refresh();
        $this->assertEquals('inactive', $vehicle->status);

        // 3. Back to active
        $this->actingAs($owner)->put("/owner/vehicles/{$vehicle->slug}/status", ['status' => 'active'])
            ->assertSessionHas('success');
        $vehicle->refresh();
        $this->assertEquals('active', $vehicle->status);
    }

    public function test_owner_can_archive_vehicle(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);

        $response = $this->actingAs($owner)->delete("/owner/vehicles/{$vehicle->slug}");

        $response->assertRedirect(route('owner.vehicles.index'));
        $vehicle->refresh();
        $this->assertEquals('archived', $vehicle->status);
    }

    public function test_owner_can_update_calendar_availability(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);

        $date1 = now()->addDays(2)->format('Y-m-d');
        $date2 = now()->addDays(3)->format('Y-m-d');

        $response = $this->actingAs($owner)->put("/owner/vehicles/{$vehicle->slug}/availability", [
            'dates' => [
                ['date' => $date1, 'status' => 'blocked'],
                ['date' => $date2, 'status' => 'available'],
            ],
        ]);

        $response->assertSessionHas('success');

        $blockedRecord = VehicleAvailability::where('vehicle_id', $vehicle->id)->whereDate('date', $date1)->firstOrFail();
        $this->assertEquals('blocked', $blockedRecord->status);
    }

    public function test_host_cannot_update_another_hosts_vehicle(): void
    {
        $owner1 = User::factory()->owner()->create();
        $owner2 = User::factory()->owner()->create();
        $foreignVehicle = Vehicle::factory()->create(['owner_id' => $owner2->id]);

        // Attempting to update another owner's vehicle
        $response = $this->actingAs($owner1)->put("/owner/vehicles/{$foreignVehicle->slug}", [
            'title' => 'Hacked Title',
            'type' => $foreignVehicle->type,
            'brand' => $foreignVehicle->brand,
            'model' => $foreignVehicle->model,
            'transmission' => 'automatic',
            'seats' => 5,
            'has_aircon' => true,
            'price_per_day' => 1000,
            'location' => $foreignVehicle->location,
        ]);

        // Authorization throws 403, which redirects to '/' via exception handler
        $response->assertRedirect('/');
        $foreignVehicle->refresh();
        $this->assertNotEquals('Hacked Title', $foreignVehicle->title);
    }
}
