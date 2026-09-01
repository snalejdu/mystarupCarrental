import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    CarFront, MapPin, Calendar, Search, ArrowRight, ShieldCheck,
    Star, Users, Award, Lock, Banknote, CalendarCheck,
    Gauge, Wind, Bike, Compass, User, PhoneCall, MessageSquare, Camera,
    ChevronDown, HelpCircle, Fuel, Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import BlurText from '@/Components/BlurText';
import ShinyText from '@/Components/ShinyText';
import CountUp from '@/Components/CountUp';
import AnimatedContent from '@/Components/AnimatedContent';
import SpotlightCard from '@/Components/SpotlightCard';
import AuroraBackground from '@/Components/AuroraBackground';
import GlassIcons, { GlassIconsItem } from '@/Components/GlassIcons';
import AccordionGallery, { AccordionGalleryItem } from '@/Components/AccordionGallery';
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

const TOURIST_SPOTS = [
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

const SPONSOR_LOGOS = [
    { name: 'Toyota Philippines', src: '/images/sponsors/toyota.svg' },
    { name: 'Honda Philippines', src: '/images/sponsors/honda.svg' },
    { name: 'Yamaha Motor', src: '/images/sponsors/yamaha.svg' },
    { name: 'Mitsubishi Motors', src: '/images/sponsors/mitsubishi.svg' },
    { name: 'Bohol Tourism Board', src: '/images/sponsors/bohol_tourism.svg' },
    { name: 'Panglao Island Tourism', src: '/images/sponsors/panglao_tourism.svg' },
];

export default function Welcome({ featuredVehicles, stats, locations, vehicleTypes }: Props) {
    const [bookingType, setBookingType] = useState('');
    const [pickupLoc, setPickupLoc] = useState('');
    const [returnLoc, setReturnLoc] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const [spotIndex, setSpotIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startAutoRotate = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSpotIndex((prev) => (prev + 1) % TOURIST_SPOTS.length);
        }, 5000);
    }, []);

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

    // Filtered vehicles client-side with memoization
    const displayedVehicles = useMemo(() => {
        return activeFilter
            ? featuredVehicles.filter(v => v.type?.toLowerCase() === activeFilter.toLowerCase())
            : featuredVehicles;
    }, [featuredVehicles, activeFilter]);

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
                            {/* Live Island Marketplace Micro-Status */}
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <span className="font-bold text-slate-800">Verified Bohol Host Network</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-teal-700 font-medium">Direct Island Rentals</span>
                            </div>

                            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                                <BlurText text="Rent Vehicles Direct From Bohol Hosts" delay={65} className="font-bold text-slate-900" />
                                <br />
                                <span className="text-accent-500">For Your Island Trip</span>
                            </h1>

                            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                                Experience total freedom across Tagbilaran, Panglao, Dauis, and Loboc. Reserve clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly from verified Boholano vehicle owners.
                            </p>

                            {/* CTA Row */}
                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <a
                                    href="#booking-form"
                                    className="glass-btn px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 group cursor-pointer"
                                >
                                    <ShinyText speed={3} className="text-white font-semibold">Book Your Vehicle Now</ShinyText>
                                    <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            {/* ReactBits Live Animated Marketplace Stats Row */}
                            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
                                <div className="space-y-0.5">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                                        <CountUp to={stats.total_vehicles || 24} duration={2} />+
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Vehicles Listed</p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-primary-700 font-heading">
                                        <CountUp to={stats.total_owners || 14} duration={2.2} />+
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verified Hosts</p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-accent-500 font-heading">
                                        <CountUp to={stats.locations_count || 6} duration={2.5} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bohol Towns</p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading flex items-center gap-1">
                                        <CountUp to={stats.avg_rating || 4.9} decimals={1} duration={1.8} />
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 inline shrink-0" />
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Host Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column — 3-Second Auto-Rotating Bohol Tourist Destinations Photo Frame */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative z-10 aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">

                                {/* Main Active Image with Smooth Fade — Click to advance & reset timer */}
                                {TOURIST_SPOTS.map((spot, idx) => (
                                    <img
                                        key={spot.title}
                                        src={spot.image}
                                        alt={spot.title}
                                        loading="lazy"
                                        decoding="async"
                                        onClick={() => goToSlide((spotIndex + 1) % TOURIST_SPOTS.length)}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out cursor-pointer ${
                                            idx === spotIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                                        }`}
                                    />
                                ))}

                                {/* Bottom Overlay Caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent z-10 flex items-end p-6 pointer-events-none">
                                    <div className="text-white space-y-1 w-full pointer-events-auto">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-400 uppercase tracking-wider bg-accent-500/20 px-2.5 py-0.5 rounded-md border border-accent-500/30">
                                                <MapPin className="w-3 h-3" /> {TOURIST_SPOTS[spotIndex].location}
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-300">
                                                {spotIndex + 1} / {TOURIST_SPOTS.length}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white tracking-tight">
                                            {TOURIST_SPOTS[spotIndex].title}
                                        </h3>
                                        <p className="text-xs text-slate-300 font-medium line-clamp-1">
                                            {TOURIST_SPOTS[spotIndex].description}
                                        </p>

                                        {/* Progress Dot Indicators */}
                                        <div className="flex items-center gap-1.5 pt-2">
                                            {TOURIST_SPOTS.map((_, i) => (
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
                                {TOURIST_SPOTS.map((s, i) => (
                                    <button
                                        key={s.title}
                                        onClick={() => goToSlide(i)}
                                        className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                                            i === spotIndex ? 'border-primary-500 ring-2 ring-primary-300 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
                            <span className="text-xs font-semibold text-emerald-700 hidden sm:inline-flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Zero Renter Fees</span>
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
                                    className="glass-btn w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
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

                        {/* 3D Glassmorphic Interactive Category Icons */}
                        <div className="py-2">
                            <GlassIcons
                                items={[
                                    {
                                        icon: <Compass className="w-6 h-6" />,
                                        color: 'teal',
                                        label: 'All Vehicles',
                                        customClass: !activeFilter ? 'is-active' : '',
                                        onClick: () => setActiveFilter(null),
                                    },
                                    {
                                        icon: <CarFront className="w-6 h-6" />,
                                        color: 'blue',
                                        label: 'Sedans / Cars',
                                        customClass: activeFilter === 'car' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('car'),
                                    },
                                    {
                                        icon: <Bike className="w-6 h-6" />,
                                        color: 'coral',
                                        label: 'Motorbikes',
                                        customClass: activeFilter === 'motorbike' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('motorbike'),
                                    },
                                    {
                                        icon: <CarFront className="w-6 h-6" />,
                                        color: 'green',
                                        label: 'SUV (4x4)',
                                        customClass: activeFilter === 'suv' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('suv'),
                                    },
                                    {
                                        icon: <Users className="w-6 h-6" />,
                                        color: 'purple',
                                        label: 'Minivans',
                                        customClass: activeFilter === 'van' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('van'),
                                    },
                                ]}
                                className="icon-btns-flex"
                            />
                        </div>

                        {/* Filter Category Pills Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
                            <button
                                onClick={() => setActiveFilter(null)}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                                    !activeFilter
                                        ? 'glass-pill-active'
                                        : 'glass-pill text-slate-700'
                                }`}
                            >
                                All Vehicles
                            </button>

                            <button
                                onClick={() => setActiveFilter('car')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                                    activeFilter === 'car'
                                        ? 'glass-pill-active'
                                        : 'glass-pill text-slate-700'
                                }`}
                            >
                                Sedans / Cars
                            </button>

                            <button
                                onClick={() => setActiveFilter('motorbike')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                                    activeFilter === 'motorbike'
                                        ? 'glass-pill-active'
                                        : 'glass-pill text-slate-700'
                                }`}
                            >
                                Motorbikes & Scooters
                            </button>

                            <button
                                onClick={() => setActiveFilter('suv')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                                    activeFilter === 'suv'
                                        ? 'glass-pill-active'
                                        : 'glass-pill text-slate-700'
                                }`}
                            >
                                SUV (4x4)
                            </button>

                            <button
                                onClick={() => setActiveFilter('van')}
                                className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                                    activeFilter === 'van'
                                        ? 'glass-pill-active'
                                        : 'glass-pill text-slate-700'
                                }`}
                            >
                                Minivan (15-Seater)
                            </button>
                        </div>
                    </div>

                    {/* 3-Column Vehicle Cards Grid (Matching Reference Layout Cards with Soft Tinted Card Container) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {displayedVehicles.map((v, index) => {
                            const hostName = v.owner?.name || 'Verified Host';
                            const primaryPhoto = v.photos?.[0]?.url;

                            return (
                                <AnimatedContent key={v.id} delay={index * 80} direction="up" distance={20}>
                                    <SpotlightCard
                                        spotlightColor="rgba(13, 148, 136, 0.15)"
                                        className="bg-[#f0f4f8] rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group cursor-pointer h-full"
                                    >
                                        {/* Top Inner Image Box */}
                                        <div className="bg-slate-100 rounded-2xl aspect-[16/10] overflow-hidden relative border border-slate-100 mb-4">
                                            {/* Top-Left Brand / Type Badge */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 text-white rounded-md text-[10px] font-bold uppercase tracking-wider z-10 shadow-xs">
                                                <CarFront className="w-3 h-3 text-primary-400" />
                                                <span>{v.brand || v.type}</span>
                                            </div>

                                            {/* Vehicle Image */}
                                            {primaryPhoto ? (
                                                <img
                                                    src={primaryPhoto}
                                                    alt={v.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    style={{
                                                        objectPosition: `${v.photos?.[0]?.position_x ?? 50}% ${v.photos?.[0]?.position_y ?? 50}%`,
                                                    }}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                    <CarFront className="w-12 h-12 stroke-[1.2]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle Content */}
                                        <div>
                                            <h3 className="font-heading text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-primary-700 transition-colors">
                                                {v.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{v.location}, Bohol</span>
                                            </div>
                                        </div>

                                        {/* Specs Pills Row */}
                                        <div className="flex flex-wrap items-center gap-2 py-3.5 border-y border-slate-200/70 my-3 text-xs text-slate-600 font-semibold">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{v.seats || 5} Seats</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="capitalize">{v.transmission || 'Auto'}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Fuel className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="capitalize">{v.fuel_type || 'Gasoline'}</span>
                                            </div>
                                        </div>

                                        {/* Bottom Host & Pricing Row */}
                                        <div className="flex items-center justify-between gap-2 pt-1">
                                            {/* Host Info */}
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 border border-primary-200">
                                                    {hostName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{hostName}</p>
                                                    <p className="text-[10px] text-slate-500 font-semibold leading-tight">Vehicle Host</p>
                                                </div>
                                            </div>

                                            {/* Middle Star Rating Circular Badge */}
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
                                                className="glass-btn w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </SpotlightCard>
                                </AnimatedContent>
                            );
                        })}
                    </div>

                    {/* View All Link */}
                    <div className="text-center pt-4">
                        <Link
                            href="/vehicles"
                            className="glass-btn inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-xs"
                        >
                            <span>Browse All {stats.total_vehicles} Vehicles</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* WHY CHOOSE US SECTION — WIDE BEZEL-LESS ACCORDION GALLERY SHOWCASE */}
            <section id="why-us" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                            Island Fleet & Destinations
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Why RentBohol is the Best Choice for Your Trip
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                            Explore iconic Bohol destinations with direct, verified vehicle owners. Hover or tap across the interactive panels below.
                        </p>
                    </div>

                    {/* Wide Bezel-Less Accordion Gallery Display */}
                    <div className="w-full relative">
                        <AccordionGallery
                            items={[
                                { image: '/images/destinations/chocolate_hills.jpg', label: 'Chocolate Hills — Carmen', link: '/vehicles', alt: 'Chocolate Hills Carmen Bohol' },
                                { image: '/images/destinations/panglao_beach.jpg', label: 'Panglao White Beach', link: '/vehicles', alt: 'Panglao Island Beach' },
                                { image: '/images/demo/vios.png', label: 'Sedan Fleet — Toyota Vios', link: '/vehicles', alt: 'Toyota Vios Bohol Rental' },
                                { image: '/images/destinations/tarsier_sanctuary.jpg', label: 'Tarsier Sanctuary — Corella', link: '/vehicles', alt: 'Corella Tarsier Sanctuary' },
                                { image: '/images/destinations/loboc_river.jpg', label: 'Loboc River Cruise', link: '/vehicles', alt: 'Loboc River Bohol' },
                            ]}
                            defaultIndex={0}
                            expandRatio={0.52}
                            trigger="hover"
                            accentColor="#14b8a6"
                            overlayColor="#090d16"
                            textColor="#ffffff"
                            height={480}
                            gap={10}
                            radius={18}
                            tilt={6}
                            parallax={0.45}
                            grayscale={false}
                            showLabels={true}
                            bezelLess={true}
                        />
                    </div>

                    {/* 4 Feature Pillars Grid (Underneath Wide Gallery) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
                        {[
                            {
                                icon: <Lock className="w-5 h-5 text-white" />,
                                title: 'Direct Owner Booking',
                                desc: 'Encrypted contact privacy. No renter account required to inquire.'
                            },
                            {
                                icon: <Banknote className="w-5 h-5 text-white" />,
                                title: 'Zero Renter Commission',
                                desc: 'Transparent daily rates direct from Bohol hosts with zero surprise fees.'
                            },
                            {
                                icon: <CalendarCheck className="w-5 h-5 text-white" />,
                                title: 'Real-Time Availability',
                                desc: 'Instant calendar blockouts prevent double bookings and lost chats.'
                            },
                            {
                                icon: <Award className="w-5 h-5 text-white" />,
                                title: 'Verified Local Hosts',
                                desc: 'Authentic community reviews and direct handover support across Bohol.'
                            }
                        ].map((feature, i) => (
                            <AnimatedContent key={i} delay={i * 80} direction="up" distance={15}>
                                <SpotlightCard
                                    spotlightColor="rgba(13, 148, 136, 0.12)"
                                    className="h-full flex flex-col p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300/60 transition-all duration-300"
                                >
                                    {/* 3D Dual-Layer Squircle Glass Icon Badge (React Bits Design) */}
                                    <div className="glass-3d-badge mb-3.5">
                                        <span className="glass-3d-badge__back" aria-hidden="true" />
                                        <span className="glass-3d-badge__front" aria-hidden="true">
                                            {feature.icon}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-base">{feature.title}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </SpotlightCard>
                            </AnimatedContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION — 3 STEPS (Enhanced Dark Glass Section) */}
            <section className="py-20 lg:py-28 bg-slate-950 text-white relative overflow-hidden">
                {/* Ambient Soft Glow Background Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                            HOW IT WORKS
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            How RentBohol Works in 3 Easy Steps
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            From Tagbilaran Airport to Panglao beaches — direct rental booking made effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Step 01 */}
                        <AnimatedContent delay={0} direction="up" distance={20} className="h-full">
                            <SpotlightCard
                                spotlightColor="rgba(13, 148, 136, 0.22)"
                                className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 sm:p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="glass-3d-badge">
                                            <span className="glass-3d-badge__back" aria-hidden="true" />
                                            <span className="glass-3d-badge__front" aria-hidden="true">
                                                <CarFront className="w-5 h-5 text-white" />
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary-500/10 text-primary-300 border border-primary-500/25">
                                            Step 01
                                        </span>
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-teal-300 transition-colors">
                                            Choose Your Vehicle
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Select clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly listed by verified local Boholano hosts.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-teal-400">
                                    <span>Browse fleet models</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </SpotlightCard>
                        </AnimatedContent>

                        {/* Step 02 */}
                        <AnimatedContent delay={120} direction="up" distance={20} className="h-full">
                            <SpotlightCard
                                spotlightColor="rgba(16, 185, 129, 0.22)"
                                className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="glass-3d-badge glass-3d-badge--emerald">
                                            <span className="glass-3d-badge__back" aria-hidden="true" />
                                            <span className="glass-3d-badge__front" aria-hidden="true">
                                                <CalendarCheck className="w-5 h-5 text-white" />
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                                            Step 02
                                        </span>
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                                            Submit Date Request
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Pick your trip dates and pickup location. Renter phone numbers stay encrypted and private until the host accepts.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-emerald-400">
                                    <span>Instant date lock</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </SpotlightCard>
                        </AnimatedContent>

                        {/* Step 03 */}
                        <AnimatedContent delay={240} direction="up" distance={20} className="h-full">
                            <SpotlightCard
                                spotlightColor="rgba(245, 158, 11, 0.22)"
                                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="glass-3d-badge glass-3d-badge--amber">
                                            <span className="glass-3d-badge__back" aria-hidden="true" />
                                            <span className="glass-3d-badge__front" aria-hidden="true">
                                                <ShieldCheck className="w-5 h-5 text-white" />
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/25">
                                            Step 03
                                        </span>
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-amber-300 transition-colors">
                                            Direct Host Contact
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Once accepted, phone details unlock instantly for 1-tap calls and easy Bohol airport or pier pickup coordination.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-amber-400">
                                    <span>1-Tap direct host link</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </SpotlightCard>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* OFFICIAL PARTNERS & FEATURED FLEET SPONSORS — INFINITE HORIZONTAL MARQUEE */}
            <section className="py-14 bg-slate-50 border-t border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        OFFICIAL FLEET BRANDS & BOHOL TOURISM PARTNERS
                    </p>
                </div>

                {/* Infinite Horizontal Running Marquee Track */}
                <div className="relative w-full overflow-hidden flex">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-10 sm:gap-14 md:gap-16 animate-marquee items-center">
                        {[...SPONSOR_LOGOS, ...SPONSOR_LOGOS, ...SPONSOR_LOGOS, ...SPONSOR_LOGOS].map((brand, i) => (
                            <div
                                key={`${brand.name}-${i}`}
                                className="px-8 py-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 h-18 min-w-[220px] hover:border-teal-400 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <img src={brand.src} alt={brand.name} className="h-9 w-auto object-contain" loading="lazy" decoding="async" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOHOL TRAVELER FAQ SECTION */}
            <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/90 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-10 relative z-10">
                    <div className="text-center space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                            FREQUENTLY ASKED QUESTIONS
                        </p>
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Frequently Asked Questions by Bohol Travelers
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
                            Everything you need to know about renting a car, scooter, or van directly in Bohol.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <details className="group p-6 bg-white/80 hover:bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-base sm:text-lg flex items-center justify-between list-none gap-4">
                                <span className="flex items-center gap-3.5">
                                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <HelpCircle className="w-4 h-4" />
                                    </span>
                                    <span>Can foreign tourists drive in Bohol with their home country license?</span>
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed pl-12.5 space-y-2 border-t border-slate-100 pt-3">
                                <p>
                                    Yes! Under Philippine LTO regulations, tourists visiting the Philippines are legally permitted to drive with any valid foreign driver's license for up to <span className="font-bold text-slate-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-teal-800">90 days</span> from their arrival date.
                                </p>
                                <p className="text-xs text-slate-500">
                                    If your license is not written in English, bringing an official translation or an International Driving Permit (IDP) alongside your original passport is recommended.
                                </p>
                            </div>
                        </details>

                        <details className="group p-6 bg-white/80 hover:bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-base sm:text-lg flex items-center justify-between list-none gap-4">
                                <span className="flex items-center gap-3.5">
                                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                    <span>Can the vehicle be delivered to Panglao International Airport (TAG) or Tagbilaran Port?</span>
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed pl-12.5 space-y-2 border-t border-slate-100 pt-3">
                                <p>
                                    Yes! Many of our verified Boholano hosts offer free or low-cost direct airport and seaport delivery.
                                </p>
                                <p className="text-xs text-slate-500">
                                    You can select your pickup preference (Panglao Airport, Tagbilaran Seaport, or custom resort) directly in the booking form. Your host will coordinate timing and meet you right outside arrivals with the vehicle keys.
                                </p>
                            </div>
                        </details>

                        <details className="group p-6 bg-white/80 hover:bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-base sm:text-lg flex items-center justify-between list-none gap-4">
                                <span className="flex items-center gap-3.5">
                                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <ShieldCheck className="w-4 h-4" />
                                    </span>
                                    <span>Are helmets required for motorcycle and scooter rentals?</span>
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed pl-12.5 space-y-2 border-t border-slate-100 pt-3">
                                <p>
                                    Yes. Philippine law strictly mandates DOT/ICC-certified helmets for both the driver and passenger on all public roads and coastal highways across Bohol.
                                </p>
                                <p className="text-xs text-slate-500">
                                    All scooter and motorcycle rentals on RentBohol include <span className="font-semibold text-slate-800">2 sanitized helmets</span> provided by the host at no extra charge.
                                </p>
                            </div>
                        </details>

                        <details className="group p-6 bg-white/80 hover:bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-base sm:text-lg flex items-center justify-between list-none gap-4">
                                <span className="flex items-center gap-3.5">
                                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <Banknote className="w-4 h-4" />
                                    </span>
                                    <span>How does the security deposit work?</span>
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed pl-12.5 space-y-2 border-t border-slate-100 pt-3">
                                <p>
                                    The refundable security deposit (typically ₱1,000–₱3,000 depending on vehicle category) is held directly upon handover.
                                </p>
                                <p className="text-xs text-slate-500">
                                    It is returned immediately and in full when you return the vehicle in good condition with the same fuel level. No hidden processing deductions.
                                </p>
                            </div>
                        </details>
                    </div>

                    {/* Quick Help Card */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 text-base">Have another question about exploring Bohol?</h4>
                            <p className="text-xs sm:text-sm text-slate-500">Our local island concierge team in Tagbilaran is ready to assist you.</p>
                        </div>
                        <Link
                            href="/contact"
                            className="glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contact Support</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* "INTERESTED IN RENTING?" FLOATING CTA CARD */}
            <section className="py-12 lg:py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-2xl border border-teal-500/30">
                        {/* Atmospheric Soft Glow Orbs */}
                        <div className="absolute -top-24 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="space-y-3 text-center lg:text-left max-w-2xl">
                                <p className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                                    START YOUR JOURNEY
                                </p>
                                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                    Interested In Renting Or Listing A Vehicle?
                                </h2>
                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                    Don't hesitate to send us a direct message or call our Tagbilaran concierge team 24/7.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
                                <Link
                                    href="/contact"
                                    className="glass-btn-outline px-7 py-4 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 hover:border-teal-400/60 transition-all"
                                >
                                    <MessageSquare className="w-4 h-4 text-teal-400" />
                                    <span>Send Us A Message</span>
                                </Link>

                                <a
                                    href="#booking-form"
                                    className="glass-btn-accent px-8 py-4 rounded-2xl font-semibold text-sm flex items-center gap-2 group cursor-pointer shadow-lg hover:shadow-teal-500/30 transition-all"
                                >
                                    <ShinyText speed={2.5} className="text-white font-semibold">Rent Now</ShinyText>
                                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
