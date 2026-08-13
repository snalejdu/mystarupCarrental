<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicVehicleController extends Controller
{
    /**
     * Landing home page — matching exact reference design layout.
     */
    public function home()
    {
        $featuredVehicles = Vehicle::active()
            ->with(['photos' => fn ($q) => $q->orderBy('order')->limit(1)])
            ->orderBy('avg_rating', 'desc')
            ->limit(6)
            ->get();

        $stats = [
            'total_vehicles' => Vehicle::active()->count() ?: 50,
            'total_owners' => \App\Models\User::where('role', 'owner')->count() ?: 20,
            'locations_count' => count(config('rentbohol.locations')),
            'avg_rating' => 4.9,
        ];

        return Inertia::render('Welcome', [
            'featuredVehicles' => $featuredVehicles,
            'stats' => $stats,
            'locations' => config('rentbohol.locations'),
            'vehicleTypes' => config('rentbohol.vehicle_types'),
        ]);
    }
    /**
     * Browse available vehicles — public, no auth required.
     */
    public function index(Request $request)
    {
        $query = Vehicle::active()
            ->with(['photos' => fn ($q) => $q->orderBy('order')->limit(1)])
            ->withCount('bookings');

        // Filter by location
        if ($request->filled('location')) {
            $query->inLocation($request->input('location'));
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->ofType($request->input('type'));
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price_per_day', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->input('max_price'));
        }

        // Search by title, brand, or model
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price_per_day', 'asc'),
            'price_desc' => $query->orderBy('price_per_day', 'desc'),
            'rating' => $query->orderBy('avg_rating', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $vehicles = $query->paginate(12)->withQueryString();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'filters' => $request->only(['location', 'type', 'min_price', 'max_price', 'search', 'sort']),
            'locations' => config('rentbohol.locations'),
            'vehicleTypes' => config('rentbohol.vehicle_types'),
        ]);
    }

    /**
     * Show a single vehicle detail page — public, no auth required.
     */
    public function show(Vehicle $vehicle)
    {
        // Only show active vehicles publicly
        if ($vehicle->status !== 'active') {
            abort(404);
        }

        $vehicle->load([
            'photos' => fn ($q) => $q->orderBy('order'),
            'owner:id,name,avatar',
        ]);

        // Get availability for the next 90 days
        $availability = VehicleAvailability::where('vehicle_id', $vehicle->id)
            ->where('date', '>=', now()->toDateString())
            ->where('date', '<=', now()->addDays(90)->toDateString())
            ->get()
            ->map(fn ($a) => [
                'date' => $a->date->format('Y-m-d'),
                'status' => $a->status,
            ]);

        // Get ratings via completed bookings
        $ratings = $vehicle->bookings()
            ->where('status', 'completed')
            ->with('ratings')
            ->get()
            ->pluck('ratings')
            ->flatten()
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        $otherVehicles = Vehicle::active()
            ->where('id', '!=', $vehicle->id)
            ->with(['photos' => fn ($q) => $q->orderBy('order')->limit(1)])
            ->inRandomOrder()
            ->limit(6)
            ->get();

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
            'availability' => $availability,
            'ratings' => $ratings,
            'otherVehicles' => $otherVehicles,
        ]);
    }
}
