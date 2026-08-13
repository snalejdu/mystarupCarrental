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

Route::post('/contact', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:50',
        'message' => 'required|string',
    ]);
    return back()->with('success', 'Thank you! Your message has been sent to RentBohol support.');
})->name('contact.send')->middleware('throttle:10,1');

// Booking request — public, rate-limited for submissions
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/vehicles/{vehicle}/book', [BookingController::class, 'store'])->name('booking.store');
});

// Renter status page — accessed via UUID token
Route::get('/booking/{token}', [BookingController::class, 'renterStatus'])->name('booking.status');
Route::post('/booking/{token}/rate', [BookingController::class, 'renterRate'])->name('booking.renter-rate')->middleware('throttle:10,1');

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
    Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:10,1');
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:10,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Renter Dashboard Routes (auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('renter')->name('renter.')->group(function () {
    Route::get('/bookings', [\App\Http\Controllers\RenterBookingController::class, 'index'])->name('bookings');
    Route::post('/bookings/{booking}/cancel', [\App\Http\Controllers\RenterBookingController::class, 'cancel'])->name('bookings.cancel');
});

/*
|--------------------------------------------------------------------------
| Owner Routes (auth + owner middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'owner'])->prefix('owner')->name('owner.')->group(function () {
    // Dashboard — redirects to vehicles
    Route::get('/dashboard', fn () => redirect()->route('owner.vehicles.index'))->name('dashboard');

    // Vehicles CRUD
    Route::get('/vehicles', [OwnerVehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [OwnerVehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [OwnerVehicleController::class, 'store'])->name('vehicles.store');
    Route::get('/vehicles/{vehicle}', [OwnerVehicleController::class, 'edit'])->name('vehicles.edit');
    Route::put('/vehicles/{vehicle}', [OwnerVehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [OwnerVehicleController::class, 'destroy'])->name('vehicles.destroy');

    // Vehicle photos
    Route::post('/vehicles/{vehicle}/photos', [OwnerVehicleController::class, 'uploadPhotos'])->name('vehicles.photos.upload');
    Route::delete('/vehicles/{vehicle}/photos/{photo}', [OwnerVehicleController::class, 'deletePhoto'])->name('vehicles.photos.delete');

    // Vehicle availability
    Route::put('/vehicles/{vehicle}/availability', [OwnerVehicleController::class, 'updateAvailability'])->name('vehicles.availability.update');

    // Bookings
    Route::get('/bookings', [OwnerBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [OwnerBookingController::class, 'show'])->name('bookings.show');
    Route::put('/bookings/{booking}/accept', [OwnerBookingController::class, 'accept'])->name('bookings.accept');
    Route::put('/bookings/{booking}/decline', [OwnerBookingController::class, 'decline'])->name('bookings.decline');
    Route::put('/bookings/{booking}/complete', [OwnerBookingController::class, 'complete'])->name('bookings.complete');
    Route::post('/bookings/{booking}/rate', [OwnerBookingController::class, 'rate'])->name('bookings.rate');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (auth + admin middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/commissions', [AdminDashboardController::class, 'commissions'])->name('commissions');
    Route::get('/bookings', [AdminDashboardController::class, 'bookings'])->name('bookings');
    Route::get('/owners', [AdminDashboardController::class, 'owners'])->name('owners');
});
