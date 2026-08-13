<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Admin dashboard — overview stats.
     */
    public function index()
    {
        $stats = [
            'total_owners' => User::where('role', 'owner')->count(),
            'total_vehicles' => Vehicle::count(),
            'active_vehicles' => Vehicle::active()->count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::pending()->count(),
            'confirmed_bookings' => Booking::confirmed()->count(),
            'completed_bookings' => Booking::completed()->count(),
            'total_revenue' => Booking::completed()->sum('total_price'),
            'total_commission' => Booking::completed()->sum('commission_amount'),
            'commission_rate' => config('rentbohol.commission_rate'),
        ];

        // Recent bookings
        $recentBookings = Booking::with(['vehicle:id,title,slug,location'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
        ]);
    }

    /**
     * Commission tracking page.
     */
    public function commissions(Request $request)
    {
        $owners = User::where('role', 'owner')
            ->withCount('vehicles')
            ->get()
            ->map(function ($owner) {
                $vehicleIds = $owner->vehicles()->pluck('id');
                $completedBookings = Booking::whereIn('vehicle_id', $vehicleIds)->completed();

                return [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                    'phone' => $owner->phone,
                    'vehicles_count' => $owner->vehicles_count,
                    'total_bookings' => Booking::whereIn('vehicle_id', $vehicleIds)->count(),
                    'completed_bookings' => (clone $completedBookings)->count(),
                    'total_revenue' => (clone $completedBookings)->sum('total_price'),
                    'commission_owed' => (clone $completedBookings)->sum('commission_amount'),
                ];
            })
            ->sortByDesc('commission_owed')
            ->values();

        return Inertia::render('Admin/Commissions', [
            'owners' => $owners,
        ]);
    }

    /**
     * All bookings management.
     */
    public function bookings(Request $request)
    {
        $query = Booking::with(['vehicle:id,title,slug,location,owner_id', 'vehicle.owner:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Bookings', [
            'bookings' => $bookings,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * All owners management.
     */
    public function owners()
    {
        $owners = User::where('role', 'owner')
            ->withCount('vehicles')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Owners', [
            'owners' => $owners,
        ]);
    }
}
