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
