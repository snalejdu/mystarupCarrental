import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    CarProfile, MapPin, Calendar, MagnifyingGlass, ArrowRight, ShieldCheck, Star, Users, Medal, LockSimple, Money, CalendarCheck, Gauge, Wind, Motorcycle, Van, Compass, User, PhoneCall, ChatCircle, Camera, CaretDown, Question, GasPump } from '@phosphor-icons/react';
import { formatCurrency } from '@/lib/utils';
import BlurText from '@/Components/BlurText';
import ShinyText from '@/Components/ShinyText';
import AnimatedContent from '@/Components/AnimatedContent';
import SpotlightCard from '@/Components/SpotlightCard';
import AuroraBackground from '@/Components/AuroraBackground';
import GlassIcons, { GlassIconsItem } from '@/Components/GlassIcons';
import AccordionGallery, { AccordionGalleryItem } from '@/Components/AccordionGallery';
interface Props {
    featuredVehicles: any[];
    stats: {
        total_vehicles: number;
        total_owners?: number;
        locations_count?: number;
        avg_rating?: number;
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
        if (pickupDate) query.pickup_date = pickupDate;
        if (returnDate) query.return_date = returnDate;
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
            <section className="bg-white py-6 sm:py-12 lg:py-20 border-b border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                        {/* Left Hero Column */}
                        <div className="lg:col-span-7 space-y-3 sm:space-y-6">
                            {/* Live Island Marketplace Micro-Status */}
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-700">
                                <span className="font-bold text-slate-800">Verified Bohol Host Network</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-teal-700 font-medium">Direct Island Rentals</span>
                            </div>

                            <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                                <BlurText text="Rent Vehicles Direct From Bohol Hosts" delay={65} className="font-bold text-slate-900" />
                                <br />
                                <span className="text-accent-500">For Your Island Trip</span>
                            </h1>

                            <p className="text-slate-600 text-sm sm:text-lg max-w-xl leading-relaxed">
                                Experience total freedom across Tagbilaran, Panglao, Dauis, and Loboc. Reserve clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly from verified Boholano vehicle owners.
                            </p>

                            {/* CTA Row */}
                            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                                <a
                                    href="#booking-form"
                                    className="glass-btn px-6 sm:px-8 min-h-[48px] py-3 sm:py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 group cursor-pointer"
                                >
                                    <ShinyText speed={3} className="text-white font-semibold">Book Your Vehicle Now</ShinyText>
                                    <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            {/* Authentic Bohol Island Guarantees */}
                            <div className="pt-3 sm:pt-6 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-slate-600 font-medium border-t border-slate-100">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Verified Boholano Hosts</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Panglao & Tagbilaran Delivery</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <CalendarCheck className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Zero Platform Booking Fees</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column — 3-Second Auto-Rotating Bohol Tourist Destinations Photo Frame */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative z-10 aspect-[16/9] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">

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
                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-2 sm:mt-3">
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
            <section id="booking-form" className="py-4 sm:py-8 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-3 sm:mb-6 pb-2.5 sm:pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm sm:text-lg font-bold text-slate-900">
                                    Search Available Vehicles in Bohol
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">Instant direct owner requests — zero renter commissions</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 hidden sm:inline-flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Zero Renter Fees</span>
                            </span>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                            {/* Car Type */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Vehicle Type</label>
                                <select
                                    value={bookingType}
                                    onChange={(e) => setBookingType(e.target.value)}
                                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors font-medium"
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
                                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors font-medium"
                                >
                                    <option value="">Municipality</option>
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
                                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white font-medium"
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
                                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white font-medium"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-end sm:col-span-2 lg:col-span-1 pt-1 sm:pt-0">
                                <button
                                    type="submit"
                                    className="glass-btn w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <MagnifyingGlass className="w-4 h-4" />
                                    <span>Find Vehicle</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* VEHICLE GRID SECTION — Matching Reference Layout Pattern */}
            <section className="py-10 sm:py-16 lg:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-6 sm:space-y-10">

                    {/* Section Header (Centered Display Title matching Reference Image) */}
                    <div className="text-center space-y-2 sm:space-y-3">
                        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                            Our Popular Vehicle Collection
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-base max-w-lg mx-auto font-medium">
                            Rent directly from verified Boholano owners with zero renter fees and real host contact unlocking.
                        </p>

                        {/* 3D Glassmorphic Interactive Category Icons */}
                        <div className="w-full overflow-visible py-3 sm:py-5">
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
                                        icon: <CarProfile className="w-6 h-6" />,
                                        color: 'blue',
                                        label: 'Sedans / Cars',
                                        customClass: activeFilter === 'car' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('car'),
                                    },
                                    {
                                        icon: <Motorcycle className="w-6 h-6" />,
                                        color: 'coral',
                                        label: 'Motorbikes',
                                        customClass: activeFilter === 'motorbike' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('motorbike'),
                                    },
                                    {
                                        icon: <CarProfile className="w-6 h-6" />,
                                        color: 'green',
                                        label: 'SUV (4x4)',
                                        customClass: activeFilter === 'suv' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('suv'),
                                    },
                                    {
                                        icon: <Van className="w-6 h-6" />,
                                        color: 'purple',
                                        label: 'Minivans',
                                        customClass: activeFilter === 'van' ? 'is-active' : '',
                                        onClick: () => setActiveFilter('van'),
                                    },
                                ]}
                                className="icon-btns-flex"
                            />
                        </div>
                    </div>

                    {/* 3-Column Vehicle Cards Grid (1-Col on Phone, 2-Col on Tablet, 3-Col on Desktop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {displayedVehicles.map((v, index) => {
                            const hostName = v.owner?.name || 'Verified Host';
                            const primaryPhoto = v.photos?.[0]?.url;

                            return (
                                <AnimatedContent key={v.id} delay={index * 80} direction="up" distance={20}>
                                    <SpotlightCard
                                        spotlightColor="rgba(13, 148, 136, 0.15)"
                                        className="bg-[#f0f4f8] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group cursor-pointer h-full"
                                    >
                                        {/* Top Inner Image Box */}
                                        <div className="bg-slate-100 rounded-xl sm:rounded-2xl aspect-[16/10] overflow-hidden relative border border-slate-100 mb-3 sm:mb-4">
                                            {/* Top-Left Brand / Type Badge */}
                                            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-slate-900/90 text-white rounded-md text-xs font-bold uppercase tracking-wider z-10 shadow-xs">
                                                <CarProfile className="w-3 h-3 text-primary-400" />
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
                                                    <CarProfile className="w-12 h-12 stroke-[1.2]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle Content */}
                                        <div>
                                            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                                                {v.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1 truncate">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{v.location}, Bohol</span>
                                            </div>
                                        </div>

                                        {/* Specs Row — Unified for All Screen Sizes */}
                                        <div className="flex flex-wrap items-center gap-2 py-2.5 sm:py-3.5 border-y border-slate-200/70 my-2.5 sm:my-3 text-xs text-slate-600 font-semibold">
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
                                                <GasPump className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="capitalize">{v.fuel_type || 'Gasoline'}</span>
                                            </div>
                                        </div>

                                        {/* Host & Pricing Row */}
                                        <div className="flex items-center justify-between gap-2 pt-1">
                                            {/* Host Info */}
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 border border-primary-200">
                                                    {hostName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{hostName}</p>
                                                    <p className="text-xs text-slate-500 font-semibold leading-tight">Host</p>
                                                </div>
                                            </div>

                                            {/* Rating Badge */}
                                            <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs shrink-0">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span>{v.avg_rating > 0 ? Number(v.avg_rating).toFixed(1) : 'New'}</span>
                                            </div>

                                            {/* Price Tag */}
                                            <div className="text-right shrink-0">
                                                <span className="text-base sm:text-lg font-bold text-primary-700 block leading-tight">
                                                    {formatCurrency(v.price_per_day)}
                                                </span>
                                                <span className="text-xs text-slate-400 font-semibold block">per day</span>
                                            </div>
                                        </div>

                                        {/* View Details Action Link (Min 44px touch target) */}
                                        <div className="pt-3 sm:pt-4">
                                            <Link
                                                href={`/vehicles/${v.slug}`}
                                                className="glass-btn w-full min-h-[44px] py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5"
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
            <section id="why-us" className="py-10 sm:py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 space-y-2 sm:space-y-3">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Why RentBohol is the Best Choice for Your Trip
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                            Explore iconic Bohol destinations with direct, verified vehicle owners.
                        </p>
                    </div>

                    {/* Desktop: Wide Bezel-Less Accordion Gallery Showcase */}
                    <div className="hidden md:block w-full relative">
                        <AccordionGallery
                            items={[
                                { image: '/images/destinations/chocolate_hills.jpg', label: 'Chocolate Hills — Carmen', link: '/vehicles', alt: 'Chocolate Hills Carmen Bohol' },
                                { image: '/images/destinations/panglao_beach.jpg', label: 'Panglao White Beach', link: '/vehicles', alt: 'Panglao Island Beach' },
                                { image: '/images/destinations/abatan_river.jpg', label: 'Abatan River — Firefly Tour', link: '/vehicles', alt: 'Abatan River Bohol' },
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

                    {/* Mobile: Compact, Comfortable Horizontal Destination Carousel (Takes only ~190px vs 550px stacked) */}
                    <div className="block md:hidden w-full -mx-4 px-4">
                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-1 px-1 no-scrollbar">
                            {[
                                { image: '/images/destinations/chocolate_hills.jpg', label: 'Chocolate Hills — Carmen', tag: 'Famous Landmark' },
                                { image: '/images/destinations/panglao_beach.jpg', label: 'Panglao White Beach', tag: 'Beach & Diving' },
                                { image: '/images/destinations/abatan_river.jpg', label: 'Abatan River Fireflies', tag: 'Night Cruise' },
                                { image: '/images/destinations/tarsier_sanctuary.jpg', label: 'Tarsier Sanctuary', tag: 'Eco Wildlife' },
                                { image: '/images/destinations/loboc_river.jpg', label: 'Loboc River Cruise', tag: 'River Dining' },
                            ].map((spot, idx) => (
                                <Link
                                    key={idx}
                                    href="/vehicles"
                                    className="snap-start shrink-0 w-[220px] h-[170px] rounded-2xl relative overflow-hidden shadow-xs border border-slate-200/90 active:scale-[0.98] transition-transform block"
                                >
                                    <img
                                        src={spot.image}
                                        alt={spot.label}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-teal-600/90 text-white text-xs font-bold tracking-wide shadow-xs">
                                        {spot.tag}
                                    </span>
                                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                        <div className="flex items-center gap-1 text-white font-bold text-xs truncate">
                                            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                            <span className="truncate">{spot.label}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-400 font-medium">
                            <span>← Swipe to explore Bohol destinations →</span>
                        </div>
                    </div>

                    {/* 4 Feature Pillars Grid (2x2 on Mobile, 4-Cols on Desktop) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 mt-6 sm:mt-12">
                        {[
                            {
                                icon: <LockSimple className="w-5 h-5 text-white" />,
                                title: 'Direct Owner Booking',
                                desc: 'Encrypted contact privacy. No renter account required to inquire.'
                            },
                            {
                                icon: <Money className="w-5 h-5 text-white" />,
                                title: 'Zero Renter Commission',
                                desc: 'Transparent daily rates direct from Bohol hosts with zero surprise fees.'
                            },
                            {
                                icon: <CalendarCheck className="w-5 h-5 text-white" />,
                                title: 'Real-Time Availability',
                                desc: 'Instant calendar blockouts prevent double bookings and lost chats.'
                            },
                            {
                                icon: <Medal className="w-5 h-5 text-white" />,
                                title: 'Verified Local Hosts',
                                desc: 'Authentic community reviews and direct handover support across Bohol.'
                            }
                        ].map((feature, i) => (
                            <AnimatedContent key={i} delay={i * 80} direction="up" distance={15}>
                                <SpotlightCard
                                    spotlightColor="rgba(13, 148, 136, 0.12)"
                                    className="h-full flex flex-col p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300/60 transition-all duration-300"
                                >
                                    {/* 3D Dual-Layer Squircle Glass Icon Badge (React Bits Design) */}
                                    <div className="glass-3d-badge mb-2 sm:mb-3.5">
                                        <span className="glass-3d-badge__back" aria-hidden="true" />
                                        <span className="glass-3d-badge__front" aria-hidden="true">
                                            {feature.icon}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-base leading-snug">{feature.title}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                                        {feature.desc}
                                    </p>
                                </SpotlightCard>
                            </AnimatedContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION — 3 STEPS (Enhanced Dark Glass Section) */}
            <section className="py-8 sm:py-20 lg:py-28 bg-slate-950 text-white relative overflow-hidden">
                {/* Ambient Soft Glow Background Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-14 space-y-1 sm:space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                            HOW IT WORKS
                        </p>
                        <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug">
                            How RentBohol Works in 3 Easy Steps
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
                            From Tagbilaran Airport to Panglao beaches — direct rental booking made effortless.
                        </p>
                    </div>

                    {/* MOBILE ONLY: Sleek Vertical Step Cards (< md) */}
                    <div className="md:hidden space-y-2.5">
                        {[
                            {
                                step: '01',
                                title: 'Choose Your Vehicle',
                                desc: 'Browse clean sedans, 15-seat vans, or scooters listed by local Bohol hosts.',
                                link: '/vehicles',
                                action: 'Browse fleet models',
                                icon: <CarProfile className="w-4 h-4 text-teal-300" />,
                                badgeBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
                                glowColor: 'border-slate-800/80 hover:border-teal-500/50',
                                isAnchor: false,
                            },
                            {
                                step: '02',
                                title: 'Submit Date Request',
                                desc: 'Pick trip dates and pickup spot. Contact details stay private until host accepts.',
                                link: '#booking-form',
                                action: 'Instant date lock',
                                icon: <CalendarCheck className="w-4 h-4 text-emerald-300" />,
                                badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
                                glowColor: 'border-slate-800/80 hover:border-emerald-500/50',
                                isAnchor: true,
                            },
                            {
                                step: '03',
                                title: 'Direct Host Contact',
                                desc: 'Once accepted, phone details unlock for 1-tap calls and easy Bohol pier/airport handover.',
                                link: '/contact',
                                action: 'Direct host link',
                                icon: <ShieldCheck className="w-4 h-4 text-amber-300" />,
                                badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
                                glowColor: 'border-slate-800/80 hover:border-amber-500/50',
                                isAnchor: false,
                            },
                        ].map((item) => {
                            const CardBody = (
                                <div className={`relative group p-3.5 rounded-xl bg-slate-900/90 border ${item.glowColor} transition-all duration-300 flex items-center gap-3.5 shadow-md active:scale-[0.99]`}>
                                    {/* Numbered Icon Badge */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${item.badgeBg}`}>
                                            {item.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-extrabold font-mono tracking-wider uppercase text-teal-400">
                                                STEP {item.step}
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors leading-tight mt-0.5">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );

                            return item.isAnchor ? (
                                <a
                                    key={item.step}
                                    href={item.link}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById('booking-form');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="block cursor-pointer"
                                >
                                    {CardBody}
                                </a>
                            ) : (
                                <Link key={item.step} href={item.link} className="block cursor-pointer">
                                    {CardBody}
                                </Link>
                            );
                        })}
                    </div>

                    {/* DESKTOP ONLY: 3-Column Spotlight Grid (md: and above, 100% Untouched) */}
                    <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Step 01 */}
                        <AnimatedContent delay={0} direction="up" distance={20} className="h-full">
                            <Link href="/vehicles" className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-2xl">
                                <SpotlightCard
                                    spotlightColor="rgba(13, 148, 136, 0.22)"
                                    className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="glass-3d-badge">
                                                <span className="glass-3d-badge__back" aria-hidden="true" />
                                                <span className="glass-3d-badge__front" aria-hidden="true">
                                                    <CarProfile className="w-5 h-5 text-white" />
                                                </span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary-500/10 text-primary-300 border border-primary-500/25">
                                                Step 01
                                            </span>
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-teal-300 transition-colors">
                                                Choose Your Vehicle
                                            </h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                Select clean sedans, 15-seater group vans, scooters, or 4×4 SUVs directly listed by verified local Boholano hosts.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300 transition-colors">
                                        <span>Browse fleet models</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </SpotlightCard>
                            </Link>
                        </AnimatedContent>

                        {/* Step 02 */}
                        <AnimatedContent delay={120} direction="up" distance={20} className="h-full">
                            <a
                                href="#booking-form"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.getElementById('booking-form');
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
                            >
                                <SpotlightCard
                                    spotlightColor="rgba(16, 185, 129, 0.22)"
                                    className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="glass-3d-badge glass-3d-badge--emerald">
                                                <span className="glass-3d-badge__back" aria-hidden="true" />
                                                <span className="glass-3d-badge__front" aria-hidden="true">
                                                    <CalendarCheck className="w-5 h-5 text-white" />
                                                </span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
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
                                    <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                        <span>Instant date lock</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </SpotlightCard>
                            </a>
                        </AnimatedContent>

                        {/* Step 03 */}
                        <AnimatedContent delay={240} direction="up" distance={20} className="h-full">
                            <Link href="/contact" className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-2xl">
                                <SpotlightCard
                                    spotlightColor="rgba(245, 158, 11, 0.22)"
                                    className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-7 shadow-lg h-full text-left transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="glass-3d-badge glass-3d-badge--amber">
                                                <span className="glass-3d-badge__back" aria-hidden="true" />
                                                <span className="glass-3d-badge__front" aria-hidden="true">
                                                    <ShieldCheck className="w-5 h-5 text-white" />
                                                </span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/25">
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
                                    <div className="pt-4 mt-6 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                                        <span>1-Tap direct host link</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </SpotlightCard>
                            </Link>
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
            <section className="py-6 sm:py-20 lg:py-28 bg-slate-50 border-t border-slate-200/90 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-4 sm:space-y-10 relative z-10">
                    <div className="text-center space-y-1 sm:space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                            FREQUENTLY ASKED QUESTIONS
                        </p>
                        <h2 className="font-heading text-lg sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
                            Everything you need to know about renting a car, scooter, or van directly in Bohol.
                        </p>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                        <details className="group p-2.5 sm:p-6 bg-white/80 hover:bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-xs sm:text-lg flex items-center justify-between list-none gap-2 sm:gap-4">
                                <span className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                                    <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <Question className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                    <span className="leading-snug text-xs sm:text-lg font-semibold text-slate-800">Can foreign tourists drive in Bohol with home license?</span>
                                </span>
                                <CaretDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed pl-8 sm:pl-12.5 space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-2 sm:pt-3">
                                <p>
                                    Yes! Under Philippine LTO regulations, tourists visiting the Philippines are legally permitted to drive with any valid foreign driver's license for up to <span className="font-bold text-slate-900 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-teal-800">90 days</span> from their arrival date.
                                </p>
                                <p className="text-xs text-slate-500">
                                    If your license is not written in English, bringing an official translation or an International Driving Permit (IDP) alongside your original passport is recommended.
                                </p>
                            </div>
                        </details>

                        <details className="group p-2.5 sm:p-6 bg-white/80 hover:bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-xs sm:text-lg flex items-center justify-between list-none gap-2 sm:gap-4">
                                <span className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                                    <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                    <span className="leading-snug text-xs sm:text-lg font-semibold text-slate-800">Can the vehicle be delivered to Panglao Airport or Tagbilaran Port?</span>
                                </span>
                                <CaretDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed pl-8 sm:pl-12.5 space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-2 sm:pt-3">
                                <p>
                                    Yes! Many of our verified Boholano hosts offer free or low-cost direct airport and seaport delivery.
                                </p>
                                <p className="text-xs text-slate-500">
                                    You can select your pickup preference (Panglao Airport, Tagbilaran Seaport, or custom resort) directly in the booking form. Your host will coordinate timing and meet you right outside arrivals with the vehicle keys.
                                </p>
                            </div>
                        </details>

                        <details className="group p-2.5 sm:p-6 bg-white/80 hover:bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-xs sm:text-lg flex items-center justify-between list-none gap-2 sm:gap-4">
                                <span className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                                    <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                    <span className="leading-snug text-xs sm:text-lg font-semibold text-slate-800">Are helmets required for motorcycle and scooter rentals?</span>
                                </span>
                                <CaretDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed pl-8 sm:pl-12.5 space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-2.5 sm:pt-3">
                                <p>
                                    Yes. Philippine law strictly mandates DOT/ICC-certified helmets for both the driver and passenger on all public roads and coastal highways across Bohol.
                                </p>
                                <p className="text-xs text-slate-500">
                                    All scooter and motorcycle rentals on RentBohol include <span className="font-semibold text-slate-800">2 sanitized helmets</span> provided by the host at no extra charge.
                                </p>
                            </div>
                        </details>

                        <details className="group p-2.5 sm:p-6 bg-white/80 hover:bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer open:bg-white open:border-teal-500/50 open:shadow-md">
                            <summary className="font-bold text-slate-900 text-xs sm:text-lg flex items-center justify-between list-none gap-2 sm:gap-4">
                                <span className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                                    <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-open:bg-teal-600 group-open:text-white transition-colors">
                                        <Money className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                    <span className="leading-snug text-xs sm:text-lg font-semibold text-slate-800">How does the security deposit work?</span>
                                </span>
                                <CaretDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 group-open:rotate-180 group-open:text-teal-600 transition-transform shrink-0" />
                            </summary>
                            <div className="text-slate-600 mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed pl-8 sm:pl-12.5 space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-2 sm:pt-3">
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
                    <div className="p-3 sm:p-6 rounded-xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-row items-center justify-between gap-2.5 text-left">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-base truncate sm:whitespace-normal">Have another question?</h4>
                            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 sm:line-clamp-none">Our local concierge team in Tagbilaran is ready to assist you.</p>
                        </div>
                        <Link
                            href="/contact"
                            className="glass-btn min-h-[44px] px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
                        >
                            <ChatCircle className="w-4 h-4" />
                            <span>Contact Support</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* "INTERESTED IN RENTING?" FLOATING CTA CARD */}
            <section className="py-4 sm:py-12 lg:py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-3xl p-4 sm:p-12 lg:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-xl border border-teal-500/30">
                        {/* Atmospheric Soft Glow Orbs */}
                        <div className="absolute -top-24 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-3.5 sm:gap-8">
                            <div className="space-y-1 sm:space-y-3 text-center lg:text-left max-w-2xl">
                                <p className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                                    START YOUR JOURNEY
                                </p>
                                <h2 className="font-heading text-lg sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug">
                                    Interested In Renting Or Listing A Vehicle?
                                </h2>
                                <p className="text-slate-300 text-xs sm:text-base leading-snug">
                                    Don't hesitate to send us a direct message or call our Tagbilaran concierge team 24/7.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-4 shrink-0 w-full sm:w-auto">
                                <Link
                                    href="/contact"
                                    className="glass-btn-outline min-h-[48px] px-3 sm:px-7 py-3 sm:py-4 text-white rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:border-teal-400/60 transition-all text-center whitespace-nowrap"
                                >
                                    <ChatCircle className="w-4 h-4 text-teal-400 shrink-0" />
                                    <span>Message Us</span>
                                </Link>

                                <a
                                    href="#booking-form"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById('booking-form');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="glass-btn-accent min-h-[48px] px-3 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 group cursor-pointer shadow-lg hover:shadow-teal-500/30 transition-all text-center whitespace-nowrap"
                                >
                                    <ShinyText speed={2.5} className="text-white font-semibold">Rent Now</ShinyText>
                                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </PublicLayout>
    );
}
