<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;

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

        // Read the image using Intervention v4
        $image = Image::decode($file->getPathname());

        // Resize if wider than max width, maintaining aspect ratio
        if ($image->width() > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        // Encode as WebP for optimal file size
        $encoded = $image->encode(new WebpEncoder(quality: $quality));

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
     * Transform an existing stored image — rotate, resize, re-compress.
     * Returns the new storage path (always generates a new file).
     */
    public function transform(string $currentPath, int $rotation, int $maxWidth, int $quality, string $directory): string
    {
        // Handle demo images stored in public (path starts with /)
        if (str_starts_with($currentPath, '/')) {
            $imageData = file_get_contents(public_path($currentPath));
        } else {
            if (!Storage::disk('private')->exists($currentPath)) {
                abort(404, 'Source image not found.');
            }
            $imageData = Storage::disk('private')->get($currentPath);
        }

        $image = Image::decode($imageData);

        // Apply rotation
        if ($rotation > 0) {
            // Intervention rotates counter-clockwise, so we pass negative for clockwise
            $image->rotate(-$rotation);
        }

        // Apply resize (only if maxWidth specified and image is larger)
        if ($maxWidth > 0 && $image->width() > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        // Re-encode with specified quality
        $encoded = $image->encode(new WebpEncoder(quality: $quality));

        // Save as new file
        $filename = uniqid('vehicle_', true) . '.webp';
        $newPath = $directory . '/' . $filename;
        Storage::disk('private')->put($newPath, (string) $encoded);

        return $newPath;
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
