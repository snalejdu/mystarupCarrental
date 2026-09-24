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
            'role' => 'required|in:renter,owner',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => $validated['password'],
            'role' => $validated['role'],
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
                    ->with('success', 'Welcome to RentalHub! Complete your reservation below.');
            }
        }

        if ($user->isRenter()) {
            return redirect()->route('renter.bookings')
                ->with('success', 'Welcome to RentalHub! You can track all your vehicle rentals here.');
        }

        return redirect()->route('owner.dashboard')
            ->with('success', 'Welcome to RentalHub! Start by listing your first vehicle.');
    }
}
