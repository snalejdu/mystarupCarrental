<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Production-grade HTTP security headers.
     *
     * Applied to every web response to mitigate:
     * - MIME-type sniffing attacks
     * - Clickjacking via iframe embedding
     * - Referrer information leakage
     * - Unauthorized browser feature access
     * - Downgrade attacks (HSTS in production)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent browsers from MIME-sniffing a response away from the declared Content-Type
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Prevent the page from being rendered inside an iframe (clickjacking protection)
        $response->headers->set('X-Frame-Options', 'DENY');

        // Control how much referrer information is sent with navigation requests
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Disable browser features the app doesn't need (camera, mic, geolocation, payment)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        // Modern best practice: disable legacy XSS auditor, let CSP handle XSS prevention
        $response->headers->set('X-XSS-Protection', '0');

        // Enforce HTTPS via HSTS in production (1 year max-age, include subdomains)
        if (app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
}
