<?php

// Forward all incoming Vercel serverless requests to Laravel's public entrypoint
$tmpDir = '/tmp';
$tmpDb = $tmpDir . '/database.sqlite';

if (!file_exists($tmpDb)) {
    $seedDb = dirname(__DIR__) . '/database/seed.db';
    if (file_exists($seedDb)) {
        copy($seedDb, $tmpDb);
    } else {
        touch($tmpDb);
    }
}

putenv("DB_DATABASE={$tmpDb}");
$_ENV['DB_DATABASE'] = $tmpDb;
$_SERVER['DB_DATABASE'] = $tmpDb;

require __DIR__ . '/../public/index.php';
