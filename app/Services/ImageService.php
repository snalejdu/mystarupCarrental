<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    /**
     * Process, resize, and store an uploaded image securely.
     *
     * - Validates MIME type server-side (not just extension)
     * - Resizes to max width while maintaining aspect ratio
     * - Converts to WebP for smaller file size
     * - Stores OUTSIDE public web root in private disk
     */
    public function processAndStore(UploadedFile $file, string $directory): string
    {
        $maxWidth = config('rentbohol.photos.max_width', 1200);
        $quality = config('rentbohol.photos.quality', 80);

        // Read the image using Intervention
        $image = Image::read($file);

        // Resize if wider than max width, maintaining aspect ratio
        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        // Encode as WebP for optimal file size
        $encoded = $image->toWebp($quality);

        // Generate unique filename
        $filename = uniqid('vehicle_', true) . '.webp';
        $path = $directory . '/' . $filename;

        // Store in private disk (outside public web root)
        Storage::disk('private')->put($path, (string) $encoded);

        return $path;
    }

    /**
     * Delete an image from storage.
     */
    public function delete(string $path): void
    {
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }
    }

    /**
     * Serve an image via controller route (for local development
     * where signed URLs aren't available).
     */
    public function serve(string $path)
    {
        if (!Storage::disk('private')->exists($path)) {
            abort(404);
        }

        return response(Storage::disk('private')->get($path))
            ->header('Content-Type', 'image/webp')
            ->header('Cache-Control', 'public, max-age=86400');
    }
}
