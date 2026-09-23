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
        $user = $request->user() ?: auth()->user();
        if (!$user) {
            abort(401);
        }

        $vehicles = $user
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
            'transmission' => 'required|in:automatic,manual',
            'seats' => 'required|integer|min:1|max:60',
            'has_aircon' => 'required|boolean',
            'distance_limit' => 'nullable|string|max:100',
            'price_per_day' => 'required|numeric|min:100|max:100000',
            'security_deposit' => 'nullable|numeric|min:0|max:50000',
            'fuel_policy' => 'nullable|string|in:same_to_same,full_to_full',
            'delivery_available' => 'nullable|boolean',
            'delivery_fee' => 'nullable|numeric|min:0|max:5000',
            'discount_three_days' => 'nullable|integer|min:0|max:50',
            'discount_weekly' => 'nullable|integer|min:0|max:50',
            'helmets_included' => 'nullable|boolean',
            'driver_available' => 'nullable|boolean',
            'fuel_type' => 'nullable|string|max:50',
            'features' => 'nullable|array',
            'features.*' => 'string|max:100',
            'location' => 'required|in:' . implode(',', config('rentbohol.locations')),
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'plate_number' => 'nullable|string|max:20',
            'color' => 'nullable|string|max:50',
            'vin' => 'nullable|string|max:50',
            'insurance_type' => 'nullable|string|max:64',
            'insurance_expiry' => 'nullable|date',
            'minimum_rental_days' => 'nullable|integer|min:1|max:30',
            'late_fee_per_hour' => 'nullable|numeric|min:0|max:10000',
            'registration_expiry' => 'nullable|date',
        ]);

        // Generate unique slug
        $baseSlug = Str::slug($validated['brand'] . ' ' . $validated['model'] . ' ' . $validated['location']);
        $slug = $baseSlug;
        $counter = 1;
        while (Vehicle::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $user = $request->user() ?: auth()->user();
        if (!$user) {
            abort(401);
        }

        $vehicle = $user->vehicles()->create([
            ...$validated,
            'fuel_type' => $validated['fuel_type'] ?? 'Unleaded Gas',
            'features' => $validated['features'] ?? [],
            'security_deposit' => $validated['security_deposit'] ?? 0,
            'fuel_policy' => $validated['fuel_policy'] ?? 'same_to_same',
            'delivery_available' => $validated['delivery_available'] ?? false,
            'delivery_fee' => $validated['delivery_fee'] ?? 0,
            'discount_three_days' => $validated['discount_three_days'] ?? 0,
            'discount_weekly' => $validated['discount_weekly'] ?? 0,
            'helmets_included' => $validated['helmets_included'] ?? false,
            'driver_available' => $validated['driver_available'] ?? false,
            'slug' => $slug,
            'status' => 'active',
        ]);

        if ($request->hasFile('photos')) {
            $request->validate([
                'photos.*' => 'image|mimes:jpeg,jpg,png,webp|max:10240',
            ]);

            $imageService = app(ImageService::class);
            foreach ($request->file('photos') as $index => $file) {
                $processedPath = $imageService->processAndStore($file, 'vehicles/' . $vehicle->id);
                $vehicle->photos()->create([
                    'path' => $processedPath,
                    'order' => $index,
                    'alt_text' => $vehicle->brand . ' ' . $vehicle->model . ' in ' . $vehicle->location,
                ]);
            }
        }

        return redirect()->route('owner.vehicles.edit', $vehicle)
            ->with('success', 'Vehicle listed successfully with optimized photos!');
    }

    /**
     * Show edit vehicle form.
     */
    public function edit(Vehicle $vehicle)
    {
        Gate::authorize('update', $vehicle);

        $vehicle->load(['photos' => fn ($q) => $q->orderBy('order')]);

        // Get availability for past 12 months up to next 180 days so hosts can review past & future
        $availability = VehicleAvailability::where('vehicle_id', $vehicle->id)
            ->where('date', '>=', now()->subMonths(12)->toDateString())
            ->where('date', '<=', now()->addDays(180)->toDateString())
            ->get()
            ->map(fn ($a) => [
                'date' => $a->date->format('Y-m-d'),
                'status' => $a->status,
            ]);

        // Get confirmed, in-progress, and completed bookings for occupancy display (both past and upcoming)
        $bookings = $vehicle->bookings()
            ->whereIn('status', ['accepted', 'completed', 'in_progress'])
            ->select('id', 'token', 'renter_name', 'start_date', 'end_date', 'status', 'total_price')
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'token' => $b->token,
                'renter_name' => $b->renter_name,
                'start_date' => $b->start_date->format('Y-m-d'),
                'end_date' => $b->end_date->format('Y-m-d'),
                'status' => $b->status,
                'total_price' => (float) $b->total_price,
            ]);

        return Inertia::render('Owner/Vehicles/Edit', [
            'vehicle' => $vehicle,
            'availability' => $availability,
            'bookings' => $bookings,
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
            'transmission' => 'required|in:automatic,manual',
            'seats' => 'required|integer|min:1|max:60',
            'has_aircon' => 'required|boolean',
            'distance_limit' => 'nullable|string|max:100',
            'fuel_type' => 'nullable|string|max:50',
            'features' => 'nullable|array',
            'features.*' => 'string|max:100',
            'price_per_day' => 'required|numeric|min:100|max:100000',
            'security_deposit' => 'nullable|numeric|min:0|max:50000',
            'fuel_policy' => 'nullable|string|in:same_to_same,full_to_full',
            'delivery_available' => 'nullable|boolean',
            'delivery_fee' => 'nullable|numeric|min:0|max:5000',
            'discount_three_days' => 'nullable|integer|min:0|max:50',
            'discount_weekly' => 'nullable|integer|min:0|max:50',
            'helmets_included' => 'nullable|boolean',
            'driver_available' => 'nullable|boolean',
            'location' => 'required|in:' . implode(',', config('rentbohol.locations')),
            'status' => 'sometimes|in:active,inactive,maintenance',
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'plate_number' => 'nullable|string|max:20',
            'color' => 'nullable|string|max:50',
            'vin' => 'nullable|string|max:50',
            'insurance_type' => 'nullable|string|max:64',
            'insurance_expiry' => 'nullable|date',
            'minimum_rental_days' => 'nullable|integer|min:1|max:30',
            'late_fee_per_hour' => 'nullable|numeric|min:0|max:10000',
            'registration_expiry' => 'nullable|date',
        ]);

        $validated['features'] = $validated['features'] ?? [];
        $vehicle->update($validated);

        return back()->with('success', 'Vehicle updated successfully.');
    }

    /**
     * Quick status update (e.g. Active <-> Maintenance <-> Inactive).
     */
    public function updateStatus(Request $request, Vehicle $vehicle)
    {
        Gate::authorize('update', $vehicle);

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,maintenance',
        ]);

        $vehicle->update(['status' => $validated['status']]);

        $message = match ($validated['status']) {
            'maintenance' => 'Vehicle marked as Under Maintenance. It is now hidden from renter searches.',
            'active' => 'Vehicle is now Active and visible for renter bookings!',
            'inactive' => 'Vehicle listing paused.',
            default => 'Status updated.',
        };

        return back()->with('success', $message);
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
     * Transform or replace a photo — adjust focal position, apply cropped photo, resize, and/or re-compress.
     */
    public function transformPhoto(Request $request, Vehicle $vehicle, VehiclePhoto $photo)
    {
        Gate::authorize('managePhotos', $vehicle);

        if ($photo->vehicle_id !== $vehicle->id) {
            abort(403);
        }

        // If a cropped image file is uploaded directly
        if ($request->hasFile('cropped_photo') || $request->hasFile('photo')) {
            $file = $request->file('cropped_photo') ?? $request->file('photo');
            $request->validate([
                'cropped_photo' => 'nullable|file|mimes:jpeg,jpg,png,webp|max:10240',
                'photo' => 'nullable|file|mimes:jpeg,jpg,png,webp|max:10240',
            ]);

            $imageService = app(ImageService::class);
            $newPath = $imageService->processAndStore($file, 'vehicles/' . $vehicle->id);

            // Delete old file if it wasn't a demo public file
            if (!str_starts_with($photo->path, '/')) {
                $imageService->delete($photo->path);
            }

            $photo->update([
                'path' => $newPath,
                'position_x' => 50,
                'position_y' => 50,
            ]);

            return back()->with('success', 'Photo framed and optimized successfully.');
        }

        $validated = $request->validate([
            'position_x' => 'nullable|integer|min:0|max:100',
            'position_y' => 'nullable|integer|min:0|max:100',
            'max_width' => 'nullable|integer|min:200|max:2400',
            'quality' => 'nullable|integer|min:10|max:100',
        ]);

        $updates = [];
        if (isset($validated['position_x'])) {
            $updates['position_x'] = (int) $validated['position_x'];
        }
        if (isset($validated['position_y'])) {
            $updates['position_y'] = (int) $validated['position_y'];
        }

        $maxWidth = (int) ($validated['max_width'] ?? 0);
        $quality = (int) ($validated['quality'] ?? config('rentbohol.photos.quality', 80));

        // If resize or re-compression was requested
        if ($maxWidth > 0 || (isset($validated['quality']) && $validated['quality'] != config('rentbohol.photos.quality', 80))) {
            $imageService = app(ImageService::class);
            $newPath = $imageService->transform($photo->path, 0, $maxWidth, $quality, 'vehicles/' . $vehicle->id);

            if ($newPath !== $photo->path) {
                if (!str_starts_with($photo->path, '/')) {
                    $imageService->delete($photo->path);
                }
                $updates['path'] = $newPath;
            }
        }

        if (!empty($updates)) {
            $photo->update($updates);
        }

        return back()->with('success', 'Photo adjusted successfully.');
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
     * Reorder photos / set cover photo.
     */
    public function reorderPhotos(Request $request, Vehicle $vehicle)
    {
        Gate::authorize('managePhotos', $vehicle);

        $validated = $request->validate([
            'photos' => 'required|array',
            'photos.*.id' => 'required|exists:vehicle_photos,id',
            'photos.*.order' => 'required|integer',
        ]);

        foreach ($validated['photos'] as $item) {
            $vehicle->photos()->where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Photo gallery updated.');
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
