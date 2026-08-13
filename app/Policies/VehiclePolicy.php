<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;

class VehiclePolicy
{
    /**
     * Any authenticated owner can create vehicles.
     */
    public function create(User $user): bool
    {
        return $user->isOwner();
    }

    /**
     * Only the owner of this vehicle can update it.
     */
    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->owner_id;
    }

    /**
     * Only the owner of this vehicle can delete/archive it.
     */
    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->owner_id;
    }

    /**
     * Only the owner of this vehicle can manage its photos.
     */
    public function managePhotos(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->owner_id;
    }

    /**
     * Only the owner of this vehicle can manage its availability.
     */
    public function manageAvailability(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->owner_id;
    }

    /**
     * Only the owner of this vehicle can view its bookings.
     */
    public function viewBookings(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->owner_id;
    }
}
