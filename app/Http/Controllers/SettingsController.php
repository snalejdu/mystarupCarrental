<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display user settings and host qualification status.
     */
    public function index(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        return Inertia::render('Settings/Index', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'date_of_birth' => $user->date_of_birth ? $user->date_of_birth->format('Y-m-d') : null,
                'emergency_contact_name' => $user->emergency_contact_name,
                'emergency_contact_phone' => $user->emergency_contact_phone,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'driver_license_number' => $user->driver_license_number,
                'driver_license_expiry' => $user->driver_license_expiry ? $user->driver_license_expiry->format('Y-m-d') : null,
                'driver_license_path' => $user->driver_license_path ? route('renter.license.photo') : null,
                'driver_license_status' => $user->driver_license_status ?? 'unverified',
                'is_host_qualified' => $user->isHostQualified(),
                'is_owner' => $user->isOwner(),
                'is_admin' => $user->isAdmin(),
            ],
        ]);
    }

    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|before:today',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Qualify and upgrade to Host account with Driver's License.
     */
    public function becomeHost(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $validated = $request->validate([
            'driver_license_number' => 'required|string|max:50',
            'driver_license_expiry' => 'nullable|date',
            'license_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('license_photo')) {
            // Delete old file if exists
            if ($user->driver_license_path) {
                if (Storage::disk('private')->exists($user->driver_license_path)) {
                    Storage::disk('private')->delete($user->driver_license_path);
                } elseif (Storage::disk('public')->exists($user->driver_license_path)) {
                    Storage::disk('public')->delete($user->driver_license_path);
                }
            }

            $path = $request->file('license_photo')->store('licenses', 'private');
            $user->driver_license_path = $path;
        }

        $user->driver_license_number = $validated['driver_license_number'];
        if (!empty($validated['driver_license_expiry'])) {
            $user->driver_license_expiry = $validated['driver_license_expiry'];
        }
        $user->driver_license_status = 'verified';
        $user->role = 'owner';
        $user->save();

        return redirect()->route('owner.vehicles.index')
            ->with('success', '🎉 Welcome to Waypt Host! Your driver\'s license qualification is verified. You can now list your vehicle.');
    }

    /**
     * Switch role mode between Host and Renter.
     */
    public function toggleHostRole(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return back()->withErrors(['host' => 'Admin accounts cannot switch roles.']);
        }

        if ($user->role === 'owner') {
            $user->role = 'renter';
            $user->save();
            return redirect()->route('renter.bookings')->with('success', 'Switched to Renter Mode!');
        }

        // Switching to Host mode requires Driver's License qualification
        if (!$user->isHostQualified()) {
            return back()->withErrors(['host' => 'A valid driver\'s license is required to activate Host mode.']);
        }

        $user->role = 'owner';
        $user->save();

        return redirect()->route('owner.vehicles.index')->with('success', 'Switched to Host Mode! Manage your vehicles and bookings here.');
    }
}
