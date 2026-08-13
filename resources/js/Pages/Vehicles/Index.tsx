import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Star, Gauge, Wind, Users, CarFront, Bike, Compass, ChevronRight, SlidersHorizontal, Search
} from 'lucide-react';
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

    const applyFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key];
        router.get('/vehicles', newFilters, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search || null);
    };

    const activeType = filters.type || null;

    return (
        <PublicLayout>
            <Head>
                <title>Select a Vehicle Group — RentBohol</title>
                <meta name="description" content="Choose your Bohol rental vehicle: Sedans, 15-seater group vans, scooters, motorbikes, and 4x4 SUVs directly from local hosts." />
            </Head>

            <div className="bg-white py-12 lg:py-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                    {/* Page Header (Matching Reference Design Image) */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Select a vehicle group
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
                            Direct owner rentals across Tagbilaran, Panglao, Dauis & Loboc with zero renter commissions.
                        </p>
                    </div>

                    {/* Filter Category Tabs (Matching Reference Design Pill Bar) */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
                        {/* All Vehicles */}
                        <button
                            onClick={() => applyFilter('type', null)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                                !activeType
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <Compass className="w-4 h-4" />
                            <span>All vehicles</span>
                        </button>

                        {/* Sedan / Cars */}
                        <button
                            onClick={() => applyFilter('type', 'car')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                                activeType === 'car'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <CarFront className="w-4 h-4" />
                            <span>Sedan / Cars</span>
                        </button>

                        {/* Motorbikes & Scooters */}
                        <button
                            onClick={() => applyFilter('type', 'motorbike')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                                activeType === 'motorbike'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <Bike className="w-4 h-4" />
                            <span>Motorbikes</span>
                        </button>

                        {/* SUVs */}
                        <button
                            onClick={() => applyFilter('type', 'suv')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                                activeType === 'suv'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <CarFront className="w-4 h-4" />
                            <span>Suv (4x4)</span>
                        </button>

                        {/* Minivans */}
                        <button
                            onClick={() => applyFilter('type', 'van')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                                activeType === 'van'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Minivan (15-Seater)</span>
                        </button>
                    </div>

                    {/* Search & Location Bar */}
                    <div className="max-w-2xl mx-auto bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shadow-sm">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by vehicle name (e.g. Toyota Vios, NMAX, Urvan)..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* 3-Column Grid of Vehicle Cards (Matching Reference Layout Design) */}
                    {vehicles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
                            {vehicles.data.map((vehicle: any) => (
                                <ReferenceVehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
                            <CarFront className="w-12 h-12 text-slate-400 mx-auto" />
                            <h3 className="font-extrabold text-slate-900 text-base">No vehicles found</h3>
                            <p className="text-xs text-slate-500 font-medium">Try searching for a different model or clearing category filters.</p>
                            <button
                                onClick={() => router.get('/vehicles')}
                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700"
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
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : link.url
                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            : 'text-slate-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    )}

                    {/* Brand Logos Row (Matching Reference Image) */}
                    <div className="py-12 border-t border-b border-slate-100 flex flex-wrap items-center justify-around gap-8 opacity-70">
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">TOYOTA</span>
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">NISSAN</span>
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">HONDA</span>
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">MITSUBISHI</span>
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">YAMAHA</span>
                        <span className="font-black text-slate-800 text-lg tracking-wider uppercase">SUZUKI</span>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}

{/* Single Vehicle Card Component (Matching Reference Figma Layout) */}
function ReferenceVehicleCard({ vehicle }: { vehicle: any }) {
    const primaryPhoto = vehicle.photos?.[0];

    // Specs detection
    const isAutomatic = vehicle.title?.toLowerCase().includes('at') || vehicle.type === 'motorbike' || vehicle.type === 'car';
    const isScooter = vehicle.type === 'motorbike';
    const capacityText = isScooter ? '2 Seats' : vehicle.type === 'van' ? '15 Seats' : '5 Seats';

    return (
        <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            {/* Top Image Box */}
            <div className="aspect-[16/10] bg-white rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center p-3 border border-slate-100">
                {primaryPhoto ? (
                    <img
                        src={primaryPhoto.url}
                        alt={vehicle.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                        loading="lazy"
                    />
                ) : (
                    <CarFront className="w-16 h-16 text-slate-300" />
                )}

                {/* Rating Chip */}
                {vehicle.avg_rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-amber-400 rounded-full text-[10px] font-extrabold shadow-sm">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{Number(vehicle.avg_rating).toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Title & Price Header Row */}
            <div className="space-y-1 mb-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {vehicle.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 capitalize">
                            {vehicle.type} • {vehicle.location}, Bohol
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <span className="text-xl font-black text-indigo-600 block leading-tight">
                            {formatCurrency(vehicle.price_per_day)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block">per day</span>
                    </div>
                </div>
            </div>

            {/* Specs Row (3 Icon Chips matching reference layout) */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-200/80 my-4 text-[10px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5 justify-center">
                    <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAutomatic ? 'Automat' : 'Manual'}</span>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{capacityText}</span>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                    <Wind className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Aircon</span>
                </div>
            </div>

            {/* Bottom Action Button */}
            <Link
                href={`/vehicles/${vehicle.slug}`}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xs text-center shadow-md shadow-indigo-600/20 transition-all block"
            >
                View Details
            </Link>
        </div>
    );
}
