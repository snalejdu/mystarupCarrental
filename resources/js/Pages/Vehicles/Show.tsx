import { Head, useForm, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Star, Calendar, ChevronLeft, ChevronRight, Phone, User, Mail, Send,
    CarFront, Wind, ShieldCheck, Users, Sparkles, CircleCheckBig, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Props {
    vehicle: any;
    availability: { date: string; status: string }[];
    ratings: any[];
    otherVehicles?: any[];
}

export default function VehicleShow({ vehicle, availability, ratings, otherVehicles = [] }: Props) {
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const scrollToBooking = () => {
        const formElement = document.getElementById('booking-form-card');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${vehicle.title} — Rent in ${vehicle.location}, Bohol | RentBohol`}</title>
                <meta name="description" content={`Rent ${vehicle.title} in ${vehicle.location}, Bohol for ${formatCurrency(vehicle.price_per_day)}/day. Unlimited mileage & local owner booking.`} />
            </Head>

            {/* Main Page Container — compact padding fitting viewport height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-12">
                
                {/* Back to Vehicles Navigation */}
                <div>
                    <Link
                        href="/vehicles"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to all vehicles</span>
                    </Link>
                </div>

                {/* Top Section: Vehicle Hero Header + Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT COLUMN: Vehicle Title, Price & Photo Showcase */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Title & Price Header */}
                        <div className="flex flex-wrap items-baseline justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-100">
                                    {vehicle.type}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-4 h-4 text-indigo-600" /> {vehicle.location}, Bohol Island
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
                                    {formatCurrency(vehicle.price_per_day)}
                                </div>
                                <span className="text-xs font-semibold text-slate-500">/ day</span>
                            </div>
                        </div>

                        {/* Main Photo Viewer */}
                        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg relative group">
                            <div className="aspect-[16/10] relative bg-slate-100">
                                {vehicle.photos && vehicle.photos.length > 0 ? (
                                    <>
                                        <img
                                            src={vehicle.photos[currentPhoto]?.url}
                                            alt={vehicle.photos[currentPhoto]?.alt_text || vehicle.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {vehicle.photos.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => p > 0 ? p - 1 : vehicle.photos.length - 1)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white text-slate-800 transition-all"
                                                    aria-label="Previous photo"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => p < vehicle.photos.length - 1 ? p + 1 : 0)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white text-slate-800 transition-all"
                                                    aria-label="Next photo"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                                        No photos available
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery Strip */}
                            {vehicle.photos && vehicle.photos.length > 1 && (
                                <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-200/80 overflow-x-auto">
                                    {vehicle.photos.map((photo: any, i: number) => (
                                        <button
                                            key={photo.id || i}
                                            onClick={() => setCurrentPhoto(i)}
                                            className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                                i === currentPhoto
                                                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/30'
                                                    : 'border-slate-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        {vehicle.description && (
                            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-3">
                                <h3 className="text-lg font-bold text-slate-900">About this vehicle</h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                    {vehicle.description}
                                </p>
                            </div>
                        )}

                        {/* Availability Calendar Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <span>Availability Calendar</span>
                            </h3>
                            <AvailabilityCalendar availability={availability} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400" /> Available</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400" /> Booked</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400" /> Blocked</span>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {ratings && ratings.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span>Reviews ({ratings.length})</span>
                                </h3>
                                <div className="space-y-4 divide-y divide-slate-100">
                                    {ratings.map((rating: any) => (
                                        <div key={rating.id} className="pt-4 first:pt-0 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500">
                                                    by {rating.rater_type === 'renter' ? rating.rater_identifier : 'Vehicle Host'}
                                                </span>
                                            </div>
                                            {rating.comment && <p className="text-xs sm:text-sm text-slate-700">{rating.comment}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Technical Specification, Rent Button, Equipment, Booking Form */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* 1. TECHNICAL SPECIFICATIONS CARD (Matching Reference Image Layout) */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-md space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                Technical Specification
                            </h3>

                            {/* 6 Grid Specs Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Gear Box */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <CarFront className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gear Box</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{vehicle.transmission || 'Automatic'}</p>
                                </div>

                                {/* Fuel */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Wind className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fuel</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{vehicle.fuel_type || 'Gasoline'}</p>
                                </div>

                                {/* Doors */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Doors</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{vehicle.doors || '4 Doors'}</p>
                                </div>

                                {/* Air Conditioner */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Air Conditioner</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{vehicle.air_conditioning ? 'Yes (Cold AC)' : 'No'}</p>
                                </div>

                                {/* Seats */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Users className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Seats</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{vehicle.seats || '5 Seats'}</p>
                                </div>

                                {/* Distance */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <MapPin className="w-5 h-5 text-indigo-600 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Distance</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">Unlimited</p>
                                </div>
                            </div>

                            {/* Prominent "Rent a car" Button (Matching Reference Image) */}
                            <button
                                onClick={scrollToBooking}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span>Rent a car</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* 2. CAR EQUIPMENT CHECKLIST (Matching Reference Image Layout) */}
                            <div className="pt-4 border-t border-slate-200/80 space-y-4">
                                <h4 className="font-bold text-slate-900 text-base">Car Equipment</h4>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>ABS Brakes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>Dual Air Bags</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>Cruise Control</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>Cold Air Conditioner</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>Bluetooth Audio</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>Backup Camera</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. BOOKING FORM CARD */}
                        <div id="booking-form-card">
                            <BookingForm vehicle={vehicle} availability={availability} />
                        </div>

                    </div>
                </div>

                {/* BOTTOM SECTION: "Other cars" (Matching Reference Image Layout) */}
                {otherVehicles && otherVehicles.length > 0 && (
                    <div className="pt-12 border-t border-slate-200/80 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    Other cars
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">Explore more available vehicles in Bohol</p>
                            </div>
                            <Link
                                href="/vehicles"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Other Cars 3-Column Grid (Matching Reference Design Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherVehicles.slice(0, 3).map((v: any) => (
                                <div key={v.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                                    <div>
                                        {/* Car Photo */}
                                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                            {v.photos && v.photos[0] ? (
                                                <img
                                                    src={v.photos[0].url}
                                                    alt={v.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                    No photo available
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                                                        {v.brand} {v.model}
                                                    </h3>
                                                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{v.type}</span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-lg font-extrabold text-indigo-600">{formatCurrency(v.price_per_day)}</span>
                                                    <span className="text-[10px] text-slate-500 block">/ day</span>
                                                </div>
                                            </div>

                                            {/* Specs Row */}
                                            <div className="flex items-center gap-4 text-[11px] text-slate-500 border-t border-b border-slate-100 py-2.5">
                                                <span className="flex items-center gap-1">
                                                    <CarFront className="w-3.5 h-3.5 text-indigo-600" />
                                                    {v.transmission || 'Automatic'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wind className="w-3.5 h-3.5 text-indigo-600" />
                                                    {v.fuel_type || 'Gasoline'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                                    Cold AC
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-5 pt-0">
                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

function BookingForm({ vehicle, availability }: { vehicle: any; availability: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        renter_name: '',
        renter_contact: '',
        renter_email: '',
        start_date: '',
        end_date: '',
    });

    const totalDays = useMemo(() => {
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 0;
        }
        return 0;
    }, [data.start_date, data.end_date]);

    const totalPrice = totalDays * Number(vehicle.price_per_day);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/vehicles/${vehicle.slug}/book`);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-lg space-y-4">
            <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                    Book this vehicle
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">No account required — instant direct request.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Pickup Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                            required
                        />
                        {errors.start_date && <p className="text-[11px] text-red-500 mt-1">{errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Return Date</label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                            min={data.start_date || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                            required
                        />
                        {errors.end_date && <p className="text-[11px] text-red-500 mt-1">{errors.end_date}</p>}
                    </div>
                </div>

                {/* Price Summary */}
                {totalDays > 0 && (
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>{formatCurrency(Number(vehicle.price_per_day))} × {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                            <span className="font-bold text-slate-800">{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-indigo-950 pt-2 border-t border-indigo-100">
                            <span>Total Price</span>
                            <span className="text-indigo-600 text-base">{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>
                )}

                {/* Renter Contact Info */}
                <div className="space-y-3 pt-1">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Your Full Name
                        </label>
                        <input
                            type="text"
                            value={data.renter_name}
                            onChange={e => setData('renter_name', e.target.value)}
                            placeholder="Juan Dela Cruz"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                            required
                        />
                        {errors.renter_name && <p className="text-[11px] text-red-500 mt-1">{errors.renter_name}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            value={data.renter_contact}
                            onChange={e => setData('renter_contact', e.target.value)}
                            placeholder="0917 123 4567"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                            required
                        />
                        {errors.renter_contact && <p className="text-[11px] text-red-500 mt-1">{errors.renter_contact}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            value={data.renter_email}
                            onChange={e => setData('renter_email', e.target.value)}
                            placeholder="you@email.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                    <span className="shrink-0">🔒</span>
                    <span>Your phone number is encrypted & hidden from the owner until they accept your booking request.</span>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-indigo-600/30 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    <span>{processing ? 'Submitting Request...' : 'Submit Booking Request'}</span>
                </button>
            </form>
        </div>
    );
}

function AvailabilityCalendar({ availability, selectedMonth, onMonthChange }: { availability: any[]; selectedMonth: Date; onMonthChange: (d: Date) => void }) {
    const availabilityMap = useMemo(() => {
        const map: Record<string, string> = {};
        availability.forEach(a => { map[a.date] = a.status; });
        return map;
    }, [availability]);

    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date().toISOString().split('T')[0];

    const prevMonth = () => onMonthChange(new Date(year, month - 1, 1));
    const nextMonth = () => onMonthChange(new Date(year, month + 1, 1));

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {selectedMonth.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
                ))}
                {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = availabilityMap[dateStr];
                    const isPast = dateStr < today;

                    let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold';
                    if (isPast) bgClass = 'bg-slate-100 text-slate-400 border-slate-200';
                    else if (status === 'booked') bgClass = 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold';
                    else if (status === 'blocked') bgClass = 'bg-slate-100 text-slate-500 border-slate-200';

                    return (
                        <div
                            key={day}
                            className={`text-center py-1.5 text-xs rounded-lg border ${bgClass}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
