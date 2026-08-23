<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Ensure the authenticated user has the 'admin' role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect('/login')->with('error', 'Please log in to access the admin portal.');
        }

        if ($request->user()->role !== 'admin') {
            return redirect('/')->with('error', 'Admin access required. Redirected to home page.');
        }

        return $next($request);
    }
}
