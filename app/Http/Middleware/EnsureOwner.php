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
        if (!$request->user() || $request->user()->role !== 'owner') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Owner access required.'], 403);
            }
            abort(403, 'Unauthorized. Owner access required.');
        }

        return $next($request);
    }
}
