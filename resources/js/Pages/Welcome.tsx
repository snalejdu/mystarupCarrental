import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import {
    CarFront, PhoneCall, MapPin, Calendar, Search, ArrowRight, ShieldCheck,
    CheckCircle2, Star, Sparkles, Smartphone, Mail, Globe, Users,
    Award, Clock, ChevronRight, Heart, Navigation, Compass, Shield,
    Route, Wallet, Gauge, Wind, Headphones, Lock, Banknote, CalendarCheck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Official Apple Logo
function AppleLogo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 170 170" fill="currentColor" className={className}>
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.07-3.26-2.58-7.14-7.2-11.64-13.84-6.49-9.52-11.51-20.08-15.08-31.68-3.57-11.6-5.35-22.75-5.35-33.45 0-14.1 3.51-25.75 10.53-34.95 7.02-9.2 15.82-13.9 26.4-14.1 4.54 0 9.87 1.25 16 3.75 6.13 2.5 10.42 3.75 12.87 3.75 2.18 0 6.42-1.25 12.72-3.75 6.3-2.5 11.38-3.68 15.24-3.54 10.66.52 19.34 4.56 26.04 12.12-9.56 5.8-14.22 13.9-13.98 24.3.24 8.08 3.31 15.05 9.21 20.91 5.9 5.86 13.12 9.08 21.66 9.66-2.31 6.84-5.35 13.98-9.12 21.42zm-35.08-100.8c0-6.19 2.29-12.22 6.87-18.09 4.58-5.87 10.42-9.74 17.52-11.61.12.98.18 1.8.18 2.45 0 6.09-2.28 12.02-6.84 17.79-4.56 5.77-10.46 9.64-17.7 11.61-.06-.55-.09-1.27-.09-2.15z" />
        </svg>
    );
}

// Official 4-Color Google Play Store Logo
function GooglePlayLogo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 512 512" className={className}>
            <path fill="#41A5EE" d="M90.8 471.9c-8.9-5-14.2-14.4-14.2-24.8V64.9c0-10.4 5.3-19.8 14.2-24.8l207 215.9L90.8 471.9z" />
            <path fill="#02D7A7" d="M374.3 182.2l-76.5 73.8 76.5 73.8 100.3-56.7c15-8.5 24.2-24.3 24.2-41.6s-9.2-33.1-24.2-41.6L374.3 182.2z" />
            <path fill="#FF3A44" d="M90.8 40.1l207 215.9 76.5-73.8L129.8 16.3C116.7 8.9 101.4 17.4 90.8 40.1z" />
            <path fill="#FCA800" d="M90.8 471.9l207-215.9 76.5 73.8-244.5 165.9c-13.1 7.4-28.4-1.1-39-23.8z" />
        </svg>
    );
}

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const query: any = {};
        if (bookingType) query.type = bookingType;
        if (pickupLoc) query.location = pickupLoc;
        router.get('/vehicles', query);
    };

    return (
        <PublicLayout>
            <Head>
                <title>RentBohol — Bohol Vehicle Rental Marketplace</title>
                <meta name="description" content="Experience Bohol road like never before. Rent cars, vans, motorbikes, and SUVs directly from verified local owners in Tagbilaran, Panglao, Dauis & Loboc." />
            </Head>

            {/* HERO SECTION — Electric Purple / Indigo Theme with Transparent Fleet Background */}
            <section className="relative hero-gradient-purple text-white pt-16 pb-28 lg:pt-20 lg:pb-36 overflow-hidden">
                {/* Background Fleet Image with Transparent Blue/Purple Overlay */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(30,27,75,0.85), rgba(49,46,129,0.75), rgba(59,7,100,0.80)), url('/images/hero/car-fleet-steps.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Hero Content */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-bold text-white">
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <span>Bohol's #1 Direct Vehicle Booking Marketplace</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                                Experience the road <br className="hidden sm:inline" />
                                like never before
                            </h1>

                            <p className="text-indigo-100 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
                                Rent cars, 15-seater vans, motorbikes, and SUVs directly from verified local vehicle hosts in Tagbilaran, Panglao, Dauis, and across Bohol.
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/vehicles"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 hover:shadow-2xl transition-all flex items-center gap-2"
                                >
                                    <span>View All Vehicles</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <a
                                    href="#why-us"
                                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm border border-white/20 transition-all"
                                >
                                    How It Works
                                </a>
                            </div>
                        </div>

                        {/* Right Floating Card: "Book your vehicle" */}
                        <div className="lg:col-span-5">
                            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                                <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">
                                    Book your vehicle
                                </h3>

                                <form onSubmit={handleSearchSubmit} className="space-y-4">
                                    {/* Car Type */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Vehicle Type</label>
                                        <select
                                            value={bookingType}
                                            onChange={(e) => setBookingType(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        >
                                            <option value="">All Vehicle Types (Car, Van, Scooter)</option>
                                            {vehicleTypes.map((t) => (
                                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Pickup Location */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Pickup Location</label>
                                        <select
                                            value={pickupLoc}
                                            onChange={(e) => setPickupLoc(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        >
                                            <option value="">Select Pickup City/Town (e.g. Tagbilaran)</option>
                                            {locations.map((loc) => (
                                                <option key={loc} value={loc}>{loc}, Bohol</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Return Location */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Return Location</label>
                                        <select
                                            value={returnLoc}
                                            onChange={(e) => setReturnLoc(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        >
                                            <option value="">Same as Pickup Location</option>
                                            {locations.map((loc) => (
                                                <option key={loc} value={loc}>{loc}, Bohol</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dates Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Pickup Date</label>
                                            <input
                                                type="date"
                                                value={pickupDate}
                                                onChange={(e) => setPickupDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Return Date</label>
                                            <input
                                                type="date"
                                                value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                min={pickupDate || new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all mt-2"
                                    >
                                        Search Available Vehicles
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 Key Benefits Section with Lucide Icons */}
            <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Availability (Lucide Route) */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-slate-200 text-center transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-indigo-100">
                            <Route className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-900 mb-4">
                            Availability
                        </h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
                            Explore 15+ Bohol municipalities from Tagbilaran Airport to Panglao beaches & Chocolate Hills.
                        </p>
                    </div>

                    {/* Card 2: Comfort & Quality (Lucide CarFront) */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-slate-200 text-center transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-indigo-100">
                            <CarFront className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-900 mb-4">
                            Comfort & Quality
                        </h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
                            Pick clean sedans, 15-seater group vans, scooters, and 4x4 SUVs maintained by top local hosts.
                        </p>
                    </div>

                    {/* Card 3: Savings & Privacy (Lucide Wallet) */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-slate-200 text-center transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-indigo-100">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-900 mb-4">
                            Savings & Privacy
                        </h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
                            Direct owner pricing with zero renter fees and encrypted hidden contact security until acceptance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="why-us" className="py-24 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Image Spotlight */}
                        <div className="lg:col-span-6">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="/images/demo/vios.png"
                                    alt="Drive in Bohol"
                                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-8">
                                    <div className="text-white">
                                        <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Tagbilaran City • Panglao Island</p>
                                        <p className="text-xl font-black">Direct Owner Booking System</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Numbered List */}
                        <div className="lg:col-span-6 space-y-8">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                Why RentBohol is the best choice for your trip
                            </h2>

                            <div className="space-y-4 pt-2">
                                {/* Item 1: Lucide Lock */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">Direct Owner Booking & Hidden Contact Privacy</h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            No account required for renters. Your contact number is encrypted and hidden from owners until they accept your request.
                                        </p>
                                    </div>
                                </div>

                                {/* Item 2: Lucide Banknote */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                        <Banknote className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">Transparent Daily Pricing & Zero Renter Fees</h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Vehicles are listed for free. The platform only takes a low 4% owner commission upon completed rentals.
                                        </p>
                                    </div>
                                </div>

                                {/* Item 3: Lucide CalendarCheck */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                        <CalendarCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">Real-time Availability Calendar</h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            No more double bookings or lost Facebook messages. Calendar dates are auto-blocked upon acceptance.
                                        </p>
                                    </div>
                                </div>

                                {/* Item 4: Lucide Award */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">Verified Star Ratings & Reviews</h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Read authentic feedback from past renters and owners to choose the most reliable vehicle.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VEHICLE SHOWCASE GRID SECTION */}
            <section className="py-24 lg:py-32 bg-white border-t border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">Bohol Rental Fleet</span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                Choose the vehicle that suits you
                            </h2>
                        </div>

                        <Link
                            href="/vehicles"
                            className="inline-flex items-center gap-2 text-sm font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors group"
                        >
                            <span>View All Vehicles ({stats.total_vehicles})</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* 6 Vehicle Showcase Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredVehicles.map((v) => (
                            <div key={v.id} className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                                {/* Photo Container */}
                                <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
                                    {v.photos?.[0] ? (
                                        <img
                                            src={v.photos[0].url}
                                            alt={v.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-900 text-white flex items-center justify-center">
                                            <CarFront className="w-12 h-12 opacity-30" />
                                        </div>
                                    )}

                                    {/* Type Pill */}
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                                        {v.type}
                                    </span>

                                    {/* Rating */}
                                    {v.avg_rating > 0 && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-xs font-bold">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span>{Number(v.avg_rating).toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="p-8 flex-1 flex flex-col justify-between space-y-5">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold mb-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            <span>{v.location}, Bohol</span>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {v.title}
                                        </h3>
                                    </div>

                                    {/* Specs Icons Row (Lucide Gauge, Users, Wind) */}
                                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>Automatic</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>{v.type === 'van' ? '15 Seats' : v.type === 'motorbike' ? '2 Seats' : '5 Seats'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Wind className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>Cold AC</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div>
                                            <span className="text-2xl font-black text-indigo-600">{formatCurrency(v.price_per_day)}</span>
                                            <span className="text-xs text-slate-500 font-medium"> / day</span>
                                        </div>

                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:shadow-lg"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* "How RentBohol Works in 3 Easy Steps" PROCESS SECTION */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
                {/* Background Fleet Image (Option 3) with Transparent Blue/Purple Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero/car-fleet-steps.png"
                        alt="Bohol Vehicle Fleet Steps"
                        className="w-full h-full object-cover opacity-25 mix-blend-overlay scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/85 via-indigo-900/75 to-purple-950/80" />
                </div>

                {/* Background Glow Overlay */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                        <span className="px-3.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-bold border border-indigo-500/30 uppercase tracking-wider inline-flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Direct & Simple Booking
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            How RentBohol Works in 3 Easy Steps
                        </h2>
                        <p className="text-indigo-200/80 text-xs sm:text-sm font-medium leading-relaxed">
                            From Tagbilaran Airport to Panglao beaches — direct rental booking made effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Step 1 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 hover:bg-white/10 transition-all duration-300 relative group backdrop-blur-md">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-indigo-600/30">
                                <CarFront className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">Step 01</span>
                                <h3 className="font-bold text-lg text-white">Choose Your Vehicle</h3>
                                <p className="text-xs text-indigo-100/80 leading-relaxed font-normal">
                                    Select clean sedans, 15-seater group vans, scooters, or 4x4 SUVs directly listed by verified local Boholano hosts.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 hover:bg-white/10 transition-all duration-300 relative group backdrop-blur-md">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-emerald-600/30">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">Step 02</span>
                                <h3 className="font-bold text-white text-lg">Submit Date Request</h3>
                                <p className="text-xs text-indigo-100/80 leading-relaxed font-normal">
                                    Pick your trip dates and pickup location. Renter phone numbers stay encrypted and private until the host accepts.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 hover:bg-white/10 transition-all duration-300 relative group backdrop-blur-md">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-amber-500/30">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">Step 03</span>
                                <h3 className="font-bold text-white text-lg">Direct Host Contact</h3>
                                <p className="text-xs text-indigo-100/80 leading-relaxed font-normal">
                                    Once accepted, phone details unlock instantly for 1-tap calls and easy Bohol airport or pier pickup coordination.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* "Facts In Numbers" STAT BANNER (Restored) */}
            <section className="py-14 lg:py-16 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                    <div className="space-y-1.5">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Facts In Numbers
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                            Trusted by local vehicle hosts and thousands of tourists exploring Bohol Island.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-500/30">
                                <CarFront className="w-5 h-5" />
                            </div>
                            <p className="font-black text-2xl sm:text-3xl text-white">{stats.total_vehicles}+</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Vehicles Listed</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                                <Users className="w-5 h-5" />
                            </div>
                            <p className="font-black text-2xl sm:text-3xl text-white">200+</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Happy Renters</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <p className="font-black text-2xl sm:text-3xl text-white">{stats.locations_count}+</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Bohol Locations</p>
                        </div>

                        {/* Stat 4 */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-500/30">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            </div>
                            <p className="font-black text-2xl sm:text-3xl text-white">{stats.avg_rating} / 5</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile App Section (Matching Reference Image) */}
            <section className="py-24 lg:py-32 bg-white border-t border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Side: Title + Description + Store Buttons */}
                        <div className="lg:col-span-6 space-y-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                Download <br className="hidden sm:inline" />
                                mobile app
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md font-medium">
                                Rent vehicles on the go with our easy-to-use mobile application. Instant booking notifications, unlocked owner contact details, and Bohol calendar management straight from your phone.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-3">
                                {/* Official Apple App Store Badge Image */}
                                <a
                                    href="#"
                                    className="inline-block rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
                                >
                                    <img
                                        src="/images/badges/app-store.svg"
                                        alt="Download on the App Store"
                                        className="h-12 sm:h-14 w-auto object-contain"
                                    />
                                </a>

                                {/* Official Google Play Store Badge Image */}
                                <a
                                    href="#"
                                    className="inline-block rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
                                >
                                    <img
                                        src="/images/badges/google-play.svg"
                                        alt="Get it on Google Play"
                                        className="h-12 sm:h-14 w-auto object-contain"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Right Side: High Quality Mobile App Mockup Image (Blue Option 3) */}
                        <div className="lg:col-span-6 flex justify-center items-center py-6">
                            <div className="relative max-w-lg w-full">
                                <img
                                    src="/images/mobile-app-mockup.png"
                                    alt="RentBohol Mobile App"
                                    className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Banner */}
            <section className="py-20 lg:py-24 bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black mb-2">
                                Enjoy every mile with adorable companionship.
                            </h2>
                            <p className="text-indigo-100 text-sm max-w-xl">
                                Join hundreds of travelers booking direct vehicles in Tagbilaran, Panglao, Dauis & Loboc.
                            </p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to RentBohol updates!'); }} className="w-full lg:w-auto flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-5 py-3.5 rounded-2xl bg-white text-slate-900 text-sm focus:outline-none w-full sm:w-72 shadow-inner"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-sm rounded-2xl shadow-md shrink-0 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
