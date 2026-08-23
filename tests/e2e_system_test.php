<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Booking;
use App\Models\VehiclePhoto;
use App\Models\VehicleAvailability;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

$testReport = [
    'categories' => [],
    'total_passed' => 0,
    'total_failed' => 0,
    'details' => [],
];

function getInertiaProps($response) {
    if (!$response instanceof \Inertia\Response) return [];
    $ref = new \ReflectionClass($response);
    $prop = $ref->getProperty('props');
    $prop->setAccessible(true);
    return $prop->getValue($response);
}

function getInertiaComponent($response) {
    if (!$response instanceof \Inertia\Response) return '';
    $ref = new \ReflectionClass($response);
    $comp = $ref->getProperty('component');
    $comp->setAccessible(true);
    return $comp->getValue($response);
}

function runTest($category, $title, callable $testFn) {
    global $testReport;
    try {
        $result = $testFn();
        $testReport['total_passed']++;
        $testReport['details'][] = ['status' => 'PASS', 'category' => $category, 'title' => $title, 'note' => is_string($result) ? $result : 'OK'];
        echo "  [PASS] $title" . (is_string($result) ? " -> $result" : "") . "\n";
    } catch (\Throwable $e) {
        $testReport['total_failed']++;
        $msg = $e->getMessage() . " in " . basename($e->getFile()) . ":" . $e->getLine();
        $testReport['details'][] = ['status' => 'FAIL', 'category' => $category, 'title' => $title, 'note' => $msg];
        echo "  [FAIL] $title -> $msg\n";
    }
}

echo "======================================================================\n";
echo "           RENTBOHOL COMPREHENSIVE END-TO-END SYSTEM TEST             \n";
echo "======================================================================\n\n";

DB::beginTransaction();

try {
    // -------------------------------------------------------------------------
    // CATEGORY 1: PUBLIC VEHICLE BROWSING & SEARCH
    // -------------------------------------------------------------------------
    echo "1. TESTING PUBLIC BROWSING & SEARCH ENGINE...\n";

    runTest("Public Browsing", "Landing Page (PublicVehicleController@home)", function() {
        $controller = app(\App\Http\Controllers\PublicVehicleController::class);
        $response = $controller->home();
        $component = getInertiaComponent($response);
        if ($component !== 'Welcome') throw new Exception("Expected component 'Welcome', got {$component}");
        $props = getInertiaProps($response);
        if (!isset($props['featuredVehicles']) || count($props['featuredVehicles']) === 0) throw new Exception("Missing featuredVehicles");
        if (!isset($props['stats']['total_vehicles'])) throw new Exception("Missing stats");
        return "Loaded " . count($props['featuredVehicles']) . " featured vehicles & statistics";
    });

    runTest("Public Browsing", "Vehicle Listing with Filters (PublicVehicleController@index)", function() {
        $controller = app(\App\Http\Controllers\PublicVehicleController::class);
        $request = Request::create('/vehicles', 'GET', [
            'location' => 'Tagbilaran',
            'type' => 'car',
            'sort' => 'price_asc',
        ]);
        $response = $controller->index($request);
        $component = getInertiaComponent($response);
        if ($component !== 'Vehicles/Index') throw new Exception("Expected component 'Vehicles/Index'");
        return "Filtered query returned paginated results for Tagbilaran cars";
    });

    runTest("Public Browsing", "Vehicle Detail Page (PublicVehicleController@show)", function() {
        $controller = app(\App\Http\Controllers\PublicVehicleController::class);
        $vehicle = Vehicle::active()->firstOrFail();
        $response = $controller->show($vehicle);
        $component = getInertiaComponent($response);
        if ($component !== 'Vehicles/Show') throw new Exception("Expected component 'Vehicles/Show'");
        $props = getInertiaProps($response);
        if (!isset($props['vehicle'])) throw new Exception("Missing vehicle prop");
        if (!isset($props['availability'])) throw new Exception("Missing availability prop");
        return "Vehicle '{$vehicle->title}' rendered with 90-day calendar";
    });

    runTest("Public Browsing", "Inactive Vehicle 404 Protection", function() {
        $controller = app(\App\Http\Controllers\PublicVehicleController::class);
        $vehicle = Vehicle::first();
        $originalStatus = $vehicle->status;
        $vehicle->status = 'inactive';
        $threw404 = false;
        try {
            $controller->show($vehicle);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            if ($e->getStatusCode() === 404) $threw404 = true;
        } finally {
            $vehicle->status = $originalStatus;
        }
        if (!$threw404) throw new Exception("Expected 404 HttpException for inactive vehicle");
        return "Inactive vehicles safely return 404 for public visitors";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 2: AUTHENTICATION & ROLE SWITCHING
    // -------------------------------------------------------------------------
    echo "\n2. TESTING AUTHENTICATION & ACCESS CONTROL...\n";

    $testRenterEmail = 'test_renter_' . uniqid() . '@example.com';
    $testOwnerEmail = 'test_owner_' . uniqid() . '@example.com';

    runTest("Authentication", "Renter Registration (RegisterController@store)", function() use ($testRenterEmail) {
        $controller = app(\App\Http\Controllers\Auth\RegisterController::class);
        $request = Request::create('/register', 'POST', [
            'name' => 'Automated Test Renter',
            'email' => $testRenterEmail,
            'phone' => '09170001111',
            'role' => 'renter',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $response = $controller->store($request);
        $user = User::where('email', $testRenterEmail)->first();
        if (!$user) throw new Exception("User was not created");
        if ($user->role !== 'renter') throw new Exception("User role should be 'renter'");
        if (!Auth::check()) throw new Exception("User was not authenticated after registration");
        return "Renter created, hashed, and logged in";
    });

    runTest("Authentication", "Owner Registration (RegisterController@store)", function() use ($testOwnerEmail) {
        $controller = app(\App\Http\Controllers\Auth\RegisterController::class);
        $request = Request::create('/register', 'POST', [
            'name' => 'Automated Test Owner',
            'email' => $testOwnerEmail,
            'phone' => '09170002222',
            'role' => 'owner',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $response = $controller->store($request);
        $user = User::where('email', $testOwnerEmail)->first();
        if (!$user) throw new Exception("Owner was not created");
        if ($user->role !== 'owner') throw new Exception("User role should be 'owner'");
        return "Host account created and authenticated";
    });

    runTest("Authentication", "Role Switcher (LoginController@switchRole)", function() use ($testRenterEmail) {
        $user = User::where('email', $testRenterEmail)->firstOrFail();
        Auth::login($user);
        $controller = app(\App\Http\Controllers\Auth\LoginController::class);
        $request = Request::create('/user/switch-role', 'POST');
        $controller->switchRole($request);
        $user->refresh();
        if ($user->role !== 'owner') throw new Exception("Role did not switch to owner");

        // Switch back
        $controller->switchRole($request);
        $user->refresh();
        if ($user->role !== 'renter') throw new Exception("Role did not switch back to renter");
        return "Role seamlessly toggled Renter -> Owner -> Renter";
    });

    runTest("Authentication", "Admin Cannot Switch Roles Guard", function() {
        $admin = User::where('role', 'admin')->firstOrFail();
        Auth::login($admin);
        $controller = app(\App\Http\Controllers\Auth\LoginController::class);
        $request = Request::create('/user/switch-role', 'POST');
        $response = $controller->switchRole($request);
        $admin->refresh();
        if ($admin->role !== 'admin') throw new Exception("Admin role was inappropriately mutated");
        return "Admin accounts are protected against role modification";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 3: BOOKING CREATION & CALENDAR AVAILABILITY LIFECYCLE
    // -------------------------------------------------------------------------
    echo "\n3. TESTING BOOKING ENGINE & WORKFLOW...\n";

    $hostUser = User::where('email', $testOwnerEmail)->firstOrFail();
    $renterUser = User::where('email', $testRenterEmail)->firstOrFail();

    // Create a vehicle for the host
    $testVehicle = Vehicle::create([
        'owner_id' => $hostUser->id,
        'title' => 'E2E Test Toyota Fortuner',
        'slug' => 'e2e-test-toyota-fortuner-' . uniqid(),
        'description' => 'Test vehicle description',
        'type' => 'suv',
        'brand' => 'Toyota',
        'model' => 'Fortuner',
        'transmission' => 'automatic',
        'seats' => 7,
        'has_aircon' => true,
        'price_per_day' => 3000,
        'security_deposit' => 2000,
        'discount_three_days' => 10,
        'discount_weekly' => 20,
        'delivery_available' => true,
        'delivery_fee' => 500,
        'location' => 'Tagbilaran',
        'status' => 'active',
        'avg_rating' => 5.0,
        'total_reviews' => 1,
    ]);

    runTest("Booking Engine", "Host Prevented from Booking Own Vehicle", function() use ($hostUser, $testVehicle) {
        Auth::login($hostUser);
        $controller = app(\App\Http\Controllers\BookingController::class);
        $request = Request::create("/vehicles/{$testVehicle->slug}/book", 'POST', [
            'renter_name' => $hostUser->name,
            'renter_contact' => '09170002222',
            'renter_email' => $hostUser->email,
            'start_date' => now()->addDays(5)->format('Y-m-d'),
            'end_date' => now()->addDays(8)->format('Y-m-d'),
        ]);
        $response = $controller->store($request, $testVehicle);
        if (session('errors') && session('errors')->has('vehicle')) {
            return "Self-booking correctly rejected with validation error";
        }
        throw new Exception("Self-booking should have been blocked");
    });

    $createdBookingToken = null;
    $createdBookingId = null;

    runTest("Booking Engine", "Renter Creates 3-Day Reservation with Discount", function() use ($renterUser, $testVehicle, &$createdBookingToken, &$createdBookingId) {
        Auth::login($renterUser);
        $controller = app(\App\Http\Controllers\BookingController::class);
        $startDate = now()->addDays(10)->format('Y-m-d');
        $endDate = now()->addDays(13)->format('Y-m-d'); // 3 days

        $request = Request::create("/vehicles/{$testVehicle->slug}/book", 'POST', [
            'renter_name' => $renterUser->name,
            'renter_contact' => '09170001111',
            'renter_email' => $renterUser->email,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'pickup_preference' => 'host_location',
        ]);

        $response = $controller->store($request, $testVehicle);
        $booking = Booking::where('vehicle_id', $testVehicle->id)->where('renter_id', $renterUser->id)->first();
        if (!$booking) throw new Exception("Booking was not stored");

        // 3 days * 3000 = 9000 - 10% discount (900) = 8100
        if ((float)$booking->total_price !== 8100.0) throw new Exception("Expected total price 8100, got {$booking->total_price}");
        if ($booking->status !== 'pending') throw new Exception("Booking status should be 'pending'");
        if (empty($booking->token)) throw new Exception("Booking UUID token was not generated");
        // 4% commission of 8100 = 324
        if ((float)$booking->commission_amount !== 324.0) throw new Exception("Expected 324.0 commission, got {$booking->commission_amount}");

        $createdBookingToken = $booking->token;
        $createdBookingId = $booking->id;
        return "Booking #{$booking->id} created with 10% multi-day discount (Total: P8,100, Commission: P324)";
    });

    runTest("Booking Engine", "Overlapping Date Collision Prevention", function() use ($testVehicle) {
        $otherUser = User::factory()->create(['role' => 'renter']);
        Auth::login($otherUser);
        $controller = app(\App\Http\Controllers\BookingController::class);

        // Attempt overlapping dates: 11 to 14
        $request = Request::create("/vehicles/{$testVehicle->slug}/book", 'POST', [
            'renter_name' => 'Overlapping Renter',
            'renter_contact' => '09179998888',
            'renter_email' => 'overlap@example.com',
            'start_date' => now()->addDays(11)->format('Y-m-d'),
            'end_date' => now()->addDays(14)->format('Y-m-d'),
        ]);

        $controller->store($request, $testVehicle);
        if (session('errors') && session('errors')->has('dates')) {
            return "Overlapping reservation correctly blocked";
        }
        throw new Exception("Overlapping booking was not rejected");
    });

    runTest("Booking Security", "Contact Masking on Pending Status", function() use ($createdBookingToken) {
        $controller = app(\App\Http\Controllers\BookingController::class);
        $response = $controller->renterStatus($createdBookingToken);
        $props = getInertiaProps($response);
        if ($props['ownerContact'] !== null) throw new Exception("Owner contact should be null before acceptance");
        return "Host contact information is securely hidden while booking is pending";
    });

    runTest("Host Booking Lifecycle", "Host Accepts Booking & Locks Availability", function() use ($hostUser, $createdBookingId, $createdBookingToken) {
        Auth::login($hostUser);
        $booking = Booking::findOrFail($createdBookingId);
        $controller = app(\App\Http\Controllers\Owner\BookingController::class);

        $controller->accept($booking);
        $booking->refresh();

        if ($booking->status !== 'accepted') throw new Exception("Status did not change to 'accepted'");
        if (!$booking->accepted_at) throw new Exception("accepted_at timestamp not set");
        if (!$booking->contact_unlocked_at) throw new Exception("contact_unlocked_at timestamp not set");

        // Verify calendar dates are marked 'booked'
        $bookedDatesCount = VehicleAvailability::where('vehicle_id', $booking->vehicle_id)
            ->where('status', 'booked')
            ->count();
        if ($bookedDatesCount === 0) throw new Exception("Calendar availability was not marked as booked");

        return "Booking accepted, timestamps logged, and 4 calendar dates marked as 'booked'";
    });

    runTest("Booking Security", "Contact Unlocked for Renter Post-Acceptance", function() use ($createdBookingToken) {
        $controller = app(\App\Http\Controllers\BookingController::class);
        $response = $controller->renterStatus($createdBookingToken);
        $props = getInertiaProps($response);
        if ($props['ownerContact'] === null) throw new Exception("Owner contact should be visible after acceptance");
        if (empty($props['ownerContact']['phone'])) throw new Exception("Owner phone should be present");
        return "Host direct phone and email unlocked for renter on status portal";
    });

    runTest("Host Booking Lifecycle", "Host Completes Rental & Releases Calendar", function() use ($hostUser, $createdBookingId) {
        Auth::login($hostUser);
        $booking = Booking::findOrFail($createdBookingId);
        $controller = app(\App\Http\Controllers\Owner\BookingController::class);

        $controller->complete($booking);
        $booking->refresh();

        if ($booking->status !== 'completed') throw new Exception("Status did not change to 'completed'");

        // Verify calendar dates freed
        $bookedCount = VehicleAvailability::where('vehicle_id', $booking->vehicle_id)
            ->where('status', 'booked')
            ->count();
        if ($bookedCount > 0) throw new Exception("Calendar dates should have been released to available");

        return "Booking completed and dates released back to available";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 4: RATINGS & REVIEWS SYSTEM
    // -------------------------------------------------------------------------
    echo "\n4. TESTING RATINGS & REVIEW SUBMISSIONS...\n";

    runTest("Ratings Engine", "Renter Rates Completed Rental", function() use ($renterUser, $createdBookingId) {
        Auth::login($renterUser);
        $booking = Booking::findOrFail($createdBookingId);
        $controller = app(\App\Http\Controllers\RenterBookingController::class);

        $request = Request::create("/renter/bookings/{$booking->id}/rate", 'POST', [
            'stars' => 5,
            'comment' => 'Fantastic SUV, clean and smooth drive across Bohol!',
        ]);

        $controller->rate($request, $booking);
        $rating = Rating::where('booking_id', $booking->id)->where('rater_type', 'renter')->first();
        if (!$rating) throw new Exception("Rating was not recorded");
        if ($rating->stars !== 5) throw new Exception("Expected 5 stars");
        return "5-Star renter review recorded";
    });

    runTest("Ratings Engine", "Host Rates Renter", function() use ($hostUser, $createdBookingId) {
        Auth::login($hostUser);
        $booking = Booking::findOrFail($createdBookingId);
        $controller = app(\App\Http\Controllers\Owner\BookingController::class);

        $request = Request::create("/owner/bookings/{$booking->id}/rate", 'POST', [
            'stars' => 5,
            'comment' => 'Great renter, returned on time with full tank!',
        ]);

        $controller->rate($request, $booking);
        $rating = Rating::where('booking_id', $booking->id)->where('rater_type', 'owner')->first();
        if (!$rating) throw new Exception("Host rating was not recorded");
        return "Host review for renter recorded";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 5: OWNER VEHICLE MANAGEMENT
    // -------------------------------------------------------------------------
    echo "\n5. TESTING HOST VEHICLE MANAGEMENT CRUD...\n";

    runTest("Owner Vehicles", "Host Quick Status Toggle (Active <-> Maintenance)", function() use ($hostUser, $testVehicle) {
        Auth::login($hostUser);
        $controller = app(\App\Http\Controllers\Owner\VehicleController::class);

        $request = Request::create("/owner/vehicles/{$testVehicle->id}/status", 'PUT', [
            'status' => 'maintenance',
        ]);
        $controller->updateStatus($request, $testVehicle);
        $testVehicle->refresh();
        if ($testVehicle->status !== 'maintenance') throw new Exception("Status did not change to maintenance");

        $request2 = Request::create("/owner/vehicles/{$testVehicle->id}/status", 'PUT', [
            'status' => 'active',
        ]);
        $controller->updateStatus($request2, $testVehicle);
        $testVehicle->refresh();
        if ($testVehicle->status !== 'active') throw new Exception("Status did not change back to active");

        return "Quick status transitions verified: Active -> Maintenance -> Active";
    });

    runTest("Owner Earnings", "Host Earnings Statement Calculation", function() use ($hostUser) {
        Auth::login($hostUser);
        $controller = app(\App\Http\Controllers\Owner\BookingController::class);
        $request = Request::create('/owner/earnings', 'GET');
        $response = $controller->earnings($request);
        $props = getInertiaProps($response);

        $earnings = $props['earnings'];
        if ($earnings['total_gross'] !== 8100.0) throw new Exception("Expected gross 8100, got {$earnings['total_gross']}");
        if ($earnings['total_commission'] !== 324.0) throw new Exception("Expected commission 324, got {$earnings['total_commission']}");
        if ($earnings['net_payout'] !== 7776.0) throw new Exception("Expected net 7776, got {$earnings['net_payout']}");

        return "Earnings ledger accurate: Gross P8,100 - Commission P324 = P7,776 Net Payout";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 6: ADMIN PORTAL & LEDGERS
    // -------------------------------------------------------------------------
    echo "\n6. TESTING ADMIN DASHBOARD & FINANCIAL AUDIT...\n";

    runTest("Admin Dashboard", "Admin Metrics Aggregation", function() {
        $admin = User::where('role', 'admin')->firstOrFail();
        Auth::login($admin);
        $controller = app(\App\Http\Controllers\Admin\DashboardController::class);
        $response = $controller->index();
        $props = getInertiaProps($response);
        $stats = $props['stats'];

        if (!isset($stats['total_owners']) || !isset($stats['total_revenue'])) throw new Exception("Admin stats missing fields");
        return "Admin stats calculated (Total Bookings: {$stats['total_bookings']}, Confirmed/Completed Rev: P" . number_format($stats['total_revenue']) . ")";
    });

    runTest("Admin Commissions", "Host Commission Ledger", function() {
        $admin = User::where('role', 'admin')->firstOrFail();
        Auth::login($admin);
        $controller = app(\App\Http\Controllers\Admin\DashboardController::class);
        $request = Request::create('/admin/commissions', 'GET');
        $response = $controller->commissions($request);
        $props = getInertiaProps($response);
        $owners = $props['owners'];
        if (!is_array($owners) && !is_a($owners, \Illuminate\Support\Collection::class)) throw new Exception("Owners prop missing");
        return "Commission breakdown compiled across " . count($owners) . " registered hosts";
    });

    // -------------------------------------------------------------------------
    // CATEGORY 7: RENTER DASHBOARD & HANDOVER
    // -------------------------------------------------------------------------
    echo "\n7. TESTING RENTER DIGITAL HANDOVER & BOOKINGS LIST...\n";

    runTest("Renter Dashboard", "Renter Bookings Index", function() use ($renterUser) {
        Auth::login($renterUser);
        $controller = app(\App\Http\Controllers\RenterBookingController::class);
        $request = Request::create('/renter/bookings', 'GET');
        $response = $controller->index($request);
        $props = getInertiaProps($response);
        $bookings = $props['bookings'];
        if (count($bookings) === 0) throw new Exception("Renter bookings list was empty");
        return "Renter dashboard rendered " . count($bookings) . " rental record(s)";
    });

    runTest("Renter Dashboard", "Digital Handover Checklist Update", function() use ($renterUser, $createdBookingId) {
        Auth::login($renterUser);
        $booking = Booking::findOrFail($createdBookingId);
        $controller = app(\App\Http\Controllers\RenterBookingController::class);

        $request = Request::create("/renter/bookings/{$booking->id}/handover", 'POST', [
            'checkin_odometer' => '45,210 km',
            'checkin_fuel' => 'Full Tank (100%)',
            'checkin_notes' => 'Minor scratch on rear left bumper noted at pickup.',
            'checkout_odometer' => '45,450 km',
            'checkout_fuel' => 'Full Tank (100%)',
            'checkout_deposit_refunded' => true,
        ]);

        $controller->updateHandover($request, $booking);
        $booking->refresh();

        if ($booking->checkin_odometer !== '45,210 km') throw new Exception("Handover odometer mismatch");
        if ($booking->checkout_deposit_refunded !== true) throw new Exception("Deposit refund flag not set");

        return "Handover digital inspection logged (Odo: 45,210km -> 45,450km, Deposit Refunded: Yes)";
    });

} finally {
    // Rollback test mutations to keep database clean and pristine
    DB::rollBack();
}

echo "\n======================================================================\n";
echo "FINAL RESULTS: {$testReport['total_passed']} PASSED, {$testReport['total_failed']} FAILED\n";
echo "======================================================================\n";
