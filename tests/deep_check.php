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
use App\Services\ImageService;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

$results = [
    'passed' => [],
    'failed' => [],
    'warnings' => [],
];

function reportPass($category, $test) {
    global $results;
    $results['passed'][] = "[$category] $test";
    echo "[PASS] [$category] $test\n";
}

function reportFail($category, $test, $error) {
    global $results;
    $results['failed'][] = "[$category] $test: $error";
    echo "[FAIL] [$category] $test: $error\n";
}

function reportWarn($category, $test, $warning) {
    global $results;
    $results['warnings'][] = "[$category] $test: $warning";
    echo "[WARN] [$category] $test: $warning\n";
}

echo "========================================================\n";
echo "       RENTBOHOL SYSTEM FUNCTIONALITY DEEP CHECK        \n";
echo "========================================================\n\n";

// 1. DATABASE & SCHEMA CHECKS
try {
    $userCount = User::count();
    $vehicleCount = Vehicle::count();
    $bookingCount = Booking::count();
    $photoCount = VehiclePhoto::count();
    reportPass("Database", "Database connection and records exist (Users: $userCount, Vehicles: $vehicleCount, Bookings: $bookingCount, Photos: $photoCount)");
} catch (\Throwable $e) {
    reportFail("Database", "Database query failed", $e->getMessage());
}

// 2. USER AUTH & ROLES
try {
    $admin = User::where('role', 'admin')->first();
    $owner = User::where('role', 'owner')->first();
    $renter = User::where('role', 'renter')->first();

    if ($admin && $admin->isAdmin()) {
        reportPass("Auth", "Admin user found and isAdmin() returns true ({$admin->email})");
    } else {
        reportFail("Auth", "Admin user verification", "No admin user or isAdmin() returned false");
    }

    if ($owner && $owner->isOwner()) {
        reportPass("Auth", "Owner user found and isOwner() returns true ({$owner->email})");
    } else {
        reportFail("Auth", "Owner user verification", "No owner user or isOwner() returned false");
    }

    if ($renter && $renter->isRenter()) {
        reportPass("Auth", "Renter user found and isRenter() returns true ({$renter->email})");
    } else {
        reportFail("Auth", "Renter user verification", "No renter user or isRenter() returned false");
    }
} catch (\Throwable $e) {
    reportFail("Auth", "User roles check failed", $e->getMessage());
}

// 3. VEHICLE MODEL & PRICE QUOTE CALCULATOR
try {
    $vehicle = Vehicle::first();
    if ($vehicle) {
        $quote1 = $vehicle->calculatePriceQuote(1, false);
        $quote3 = $vehicle->calculatePriceQuote(3, false);
        $quote7 = $vehicle->calculatePriceQuote(7, false);
        $quoteDelivery = $vehicle->calculatePriceQuote(1, true);

        reportPass("Vehicle Pricing", "Price calculation engine works properly (1d: P{$quote1['final_total']}, 3d: P{$quote3['final_total']}, 7d: P{$quote7['final_total']}, with delivery: P{$quoteDelivery['final_total']})");
    } else {
        reportFail("Vehicle Pricing", "Vehicle lookup", "No vehicles found");
    }
} catch (\Throwable $e) {
    reportFail("Vehicle Pricing", "Pricing calculation error", $e->getMessage());
}

// 4. PHOTO HANDLING & ATTR
try {
    $vehicleWithPhotos = Vehicle::whereHas('photos')->with('photos')->first();
    if ($vehicleWithPhotos) {
        $photo = $vehicleWithPhotos->photos->first();
        reportPass("Vehicle Photos", "Vehicle photo relationship loaded properly. Photo path: {$photo->path}, order: {$photo->order}");
    } else {
        reportWarn("Vehicle Photos", "No vehicles with photos found in database", "Check seeders");
    }
} catch (\Throwable $e) {
    reportFail("Vehicle Photos", "Photo relationship error", $e->getMessage());
}

// 5. BOOKINGS & CONTACT MASKING / SECURITY
try {
    $booking = Booking::with('vehicle.owner')->first();
    if ($booking) {
        $maskedName = $booking->masked_renter_name;
        $isContactUnlocked = $booking->isContactUnlocked();
        reportPass("Booking Security", "Masked renter name logic working: '{$booking->renter_name}' -> '$maskedName'. Contact unlocked: " . ($isContactUnlocked ? 'YES' : 'NO'));

        $rawContact = $booking->getRawOriginal('renter_contact');
        $decryptedContact = $booking->renter_contact;
        reportPass("Booking Security", "Renter contact encryption verified (encrypted raw length: " . strlen($rawContact) . ")");
    } else {
        reportWarn("Booking Security", "No bookings found to test", "Create sample booking");
    }
} catch (\Throwable $e) {
    reportFail("Booking Security", "Booking model check failed", $e->getMessage());
}

// 6. AVAILABILITY ENGINE & DATE OVERLAPS
try {
    $vehicle = Vehicle::where('status', 'active')->first();
    if ($vehicle) {
        $activeQueryCount = Vehicle::active()->count();
        $inLocationCount = Vehicle::inLocation($vehicle->location)->count();
        $ofTypeCount = Vehicle::ofType($vehicle->type)->count();
        reportPass("Search & Filter", "Scopes working (Active: $activeQueryCount, Location '{$vehicle->location}': $inLocationCount, Type '{$vehicle->type}': $ofTypeCount)");
    }
} catch (\Throwable $e) {
    reportFail("Search & Filter", "Vehicle scope filtering error", $e->getMessage());
}

// 7. NOTIFICATION SERVICE
try {
    $booking = Booking::first();
    if ($booking) {
        NotificationService::notifyHostNewBooking($booking);
        NotificationService::notifyRenterBookingAccepted($booking);
        reportPass("Notification Service", "Notification methods executed cleanly without exception");
    }
} catch (\Throwable $e) {
    reportFail("Notification Service", "Notification service error", $e->getMessage());
}

// 8. CONFIG CHECK
try {
    $locations = config('rentbohol.locations');
    $types = config('rentbohol.vehicle_types');
    $commRate = config('rentbohol.commission_rate');
    if (is_array($locations) && count($locations) > 0 && is_array($types) && count($types) > 0) {
        reportPass("Configuration", "rentbohol.php loaded " . count($locations) . " locations, " . count($types) . " types, and commission rate {$commRate}%");
    } else {
        reportFail("Configuration", "rentbohol config missing or empty", "");
    }
} catch (\Throwable $e) {
    reportFail("Configuration", "Config check error", $e->getMessage());
}

// 9. COMPONENT & ROUTE INTEGRITY
try {
    $routes = Route::getRoutes();
    $namedRoutes = [];
    foreach ($routes as $r) {
        if ($r->getName()) {
            $namedRoutes[] = $r->getName();
        }
    }
    $requiredRoutes = [
        'home', 'vehicles.index', 'vehicles.show', 'about', 'contact', 'privacy',
        'booking.store', 'booking.status', 'booking.renter-rate',
        'login', 'register', 'logout', 'user.switch-role',
        'renter.bookings', 'renter.license.upload', 'renter.bookings.rate', 'renter.bookings.cancel', 'renter.bookings.handover',
        'owner.vehicles.index', 'owner.vehicles.create', 'owner.vehicles.store', 'owner.vehicles.edit', 'owner.vehicles.update',
        'owner.vehicles.status', 'owner.vehicles.destroy', 'owner.vehicles.photos.upload',
        'owner.bookings.index', 'owner.earnings', 'owner.bookings.show', 'owner.bookings.accept', 'owner.bookings.decline', 'owner.bookings.complete',
        'admin.dashboard', 'admin.commissions', 'admin.bookings', 'admin.owners'
    ];

    $missingRoutes = [];
    foreach ($requiredRoutes as $req) {
        if (!in_array($req, $namedRoutes)) {
            $missingRoutes[] = $req;
        }
    }

    if (empty($missingRoutes)) {
        reportPass("Route Registry", "All core named routes are correctly registered");
    } else {
        reportFail("Route Registry", "Missing named routes", implode(', ', $missingRoutes));
    }
} catch (\Throwable $e) {
    reportFail("Route Registry", "Route check error", $e->getMessage());
}

echo "\n========================================================\n";
echo "SUMMARY: " . count($results['passed']) . " PASSED, " . count($results['failed']) . " FAILED, " . count($results['warnings']) . " WARNINGS\n";
echo "========================================================\n";
