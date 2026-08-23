import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    CarFront, MapPin, Calendar, Search, ArrowRight, ShieldCheck,
    Star, Users, Award, Lock, Banknote, CalendarCheck,
    Gauge, Wind, Bike, Compass, User, PhoneCall, MessageSquare, Camera,
    ChevronDown, HelpCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
    featuredVehicles: any[];
    stats: {
        total_vehicles: number;
        total_owners: number;
        locations_count: number;
        avg_rating: number;
    };
    locations: string[];
    vehicleTypes: string[];
}

export default function Welcome({ featuredVehicles, stats, locations, vehicleTypes }: Props) {
    const [bookingType, setBookingType] = useState('');
    const [pickupLoc, setPickupLoc] = useState('');
    const [returnLoc, setReturnLoc] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Bohol Tourist Destinations Slideshow (Auto-rotates every 3 seconds)
    const touristSpots = [
        {
            title: "Chocolate Hills",
            location: "Carmen, Bohol",
            description: "Over 1,260 iconic chocolate-brown conical hills",
            image: "/images/destinations/chocolate_hills.jpg",
        },
        {
            title: "Alona Beach & Panglao",
            location: "Panglao Island",
            description: "White sand beaches & crystal clear diving waters",
            image: "/images/destinations/panglao_beach.jpg",
        },
        {
            title: "Loboc River Cruise",
            location: "Loboc, Bohol",
            description: "Emerald green river buffet cruise under jungle canopy",
            image: "/images/destinations/loboc_river.jpg",
        },
        {
            title: "Abatan River Kayaking",
            location: "Cortes, Bohol",
            description: "Sunset mangrove kayaking & night firefly tours",
            image: "/images/destinations/abatan_river.jpg",
        },
        {
            title: "Tarsier Sanctuary",
            location: "Corella, Bohol",
            description: "Natural habitat of the world's smallest primate",
            image: "/images/destinations/tarsier_sanctuary.jpg",
        },
    ];

    const sponsorLogos = [
        { name: 'Toyota Philippines', src: '/images/sponsors/toyota.svg' },
        { name: 'Honda Philippines', src: '/images/sponsors/honda.svg' },
        { name: 'Yamaha Motor', src: '/images/sponsors/yamaha.svg' },
        { name: 'Mitsubishi Motors', src: '/images/sponsors/mitsubishi.svg' },
        { name: 'Bohol Tourism Board', src: '/images/sponsors/bohol_tourism.svg' },
        { name: 'Panglao Island Tourism', src: '/images/sponsors/panglao_tourism.svg' },
    ];

    const [spotIndex, setSpotIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startAutoRotate = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSpotIndex((prev) => (prev + 1) % touristSpots.length);
        }, 5000);
    }, [touristSpots.length]);

    useEffect(() => {
        startAutoRotate();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [startAutoRotate]);

    // Change slide and reset the 5s auto-rotate timer
    const goToSlide = useCallback((index: number) => {
        setSpotIndex(index);
        startAutoRotate();
    }, [startAutoRotate]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const query: any = {};
        if (bookingType) query.type = bookingType;
        if (pickupLoc) query.location = pickupLoc;
        router.get('/vehicles', query);
    };

    // Filtered vehicles client-side for quick tab switching
    const displayedVehicles = activeFilter
        ? featuredVehicles.filter(v => v.type?.toLowerCase() === activeFilter.toLowerCase())
        : featuredVehicles;

    return (
        <PublicLayout>
            <Head>
                <title>RentBohol — Bohol Vehicle Rental Marketplace</title>
                <meta name="description" content="Experience Bohol road like never before. Rent cars, vans, motorbikes, and SUVs directly from verified local owners in Tagbilaran, Panglao, Dauis & Loboc." />
            </Head>

            {/* HERO SECTION — Split Layout (Left: Copy & CTA, Right: Hero Car Bleed Image) */}
            <section className="bg-white py-12 lg:py-20 border-b border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                        {/* Left Hero Column */}
                        <div className="lg:col-span-7 space-y-6">

                            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                                Rent Vehicles <br />
                                <span className="text-accent-500">Direct From Bohol Hosts</span> <br />
                                For Your Island Trip
                            </h1>

                            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                                Experience total freedom across Tagbilaran, Panglao, Dauis, and Loboc. Reserve clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly from verified Boholano vehicle owners.
                            </p>

                            {/* CTA Row with Circular Vehicle Type Quick Selector Toggle (Matching Reference Design) */}
                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <a
                                    href="#booking-form"
                                    className="px-8 py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md shadow-primary-700/25 hover:shadow-lg hover:shadow-primary-700/30 active:scale-98"
                                >
                                    <span>Book Your Vehicle Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </a>

                                {/* Quick Vehicle Type Toggle Badges (Matching Reference Image Pill Toggle) */}
                                <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-full border border-slate-200">
                                    <button
                                        onClick={() => setActiveFilter(activeFilter === 'car' ? null : 'car')}
                                        title="Quick filter: Sedans"
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                            activeFilter === 'car'
                                                ? 'bg-accent-500 text-white shadow-xs'
                                                : 'bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <CarFront className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter(activeFilter === 'motorbike' ? null : 'motorbike')}
                                        title="Quick filter: Motorbikes & Scooters"
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                            activeFilter === 'motorbike'
                                                ? 'bg-accent-500 text-white shadow-xs'
                                                : 'bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Bike className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column — 3-Second Auto-Rotating Bohol Tourist Destinations Photo Frame */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative z-10 aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">

                                {/* Main Active Image with Smooth Fade — Click to advance & reset timer */}
                                {touristSpots.map((spot, idx) => (
                                    <img
                                        key={spot.title}
                                        src={spot.image}
                                        alt={spot.title}
                                        onClick={() => goToSlide((spotIndex + 1) % touristSpots.length)}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out cursor-pointer ${
                                            idx === spotIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                                        }`}
                                    />
                                ))}



                                {/* Bottom Overlay Caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent z-10 flex items-end p-6">
                                    <div className="text-white space-y-1 w-full">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-400 uppercase tracking-wider bg-accent-500/20 px-2.5 py-0.5 rounded-md border border-accent-500/30">
                                                <MapPin className="w-3 h-3" /> {touristSpots[spotIndex].location}
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-300">
                                                {spotIndex + 1} / {touristSpots.length}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white tracking-tight">
                                            {touristSpots[spotIndex].title}
                                        </h3>
                                        <p className="text-xs text-slate-300 font-medium line-clamp-1">
                                            {touristSpots[spotIndex].description}
                                        </p>

                                        {/* Progress Dot Indicators */}
                                        <div className="flex items-center gap-1.5 pt-2">
                                            {touristSpots.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => goToSlide(i)}
                                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                        i === spotIndex ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Destination Thumbnail Quick Selector Bar Below Frame */}
                            <div className="grid grid-cols-5 gap-2 mt-3">
                                {touristSpots.map((s, i) => (
                                    <button
                                        key={s.title}
                                        onClick={() => goToSlide(i)}
                                        className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                                            i === spotIndex ? 'border-primary-500 ring-2 ring-primary-300 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SEARCH / BOOKING FORM SECTION (Preserved Below Hero as a Stronger UX Pattern) */}
            <section id="booking-form" className="py-8 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Search Available Vehicles in Bohol
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">Instant direct owner requests — zero renter commissions</p>
                            </div>
                            <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100 hidden sm:inline-block">
                                100% Free Booking
                            </span>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Car Type */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Vehicle Type</label>
                                <select
                                    value={bookingType}
                                    onChange={(e) => setBookingType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors"
                                >
                                    <option value="">All Vehicle Types</option>
                                    {vehicleTypes.map((t) => (
                                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pickup Location */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pickup Location</label>
                                <select
                                    value={pickupLoc}
                                    onChange={(e) => setPickupLoc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors"
                                >
                                    <option value="">Pickup Municipality</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}, Bohol</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pickup Date */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pickup Date</label>
                                <input
                                    type="date"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white"
                                />
                            </div>

                            {/* Return Date */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Return Date</label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={pickupDate || new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-end sm:col-span-2 lg:col-span-1">
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Find Vehicle</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* VEHICLE GRID SECTION — Matching Reference Layout Pattern */}
            <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-10">

                    {/* Section Header (Centered Display Title matching Reference Image) */}
                    <div className="text-center space-y-3">
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                            Our Popular Vehicle Collection
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-medium">
                            Rent directly from verified Boholano owners with zero renter fees and real host contact unlocking.
                        </p>

                        {/* Filter Category Pills Bar (Matching Reference Image Pill Row) */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-4">
                            <button
                                onClick={() => setActiveFilter(null)}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    !activeFilter
                                        ? 'bg-accent-500 text-white shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                All Vehicles
                            </button>

                            <button
                                onClick={() => setActiveFilter('car')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    activeFilter === 'car'
                                        ? 'bg-accent-500 text-white shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Sedans / Cars
                            </button>

                            <button
                                onClick={() => setActiveFilter('motorbike')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    activeFilter === 'motorbike'
                                        ? 'bg-accent-500 text-white shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Motorbikes & Scooters
                            </button>

                            <button
                                onClick={() => setActiveFilter('suv')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    activeFilter === 'suv'
                                        ? 'bg-accent-500 text-white shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                SUV (4x4)
                            </button>

                            <button
                                onClick={() => setActiveFilter('van')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    activeFilter === 'van'
                                        ? 'bg-accent-500 text-white shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                Minivan (15-Seater)
                            </button>
                        </div>
                    </div>

                    {/* 3-Column Vehicle Cards Grid (Matching Reference Layout Cards with Soft Tinted Card Container) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {displayedVehicles.map((v) => {
                            const hostName = v.owner?.name || 'Verified Host';
                            const primaryPhoto = v.photos?.[0]?.url;

                            return (
                                <div
                                    key={v.id}
                                    className="bg-[#f0f4f8] rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Top Inner Image Box */}
                                    <div className="bg-slate-100 rounded-xl aspect-[16/10] overflow-hidden relative border border-slate-100 mb-4">
                                        {/* Top-Left Brand / Type Badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 text-white rounded-md text-[10px] font-bold uppercase tracking-wider z-10">
                                            <CarFront className="w-3 h-3 text-primary-400" />
                                            <span>{v.brand || v.type}</span>
                                        </div>

                                        {/* Vehicle Image */}
                                        {primaryPhoto ? (
                                            <img
                                                src={primaryPhoto}
                                                alt={v.title}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    objectPosition: `${v.photos?.[0]?.position_x ?? 50}% ${v.photos?.[0]?.position_y ?? 50}%`,
                                                }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <CarFront className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Vehicle Title & Location Header */}
                                    <div className="space-y-1 mb-4">
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
                                            {v.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-primary-700 shrink-0" />
                                            <span>{v.location}, Bohol</span>
                                        </p>
                                    </div>

                                    {/* Specifications Strip */}
                                    <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 mb-4">
                                        <div className="flex items-center gap-1 justify-center">
                                            <Gauge className="w-3.5 h-3.5 text-primary-700" />
                                            <span>{v.transmission ? (v.transmission.charAt(0).toUpperCase() + v.transmission.slice(1)) : 'Automatic'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 justify-center">
                                            <Users className="w-3.5 h-3.5 text-primary-700" />
                                            <span>{v.seats ? `${v.seats} Seats` : (v.type === 'van' ? '15 Seats' : v.type === 'motorbike' ? '2 Seats' : '5 Seats')}</span>
                                        </div>
                                        <div className="flex items-center gap-1 justify-center">
                                            <Wind className="w-3.5 h-3.5 text-primary-700" />
                                            <span>{v.has_aircon === false ? 'Non-Aircon' : 'Aircon'}</span>
                                        </div>
                                    </div>

                                    {/* Bottom Footer Row (Matching Reference Layout: Host Info Left, Star Rating Center Badge, Price Right) */}
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        {/* Bottom-Left Host Info */}
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-primary-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                {hostName[0]?.toUpperCase() || 'H'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{hostName}</p>
                                                <p className="text-[10px] text-slate-500 font-semibold leading-tight">Vehicle Host</p>
                                            </div>
                                        </div>

                                        {/* Middle Star Rating Circular Badge (Replaces Reference Circular Discount Badge) */}
                                        <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs shrink-0">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            <span>{v.avg_rating > 0 ? Number(v.avg_rating).toFixed(1) : 'New'}</span>
                                        </div>

                                        {/* Bottom-Right Price Tag */}
                                        <div className="text-right shrink-0">
                                            <span className="text-base sm:text-lg font-bold text-primary-700 block leading-tight">
                                                {formatCurrency(v.price_per_day)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold block">per day</span>
                                        </div>
                                    </div>

                                    {/* View Details Action Link */}
                                    <div className="pt-4">
                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="w-full py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* View All Link */}
                    <div className="text-center pt-4">
                        <Link
                            href="/vehicles"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-primary-700/20 hover:shadow-lg"
                        >
                            <span>Browse All {stats.total_vehicles} Vehicles</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section id="why-us" className="py-20 lg:py-28 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Image */}
                        <div className="lg:col-span-6">
                            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                <img
                                    src="/images/demo/vios.png"
                                    alt="Drive in Bohol"
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-8">
                                    <div className="text-white">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-300">Tagbilaran City • Panglao Island</p>
                                        <p className="text-lg font-bold">Direct Owner Booking System</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Feature List */}
                        <div className="lg:col-span-6 space-y-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                                Why RentBohol is the best choice for your trip
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary-700 text-white flex items-center justify-center shrink-0">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Direct Owner Booking & Hidden Contact Privacy</h4>
                                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                                            No account required for renters. Your contact number is encrypted and hidden from owners until they accept your request.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary-700 text-white flex items-center justify-center shrink-0">
                                        <Banknote className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Transparent Daily Pricing & Zero Renter Fees</h4>
                                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                                            Vehicles are listed for free. The platform only takes a low 4% owner commission upon completed rentals.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary-700 text-white flex items-center justify-center shrink-0">
                                        <CalendarCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Real-time Availability Calendar</h4>
                                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                                            No more double bookings or lost Facebook messages. Calendar dates are auto-blocked upon acceptance.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary-700 text-white flex items-center justify-center shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Verified Star Ratings & Reviews</h4>
                                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                                            Read authentic feedback from past renters and owners to choose the most reliable vehicle.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION — 3 STEPS */}
            <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                            How RentBohol Works in 3 Easy Steps
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            From Tagbilaran Airport to Panglao beaches — direct rental booking made effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-700 text-white flex items-center justify-center">
                                <CarFront className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary-400 block">Step 01</span>
                                <h3 className="font-semibold text-lg text-white">Choose Your Vehicle</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Select clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly listed by verified local Boholano hosts.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">Step 02</span>
                                <h3 className="font-semibold text-white text-lg">Submit Date Request</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Pick your trip dates and pickup location. Renter phone numbers stay encrypted and private until the host accepts.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">Step 03</span>
                                <h3 className="font-semibold text-white text-lg">Direct Host Contact</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Once accepted, phone details unlock instantly for 1-tap calls and easy Bohol airport or pier pickup coordination.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OFFICIAL PARTNERS & FEATURED FLEET SPONSORS — INFINITE HORIZONTAL MARQUEE */}
            <section className="py-12 bg-slate-50 border-t border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        OFFICIAL FLEET BRANDS & BOHOL TOURISM PARTNERS
                    </p>
                </div>

                {/* Infinite Horizontal Running Marquee Track */}
                <div className="relative w-full overflow-hidden flex">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-12 sm:gap-16 md:gap-20 animate-marquee items-center">
                        {[...sponsorLogos, ...sponsorLogos, ...sponsorLogos, ...sponsorLogos].map((brand, i) => (
                            <div
                                key={`${brand.name}-${i}`}
                                className="px-8 py-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 h-16 min-w-[210px] hover:border-slate-300 transition-all cursor-pointer"
                            >
                                <img src={brand.src} alt={brand.name} className="h-9 w-auto object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOHOL TRAVELER FAQ SECTION */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-700 block">HELPFUL ISLAND TIPS</span>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Frequently Asked Questions by Bohol Travelers
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                            Everything you need to know about renting a car, scooter, or van in Bohol.
                        </p>
                    </div>

                    <div className="space-y-3.5">
                        <details className="group p-5 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer transition-all hover:border-slate-300">
                            <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between list-none">
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle className="w-4 h-4 text-primary-700 shrink-0" />
                                    <span>Can foreign tourists drive in Bohol with their home country license?</span>
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed pl-6">
                                Yes! Under Philippine LTO regulations, tourists visiting the Philippines are legally permitted to drive with any valid foreign driver's license for up to <b>90 days</b> from their arrival date. If your license is not in English, an official translation or International Driving Permit (IDP) is recommended.
                            </p>
                        </details>

                        <details className="group p-5 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer transition-all hover:border-slate-300">
                            <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between list-none">
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle className="w-4 h-4 text-primary-700 shrink-0" />
                                    <span>Can the vehicle be delivered to Panglao International Airport (TAG) or Tagbilaran Port?</span>
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed pl-6">
                                Yes! Many of our verified hosts offer free or low-cost airport and seaport drop-off. You can select your pickup preference right in the vehicle booking form, and your host will meet you outside the arrivals area with your keys.
                            </p>
                        </details>

                        <details className="group p-5 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer transition-all hover:border-slate-300">
                            <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between list-none">
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle className="w-4 h-4 text-primary-700 shrink-0" />
                                    <span>Are helmets required for motorcycle and scooter rentals?</span>
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed pl-6">
                                Yes. Philippine law strictly mandates DOT-certified helmets for both the driver and passenger on all public roads and coastal highways in Bohol. All scooter and motorcycle rentals on RentBohol include <b>2 sanitized helmets</b> at no extra cost.
                            </p>
                        </details>

                        <details className="group p-5 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer transition-all hover:border-slate-300">
                            <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between list-none">
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle className="w-4 h-4 text-primary-700 shrink-0" />
                                    <span>How does the security deposit work?</span>
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed pl-6">
                                The refundable security deposit (typically ₱1,000–₱3,000 depending on the vehicle) is held in cash upon vehicle handover and returned to you immediately when you return the vehicle in good condition with the same fuel level.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* "INTERESTED IN RENTING?" CTA SECTION (Restyled to Teal/Slate Brand Palette) */}
            <section className="py-16 bg-primary-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent-400 block">RENT YOUR CAR IN BOHOL</span>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Interested In Renting Or Listing A Vehicle?
                        </h2>
                        <p className="text-slate-300 text-sm max-w-xl">
                            Don't hesitate to send us a direct message or call our Tagbilaran support team 24/7.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
                        <Link
                            href="/contact"
                            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 border border-white/20 backdrop-blur-xs"
                        >
                            <MessageSquare className="w-4 h-4 text-accent-400" />
                            <span>Send Us A Message</span>
                        </Link>

                        <a
                            href="#booking-form"
                            className="px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
                        >
                            <span>Rent Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
