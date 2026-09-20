<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        $brand = fake()->randomElement(['Toyota', 'Honda', 'Mitsubishi', 'Nissan']);
        $model = fake()->randomElement(['Vios', 'Innova', 'Fortuner', 'Click 125i', 'NMAX']);
        $location = fake()->randomElement(config('rentbohol.locations', ['Tagbilaran', 'Panglao', 'Dauis']));
        $title = "{$brand} {$model} in {$location}";

        return [
            'owner_id' => User::factory()->owner(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'description' => fake()->paragraph(),
            'type' => 'car',
            'brand' => $brand,
            'model' => $model,
            'transmission' => 'automatic',
            'seats' => 5,
            'has_aircon' => true,
            'distance_limit' => 'Unlimited',
            'fuel_type' => 'Unleaded Gas',
            'features' => ['Cold Air Conditioner', 'Bluetooth Audio', 'ABS Brakes'],
            'price_per_day' => 2000.00,
            'security_deposit' => 1000.00,
            'fuel_policy' => 'same_to_same',
            'delivery_available' => true,
            'delivery_fee' => 500.00,
            'discount_three_days' => 10,
            'discount_weekly' => 20,
            'location' => $location,
            'status' => 'active',
            'avg_rating' => 5.0,
            'total_reviews' => 1,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => 'inactive']);
    }

    public function maintenance(): static
    {
        return $this->state(fn () => ['status' => 'maintenance']);
    }
}
