<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

echo "======================================================================\n";
echo "       RENTBOHOL SECURITY HEADERS & RATE LIMITING TEST               \n";
echo "======================================================================\n\n";

$passed = 0;
$failed = 0;

function assertCondition($name, $condition, $details = '') {
    global $passed, $failed;
    if ($condition) {
        echo "  [PASS] {$name}" . ($details ? " -> {$details}" : "") . "\n";
        $passed++;
    } else {
        echo "  [FAIL] {$name}" . ($details ? " -> {$details}" : "") . "\n";
        $failed++;
    }
}

// 1. TEST SECURITY HEADERS
echo "1. TESTING HTTP SECURITY HEADERS...\n";
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $kernel->handle($request);

$headers = $response->headers;
assertCondition('X-Content-Type-Options Header', $headers->get('X-Content-Type-Options') === 'nosniff', 'Value: ' . $headers->get('X-Content-Type-Options'));
assertCondition('X-Frame-Options Header', $headers->get('X-Frame-Options') === 'DENY', 'Value: ' . $headers->get('X-Frame-Options'));
assertCondition('Referrer-Policy Header', $headers->get('Referrer-Policy') === 'strict-origin-when-cross-origin', 'Value: ' . $headers->get('Referrer-Policy'));
assertCondition('Permissions-Policy Header', str_contains($headers->get('Permissions-Policy') ?? '', 'camera=()'), 'Value: ' . $headers->get('Permissions-Policy'));
assertCondition('X-XSS-Protection Modern Policy', $headers->get('X-XSS-Protection') === '0', 'Value: ' . $headers->get('X-XSS-Protection'));

$kernel->terminate($request, $response);

// 2. TEST RATE LIMITER FOR CONTACT FORM (3 attempts/min)
echo "\n2. TESTING GRANULAR RATE LIMITERS...\n";

$rateLimiter = $app->make(Illuminate\Cache\RateLimiter::class);
$testIp = '192.168.1.100';

// Clear test key
$testKey = "contact:{$testIp}";
$rateLimiter->clear($testKey);

$limitHits = 0;
$blocked = false;

for ($i = 1; $i <= 5; $i++) {
    $mockReq = Illuminate\Http\Request::create('/contact', 'POST', [], [], [], ['REMOTE_ADDR' => $testIp]);
    
    // Resolve limiter definition
    $limiterResolver = $rateLimiter->limiter('contact');
    $limit = $limiterResolver($mockReq);
    
    $key = $limit->key ?: sha1('contact' . '|' . $testIp);
    $maxAttempts = $limit->maxAttempts;
    
    if ($rateLimiter->tooManyAttempts($key, $maxAttempts)) {
        $blocked = true;
        break;
    }
    
    $rateLimiter->hit($key, $limit->decaySeconds);
    $limitHits++;
}

assertCondition('Contact Form Rate Limiter (3/min max)', $blocked && $limitHits === 3, "Allowed {$limitHits} attempts, attempt 4 was throttled");

// Test global rate limiter (120/min)
$globalLimiter = $rateLimiter->limiter('global');
$mockGlobalReq = Illuminate\Http\Request::create('/', 'GET', [], [], [], ['REMOTE_ADDR' => $testIp]);
$globalLimit = $globalLimiter($mockGlobalReq);
assertCondition('Global Baseline Rate Limiter (120/min)', $globalLimit->maxAttempts === 120, "Configured at {$globalLimit->maxAttempts} req/min");

// Test login rate limiter (5/min)
$loginLimiter = $rateLimiter->limiter('login');
$loginLimit = $loginLimiter($mockGlobalReq);
assertCondition('Login Rate Limiter (5/min)', $loginLimit->maxAttempts === 5, "Configured at {$loginLimit->maxAttempts} attempts/min");

// 3. TEST DATABASE INDEXES EXIST IN MYSQL
echo "\n3. TESTING DATABASE INDEXES...\n";

$indexesBookings = collect(Illuminate\Support\Facades\DB::select("SHOW INDEX FROM bookings"))->pluck('Key_name')->unique()->values()->all();
$indexesVehicles = collect(Illuminate\Support\Facades\DB::select("SHOW INDEX FROM vehicles"))->pluck('Key_name')->unique()->values()->all();
$indexesUsers = collect(Illuminate\Support\Facades\DB::select("SHOW INDEX FROM users"))->pluck('Key_name')->unique()->values()->all();

assertCondition('Bookings renter_id index', in_array('bookings_renter_id_index', $indexesBookings), 'Index exists');
assertCondition('Bookings renter_email index', in_array('bookings_renter_email_index', $indexesBookings), 'Index exists');
assertCondition('Bookings vehicle_date_range composite index', in_array('bookings_vehicle_date_range_index', $indexesBookings), 'Composite index exists');
assertCondition('Vehicles status_avg_rating composite index', in_array('vehicles_status_avg_rating_index', $indexesVehicles), 'Composite index exists');
assertCondition('Vehicles status_price composite index', in_array('vehicles_status_price_index', $indexesVehicles), 'Composite index exists');
assertCondition('Users role index', in_array('users_role_index', $indexesUsers), 'Index exists');

echo "\n======================================================================\n";
echo "FINAL RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "======================================================================\n";

exit($failed > 0 ? 1 : 0);
