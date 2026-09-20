<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Owner\BookingController as OwnerBookingController;
use App\Http\Controllers\Owner\VehicleController as OwnerVehicleController;
use App\Http\Controllers\PublicVehicleController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Services\ImageService;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (rate-limited)
|--------------------------------------------------------------------------
*/

// Home page — full landing page
Route::get('/', [PublicVehicleController::class, 'home'])->name('home');

// Vehicle browsing — public
Route::get('/vehicles', [PublicVehicleController::class, 'index'])->name('vehicles.index');
Route::get('/vehicles/{vehicle}', [PublicVehicleController::class, 'show'])->name('vehicles.show');
Route::get('/about', fn () => \Inertia\Inertia::render('About'))->name('about');
Route::get('/contact', fn () => \Inertia\Inertia::render('Contact'))->name('contact');
Route::get('/privacy-policy', fn () => \Inertia\Inertia::render('PrivacyPolicy'))->name('privacy');
Route::get('/terms', fn () => \Inertia\Inertia::render('Terms'))->name('terms');
Route::get('/animation-preview', fn () => \Inertia\Inertia::render('AnimationPreview'))->name('animation.preview');

Route::post('/contact', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:50',
        'message' => 'required|string|max:5000',
    ]);
    return back()->with('success', 'Thank you! Your message has been sent to RentBohol support.');
})->name('contact.send')->middleware('throttle:contact');

// Booking request — public, rate-limited for submissions
Route::middleware('throttle:booking')->group(function () {
    Route::post('/vehicles/{vehicle}/book', [BookingController::class, 'store'])->name('booking.store');
});

// Renter status page — accessed via UUID token
Route::get('/booking/{token}', [BookingController::class, 'renterStatus'])
    ->name('booking.status')
    ->whereUuid('token');

Route::post('/booking/{token}/rate', [BookingController::class, 'renterRate'])
    ->name('booking.renter-rate')
    ->middleware('throttle:rating')
    ->whereUuid('token');

// Photo serving route (for local dev without signed URLs)
Route::get('/photos/{photo}', function (App\Models\VehiclePhoto $photo) {
    return app(ImageService::class)->serve($photo->path);
})->name('vehicle.photo');

/*
|--------------------------------------------------------------------------
| Auth Routes (guest / rate-limited for form posts)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:register');
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:login');
    Route::get('/auth/google/redirect', [LoginController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [LoginController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

Route::middleware(['auth', 'throttle:global'])->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::post('/user/switch-role', [LoginController::class, 'switchRole'])->name('user.switch-role');
});

/*
|--------------------------------------------------------------------------
| Renter Dashboard Routes (auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'throttle:global'])->prefix('renter')->name('renter.')->group(function () {
    Route::get('/bookings', [\App\Http\Controllers\RenterBookingController::class, 'index'])->name('bookings');
    Route::post('/license/upload', [\App\Http\Controllers\RenterBookingController::class, 'uploadLicense'])->name('license.upload')->middleware('throttle:upload');
    Route::post('/bookings/{booking}/rate', [\App\Http\Controllers\RenterBookingController::class, 'rate'])->name('bookings.rate')->middleware('throttle:rating');
    Route::post('/bookings/{booking}/handover', [\App\Http\Controllers\RenterBookingController::class, 'updateHandover'])->name('bookings.handover');
    Route::post('/bookings/{booking}/cancel', [\App\Http\Controllers\RenterBookingController::class, 'cancel'])->name('bookings.cancel');
});

/*
|--------------------------------------------------------------------------
| Owner Routes (auth + owner middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'owner', 'throttle:global'])->prefix('owner')->name('owner.')->group(function () {
    // Dashboard — redirects to vehicles
    Route::get('/dashboard', fn () => redirect()->route('owner.vehicles.index'))->name('dashboard');

    // Vehicles CRUD
    Route::get('/vehicles', [OwnerVehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [OwnerVehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [OwnerVehicleController::class, 'store'])->name('vehicles.store');
    Route::get('/vehicles/{vehicle}', [OwnerVehicleController::class, 'edit'])->name('vehicles.edit');
    Route::put('/vehicles/{vehicle}', [OwnerVehicleController::class, 'update'])->name('vehicles.update');
    Route::put('/vehicles/{vehicle}/status', [OwnerVehicleController::class, 'updateStatus'])->name('vehicles.status');
    Route::delete('/vehicles/{vehicle}', [OwnerVehicleController::class, 'destroy'])->name('vehicles.destroy');

    // Vehicle photos
    Route::post('/vehicles/{vehicle}/photos', [OwnerVehicleController::class, 'uploadPhotos'])->name('vehicles.photos.upload')->middleware('throttle:upload');
    Route::put('/vehicles/{vehicle}/photos/reorder', [OwnerVehicleController::class, 'reorderPhotos'])->name('vehicles.photos.reorder');
    Route::match(['post', 'put'], '/vehicles/{vehicle}/photos/{photo}/transform', [OwnerVehicleController::class, 'transformPhoto'])->name('vehicles.photos.transform');
    Route::delete('/vehicles/{vehicle}/photos/{photo}', [OwnerVehicleController::class, 'deletePhoto'])->name('vehicles.photos.delete');

    // Vehicle availability
    Route::put('/vehicles/{vehicle}/availability', [OwnerVehicleController::class, 'updateAvailability'])->name('vehicles.availability.update');

    // Bookings & Earnings
    Route::get('/bookings', [OwnerBookingController::class, 'index'])->name('bookings.index');
    Route::get('/earnings', [OwnerBookingController::class, 'earnings'])->name('earnings');
    Route::get('/bookings/{booking}', [OwnerBookingController::class, 'show'])->name('bookings.show');
    Route::put('/bookings/{booking}/accept', [OwnerBookingController::class, 'accept'])->name('bookings.accept');
    Route::put('/bookings/{booking}/decline', [OwnerBookingController::class, 'decline'])->name('bookings.decline');
    Route::put('/bookings/{booking}/cancel', [OwnerBookingController::class, 'cancel'])->name('bookings.cancel');
    Route::put('/bookings/{booking}/complete', [OwnerBookingController::class, 'complete'])->name('bookings.complete');
    Route::post('/bookings/{booking}/rate', [OwnerBookingController::class, 'rate'])->name('bookings.rate')->middleware('throttle:rating');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (auth + admin middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin', 'throttle:global'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/commissions', [AdminDashboardController::class, 'commissions'])->name('commissions');
    Route::get('/bookings', [AdminDashboardController::class, 'bookings'])->name('bookings');
    Route::get('/owners', [AdminDashboardController::class, 'owners'])->name('owners');
});

