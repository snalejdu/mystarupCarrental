<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login request.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            // Log failed auth attempt
            Log::channel('security')->warning('Failed login attempt', [
                'email' => $credentials['email'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        Log::channel('security')->info('Successful login', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        if ($request->filled('intended')) {
            return redirect($request->input('intended'));
        }

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isRenter()) {
            // Auto-link past guest bookings matching this email
            \App\Models\Booking::where('renter_email', $user->email)
                ->whereNull('renter_id')
                ->update(['renter_id' => $user->id]);

            return redirect()->route('renter.bookings');
        }

        return redirect()->route('owner.dashboard');
    }

    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirectToGoogle()
    {
        return \Laravel\Socialite\Facades\Socialite::driver('google')
            ->redirect();
    }

    /**
     * Handle the callback from Google after authentication.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = \Laravel\Socialite\Facades\Socialite::driver('google')->user();
        } catch (\Exception $e) {
            Log::channel('security')->warning('Google OAuth callback failed', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return redirect()->route('login')->withErrors([
                'email' => 'Google sign-in failed. Please try again.',
            ]);
        }

        // Try to find an existing user by google_id first, then by email
        $user = \App\Models\User::where('google_id', $googleUser->getId())->first()
             ?? \App\Models\User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Link Google account if not already linked
            $user->update([
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar() ?? $user->avatar,
            ]);
        } else {
            // Create a new user (defaults to renter role)
            $user = \App\Models\User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'renter',
                'password' => null,
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        Log::channel('security')->info('Successful Google OAuth login', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isRenter()) {
            // Auto-link past guest bookings matching this email
            \App\Models\Booking::where('renter_email', $user->email)
                ->whereNull('renter_id')
                ->update(['renter_id' => $user->id]);

            return redirect()->route('renter.bookings')->with('success', 'Successfully signed in with Google!');
        }

        return redirect()->route('owner.dashboard')->with('success', 'Successfully signed in with Google!');
    }

    /**
     * Switch user role mode (Renter <-> Owner).
     */
    public function switchRole(Request $request)
    {
        $user = Auth::user();
        if ($user->isAdmin()) {
            return back()->withErrors(['role' => 'Admin accounts cannot switch roles.']);
        }

        $newRole = $user->role === 'owner' ? 'renter' : 'owner';
        $user->role = $newRole;
        $user->save();

        $message = $newRole === 'owner' ? 'Switched to Host Mode!' : 'Switched to Renter Mode!';

        if ($newRole === 'owner') {
            return redirect()->route('owner.vehicles.index')->with('success', $message);
        }

        return redirect()->route('renter.bookings')->with('success', $message);
    }

    /**
     * Handle logout.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
