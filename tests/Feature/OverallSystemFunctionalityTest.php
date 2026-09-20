<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\BookingHandover;
use App\Models\Rating;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OverallSystemFunctionalityTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_platform_lifecycle_end_to_end(): void
    {
        // ---------------------------------------------------------------------
        // STEP 1: PUBLIC VEHICLE BROWSING & CATALOG
        // ---------------------------------------------------------------------
        $this->seed();

        // 1.1 Home page loads
        $response = $this->get('/');
        $response->assertStatus(200);

        // 1.2 Vehicle listing with filters
        $catalogResponse = $this->get('/vehicles?location=Tagbilaran&type=car&sort=price_asc');
        $catalogResponse->assertStatus(200);

        // 1.3 View vehicle details
        $activeVehicle = Vehicle::active()->firstOrFail();
        $detailResponse = $this->get("/vehicles/{$activeVehicle->slug}");
        $detailResponse->assertStatus(200);

        // 1.4 Inactive vehicle returns 404
        $activeVehicle->update(['status' => 'inactive']);
        $inactiveResponse = $this->get("/vehicles/{$activeVehicle->slug}");
        $inactiveResponse->assertStatus(404);
        $activeVehicle->update(['status' => 'active']);

        // ---------------------------------------------------------------------
        // STEP 2: HOST ONBOARDING & VEHICLE MANAGEMENT
        // ---------------------------------------------------------------------
        $hostEmail = 'boholhost_' . uniqid() . '@example.com';
        $registerHostResponse = $this->post('/register', [
            'name' => 'Bohol Host Owner',
            'email' => $hostEmail,
            'phone' => '09171112233',
            'role' => 'owner',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $registerHostResponse->assertRedirect(route('owner.dashboard'));

        $hostUser = User::where('email', $hostEmail)->firstOrFail();
        $this->assertTrue($hostUser->isOwner());

        // Host creates a vehicle listing with 5-column specs and features
        $newVehicleResponse = $this->actingAs($hostUser)->post('/owner/vehicles', [
            'title' => '2024 Mitsubishi Montero Sport Luxury SUV',
            'description' => 'Premium 7-seater SUV with cold AC and Bluetooth.',
            'type' => 'suv',
            'brand' => 'Mitsubishi',
            'model' => 'Montero Sport',
            'transmission' => 'automatic',
            'seats' => 7,
            'has_aircon' => true,
            'distance_limit' => 'Unlimited Mileage',
            'fuel_type' => 'Diesel',
            'features' => ['Cold Air Conditioner', 'Bluetooth Audio', 'ABS Brakes', 'Backup Camera'],
            'price_per_day' => 3000,
            'security_deposit' => 2000,
            'fuel_policy' => 'same_to_same',
            'delivery_available' => true,
            'delivery_fee' => 500,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'location' => 'Tagbilaran',
        ]);

        $createdVehicle = Vehicle::where('owner_id', $hostUser->id)->firstOrFail();
        $newVehicleResponse->assertRedirect(route('owner.vehicles.edit', $createdVehicle));
        $this->assertEquals('Unlimited Mileage', $createdVehicle->distance_limit);
        $this->assertEquals('Diesel', $createdVehicle->fuel_type);
        $this->assertContains('ABS Brakes', $createdVehicle->features);

        // Host toggles quick status: Active -> Maintenance -> Active
        $statusResponse = $this->actingAs($hostUser)->put("/owner/vehicles/{$createdVehicle->slug}/status", [
            'status' => 'maintenance',
        ]);
        $statusResponse->assertSessionHas('success');
        $createdVehicle->refresh();
        $this->assertEquals('maintenance', $createdVehicle->status);

        $this->actingAs($hostUser)->put("/owner/vehicles/{$createdVehicle->slug}/status", [
            'status' => 'active',
        ]);
        $createdVehicle->refresh();
        $this->assertEquals('active', $createdVehicle->status);

        // ---------------------------------------------------------------------
        // STEP 3: RENTER ONBOARDING & RESERVATION WITH DISCOUNT
        // ---------------------------------------------------------------------
        // Host cannot self-book own vehicle
        $selfBookResponse = $this->actingAs($hostUser)->post("/vehicles/{$createdVehicle->slug}/book", [
            'renter_name' => $hostUser->name,
            'renter_contact' => '09171112233',
            'renter_email' => $hostUser->email,
            'start_date' => now()->addDays(5)->format('Y-m-d'),
            'end_date' => now()->addDays(8)->format('Y-m-d'),
        ]);
        $selfBookResponse->assertSessionHasErrors(['vehicle']);

        // Log out host so a new guest renter can register
        auth()->logout();

        // Renter registers
        $renterEmail = 'tourist_' . uniqid() . '@example.com';
        $registerRenterResponse = $this->post('/register', [
            'name' => 'Island Explorer Renter',
            'email' => $renterEmail,
            'phone' => '09178889900',
            'role' => 'renter',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $registerRenterResponse->assertRedirect(route('renter.bookings'));

        $renterUser = User::where('email', $renterEmail)->firstOrFail();
        $this->assertTrue($renterUser->isRenter());

        // Renter books 3 days: Day 10 to Day 13 (3 days @ 3000 = 9000 - 10% discount = 8100)
        $startDate = now()->addDays(10)->format('Y-m-d');
        $endDate = now()->addDays(13)->format('Y-m-d');

        $bookResponse = $this->actingAs($renterUser)->post("/vehicles/{$createdVehicle->slug}/book", [
            'renter_name' => $renterUser->name,
            'renter_contact' => '09178889900',
            'renter_email' => $renterUser->email,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'pickup_preference' => 'host_location',
        ]);

        $booking = Booking::where('vehicle_id', $createdVehicle->id)
            ->where('renter_id', $renterUser->id)
            ->firstOrFail();

        $bookResponse->assertRedirect(route('booking.status', ['token' => $booking->token]));
        $this->assertEquals(8100.0, (float) $booking->total_price);
        $this->assertEquals('pending', $booking->status);
        $this->assertEquals(324.0, (float) $booking->commission_amount); // 4% of 8100 = 324
        $this->assertNotEmpty($booking->token);

        // ---------------------------------------------------------------------
        // STEP 4: OVERLAPPING DATE COLLISION REJECTION
        // ---------------------------------------------------------------------
        $overlapRenter = User::factory()->create(['role' => 'renter']);
        $overlapResponse = $this->actingAs($overlapRenter)->post("/vehicles/{$createdVehicle->slug}/book", [
            'renter_name' => 'Overlap Traveler',
            'renter_contact' => '09179990011',
            'renter_email' => 'overlap@example.com',
            'start_date' => now()->addDays(11)->format('Y-m-d'),
            'end_date' => now()->addDays(14)->format('Y-m-d'),
        ]);
        $overlapResponse->assertSessionHasErrors(['dates']);

        // ---------------------------------------------------------------------
        // STEP 5: PRIVACY & CONTACT MASKING DURING PENDING STATUS
        // ---------------------------------------------------------------------
        // Status page for renter: host contact must be null
        $statusPageResponse = $this->get(route('booking.status', ['token' => $booking->token]));
        $statusPageResponse->assertStatus(200);
        $this->assertNull($statusPageResponse->viewData('page')['props']['ownerContact'] ?? null);

        // Host bookings index: renter contact info is masked
        $hostBookingsResponse = $this->actingAs($hostUser)->get('/owner/bookings');
        $hostBookingsResponse->assertStatus(200);

        // ---------------------------------------------------------------------
        // STEP 6: HOST ACCEPTS BOOKING & LOCKS CALENDAR
        // ---------------------------------------------------------------------
        $acceptResponse = $this->actingAs($hostUser)->put("/owner/bookings/{$booking->id}/accept");
        $acceptResponse->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('accepted', $booking->status);
        $this->assertNotNull($booking->accepted_at);
        $this->assertNotNull($booking->contact_unlocked_at);

        // Calendar dates are marked as 'booked'
        $bookedDatesCount = VehicleAvailability::where('vehicle_id', $createdVehicle->id)
            ->where('status', 'booked')
            ->count();
        $this->assertGreaterThanOrEqual(3, $bookedDatesCount);

        // Now host contact is unlocked on renter status page
        $unlockedStatusPage = $this->get(route('booking.status', ['token' => $booking->token]));
        $unlockedStatusPage->assertStatus(200);
        $ownerContact = $unlockedStatusPage->viewData('page')['props']['ownerContact'] ?? null;
        $this->assertNotNull($ownerContact);
        $this->assertEquals($hostUser->phone, $ownerContact['phone']);

        // ---------------------------------------------------------------------
        // STEP 7: DIGITAL HANDOVER INSPECTION (3NF NORMALIZATION)
        // ---------------------------------------------------------------------
        $handoverResponse = $this->actingAs($renterUser)->post("/renter/bookings/{$booking->id}/handover", [
            'checkin_odometer' => '25,100 km',
            'checkin_fuel' => 'Full Tank (100%)',
            'checkin_notes' => 'No scratches, clean interior.',
            'checkout_odometer' => '25,350 km',
            'checkout_fuel' => 'Full Tank (100%)',
            'checkout_deposit_refunded' => true,
        ]);
        $handoverResponse->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('25,100 km', $booking->checkin_odometer);
        $this->assertTrue((bool) $booking->checkout_deposit_refunded);

        // Verify normalized 3NF table synchronization
        $handoverRecord = BookingHandover::where('booking_id', $booking->id)->firstOrFail();
        $this->assertEquals('25,100 km', $handoverRecord->checkin_odometer);
        $this->assertEquals('25,350 km', $handoverRecord->checkout_odometer);
        $this->assertTrue((bool) $handoverRecord->checkout_deposit_refunded);

        // ---------------------------------------------------------------------
        // STEP 8: HOST COMPLETES RENTAL & RELEASES CALENDAR
        // ---------------------------------------------------------------------
        $completeResponse = $this->actingAs($hostUser)->put("/owner/bookings/{$booking->id}/complete");
        $completeResponse->assertSessionHas('success');

        $booking->refresh();
        $this->assertEquals('completed', $booking->status);
        $this->assertNotNull($booking->completed_at);

        // Dates are released back to available
        $bookedDatesCountAfter = VehicleAvailability::where('vehicle_id', $createdVehicle->id)
            ->where('status', 'booked')
            ->count();
        $this->assertEquals(0, $bookedDatesCountAfter);

        // ---------------------------------------------------------------------
        // STEP 9: MUTUAL RATINGS & VEHICLE REVIEWS UPDATE
        // ---------------------------------------------------------------------
        // Renter rates completed trip
        $renterRateResponse = $this->actingAs($renterUser)->post("/renter/bookings/{$booking->id}/rate", [
            'stars' => 5,
            'comment' => 'Fantastic Bohol road trip in this Montero! Smooth handover and clean ride.',
        ]);
        $renterRateResponse->assertSessionHas('success');

        $renterRating = Rating::where('booking_id', $booking->id)->where('rater_type', 'renter')->firstOrFail();
        $this->assertEquals(5, $renterRating->stars);
        $this->assertEquals($renterUser->id, $renterRating->rater_id);

        // Host rates renter
        $hostRateResponse = $this->actingAs($hostUser)->post("/owner/bookings/{$booking->id}/rate", [
            'stars' => 5,
            'comment' => 'Excellent renter, returned with a full tank and on time.',
        ]);
        $hostRateResponse->assertSessionHas('success');

        $hostRating = Rating::where('booking_id', $booking->id)->where('rater_type', 'owner')->firstOrFail();
        $this->assertEquals(5, $hostRating->stars);

        // ---------------------------------------------------------------------
        // STEP 10: HOST EARNINGS STATEMENT LEDGER
        // ---------------------------------------------------------------------
        $earningsResponse = $this->actingAs($hostUser)->get('/owner/earnings');
        $earningsResponse->assertStatus(200);

        $earningsData = $earningsResponse->viewData('page')['props']['earnings'];
        $this->assertEquals(8100.0, (float) $earningsData['total_gross']);
        $this->assertEquals(324.0, (float) $earningsData['total_commission']);
        $this->assertEquals(7776.0, (float) $earningsData['net_payout']); // 8100 - 324 = 7776
        $this->assertEquals(1, $earningsData['completed_count']);

        // ---------------------------------------------------------------------
        // STEP 11: ADMIN AUDIT & COMMISSION TRACKING
        // ---------------------------------------------------------------------
        $adminUser = User::where('role', 'admin')->firstOrFail();

        // Admin dashboard
        $adminDashboardResponse = $this->actingAs($adminUser)->get('/admin/dashboard');
        $adminDashboardResponse->assertStatus(200);
        $adminStats = $adminDashboardResponse->viewData('page')['props']['stats'];
        $this->assertGreaterThan(0, $adminStats['total_vehicles']);
        $this->assertGreaterThan(0, $adminStats['total_revenue']);

        // Admin commission breakdown
        $adminCommissionsResponse = $this->actingAs($adminUser)->get('/admin/commissions');
        $adminCommissionsResponse->assertStatus(200);
        $ownersList = collect($adminCommissionsResponse->viewData('page')['props']['owners']);
        $hostRow = $ownersList->firstWhere('id', $hostUser->id);
        $this->assertNotNull($hostRow);
        $this->assertEquals(8100.0, (float) $hostRow['total_revenue']);
        $this->assertEquals(324.0, (float) $hostRow['commission_owed']);

        // Admin bookings & owners index
        $this->actingAs($adminUser)->get('/admin/bookings')->assertStatus(200);
        $this->actingAs($adminUser)->get('/admin/owners')->assertStatus(200);
    }
}
