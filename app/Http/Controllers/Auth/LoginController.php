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
     * Handle Google Sign-In authentication.
     */
    public function google(Request $request)
    {
        $role = $request->input('role', 'renter');
        $email = $role === 'owner' ? 'maria@boholrentals.ph' : 'renter@gmail.com';
        $name = $role === 'owner' ? 'Maria Santos (Google Host)' : 'Juan Dela Cruz (Google User)';

        $user = \App\Models\User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'phone' => '09171234567',
                'password' => bcrypt('password123'),
                'role' => $role,
            ]
        );

        Auth::login($user, true);
        $request->session()->regenerate();

        Log::channel('security')->info('Successful Google OAuth login', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        if ($request->filled('intended')) {
            return redirect($request->input('intended'))->with('success', 'Successfully signed in with Google!');
        }

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isRenter()) {
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
