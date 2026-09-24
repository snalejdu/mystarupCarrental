import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    LuMapPin,
    LuStar,
    LuGauge,
    LuWind,
    LuUsers,
    LuCar,
    LuBike,
    LuBus,
    LuCompass,
    LuSearch,
    LuCalendar,
    LuX
} from 'react-icons/lu';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Props {
    vehicles: any;
    filters: any;
    locations: string[];
    vehicleTypes: string[];
}

export default function VehiclesIndex({ vehicles, filters, locations, vehicleTypes }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [pickupDate, setPickupDate] = useState(filters.pickup_date || '');
    const [returnDate, setReturnDate] = useState(filters.return_date || '');

    const applyFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key];
        router.get('/vehicles', newFilters, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters = {
            ...filters,
            search: search || null,
            pickup_date: pickupDate || null,
            return_date: returnDate || null,
        };
        if (!search) delete newFilters.search;
        if (!pickupDate) delete newFilters.pickup_date;
        if (!returnDate) delete newFilters.return_date;

        router.get('/vehicles', newFilters, { preserveState: true, preserveScroll: true });
    };

    const clearDates = () => {
        setPickupDate('');
        setReturnDate('');
        const newFilters = { ...filters };
        delete newFilters.pickup_date;
        delete newFilters.return_date;
        router.get('/vehicles', newFilters, { preserveState: true, preserveScroll: true });
    };

    const activeType = filters.type || null;

    return (
        <PublicLayout>
            <Head>
                <title>Select a Vehicle Group — RentalHub</title>
                <meta name="description" content="Choose your Bohol rental vehicle: Sedans, 15-seater group vans, scooters, motorbikes, and 4x4 SUVs directly from local hosts." />
            </Head>

            <div className="bg-white py-12 lg:py-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                    {/* Page Header */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                            Select a vehicle group
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
                            Direct owner rentals across Tagbilaran, Panglao, Dauis & Loboc with zero renter commissions.
                        </p>
                    </div>

                    {/* Filter Category Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
                        <button
                            onClick={() => applyFilter('type', null)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${
                                !activeType
                                    ? 'glass-pill-active'
                                    : 'glass-pill text-slate-700'
                            }`}
                        >
                            <LuCompass className="w-4 h-4" />
                            <span>All vehicles</span>
                        </button>

                        <button
                            onClick={() => applyFilter('type', 'car')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${
                                activeType === 'car'
                                    ? 'glass-pill-active'
                                    : 'glass-pill text-slate-700'
                            }`}
                        >
                            <LuCar className="w-4 h-4" />
                            <span>Sedan / Cars</span>
                        </button>

                        <button
                            onClick={() => applyFilter('type', 'motorbike')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${
                                activeType === 'motorbike'
                                    ? 'glass-pill-active'
                                    : 'glass-pill text-slate-700'
                            }`}
                        >
                            <LuBike className="w-4 h-4" />
                            <span>Motorbikes</span>
                        </button>

                        <button
                            onClick={() => applyFilter('type', 'suv')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${
                                activeType === 'suv'
                                    ? 'glass-pill-active'
                                    : 'glass-pill text-slate-700'
                            }`}
                        >
                            <LuCar className="w-4 h-4" />
                            <span>Suv (4x4)</span>
                        </button>

                        <button
                            onClick={() => applyFilter('type', 'van')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${
                                activeType === 'van'
                                    ? 'glass-pill-active'
                                    : 'glass-pill text-slate-700'
                            }`}
                        >
                            <LuBus className="w-4 h-4" />
                            <span>Minivan (15-Seater)</span>
                        </button>
                    </div>

                    {/* Search & Sub-Filter Bar */}
                    <div className="w-full bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            {/* Search by Name */}
                            <div className="md:col-span-5 relative">
                                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by vehicle name (e.g. Toyota Vios, NMAX)..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 font-medium"
                                />
                            </div>

                            {/* Pickup Date */}
                            <div className="md:col-span-3 relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute -top-2 left-3 bg-slate-50 px-1 z-10">Pickup Date</label>
                                <input
                                    type="date"
                                    value={pickupDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 font-medium"
                                />
                            </div>

                            {/* Return Date */}
                            <div className="md:col-span-3 relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute -top-2 left-3 bg-slate-50 px-1 z-10">Return Date</label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    min={pickupDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 font-medium"
                                />
                            </div>

                            {/* Search Submit Button */}
                            <div className="md:col-span-1 flex gap-1.5">
                                <button
                                    type="submit"
                                    className="glass-btn w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 shrink-0"
                                >
                                    <span>Find</span>
                                </button>
                                {(pickupDate || returnDate) && (
                                    <button
                                        type="button"
                                        onClick={clearDates}
                                        className="glass-btn-icon p-2.5 rounded-xl text-slate-700 text-xs shrink-0"
                                        title="Clear Date Filters"
                                    >
                                        <LuX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Date Filter Active Pill */}
                        {(filters.pickup_date || filters.return_date) && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary-800 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-200">
                                <LuCalendar className="w-3.5 h-3.5 text-primary-600" />
                                <span>
                                    Filtering available vehicles for: <b>{filters.pickup_date || 'Any'}</b> to <b>{filters.return_date || 'Any'}</b>
                                </span>
                                <button onClick={clearDates} className="ml-auto text-primary-600 hover:text-primary-800 text-[11px] underline">
                                    Reset Dates
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-xs">
                            {/* Transmission Pills */}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Transmission:</span>
                                <button
                                    onClick={() => applyFilter('transmission', null)}
                                    className={`px-3 py-1 rounded-md font-semibold ${
                                        !filters.transmission ? 'glass-pill-active' : 'glass-pill text-slate-600'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => applyFilter('transmission', 'automatic')}
                                    className={`px-3 py-1 rounded-md font-semibold ${
                                        filters.transmission === 'automatic' ? 'glass-pill-active' : 'glass-pill text-slate-600'
                                    }`}
                                >
                                    Automatic
                                </button>
                                <button
                                    onClick={() => applyFilter('transmission', 'manual')}
                                    className={`px-3 py-1 rounded-md font-semibold ${
                                        filters.transmission === 'manual' ? 'glass-pill-active' : 'glass-pill text-slate-600'
                                    }`}
                                >
                                    Manual
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Sort By:</span>
                                <select
                                    value={filters.sort || 'newest'}
                                    onChange={(e) => applyFilter('sort', e.target.value)}
                                    className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                    <option value="newest">Newly Listed</option>
                                    <option value="rating">Highest Rated ⭐</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Cards Grid */}
                    {vehicles.data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 pt-4">
                            {vehicles.data.map((vehicle: any) => (
                                <ReferenceVehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
                            <LuCar className="w-12 h-12 text-slate-400 mx-auto" />
                            <h3 className="font-semibold text-slate-900 text-base">No vehicles found</h3>
                            <p className="text-sm text-slate-500">Try searching for a different model or clearing category filters.</p>
                            <button
                                onClick={() => router.get('/vehicles')}
                                className="glass-btn px-5 py-2.5 rounded-lg text-sm font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {vehicles.last_page > 1 && (
                        <div className="flex justify-center gap-2 pt-6">
                            {vehicles.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium ${
                                        link.active
                                            ? 'glass-pill-active'
                                            : link.url
                                            ? 'glass-pill text-slate-700'
                                            : 'text-slate-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </PublicLayout>
    );
}

{/* Single Vehicle Card Component */}
function ReferenceVehicleCard({ vehicle }: { vehicle: any }) {
    const primaryPhoto = vehicle.photos?.[0];

    // Specs detection from database fields
    const transmissionText = vehicle.transmission
        ? (vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1))
        : (vehicle.title?.toLowerCase().includes('at') || vehicle.type === 'motorbike' || vehicle.type === 'car' ? 'Automatic' : 'Manual');

    const capacityText = vehicle.seats
        ? `${vehicle.seats} Seats`
        : (vehicle.type === 'motorbike' ? '2 Seats' : vehicle.type === 'van' ? '15 Seats' : '5 Seats');

    const airconText = vehicle.has_aircon === false ? 'Non-Aircon' : 'Aircon';

    return (
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group cursor-pointer h-full">
            {/* Top Image Box */}
            <div className="aspect-[4/3] sm:aspect-[16/10] bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-5 relative border border-slate-100">
                {primaryPhoto ? (
                    <img
                        src={primaryPhoto.url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        style={{
                            objectPosition: `${primaryPhoto.position_x ?? 50}% ${primaryPhoto.position_y ?? 50}%`,
                        }}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <LuCar className="w-10 sm:w-16 h-10 sm:h-16" />
                    </div>
                )}

                {/* Rating Chip */}
                {vehicle.avg_rating > 0 && (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-900/80 text-amber-400 rounded-md text-[9px] sm:text-xs font-semibold shadow-xs">
                        <LuStar className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400" />
                        <span>{Number(vehicle.avg_rating).toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Title & Price Header Row — Desktop */}
            <div className="hidden sm:block space-y-1 mb-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-1 group-hover:text-primary-700 transition-colors">
                            {vehicle.title}
                        </h3>
                        <p className="text-xs text-slate-400 capitalize">
                            {vehicle.type} • {vehicle.location}, Bohol
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <span className="text-xl font-bold text-primary-700 block leading-tight">
                            {formatCurrency(vehicle.price_per_day)}
                        </span>
                        <span className="text-xs text-slate-400 block">per day</span>
                    </div>
                </div>
            </div>

            {/* Title & Price Header Row — Mobile */}
            <div className="block sm:hidden mb-1.5">
                <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 min-h-[2rem] group-hover:text-primary-700 transition-colors">
                    {vehicle.title}
                </h3>
                <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">
                    {vehicle.location}, Bohol
                </p>
                <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-100">
                    <div>
                        <span className="text-xs font-extrabold text-primary-700 block leading-tight">
                            {formatCurrency(vehicle.price_per_day)}
                        </span>
                        <span className="text-[8px] text-slate-400 block -mt-0.5">/day</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500 capitalize">{vehicle.type}</span>
                </div>
            </div>

            {/* Specs Row — Desktop */}
            <div className="hidden sm:grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-200 my-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 justify-center">
                    <LuGauge className="w-3.5 h-3.5 text-primary-600" />
                    <span>{transmissionText}</span>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                    <LuUsers className="w-3.5 h-3.5 text-primary-600" />
                    <span>{capacityText}</span>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                    <LuWind className="w-3.5 h-3.5 text-primary-600" />
                    <span>{airconText}</span>
                </div>
            </div>

            {/* Specs Row — Mobile */}
            <div className="flex sm:hidden items-center gap-1.5 py-1 border-t border-b border-slate-200/70 my-1 text-[9px] text-slate-500 font-medium">
                <span className="truncate">{capacityText}</span>
                <span>•</span>
                <span className="truncate">{transmissionText}</span>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-1.5 sm:pt-0">
                <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="glass-btn w-full py-1.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-xs text-center block"
                >
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                </Link>
            </div>
        </div>
    );
}
