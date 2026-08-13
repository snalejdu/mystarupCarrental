<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     */
    protected $description = 'Generate XML sitemap for search engine indexing of Bohol vehicle listings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $baseUrl = config('app.url', 'http://carrental.test');
        $vehicles = Vehicle::active()->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Static routes
        $xml .= '  <url>' . PHP_EOL;
        $xml .= '    <loc>' . htmlspecialchars($baseUrl . '/vehicles') . '</loc>' . PHP_EOL;
        $xml .= '    <changefreq>daily</changefreq>' . PHP_EOL;
        $xml .= '    <priority>1.0</priority>' . PHP_EOL;
        $xml .= '  </url>' . PHP_EOL;

        // Vehicle detail routes
        foreach ($vehicles as $vehicle) {
            $url = $baseUrl . '/vehicles/' . $vehicle->slug;
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . htmlspecialchars($url) . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $vehicle->updated_at->toAtomString() . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>weekly</changefreq>' . PHP_EOL;
            $xml .= '    <priority>0.8</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>' . PHP_EOL;

        $path = public_path('sitemap.xml');
        File::put($path, $xml);

        $this->info("XML Sitemap generated successfully with " . ($vehicles->count() + 1) . " URLs at {$path}");
        return Command::SUCCESS;
    }
}
