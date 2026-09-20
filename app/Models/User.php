<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'phone', 'password', 'role', 'avatar', 'driver_license_path', 'google_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Check if renter's driver license is verified.
     */
    public function isLicenseVerified(): bool
    {
        return $this->driver_license_status === 'verified';
    }

    /**
     * Check if renter's driver license is pending review.
     */
    public function isLicensePending(): bool
    {
        return $this->driver_license_status === 'pending';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the vehicles owned by this user.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(\App\Models\Vehicle::class, 'owner_id');
    }

    /**
     * Get the bookings made by this renter.
     */
    public function renterBookings(): HasMany
    {
        return $this->hasMany(\App\Models\Booking::class, 'renter_id');
    }

    /**
     * Check if the user is a renter.
     */
    public function isRenter(): bool
    {
        return $this->role === 'renter';
    }

    /**
     * Check if the user is an owner.
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}

