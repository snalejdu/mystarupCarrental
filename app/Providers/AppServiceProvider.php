<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->configureModels();
        $this->configurePasswordDefaults();
        $this->configureUrlGeneration();
    }

    /**
     * Configure granular rate limiters for authentication, booking,
     * upload, and general request throttling.
     */
    protected function configureRateLimiting(): void
    {
        // Login: 5 attempts per minute per IP — brute-force prevention
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Registration: 3 attempts per minute per IP — spam account prevention
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // Booking submissions: 5 per minute, scoped to authenticated user + IP
        RateLimiter::for('booking', function (Request $request) {
            $key = $request->user()?->id ?: $request->ip();
            return Limit::perMinute(5)->by($key);
        });

        // Contact form: 3 per minute per IP — abuse prevention
        RateLimiter::for('contact', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // File uploads (photos, license): 10 per minute per authenticated user
        RateLimiter::for('upload', function (Request $request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        // Rating submissions: 5 per minute per authenticated user
        RateLimiter::for('rating', function (Request $request) {
            return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
        });

        // Global baseline: 120 requests per minute per IP — DDoS mitigation
        RateLimiter::for('global', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });
    }

    /**
     * Configure Eloquent model strictness for development safety.
     */
    protected function configureModels(): void
    {
        // Prevent N+1 queries from silently degrading performance in dev
        Model::preventLazyLoading(! app()->isProduction());

        // Prevent silently discarding attributes not in $fillable
        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
    }

    /**
     * Set application-wide password strength requirements.
     */
    protected function configurePasswordDefaults(): void
    {
        Password::defaults(function () {
            $rule = Password::min(8);

            return app()->isProduction()
                ? $rule->letters()->mixedCase()->numbers()->uncompromised()
                : $rule;
        });
    }

    /**
     * Force HTTPS URL generation in production environments.
     */
    protected function configureUrlGeneration(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
