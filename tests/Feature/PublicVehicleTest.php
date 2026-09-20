<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_renders_featured_vehicles_and_stats(): void
    {
        $this->seed();

        $response = $this->get('/');

        $response->assertStatus(200);
        $featured = $response->viewData('page')['props']['featuredVehicles'];
        $stats = $response->viewData('page')['props']['stats'];

        $this->assertNotEmpty($featured);
        $this->assertGreaterThan(0, $stats['total_vehicles']);
        $this->assertGreaterThan(0, $stats['total_owners']);
    }

    public function test_public_catalog_displays_active_vehicles(): void
    {
        $owner = User::factory()->owner()->create();
        $v1 = Vehicle::factory()->create(['owner_id' => $owner->id, 'title' => 'Toyota Vios Active', 'status' => 'active']);
        $v2 = Vehicle::factory()->create(['owner_id' => $owner->id, 'title' => 'Toyota Innova Inactive', 'status' => 'inactive']);

        $response = $this->get('/vehicles');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertTrue($vehicles->contains('id', $v1->id));
        $this->assertFalse($vehicles->contains('id', $v2->id));
    }

    public function test_public_catalog_filters_by_location(): void
    {
        $owner = User::factory()->owner()->create();
        $vTagbilaran = Vehicle::factory()->create(['owner_id' => $owner->id, 'location' => 'Tagbilaran', 'status' => 'active']);
        $vPanglao = Vehicle::factory()->create(['owner_id' => $owner->id, 'location' => 'Panglao', 'status' => 'active']);

        $response = $this->get('/vehicles?location=Tagbilaran');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertTrue($vehicles->contains('id', $vTagbilaran->id));
        $this->assertFalse($vehicles->contains('id', $vPanglao->id));
    }

    public function test_public_catalog_filters_by_vehicle_type(): void
    {
        $owner = User::factory()->owner()->create();
        $vCar = Vehicle::factory()->create(['owner_id' => $owner->id, 'type' => 'car', 'status' => 'active']);
        $vMotorbike = Vehicle::factory()->create(['owner_id' => $owner->id, 'type' => 'motorbike', 'status' => 'active']);

        $response = $this->get('/vehicles?type=motorbike');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertTrue($vehicles->contains('id', $vMotorbike->id));
        $this->assertFalse($vehicles->contains('id', $vCar->id));
    }

    public function test_public_catalog_filters_by_price_range(): void
    {
        $owner = User::factory()->owner()->create();
        $cheap = Vehicle::factory()->create(['owner_id' => $owner->id, 'price_per_day' => 800, 'status' => 'active']);
        $expensive = Vehicle::factory()->create(['owner_id' => $owner->id, 'price_per_day' => 3500, 'status' => 'active']);

        $response = $this->get('/vehicles?min_price=500&max_price=1500');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertTrue($vehicles->contains('id', $cheap->id));
        $this->assertFalse($vehicles->contains('id', $expensive->id));
    }

    public function test_public_catalog_search_query_with_wildcard_escaping(): void
    {
        $owner = User::factory()->owner()->create();
        $target = Vehicle::factory()->create([
            'owner_id' => $owner->id,
            'title' => 'Toyota Fortuner 4x4 Special',
            'brand' => 'Toyota',
            'model' => 'Fortuner',
            'status' => 'active',
        ]);
        $other = Vehicle::factory()->create([
            'owner_id' => $owner->id,
            'title' => 'Honda Click Scooter',
            'brand' => 'Honda',
            'model' => 'Click',
            'status' => 'active',
        ]);

        // Search with query and escaped wildcards
        $response = $this->get('/vehicles?search=Fortuner%25');

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertFalse($vehicles->contains('id', $other->id));
    }

    public function test_public_catalog_date_range_availability_filter(): void
    {
        $owner = User::factory()->owner()->create();
        $availableVehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);
        $blockedVehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);

        // Block dates on blockedVehicle
        VehicleAvailability::create([
            'vehicle_id' => $blockedVehicle->id,
            'date' => now()->addDays(5)->format('Y-m-d'),
            'status' => 'booked',
        ]);

        $pickup = now()->addDays(4)->format('Y-m-d');
        $return = now()->addDays(7)->format('Y-m-d');

        $response = $this->get("/vehicles?pickup_date={$pickup}&return_date={$return}");

        $response->assertStatus(200);
        $vehicles = collect($response->viewData('page')['props']['vehicles']['data']);
        $this->assertTrue($vehicles->contains('id', $availableVehicle->id));
        $this->assertFalse($vehicles->contains('id', $blockedVehicle->id));
    }

    public function test_vehicle_show_page_renders_with_availability_calendar(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);

        $response = $this->get("/vehicles/{$vehicle->slug}");

        $response->assertStatus(200);
        $propVehicle = $response->viewData('page')['props']['vehicle'];
        $propAvailability = $response->viewData('page')['props']['availability'];

        $this->assertEquals($vehicle->id, $propVehicle['id']);
        $this->assertIsArray($propAvailability);
    }

    public function test_inactive_and_maintenance_vehicles_return_404(): void
    {
        $owner = User::factory()->owner()->create();
        $inactive = Vehicle::factory()->inactive()->create(['owner_id' => $owner->id]);
        $maintenance = Vehicle::factory()->maintenance()->create(['owner_id' => $owner->id]);

        $this->get("/vehicles/{$inactive->slug}")->assertStatus(404);
        $this->get("/vehicles/{$maintenance->slug}")->assertStatus(404);
    }

    public function test_static_informational_pages_render(): void
    {
        $this->get('/about')->assertStatus(200);
        $this->get('/contact')->assertStatus(200);
        $this->get('/terms')->assertStatus(200);
        $this->get('/privacy-policy')->assertStatus(200);
    }

    public function test_contact_form_submission(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Island Traveler',
            'email' => 'traveler@bohol.ph',
            'phone' => '09171234567',
            'message' => 'Hello! How do I book multiple vehicles for a family tour?',
        ]);

        $response->assertSessionHas('success');
    }

    public function test_contact_form_validation(): void
    {
        $response = $this->post('/contact', [
            'name' => '',
            'email' => 'invalid-email',
            'message' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'message']);
    }
}
