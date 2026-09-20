<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_users_are_forbidden_from_admin_portal(): void
    {
        $renter = User::factory()->renter()->create();
        $owner = User::factory()->owner()->create();

        // Guest
        $this->get('/admin/dashboard')->assertRedirect('/login');

        // Renter
        $this->actingAs($renter)->get('/admin/dashboard')->assertRedirect('/');
        $this->actingAs($renter)->get('/admin/commissions')->assertRedirect('/');

        // Owner
        $this->actingAs($owner)->get('/admin/dashboard')->assertRedirect('/');
        $this->actingAs($owner)->get('/admin/bookings')->assertRedirect('/');
    }

    public function test_admin_dashboard_metrics_aggregation(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id, 'status' => 'active']);
        $renter = User::factory()->renter()->create();

        Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(2)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 9000,
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
        $stats = $response->viewData('page')['props']['stats'];

        $this->assertEquals(1, $stats['total_owners']);
        $this->assertEquals(1, $stats['total_vehicles']);
        $this->assertEquals(1, $stats['active_vehicles']);
        $this->assertEquals(1, $stats['completed_bookings']);
        $this->assertEquals(9000.0, (float) $stats['total_revenue']);
        $this->assertEquals(360.0, (float) $stats['total_commission']); // 4% of 9000
    }

    public function test_admin_commissions_ledger(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->owner()->create(['name' => 'Host Commission Tester']);
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => $renter->name,
            'renter_contact' => '09170001122',
            'start_date' => now()->subDays(4)->format('Y-m-d'),
            'end_date' => now()->subDays(1)->format('Y-m-d'),
            'total_days' => 3,
            'total_price' => 6000,
            'status' => 'completed',
            'completed_at' => now()->subDays(1),
        ]);

        $response = $this->actingAs($admin)->get('/admin/commissions');

        $response->assertStatus(200);
        $owners = collect($response->viewData('page')['props']['owners']);
        $ownerEntry = $owners->firstWhere('id', $owner->id);

        $this->assertNotNull($ownerEntry);
        $this->assertEquals(1, $ownerEntry['vehicles_count']);
        $this->assertEquals(1, $ownerEntry['completed_bookings']);
        $this->assertEquals(6000.0, (float) $ownerEntry['total_revenue']);
        $this->assertEquals(240.0, (float) $ownerEntry['commission_owed']); // 4% of 6000
    }

    public function test_admin_bookings_and_owners_directories(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);

        // Test bookings index
        $bookingsResponse = $this->actingAs($admin)->get('/admin/bookings?status=pending');
        $bookingsResponse->assertStatus(200);

        // Test owners directory
        $ownersResponse = $this->actingAs($admin)->get('/admin/owners');
        $ownersResponse->assertStatus(200);
        $ownersList = collect($ownersResponse->viewData('page')['props']['owners']['data']);
        $this->assertTrue($ownersList->contains('id', $owner->id));
    }
}
