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

// Diagnostic check
if (isset($_GET['diag'])) {
    header('Content-Type: text/plain');
    echo "=== PHP DIAGNOSTICS ===\n";
    echo "PHP Version: " . PHP_VERSION . "\n";
    echo "PDO Drivers: " . implode(', ', PDO::getAvailableDrivers()) . "\n";
    echo "pdo_sqlite: " . (extension_loaded('pdo_sqlite') ? 'yes' : 'no') . "\n";
    echo "sqlite3: " . (extension_loaded('sqlite3') ? 'yes' : 'no') . "\n";
    echo "tmp directory writable: " . (is_writable('/tmp') ? 'yes' : 'no') . "\n";
    echo "seed.db exists: " . (file_exists(dirname(__DIR__) . '/database/seed.db') ? 'yes (' . filesize(dirname(__DIR__) . '/database/seed.db') . ' bytes)' : 'no') . "\n";
    echo "packages.php exists: " . (file_exists(__DIR__ . '/../bootstrap/cache/packages.php') ? 'yes' : 'no') . "\n";
    echo "services.php exists: " . (file_exists(__DIR__ . '/../bootstrap/cache/services.php') ? 'yes' : 'no') . "\n";
    echo "public/index.php exists: " . (file_exists(__DIR__ . '/../public/index.php') ? 'yes' : 'no') . "\n";
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

// Copy package and service manifests to writable /tmp
$tmpPackages = '/tmp/packages.php';
if (!file_exists($tmpPackages) && file_exists(__DIR__ . '/../bootstrap/cache/packages.php')) {
    @copy(__DIR__ . '/../bootstrap/cache/packages.php', $tmpPackages);
}
if (file_exists($tmpPackages)) {
    putenv("APP_PACKAGES_CACHE={$tmpPackages}");
    $_ENV['APP_PACKAGES_CACHE'] = $tmpPackages;
    $_SERVER['APP_PACKAGES_CACHE'] = $tmpPackages;
}

$tmpServices = '/tmp/services.php';
if (!file_exists($tmpServices) && file_exists(__DIR__ . '/../bootstrap/cache/services.php')) {
    @copy(__DIR__ . '/../bootstrap/cache/services.php', $tmpServices);
}
if (file_exists($tmpServices)) {
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
