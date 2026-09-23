<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
        http_response_code(500);
        header('Content-Type: text/html');
        echo "<h1>PHP Fatal Error on Vercel</h1>";
        echo "<pre>" . print_r($error, true) . "</pre>";
    }
});

require_once __DIR__ . '/../vendor/autoload.php';

// Diagnostic check
if (isset($_GET['diag'])) {
    header('Content-Type: text/plain');
    echo "=== PHP & LARAVEL DIAGNOSTICS ===\n";
    echo "PHP Version: " . PHP_VERSION . "\n";
    echo "getenv BCRYPT_ROUNDS: " . var_export(getenv('BCRYPT_ROUNDS'), true) . "\n";
    echo "getenv HASH_DRIVER: " . var_export(getenv('HASH_DRIVER'), true) . "\n";
    echo "\$_ENV BCRYPT_ROUNDS: " . var_export($_ENV['BCRYPT_ROUNDS'] ?? null, true) . "\n";
    echo "\$_SERVER BCRYPT_ROUNDS: " . var_export($_SERVER['BCRYPT_ROUNDS'] ?? null, true) . "\n";
    echo "CRYPT_BLOWFISH: " . (defined('CRYPT_BLOWFISH') ? CRYPT_BLOWFISH : 'not defined') . "\n";

    // Direct password_hash tests
    foreach ([4, 10, 12, '10', '12', '', null] as $cost) {
        try {
            $opts = $cost !== null ? ['cost' => $cost] : [];
            $h = password_hash('test1234', PASSWORD_BCRYPT, $opts);
            echo "Direct password_hash cost=" . var_export($cost, true) . ": SUCCESS (" . substr($h, 0, 10) . "...)\n";
        } catch (\Throwable $e) {
            echo "Direct password_hash cost=" . var_export($cost, true) . " ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
        }
    }

    // Now test with Laravel booted
    try {
        $app = require __DIR__ . '/../bootstrap/app.php';
        $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
        $kernel->bootstrap();
        echo "Laravel Booted: YES\n";
        echo "config(hashing.driver): " . var_export(config('hashing.driver'), true) . "\n";
        echo "config(hashing.bcrypt): " . var_export(config('hashing.bcrypt'), true) . "\n";

        try {
            $h = \Illuminate\Support\Facades\Hash::make('password123');
            echo "Hash::make: SUCCESS (" . substr($h, 0, 10) . "...)\n";
        } catch (\Throwable $e) {
            echo "Hash::make ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
            echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
            echo "Trace:\n" . $e->getTraceAsString() . "\n";
        }
    } catch (\Throwable $e) {
        echo "Laravel Boot ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
    }
    exit;
}

// Forward all incoming Vercel serverless requests to Laravel's public entrypoint
putenv('VERCEL=1');
$_ENV['VERCEL'] = '1';
$_SERVER['VERCEL'] = '1';

putenv('APP_MAINTENANCE_DRIVER=file');
$_ENV['APP_MAINTENANCE_DRIVER'] = 'file';
$_SERVER['APP_MAINTENANCE_DRIVER'] = 'file';

putenv('SESSION_DRIVER=cookie');
$_ENV['SESSION_DRIVER'] = 'cookie';
$_SERVER['SESSION_DRIVER'] = 'cookie';

putenv('CACHE_STORE=array');
$_ENV['CACHE_STORE'] = 'array';
$_SERVER['CACHE_STORE'] = 'array';

putenv('CACHE_DRIVER=array');
$_ENV['CACHE_DRIVER'] = 'array';
$_SERVER['CACHE_DRIVER'] = 'array';

putenv('QUEUE_CONNECTION=sync');
$_ENV['QUEUE_CONNECTION'] = 'sync';
$_SERVER['QUEUE_CONNECTION'] = 'sync';

putenv('HASH_DRIVER=bcrypt');
$_ENV['HASH_DRIVER'] = 'bcrypt';
$_SERVER['HASH_DRIVER'] = 'bcrypt';

putenv('BCRYPT_ROUNDS=10');
$_ENV['BCRYPT_ROUNDS'] = '10';
$_SERVER['BCRYPT_ROUNDS'] = '10';

// Create writable storage structure in /tmp for Vercel
$storageDirs = [
    '/tmp/storage',
    '/tmp/storage/framework',
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/storage/app',
    '/tmp/storage/app/public',
];
foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

$viewCompiledPath = '/tmp/storage/framework/views';
putenv("VIEW_COMPILED_PATH={$viewCompiledPath}");
$_ENV['VIEW_COMPILED_PATH'] = $viewCompiledPath;
$_SERVER['VIEW_COMPILED_PATH'] = $viewCompiledPath;

// Copy and sanitize package manifest to writable /tmp
$tmpPackages = '/tmp/packages.php';
$srcPackages = __DIR__ . '/../bootstrap/cache/packages.php';
if (file_exists($srcPackages)) {
    $raw = require $srcPackages;
    $filtered = [];
    foreach ($raw as $pkg => $cfg) {
        $filteredCfg = $cfg;
        if (!empty($cfg['providers'])) {
            $filteredCfg['providers'] = array_values(array_filter(
                $cfg['providers'],
                fn($p) => class_exists($p)
            ));
            if (empty($filteredCfg['providers'])) {
                continue;
            }
        }
        $filtered[$pkg] = $filteredCfg;
    }
    @file_put_contents($tmpPackages, '<?php return ' . var_export($filtered, true) . ';');
    putenv("APP_PACKAGES_CACHE={$tmpPackages}");
    $_ENV['APP_PACKAGES_CACHE'] = $tmpPackages;
    $_SERVER['APP_PACKAGES_CACHE'] = $tmpPackages;
}

$tmpServices = '/tmp/services.php';
$srcServices = __DIR__ . '/../bootstrap/cache/services.php';
if (file_exists($srcServices)) {
    @copy($srcServices, $tmpServices);
    putenv("APP_SERVICES_CACHE={$tmpServices}");
    $_ENV['APP_SERVICES_CACHE'] = $tmpServices;
    $_SERVER['APP_SERVICES_CACHE'] = $tmpServices;
}

// Ensure SQLite database exists in /tmp and is fully populated
$tmpDb = '/tmp/database.sqlite';
$seedDb = dirname(__DIR__) . '/database/seed.db';
if (!file_exists($tmpDb) || (file_exists($seedDb) && filesize($tmpDb) < filesize($seedDb))) {
    if (file_exists($seedDb)) {
        @copy($seedDb, $tmpDb);
        @chmod($tmpDb, 0666);
    } else {
        @touch($tmpDb);
    }
}

putenv("DB_DATABASE={$tmpDb}");
$_ENV['DB_DATABASE'] = $tmpDb;
$_SERVER['DB_DATABASE'] = $tmpDb;

putenv('LOG_CHANNEL=stderr');
$_ENV['LOG_CHANNEL'] = 'stderr';
$_SERVER['LOG_CHANNEL'] = 'stderr';

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/html');
    echo "<h1>Unhandled Exception in public/index.php</h1>";
    echo "<p><strong>" . get_class($e) . "</strong>: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
