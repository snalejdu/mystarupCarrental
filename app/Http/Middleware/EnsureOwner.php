<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOwner
{
    /**
     * Ensure the authenticated user has the 'owner' role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect('/login')->with('error', 'Please log in to access the host portal.');
        }

        if ($request->user()->role !== 'owner') {
            return redirect('/')->with('error', 'Host access required. Redirected to home page.');
        }

        return $next($request);
    }
}
