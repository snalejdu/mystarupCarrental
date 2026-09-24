<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'php_version' => PHP_VERSION,
    'vendor_autoload' => file_exists(__DIR__ . '/../vendor/autoload.php'),
    'database_seed' => file_exists(dirname(__DIR__) . '/database/seed.db'),
    'tmp_writable' => is_writable('/tmp'),
    'time' => date('Y-m-d H:i:s'),
], JSON_PRETTY_PRINT);
