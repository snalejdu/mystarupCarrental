import { Head, Link, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import {
    Plus, MapPin, Star, Calendar, WarningCircle, Eye, ArrowSquareOut, Gear, Image as ImageIcon, Users, Gauge, Wrench, CheckCircle, PauseCircle, CaretDown, Check, Car } from '@phosphor-icons/react';
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
            <Head title="My Vehicles — RentalHub Host" />

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div>
                    <h2 className="font-bold text-slate-900 text-lg tracking-tight">Vehicle Fleet</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} listed • Manage calendar, photos, pricing, and live listings.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Filter Segmented Control */}
                    <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span>All</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                                filter === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-600'
                            }`}>
                                {counts.all}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFilter('active')}
                            className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                filter === 'active'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${filter === 'active' ? 'bg-white' : 'bg-emerald-500'}`} />
                            <span>Active</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                                filter === 'active' ? 'bg-emerald-700 text-white' : 'bg-slate-200/60 text-slate-600'
                            }`}>
                                {counts.active}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFilter('maintenance')}
                            className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                filter === 'maintenance'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Wrench className={`w-3 h-3 ${filter === 'maintenance' ? 'text-white' : 'text-amber-500'}`} />
                            <span>Maintenance</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                                filter === 'maintenance' ? 'bg-amber-700 text-white' : 'bg-slate-200/60 text-slate-600'
                            }`}>
                                {counts.maintenance}
                            </span>
                        </button>
                    </div>

                    <Link
                        href="/owner/vehicles/create"
                        className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 text-teal-100" />
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
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>List Your First Vehicle</span>
                        </Link>
                    )}
                </div>
            ) : (
                /* Box-Type Card Grid (Responsive 1, 2, or 3 columns) */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
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
                                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col group relative ${
                                    isMenuOpen ? 'z-30' : 'z-10'
                                } ${
                                    isMaintenance
                                        ? 'border-amber-300 ring-1 ring-amber-200/60 shadow-xs'
                                        : 'border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300'
                                }`}
                            >
                                {/* Box Top: Fixed 16:10 Image Frame */}
                                <div className="relative aspect-[16/10] select-none">
                                    {/* Photo & Maintenance Container */}
                                    <div className="absolute inset-0 bg-slate-900 rounded-t-2xl overflow-hidden">
                                        {coverPhoto ? (
                                            <img
                                                src={coverPhoto.url}
                                                alt={vehicle.title}
                                                className={`w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ${
                                                    isMaintenance ? 'opacity-85 filter saturate-75' : ''
                                                }`}
                                                style={{
                                                    objectPosition: `${coverPhoto.position_x ?? 50}% ${coverPhoto.position_y ?? 50}%`,
                                                }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center">
                                                <Car className="w-10 h-10 text-slate-500 mb-1.5" />
                                                <span className="text-xs font-bold text-slate-300">No Photo Uploaded</span>
                                                <span className="text-[10px] text-slate-500 mt-0.5">Click Edit to add photos</span>
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
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold tracking-wide capitalize shadow-xs border border-white/20 pointer-events-none flex items-center gap-1.5">
                                        {vehicle.type}
                                    </div>

                                    {/* Top-Right: Interactive Quick Status Switcher Dropdown */}
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            type="button"
                                            onClick={() => setOpenMenuId(isMenuOpen ? null : vehicle.id)}
                                            disabled={isUpdating}
                                            className={`h-8 px-2.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md backdrop-blur-md border transition-all active:scale-95 cursor-pointer ${
                                                isActive
                                                    ? 'bg-emerald-500/95 hover:bg-emerald-600 text-white border-emerald-400/50'
                                                    : isMaintenance
                                                    ? 'bg-amber-500/95 hover:bg-amber-600 text-white border-amber-400/50'
                                                    : 'bg-slate-700/95 hover:bg-slate-800 text-slate-200 border-slate-600/50'
                                            }`}
                                            title="Click to change vehicle status"
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
                                            <span className="capitalize">{vehicle.status}</span>
                                            <CaretDown className="w-3 h-3 opacity-80" />
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
                                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-black tracking-tight shadow-md border border-white/15 pointer-events-none flex items-baseline gap-0.5">
                                        {formatCurrency(Number(vehicle.price_per_day))}
                                        <span className="text-[10px] font-normal text-slate-300">/day</span>
                                    </div>
                                </div>

                                {/* Box Bottom: Details & Controls */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                                    <div className="space-y-1.5">
                                        {/* Title */}
                                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-teal-700 transition-colors" title={vehicle.title}>
                                            {vehicle.title}
                                        </h3>

                                        {/* Location */}
                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                            <span className="truncate">{vehicle.location}, Bohol</span>
                                        </p>
                                    </div>

                                    {/* Maintenance Notice Banner */}
                                    {isMaintenance && (
                                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                                            <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span className="font-medium text-xs leading-tight">
                                                Hidden from renter POV while in maintenance.
                                            </span>
                                        </div>
                                    )}

                                    {/* Specs & Performance Stats Strip */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                                        {/* Bookings count */}
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/80 truncate">
                                            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                            <span className="truncate font-semibold text-slate-700">
                                                {vehicle.bookings_count} {vehicle.bookings_count === 1 ? 'booking' : 'bookings'}
                                            </span>
                                        </div>

                                        {/* Rating / Reviews */}
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/80">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                            <span className="font-semibold text-slate-700">
                                                {vehicle.avg_rating > 0 ? Number(vehicle.avg_rating).toFixed(1) : 'New'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pending Alert Chip (If any) */}
                                    {hasPending && (
                                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
                                            <WarningCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span>{vehicle.pending_bookings_count} pending {vehicle.pending_bookings_count === 1 ? 'request' : 'requests'}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                                        {/* Edit Vehicle & Manage */}
                                        <Link
                                            href={`/owner/vehicles/${vehicle.slug}`}
                                            className="flex-1 h-10 inline-flex items-center justify-center gap-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer"
                                        >
                                            <Gear className="w-4 h-4 text-teal-100" />
                                            <span>Edit Vehicle</span>
                                        </Link>

                                        {/* Renter POV preview button */}
                                        {isActive ? (
                                            <a
                                                href={`/vehicles/${vehicle.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold text-xs transition-colors border border-slate-200/80 whitespace-nowrap cursor-pointer group/pov"
                                                title="View Live Listing as Renter"
                                            >
                                                <Eye className="w-4 h-4 text-teal-700 group-hover/pov:scale-110 transition-transform" />
                                                <span>Renter POV</span>
                                                <ArrowSquareOut className="w-3.5 h-3.5 text-slate-400" />
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(vehicle.slug, vehicle.id, 'active')}
                                                className="h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-700 font-bold text-xs transition-colors border border-emerald-200 whitespace-nowrap cursor-pointer"
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
