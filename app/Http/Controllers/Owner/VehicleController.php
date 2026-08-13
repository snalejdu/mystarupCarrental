<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleAvailability;
use App\Models\VehiclePhoto;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Owner dashboard — list their vehicles.
     */
    public function index(Request $request)
    {
        $vehicles = $request->user()
            ->vehicles()
            ->with(['photos' => fn ($q) => $q->orderBy('order')->limit(1)])
            ->withCount(['bookings', 'bookings as pending_bookings_count' => fn ($q) => $q->where('status', 'pending')])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Owner/Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Show create vehicle form.
     */
    public function create()
    {
        return Inertia::render('Owner/Vehicles/Create', [
            'locations' => config('rentbohol.locations'),
            'vehicleTypes' => config('rentbohol.vehicle_types'),
        ]);
    }

    /**
     * Store a new vehicle listing.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'type' => 'required|in:' . implode(',', config('rentbohol.vehicle_types')),
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'price_per_day' => 'required|numeric|min:100|max:100000',
            'location' => 'required|in:' . implode(',', config('rentbohol.locations')),
        ]);

        // Generate unique slug
        $baseSlug = Str::slug($validated['brand'] . ' ' . $validated['model'] . ' ' . $validated['location']);
        $slug = $baseSlug;
        $counter = 1;
        while (Vehicle::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $vehicle = $request->user()->vehicles()->create([
            ...$validated,
            'slug' => $slug,
            'status' => 'active',
        ]);

        return redirect()->route('owner.vehicles.edit', $vehicle)
            ->with('success', 'Vehicle listed! Now add some photos.');
    }

    /**
     * Show edit vehicle form.
     */
    public function edit(Vehicle $vehicle)
    {
        Gate::authorize('update', $vehicle);

        $vehicle->load(['photos' => fn ($q) => $q->orderBy('order')]);

        // Get availability for next 90 days
        $availability = VehicleAvailability::where('vehicle_id', $vehicle->id)
            ->where('date', '>=', now()->toDateString())
            ->where('date', '<=', now()->addDays(90)->toDateString())
            ->get()
            ->map(fn ($a) => [
                'date' => $a->date->format('Y-m-d'),
                'status' => $a->status,
            ]);

        return Inertia::render('Owner/Vehicles/Edit', [
            'vehicle' => $vehicle,
            'availability' => $availability,
            'locations' => config('rentbohol.locations'),
            'vehicleTypes' => config('rentbohol.vehicle_types'),
        ]);
    }

    /**
     * Update a vehicle listing.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        Gate::authorize('update', $vehicle);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'type' => 'required|in:' . implode(',', config('rentbohol.vehicle_types')),
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'price_per_day' => 'required|numeric|min:100|max:100000',
            'location' => 'required|in:' . implode(',', config('rentbohol.locations')),
            'status' => 'sometimes|in:active,inactive',
        ]);

        $vehicle->update($validated);

        return back()->with('success', 'Vehicle updated successfully.');
    }

    /**
     * Archive (soft delete) a vehicle.
     */
    public function destroy(Vehicle $vehicle)
    {
        Gate::authorize('delete', $vehicle);

        $vehicle->update(['status' => 'archived']);

        return redirect()->route('owner.vehicles.index')
            ->with('success', 'Vehicle archived.');
    }

    /**
     * Upload photos for a vehicle.
     */
    public function uploadPhotos(Request $request, Vehicle $vehicle)
    {
        Gate::authorize('managePhotos', $vehicle);

        $request->validate([
            'photos' => 'required|array|max:' . config('rentbohol.photos.max_per_vehicle'),
            'photos.*' => [
                'required',
                'file',
                'max:' . config('rentbohol.photos.max_size_kb'),
                function ($attribute, $value, $fail) {
                    // Server-side MIME type validation (not just extension)
                    $allowedMimes = config('rentbohol.photos.allowed_mimes');
                    $realMime = $value->getMimeType();
                    if (!in_array($realMime, $allowedMimes)) {
                        $fail("The file must be a JPEG, PNG, or WebP image. Detected: {$realMime}");
                    }
                },
            ],
        ]);

        $imageService = app(ImageService::class);
        $currentMax = $vehicle->photos()->max('order') ?? 0;

        foreach ($request->file('photos') as $index => $photo) {
            $processedPath = $imageService->processAndStore($photo, 'vehicles/' . $vehicle->id);

            $vehicle->photos()->create([
                'path' => $processedPath,
                'order' => $currentMax + $index + 1,
                'alt_text' => $vehicle->brand . ' ' . $vehicle->model . ' in ' . $vehicle->location,
            ]);
        }

        return back()->with('success', 'Photos uploaded successfully.');
    }

    /**
     * Delete a photo.
     */
    public function deletePhoto(Vehicle $vehicle, VehiclePhoto $photo)
    {
        Gate::authorize('managePhotos', $vehicle);

        if ($photo->vehicle_id !== $vehicle->id) {
            abort(403);
        }

        app(ImageService::class)->delete($photo->path);
        $photo->delete();

        return back()->with('success', 'Photo deleted.');
    }

    /**
     * Update availability calendar.
     */
    public function updateAvailability(Request $request, Vehicle $vehicle)
    {
        Gate::authorize('manageAvailability', $vehicle);

        $validated = $request->validate([
            'dates' => 'required|array',
            'dates.*.date' => 'required|date|after_or_equal:today',
            'dates.*.status' => 'required|in:available,blocked',
        ]);

        foreach ($validated['dates'] as $dateEntry) {
            VehicleAvailability::updateOrCreate(
                [
                    'vehicle_id' => $vehicle->id,
                    'date' => $dateEntry['date'],
                ],
                [
                    'status' => $dateEntry['status'],
                ]
            );
        }

        return back()->with('success', 'Availability updated.');
    }
}
