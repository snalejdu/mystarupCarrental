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
            ->with(['photos' => fn ($q) => $q->orderBy('order')->limit(1), 'owner:id,name'])
            ->orderBy('avg_rating', 'desc')
            ->limit(6)
            ->get();

        $stats = [
            'total_vehicles' => Vehicle::active()->count(),
            'total_owners' => \App\Models\User::where('role', 'owner')->count(),
            'locations_count' => count(config('rentbohol.locations')),
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

        // Filter by location (strictly whitelist validated)
        if ($request->filled('location')) {
            $location = (string) $request->input('location');
            if (in_array($location, config('rentbohol.locations', []), true)) {
                $query->inLocation($location);
            }
        }

        // Filter by type (strictly whitelist validated)
        if ($request->filled('type')) {
            $type = (string) $request->input('type');
            if (in_array($type, config('rentbohol.vehicle_types', []), true)) {
                $query->ofType($type);
            }
        }

        // Filter by price range (strictly numeric and clamped)
        if ($request->filled('min_price') && is_numeric($request->input('min_price'))) {
            $query->where('price_per_day', '>=', max(0, (float) $request->input('min_price')));
        }
        if ($request->filled('max_price') && is_numeric($request->input('max_price'))) {
            $query->where('price_per_day', '<=', min(1000000, (float) $request->input('max_price')));
        }

        // Search by title, brand, or model (sanitized against SQL wildcard injection)
        if ($request->filled('search')) {
            $rawSearch = trim(strip_tags(substr((string) $request->input('search'), 0, 100)));
            if ($rawSearch !== '') {
                // Escape SQL LIKE wildcard characters (% and _) to prevent wildcard expansion DoS
                $escapedSearch = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $rawSearch);
                $query->where(function ($q) use ($escapedSearch) {
                    $q->where('title', 'like', "%{$escapedSearch}%")
                      ->orWhere('brand', 'like', "%{$escapedSearch}%")
                      ->orWhere('model', 'like', "%{$escapedSearch}%");
                });
            }
        }

        // Filter by transmission
        if ($request->filled('transmission') && in_array($request->input('transmission'), ['Automatic', 'Manual'])) {
            $query->where('transmission', $request->input('transmission'));
        }

        // Real-time Date-Range Availability Filter
        if ($request->filled('pickup_date') && $request->filled('return_date')) {
            try {
                $startDate = \Carbon\Carbon::parse($request->input('pickup_date'))->toDateString();
                $endDate = \Carbon\Carbon::parse($request->input('return_date'))->toDateString();

                if ($startDate <= $endDate) {
                    // Exclude vehicles with blocked or booked calendar dates
                    $query->whereDoesntHave('availability', function ($q) use ($startDate, $endDate) {
                        $q->whereBetween('date', [$startDate, $endDate])
                          ->whereIn('status', ['booked', 'blocked']);
                    });

                    // Exclude vehicles with conflicting active bookings
                    $query->whereDoesntHave('bookings', function ($q) use ($startDate, $endDate) {
                        $q->whereIn('status', ['pending', 'accepted'])
                          ->where('start_date', '<=', $endDate)
                          ->where('end_date', '>=', $startDate);
                    });
                }
            } catch (\Exception $e) {
                // Ignore invalid date formats gracefully
            }
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
            'filters' => $request->only(['location', 'type', 'transmission', 'min_price', 'max_price', 'search', 'sort', 'pickup_date', 'return_date']),
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

        // Get ratings via completed bookings — scoped to renter reviews only with safe field mapping
        $ratings = $vehicle->bookings()
            ->where('status', 'completed')
            ->with(['ratings' => fn ($q) => $q->where('rater_type', 'renter')])
            ->get()
            ->pluck('ratings')
            ->flatten()
            ->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rater_identifier' => $r->rater_identifier,
                'stars' => $r->stars,
                'comment' => $r->comment,
                'created_at' => $r->created_at->toISOString(),
            ]);

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
