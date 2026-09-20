<?php

namespace Tests\Unit;

use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Tests\TestCase;

class VehiclePricingTest extends TestCase
{
    public function test_standard_single_day_price_calculation(): void
    {
        $vehicle = new Vehicle([
            'price_per_day' => 2000,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'delivery_available' => true,
            'delivery_fee' => 500,
            'security_deposit' => 1500,
        ]);

        $quote = $vehicle->calculatePriceQuote(1, false);

        $this->assertEquals(1, $quote['days']);
        $this->assertEquals(2000.0, $quote['price_per_day']);
        $this->assertEquals(2000.0, $quote['base_total']);
        $this->assertEquals(0, $quote['discount_percent']);
        $this->assertEquals(0.0, $quote['discount_amount']);
        $this->assertEquals(0.0, $quote['delivery_amount']);
        $this->assertEquals(2000.0, $quote['final_total']);
        $this->assertEquals(1500.0, $quote['security_deposit']);
    }

    public function test_three_day_multi_day_discount_calculation(): void
    {
        $vehicle = new Vehicle([
            'price_per_day' => 2000,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'delivery_available' => true,
            'delivery_fee' => 500,
        ]);

        $quote = $vehicle->calculatePriceQuote(3, false);

        // 3 days * 2000 = 6000 base, 10% discount = 600, final = 5400
        $this->assertEquals(3, $quote['days']);
        $this->assertEquals(6000.0, $quote['base_total']);
        $this->assertEquals(10, $quote['discount_percent']);
        $this->assertEquals(600.0, $quote['discount_amount']);
        $this->assertEquals(5400.0, $quote['final_total']);
    }

    public function test_seven_day_weekly_discount_calculation(): void
    {
        $vehicle = new Vehicle([
            'price_per_day' => 2000,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'delivery_available' => true,
            'delivery_fee' => 500,
        ]);

        $quote = $vehicle->calculatePriceQuote(7, false);

        // 7 days * 2000 = 14000 base, 20% discount = 2800, final = 11200
        $this->assertEquals(7, $quote['days']);
        $this->assertEquals(14000.0, $quote['base_total']);
        $this->assertEquals(20, $quote['discount_percent']);
        $this->assertEquals(2800.0, $quote['discount_amount']);
        $this->assertEquals(11200.0, $quote['final_total']);
    }

    public function test_price_calculation_with_delivery_fee(): void
    {
        $vehicle = new Vehicle([
            'price_per_day' => 2000,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'delivery_available' => true,
            'delivery_fee' => 500,
        ]);

        $quote = $vehicle->calculatePriceQuote(2, true);

        // 2 days * 2000 = 4000 base, 0% discount, + 500 delivery = 4500
        $this->assertEquals(4000.0, $quote['base_total']);
        $this->assertEquals(500.0, $quote['delivery_amount']);
        $this->assertEquals(4500.0, $quote['final_total']);
    }

    public function test_delivery_fee_ignored_if_delivery_not_available(): void
    {
        $vehicle = new Vehicle([
            'price_per_day' => 2000,
            'delivery_available' => false,
            'delivery_fee' => 500,
        ]);

        $quote = $vehicle->calculatePriceQuote(2, true);

        $this->assertEquals(0.0, $quote['delivery_amount']);
        $this->assertEquals(4000.0, $quote['final_total']);
    }

    public function test_masked_renter_name_attribute(): void
    {
        $booking = new Booking(['renter_name' => 'Juan Dela Cruz']);
        $this->assertEquals('J**n D**a C**z', $booking->masked_renter_name);

        $booking2 = new Booking(['renter_name' => 'Al Smith']);
        $this->assertEquals('A* S***h', $booking2->masked_renter_name);
    }

    public function test_user_role_helper_methods(): void
    {
        $renter = new User(['role' => 'renter']);
        $owner = new User(['role' => 'owner']);
        $admin = new User(['role' => 'admin']);

        $this->assertTrue($renter->isRenter());
        $this->assertFalse($renter->isOwner());
        $this->assertFalse($renter->isAdmin());

        $this->assertTrue($owner->isOwner());
        $this->assertFalse($owner->isRenter());
        $this->assertFalse($owner->isAdmin());

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isRenter());
        $this->assertFalse($admin->isOwner());
    }
}
