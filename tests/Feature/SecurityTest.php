<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Cache\RateLimiter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_http_security_headers_are_present(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('X-XSS-Protection', '0');

        $permissionsPolicy = $response->headers->get('Permissions-Policy');
        $this->assertStringContainsString('camera=()', $permissionsPolicy);
        $this->assertStringContainsString('microphone=()', $permissionsPolicy);
    }

    public function test_sensitive_renter_contact_is_encrypted_in_database(): void
    {
        $owner = User::factory()->owner()->create();
        $vehicle = Vehicle::factory()->create(['owner_id' => $owner->id]);
        $renter = User::factory()->renter()->create();

        $plainPhone = '09171234567';

        $booking = Booking::create([
            'vehicle_id' => $vehicle->id,
            'renter_id' => $renter->id,
            'renter_name' => 'Secret Phone User',
            'renter_contact' => $plainPhone,
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(4)->format('Y-m-d'),
            'total_days' => 2,
            'total_price' => 4000,
            'status' => 'pending',
        ]);

        // Model decrypts transparently on property access
        $this->assertEquals($plainPhone, $booking->renter_contact);

        // Raw original stored value is encrypted and NOT plain text
        $rawStored = $booking->getRawOriginal('renter_contact');
        $this->assertNotEquals($plainPhone, $rawStored);
        $this->assertGreaterThan(strlen($plainPhone), strlen($rawStored));
    }

    public function test_model_mass_assignment_protection(): void
    {
        $this->expectException(\Illuminate\Database\Eloquent\MassAssignmentException::class);

        // Vehicle strictly rejects guarded attributes like owner_id, avg_rating, and total_reviews
        Vehicle::create([
            'owner_id' => 999999, // Attempting to hijack owner_id via mass assignment
            'title' => 'Mass Assignment Test Car',
            'type' => 'car',
            'brand' => 'Toyota',
            'model' => 'Corolla',
            'transmission' => 'automatic',
            'seats' => 5,
            'has_aircon' => true,
            'price_per_day' => 1500,
            'location' => 'Tagbilaran',
            'avg_rating' => 5.0, // Attempting to fake rating
            'total_reviews' => 100, // Attempting to fake review count
        ]);
    }

    public function test_rate_limiter_definitions_configured(): void
    {
        $rateLimiter = app(RateLimiter::class);
        $mockRequest = Request::create('/', 'GET', [], [], [], ['REMOTE_ADDR' => '127.0.0.1']);

        // Global limiter (120 req/min)
        $globalLimiter = $rateLimiter->limiter('global');
        $this->assertNotNull($globalLimiter);
        $limit = $globalLimiter($mockRequest);
        $this->assertEquals(120, $limit->maxAttempts);

        // Login limiter (5 req/min)
        $loginLimiter = $rateLimiter->limiter('login');
        $this->assertNotNull($loginLimiter);
        $loginLimit = $loginLimiter($mockRequest);
        $this->assertEquals(5, $loginLimit->maxAttempts);

        // Contact limiter (3 req/min)
        $contactLimiter = $rateLimiter->limiter('contact');
        $this->assertNotNull($contactLimiter);
        $contactLimit = $contactLimiter($mockRequest);
        $this->assertEquals(3, $contactLimit->maxAttempts);
    }
}
