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
    echo "password_algos: " . implode(', ', function_exists('password_algos') ? password_algos() : ['none']) . "\n";
    echo "PASSWORD_BCRYPT defined: " . (defined('PASSWORD_BCRYPT') ? 'yes' : 'no') . "\n";
    echo "PASSWORD_DEFAULT: " . (defined('PASSWORD_DEFAULT') ? PASSWORD_DEFAULT : 'no') . "\n";
    echo "CRYPT_BLOWFISH: " . (defined('CRYPT_BLOWFISH') ? CRYPT_BLOWFISH : 'not defined') . "\n";
    try {
        $h1 = password_hash('test1234', PASSWORD_BCRYPT, ['cost' => 10]);
        echo "password_hash BCRYPT (cost 10): SUCCESS (" . substr($h1, 0, 10) . "...)\n";
    } catch (\Throwable $e) {
        echo "password_hash BCRYPT (cost 10) ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
    }
    try {
        $h2 = password_hash('test1234', PASSWORD_BCRYPT, ['cost' => 12]);
        echo "password_hash BCRYPT (cost 12): SUCCESS (" . substr($h2, 0, 10) . "...)\n";
    } catch (\Throwable $e) {
        echo "password_hash BCRYPT (cost 12) ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
    }
    try {
        $h3 = password_hash('test1234', PASSWORD_DEFAULT);
        echo "password_hash DEFAULT: SUCCESS (" . substr($h3, 0, 10) . "...)\n";
    } catch (\Throwable $e) {
        echo "password_hash DEFAULT ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
    }
    if (defined('PASSWORD_ARGON2ID')) {
        try {
            $h4 = password_hash('test1234', PASSWORD_ARGON2ID);
            echo "password_hash ARGON2ID: SUCCESS (" . substr($h4, 0, 10) . "...)\n";
        } catch (\Throwable $e) {
            echo "password_hash ARGON2ID ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
        }
    }
    try {
        $hasher = new \Illuminate\Hashing\BcryptHasher();
        $h5 = $hasher->make('test1234');
        echo "BcryptHasher->make: SUCCESS (" . substr($h5, 0, 10) . "...)\n";
    } catch (\Throwable $e) {
        echo "BcryptHasher->make ERROR: " . get_class($e) . " - " . $e->getMessage() . "\n";
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
