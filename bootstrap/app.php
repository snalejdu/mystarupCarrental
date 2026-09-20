<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(prepend: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'owner' => \App\Http\Middleware\EnsureOwner::class,
            'admin' => \App\Http\Middleware\EnsureAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (\Illuminate\Database\QueryException $e) {
            \Illuminate\Support\Facades\Log::channel('security')->error('Database query anomaly intercepted', [
                'code' => $e->getCode(),
                'message' => app()->isProduction() ? 'SQL execution exception' : $e->getMessage(),
                'ip' => request()?->ip(),
                'url' => request()?->fullUrl(),
            ]);
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if (in_array($response->getStatusCode(), [401, 403, 419]) && !$request->is('api/*')) {
                return redirect('/')->with('error', 'Session changed. Redirected to home page.');
            }
            return $response;
        });
    })->create();

// If running in serverless environment (e.g. Vercel), redirect storage to writable /tmp
if (isset($_ENV['VERCEL']) || getenv('VERCEL') || env('VERCEL')) {
    $app->useStoragePath('/tmp/storage');
}

return $app;
