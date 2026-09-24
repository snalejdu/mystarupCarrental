<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Immediate diagnostic probe if requested via query parameter
if (isset($_GET['__diagnostic'])) {
    header('Content-Type: text/plain');
    echo "=== Vercel Serverless Diagnostic ===\n";
    echo "PHP Version: " . PHP_VERSION . "\n";
    echo "Vendor Autoload: " . (file_exists(__DIR__ . '/../vendor/autoload.php') ? 'EXISTS' : 'MISSING') . "\n";
    echo "Seed DB: " . (file_exists(dirname(__DIR__) . '/database/seed.db') ? 'EXISTS (' . filesize(dirname(__DIR__) . '/database/seed.db') . ' bytes)' : 'MISSING') . "\n";
    echo "Tmp Writable: " . (is_writable('/tmp') ? 'YES' : 'NO') . "\n";
    echo "Time: " . date('Y-m-d H:i:s') . "\n";
    exit;
}

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

// Forward all incoming Vercel serverless requests to Laravel's public entrypoint
putenv('VERCEL=1');
$_ENV['VERCEL'] = '1';
$_SERVER['VERCEL'] = '1';

putenv('APP_KEY=base64:SGe084z0okoksW0WXyFebDKAZ9umXMfWnYBVU79MTlI=');
$_ENV['APP_KEY'] = 'base64:SGe084z0okoksW0WXyFebDKAZ9umXMfWnYBVU79MTlI=';
$_SERVER['APP_KEY'] = 'base64:SGe084z0okoksW0WXyFebDKAZ9umXMfWnYBVU79MTlI=';

putenv('APP_ENV=production');
$_ENV['APP_ENV'] = 'production';
$_SERVER['APP_ENV'] = 'production';

putenv('APP_DEBUG=true');
$_ENV['APP_DEBUG'] = 'true';
$_SERVER['APP_DEBUG'] = 'true';

putenv('DB_CONNECTION=sqlite');
$_ENV['DB_CONNECTION'] = 'sqlite';
$_SERVER['DB_CONNECTION'] = 'sqlite';

putenv('APP_MAINTENANCE_DRIVER=file');
$_ENV['APP_MAINTENANCE_DRIVER'] = 'file';
$_SERVER['APP_MAINTENANCE_DRIVER'] = 'file';

putenv('SESSION_DRIVER=database');
$_ENV['SESSION_DRIVER'] = 'database';
$_SERVER['SESSION_DRIVER'] = 'database';

putenv('SESSION_COOKIE=rentbohol_session');
$_ENV['SESSION_COOKIE'] = 'rentbohol_session';
$_SERVER['SESSION_COOKIE'] = 'rentbohol_session';

putenv('SESSION_LIFETIME=120');
$_ENV['SESSION_LIFETIME'] = '120';
$_SERVER['SESSION_LIFETIME'] = '120';

putenv('SESSION_EXPIRE_ON_CLOSE=false');
$_ENV['SESSION_EXPIRE_ON_CLOSE'] = 'false';
$_SERVER['SESSION_EXPIRE_ON_CLOSE'] = 'false';

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

$_SERVER['HTTPS'] = 'on';
$_SERVER['SERVER_PORT'] = '443';
$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';

putenv('SESSION_SECURE_COOKIE=true');
$_ENV['SESSION_SECURE_COOKIE'] = 'true';
$_SERVER['SESSION_SECURE_COOKIE'] = 'true';

$appUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'mystarup-carrental.vercel.app');
putenv("APP_URL={$appUrl}");
$_ENV['APP_URL'] = $appUrl;
$_SERVER['APP_URL'] = $appUrl;

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
    $raw = require $srcServices;
    if (is_array($raw)) {
        if (!empty($raw['providers'])) {
            $raw['providers'] = array_values(array_filter($raw['providers'], fn($p) => class_exists($p)));
        }
        if (!empty($raw['eager'])) {
            $raw['eager'] = array_values(array_filter($raw['eager'], fn($p) => class_exists($p)));
        }
        @file_put_contents($tmpServices, '<?php return ' . var_export($raw, true) . ';');
        putenv("APP_SERVICES_CACHE={$tmpServices}");
        $_ENV['APP_SERVICES_CACHE'] = $tmpServices;
        $_SERVER['APP_SERVICES_CACHE'] = $tmpServices;
    }
}

// Ensure SQLite database exists in /tmp and is fully populated
$tmpDb = '/tmp/database.sqlite';
$seedDb = dirname(__DIR__) . '/database/seed.db';
if (!file_exists($tmpDb) || filesize($tmpDb) === 0) {
    if (file_exists($seedDb) && filesize($seedDb) > 0) {
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

// Ensure sessions table exists for the database session driver
if (file_exists($tmpDb) && filesize($tmpDb) > 0) {
    try {
        $pdo = new PDO("sqlite:{$tmpDb}");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS sessions (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            user_id BIGINT UNSIGNED NULL,
            ip_address VARCHAR(45) NULL,
            user_agent TEXT NULL,
            payload LONGTEXT NOT NULL,
            last_activity INT NOT NULL
        )");
        $pdo = null;
    } catch (Exception $e) {
        // Silently continue - session will fall back gracefully
    }
}

// Clear bloated cookies from old cookie-based sessions.
// If total Cookie header is large, expire all non-essential cookies to prevent 494 on next request.
$rawCookieHeader = $_SERVER['HTTP_COOKIE'] ?? '';
if (strlen($rawCookieHeader) > 4000) {
    $cookieParts = explode(';', $rawCookieHeader);
    foreach ($cookieParts as $part) {
        $part = trim($part);
        if (empty($part)) continue;
        $eqPos = strpos($part, '=');
        $cookieName = $eqPos !== false ? substr($part, 0, $eqPos) : $part;
        $cookieName = trim($cookieName);
        // Keep only the new session cookie and XSRF token
        if ($cookieName === 'rentbohol_session' || $cookieName === 'XSRF-TOKEN') {
            continue;
        }
        // Expire old cookie
        header("Set-Cookie: {$cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/; secure; samesite=lax", false);
    }
    // Also clear any old-format session cookies
    foreach (['laravel_session', 'bohol_car_rental_session', 'rent_bohol_session'] as $oldName) {
        header("Set-Cookie: {$oldName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/; secure; httponly; samesite=lax", false);
    }
}

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/html');
    echo "<h1>Unhandled Exception in public/index.php</h1>";
    echo "<p><strong>" . get_class($e) . "</strong>: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>File: " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
