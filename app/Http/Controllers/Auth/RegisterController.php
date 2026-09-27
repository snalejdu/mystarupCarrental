<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Show the registration form.
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'role' => 'nullable|in:renter,owner',
            'password' => ['required', 'confirmed', Password::defaults()],
            'driver_license_number' => 'required_if:role,owner|nullable|string|max:50',
            'driver_license_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $role = $validated['role'] ?? 'renter';
        $licensePath = null;
        $licenseStatus = 'unverified';

        if ($request->hasFile('driver_license_photo')) {
            $licensePath = $request->file('driver_license_photo')->store('licenses', 'private');
        }

        if ($role === 'owner' || !empty($validated['driver_license_number']) || $licensePath) {
            $licenseStatus = 'verified';
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => $validated['password'],
            'role' => $role,
            'driver_license_number' => $request->input('driver_license_number'),
            'driver_license_path' => $licensePath,
            'driver_license_status' => $licenseStatus,
        ]);

        Auth::login($user);

        // Auto-link past guest bookings matching this email
        \App\Models\Booking::where('renter_email', $user->email)
            ->whereNull('renter_id')
            ->update(['renter_id' => $user->id]);

        try {
            Log::channel('security')->info('New user registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'ip' => $request->ip(),
            ]);
        } catch (\Throwable $e) {
            // Silently fallback if filesystem is read-only
        }

        if ($request->filled('intended')) {
            $intended = $request->input('intended');
            // Prevent open redirect: only allow safe local paths
            if (str_starts_with($intended, '/') && !str_starts_with($intended, '//') && !str_contains($intended, '\\')) {
                return redirect($intended)
                    ->with('success', 'Welcome to Waypt! Complete your reservation below.');
            }
        }

        if ($user->isRenter()) {
            return redirect()->route('renter.bookings')
                ->with('success', 'Welcome to Waypt! You can track all your vehicle rentals here.');
        }

        return redirect()->route('owner.dashboard')
            ->with('success', 'Welcome to Waypt! Start by listing your first vehicle.');
    }
}
