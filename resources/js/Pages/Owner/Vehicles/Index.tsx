import { Head, Link, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import {
    Plus, MapPin, Star, Calendar, WarningCircle, Eye, ArrowSquareOut, Gear, Image as ImageIcon, Users, Gauge, Wrench, CheckCircle, PauseCircle, CaretDown, Check } from '@phosphor-icons/react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { broadcastVehicleUpdate } from '@/lib/vehicleSync';

interface Props {
    vehicles: any[];
}

export default function VehiclesIndex({ vehicles }: Props) {
    const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'inactive'>('all');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const handleStatusChange = (vehicleSlug: string, vehicleId: number, nextStatus: string) => {
        setUpdatingId(vehicleId);
        setOpenMenuId(null);
        router.put(`/owner/vehicles/${vehicleSlug}/status`, { status: nextStatus }, {
            onFinish: () => {
                setUpdatingId(null);
                broadcastVehicleUpdate({ slug: vehicleSlug, id: vehicleId, action: `Status changed to ${nextStatus}` });
            },
            preserveScroll: true,
        });
    };

    const counts = {
        all: vehicles.length,
        active: vehicles.filter(v => v.status === 'active').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        inactive: vehicles.filter(v => v.status === 'inactive').length,
    };

    const filteredVehicles = vehicles.filter(v => {
        if (filter === 'all') return true;
        return v.status === filter;
    });

    return (
        <OwnerLayout title="My Vehicles">
            <Head title="My Vehicles — RentBohol Host" />

            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                    <h2 className="font-bold text-slate-900 text-base">Vehicle Fleet</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} listed • Manage calendar, photos, pricing, and view renter listings.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                                filter === 'all' ? 'glass-pill-active' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All ({counts.all})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('active')}
                            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                filter === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span>Active</span>
                            <span className="text-xs opacity-90">({counts.active})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('maintenance')}
                            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                filter === 'maintenance' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span>Maintenance</span>
                            <span className="text-xs opacity-90">({counts.maintenance})</span>
                        </button>
                    </div>

                    <Link
                        href="/owner/vehicles/create"
                        className="glass-btn-accent min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Vehicle</span>
                    </Link>
                </div>
            </div>

            {filteredVehicles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                        {filter !== 'all' ? `No ${filter} vehicles` : 'No vehicles yet'}
                    </h3>
                    <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto font-medium">
                        {filter !== 'all'
                            ? `You do not have any vehicles currently marked as ${filter}.`
                            : 'List your first car, van, or motorbike and start receiving booking requests from travelers in Bohol.'}
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/owner/vehicles/create"
                            className="glass-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>List Your First Vehicle</span>
                        </Link>
                    )}
                </div>
            ) : (
                /* Box-Type Card Grid (Responsive 1, 2, or 3 columns) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {filteredVehicles.map((vehicle: any) => {
                        const coverPhoto = vehicle.photos?.[0];
                        const isActive = vehicle.status === 'active';
                        const isMaintenance = vehicle.status === 'maintenance';
                        const isInactive = vehicle.status === 'inactive';
                        const hasPending = (vehicle.pending_bookings_count ?? 0) > 0;
                        const isMenuOpen = openMenuId === vehicle.id;
                        const isUpdating = updatingId === vehicle.id;

                        return (
                            <div
                                key={vehicle.id}
                                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col group relative ${
                                    isMenuOpen ? 'z-30' : 'z-10'
                                } ${
                                    isMaintenance
                                        ? 'border-amber-300 ring-1 ring-amber-200/60 shadow-xs'
                                        : 'border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300'
                                }`}
                            >
                                {/* Box Top: Fixed 16:10 Image Frame */}
                                <div className="relative aspect-[16/10] select-none">
                                    {/* Photo & Maintenance Container (Clipped to top rounded corners) */}
                                    <div className="absolute inset-0 bg-slate-950 rounded-t-[23px] overflow-hidden">
                                        {coverPhoto ? (
                                            <img
                                                src={coverPhoto.url}
                                                alt={vehicle.title}
                                                className={`w-full h-full object-cover ${
                                                    isMaintenance ? 'opacity-85 filter saturate-75' : ''
                                                }`}
                                                style={{
                                                    objectPosition: `${coverPhoto.position_x ?? 50}% ${coverPhoto.position_y ?? 50}%`,
                                                }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900 p-4 text-center">
                                                <ImageIcon className="w-8 h-8 text-slate-600 mb-1.5" />
                                                <span className="text-xs font-semibold text-slate-400">No Photo Uploaded</span>
                                            </div>
                                        )}

                                        {/* Maintenance Overlay Badge across photo if in maintenance */}
                                        {isMaintenance && (
                                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                                                <div className="bg-amber-500/95 text-white px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg border border-amber-300/40 uppercase">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                    <span>Under Maintenance</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Top-Left: Vehicle Type Badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-extrabold text-slate-900 capitalize shadow-xs border border-white/40 pointer-events-none">
                                        {vehicle.type}
                                    </div>

                                    {/* Top-Right: Interactive Quick Status Switcher Dropdown */}
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            type="button"
                                            onClick={() => setOpenMenuId(isMenuOpen ? null : vehicle.id)}
                                            disabled={isUpdating}
                                            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md border uppercase transition-transform active:scale-95 cursor-pointer ${
                                                isActive
                                                    ? 'bg-emerald-500 text-white border-emerald-400'
                                                    : isMaintenance
                                                    ? 'bg-amber-500 text-white border-amber-400'
                                                    : 'bg-slate-700 text-slate-200 border-slate-600'
                                            }`}
                                            title="Click to toggle status (Active, Maintenance, Inactive)"
                                        >
                                            {isUpdating ? (
                                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : isMaintenance ? (
                                                <Wrench className="w-3.5 h-3.5 text-amber-100" />
                                            ) : (
                                                <span
                                                    className={`w-2 h-2 rounded-full ${
                                                        isActive ? 'bg-white animate-pulse' : 'bg-white'
                                                    }`}
                                                />
                                            )}
                                            <span>{vehicle.status}</span>
                                            <CaretDown className="w-3.5 h-3.5 opacity-75" />
                                        </button>

                                        {/* Status Switcher Popover Menu */}
                                        {isMenuOpen && (
                                            <>
                                                {/* Backdrop to close popover when clicking outside */}
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setOpenMenuId(null)}
                                                />

                                                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-fadeIn">
                                                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                                        Change Vehicle Status
                                                    </div>

                                                    {/* Active Option */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(vehicle.slug, vehicle.id, 'active')}
                                                        className={`w-full min-h-[44px] text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer ${
                                                            isActive ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                                                            <div>
                                                                <span className="block font-bold">Active</span>
                                                                <span className="text-xs text-slate-400 block font-normal">Visible to renters & bookable</span>
                                                            </div>
                                                        </div>
                                                        {isActive && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                                    </button>

                                                    {/* Maintenance Option */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(vehicle.slug, vehicle.id, 'maintenance')}
                                                        className={`w-full min-h-[44px] text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer ${
                                                            isMaintenance ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                                                            <div>
                                                                <span className="block font-bold">Under Maintenance</span>
                                                                <span className="text-xs text-slate-400 block font-normal">Hidden from renters, no bookings</span>
                                                            </div>
                                                        </div>
                                                        {isMaintenance && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                                                    </button>

                                                    {/* Inactive Option */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(vehicle.slug, vehicle.id, 'inactive')}
                                                        className={`w-full min-h-[44px] text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                                                            isInactive ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <PauseCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                                            <div>
                                                                <span className="block font-bold">Inactive (Paused)</span>
                                                                <span className="text-xs text-slate-400 block font-normal">Temporarily taken offline</span>
                                                            </div>
                                                        </div>
                                                        {isInactive && <Check className="w-4 h-4 text-slate-600 shrink-0" />}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Bottom-Right: Price Tag Overlay */}
                                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-white text-xs font-black tracking-tight shadow-md border border-white/10 pointer-events-none">
                                        {formatCurrency(Number(vehicle.price_per_day))}
                                        <span className="text-xs font-normal text-slate-300">/day</span>
                                    </div>
                                </div>

                                {/* Box Bottom: Details & Controls */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                                    <div className="space-y-1.5">
                                        {/* Title */}
                                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-primary-700 transition-colors">
                                            {vehicle.title}
                                        </h3>

                                        {/* Location */}
                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                            <span className="truncate">{vehicle.location}, Bohol</span>
                                        </p>
                                    </div>

                                    {/* Maintenance Notice Banner */}
                                    {isMaintenance && (
                                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                                            <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span className="font-medium text-xs leading-tight">
                                                Hidden from renter POV while undergoing maintenance. Switch to <b>Active</b> when ready to rent.
                                            </span>
                                        </div>
                                    )}

                                    {/* Specs & Performance Stats Strip */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                                        {/* Bookings count */}
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 truncate">
                                            <Calendar className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                            <span className="truncate">
                                                {vehicle.bookings_count} {vehicle.bookings_count === 1 ? 'booking' : 'bookings'}
                                            </span>
                                        </div>

                                        {/* Rating / Reviews */}
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                            <span>
                                                {vehicle.avg_rating > 0 ? Number(vehicle.avg_rating).toFixed(1) : 'New'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pending Alert Chip (If any) */}
                                    {hasPending && (
                                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                                            <WarningCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span>{vehicle.pending_bookings_count} pending booking {vehicle.pending_bookings_count === 1 ? 'request' : 'requests'}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                        {/* Edit Vehicle & Manage */}
                                        <Link
                                            href={`/owner/vehicles/${vehicle.slug}`}
                                            className="glass-btn flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs"
                                        >
                                            <Gear className="w-4 h-4" />
                                            <span>Edit Vehicle</span>
                                        </Link>

                                        {/* Renter POV preview button */}
                                        {isActive ? (
                                            <a
                                                href={`/vehicles/${vehicle.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                                title="View Live Listing as a Renter"
                                            >
                                                <Eye className="w-4 h-4 text-emerald-600" />
                                                <span className="hidden sm:inline">Renter POV</span>
                                                <ArrowSquareOut className="w-3.5 h-3.5 text-slate-400" />
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(vehicle.slug, vehicle.id, 'active')}
                                                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors border border-emerald-200 cursor-pointer"
                                                title="Make vehicle active and open to renters"
                                            >
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span>Publish</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </OwnerLayout>
    );
}
