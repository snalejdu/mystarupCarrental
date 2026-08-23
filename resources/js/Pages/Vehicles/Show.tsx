import { Head, useForm, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Star, Calendar, ChevronLeft, ChevronRight, Phone, User, Mail, Send,
    CarFront, Wind, ShieldCheck, Users, Thermometer, CircleCheckBig, ArrowRight, ArrowLeft,
    Plane, Fuel, Tag, Percent, Sparkles, Check, Info, Bike, Lock, UserCheck,
    ChevronDown, HelpCircle, MessageSquare, Compass
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
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors group"
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
                                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold uppercase tracking-wider mb-2 border border-primary-100">
                                    {vehicle.type}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-4 h-4 text-primary-700" /> {vehicle.location}, Bohol Island
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-3xl sm:text-4xl font-bold text-primary-700">
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
                                            style={{
                                                objectPosition: `${vehicle.photos[currentPhoto]?.position_x ?? 50}% ${vehicle.photos[currentPhoto]?.position_y ?? 50}%`,
                                            }}
                                        />
                                        {vehicle.photos.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => p > 0 ? p - 1 : vehicle.photos.length - 1)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 text-slate-800 transition-colors"
                                                    aria-label="Previous photo"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => p < vehicle.photos.length - 1 ? p + 1 : 0)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 text-slate-800 transition-colors"
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
                                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                                                i === currentPhoto
                                                    ? 'border-primary-600 shadow-sm'
                                                    : 'border-slate-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
                                <Calendar className="w-5 h-5 text-primary-700" />
                                <span>Availability Calendar</span>
                            </h3>
                            <AvailabilityCalendar availability={availability} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400" /> Available</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400" /> Booked</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400" /> Blocked</span>
                            </div>
                        </div>

                        {/* Verified Customer Reviews Section */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                                        <span>Verified Renter Reviews</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Authentic feedback from verified Bohol tourists</p>
                                </div>
                                {ratings && ratings.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-black text-amber-900">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                        <span>{(ratings.reduce((acc: number, r: any) => acc + Number(r.stars), 0) / ratings.length).toFixed(1)} / 5.0</span>
                                    </div>
                                )}
                            </div>

                            {ratings && ratings.length > 0 ? (
                                <div className="space-y-4 divide-y divide-slate-100">
                                    {ratings.map((rating: any) => (
                                        <div key={rating.id} className="pt-4 first:pt-0 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                                        {rating.rater_identifier?.[0] || 'R'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-xs text-slate-900 block">
                                                            {rating.rater_identifier || 'Verified Renter'}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-700 font-semibold block">
                                                            ✓ Verified Bohol Rental
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            {rating.comment && (
                                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    "{rating.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                                    <span>No reviews yet. Be the first to review this {vehicle.brand} {vehicle.model} after your Bohol trip!</span>
                                </div>
                            )}
                        </div>

                        {/* Bohol Island Driving & FAQ Guide Accordion */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-primary-700" />
                                <span>Bohol Tourist Driving Guide & FAQs</span>
                            </h3>

                            <div className="space-y-3 text-xs">
                                <details className="group p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                                    <summary className="font-bold text-slate-900 flex items-center justify-between list-none">
                                        <span>Can I drive in Bohol with a foreign driver's license?</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <p className="text-slate-600 mt-2 leading-relaxed text-[11px]">
                                        Yes! Under Philippine Land Transportation Office (LTO) regulations, foreign tourists can legally drive with any valid foreign driver's license for up to <b>90 days</b> from their arrival in the Philippines. International Driving Permits (IDP) are also accepted.
                                    </p>
                                </details>

                                <details className="group p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                                    <summary className="font-bold text-slate-900 flex items-center justify-between list-none">
                                        <span>How does Panglao Airport (TAG) & Port delivery work?</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <p className="text-slate-600 mt-2 leading-relaxed text-[11px]">
                                        If delivery is selected, your host will meet you directly at the Panglao International Airport arrivals area or Tagbilaran Ferry Port with the vehicle keys, rental agreement, and helmets/inclusions ready for your trip.
                                    </p>
                                </details>

                                <details className="group p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                                    <summary className="font-bold text-slate-900 flex items-center justify-between list-none">
                                        <span>When is the refundable security deposit returned?</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <p className="text-slate-600 mt-2 leading-relaxed text-[11px]">
                                        The security deposit is handed directly in cash upon vehicle pickup and returned to you immediately upon returning the vehicle in safe, undamaged condition with the agreed fuel level.
                                    </p>
                                </details>

                                <details className="group p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                                    <summary className="font-bold text-slate-900 flex items-center justify-between list-none">
                                        <span>Are helmets mandatory for motorbikes in Panglao?</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <p className="text-slate-600 mt-2 leading-relaxed text-[11px]">
                                        Yes, Philippine national law strictly enforces helmet wearing for both rider and passenger across all Bohol roads and highways. 2 sanitized DOT-approved helmets are included free with every motorcycle rental.
                                    </p>
                                </details>
                            </div>
                        </div>
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
                                    <CarFront className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Transmission</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                                        {vehicle.transmission ? (vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)) : 'Automatic'}
                                    </p>
                                </div>

                                {/* Fuel */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Wind className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fuel</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">{vehicle.fuel_type || 'Unleaded Gas'}</p>
                                </div>

                                {/* Pickup Location */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <MapPin className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">{vehicle.location}</p>
                                </div>

                                {/* Air Conditioner */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Thermometer className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Air Conditioner</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                                        {vehicle.has_aircon === false ? 'No (Non-Aircon)' : 'Yes (Cold AC)'}
                                    </p>
                                </div>

                                {/* Seats */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <Users className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Seats</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                                        {vehicle.seats ? `${vehicle.seats} Seats` : (vehicle.type === 'van' ? '15 Seats' : vehicle.type === 'motorbike' ? '2 Seats' : '5 Seats')}
                                    </p>
                                </div>

                                {/* Distance */}
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                                    <MapPin className="w-5 h-5 text-primary-700 mb-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Distance</p>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900">Unlimited</p>
                                </div>
                            </div>

                            {/* Prominent "Rent a car" Button (Matching Reference Image) */}
                            <button
                                onClick={scrollToBooking}
                                className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Rent a car</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* 2. CAR EQUIPMENT CHECKLIST (Matching Reference Image Layout) */}
                            <div className="pt-4 border-t border-slate-200/80 space-y-4">
                                <h4 className="font-bold text-slate-900 text-base">Car Equipment</h4>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>ABS Brakes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>Dual Air Bags</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>Cruise Control</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>Cold Air Conditioner</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>Bluetooth Audio</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CircleCheckBig className="w-4 h-4 text-primary-700 shrink-0" />
                                        <span>Backup Camera</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. RENTAL TERMS & HOST POLICIES CARD */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-md space-y-4">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary-700" />
                                <span>Host Rental Terms & Inclusions</span>
                            </h3>

                            <div className="space-y-3 text-xs">
                                {/* Driver License */}
                                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block">Valid Driver's License Required</span>
                                        <span className="text-slate-500 text-[11px]">Philippine Driver's License or International Driving Permit presented at handover.</span>
                                    </div>
                                </div>

                                {/* Security Deposit */}
                                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <Tag className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block">
                                            Refundable Security Deposit: {vehicle.security_deposit > 0 ? formatCurrency(vehicle.security_deposit) : '₱0 (No Deposit)'}
                                        </span>
                                        <span className="text-slate-500 text-[11px]">Held in cash upon vehicle handover and refunded immediately upon return.</span>
                                    </div>
                                </div>

                                {/* Fuel Policy */}
                                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <Fuel className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block">
                                            Fuel Policy: {vehicle.fuel_policy === 'full_to_full' ? 'Full-to-Full' : 'Same-to-Same'}
                                        </span>
                                        <span className="text-slate-500 text-[11px]">Return the vehicle with the same fuel level as received.</span>
                                    </div>
                                </div>

                                {/* Airport & Seaport Delivery */}
                                {vehicle.delivery_available && (
                                    <div className="flex items-start gap-2.5 p-2.5 bg-primary-50/70 rounded-xl border border-primary-100">
                                        <Plane className="w-4 h-4 text-primary-700 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-primary-900 block">
                                                Airport & Port Delivery Available {vehicle.delivery_fee > 0 ? `(${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}
                                            </span>
                                            <span className="text-primary-700 text-[11px]">Can be delivered directly to Panglao International Airport (TAG) or Tagbilaran Seaport.</span>
                                        </div>
                                    </div>
                                )}

                                {/* Helmets for Motorbike */}
                                {vehicle.helmets_included && (
                                    <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-emerald-800 font-semibold text-xs border border-emerald-200">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>2 Sanitized Standard Helmets Included</span>
                                    </div>
                                )}
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
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    Other cars
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">Explore more available vehicles in Bohol</p>
                            </div>
                            <Link
                                href="/vehicles"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 transition-colors group"
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
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    decoding="async"
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
                                                    <h3 className="font-semibold text-slate-900 text-base group-hover:text-primary-700 transition-colors">
                                                        {v.brand} {v.model}
                                                    </h3>
                                                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{v.type}</span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-lg font-bold text-primary-700">{formatCurrency(v.price_per_day)}</span>
                                                    <span className="text-[10px] text-slate-500 block">/ day</span>
                                                </div>
                                            </div>

                                            {/* Specs Row */}
                                            <div className="flex items-center gap-4 text-[11px] text-slate-500 border-t border-b border-slate-100 py-2.5">
                                                <span className="flex items-center gap-1">
                                                    <CarFront className="w-3.5 h-3.5 text-primary-600" />
                                                    {v.transmission || 'Automatic'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wind className="w-3.5 h-3.5 text-primary-600" />
                                                    {v.fuel_type || 'Gasoline'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wind className="w-3.5 h-3.5 text-primary-600" />
                                                    Cold AC
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-5 pt-0">
                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
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
    const { auth } = usePage<any>().props;
    const currentUser = auth?.user;

    const { data, setData, post, processing, errors } = useForm({
        renter_name: currentUser?.name || '',
        renter_contact: currentUser?.phone || '',
        renter_email: currentUser?.email || '',
        start_date: '',
        end_date: '',
        pickup_preference: 'host_location',
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

    // Multi-Day Discount Calculation
    const discountPercent = useMemo(() => {
        if (totalDays >= 7 && (vehicle.discount_weekly ?? 0) > 0) {
            return vehicle.discount_weekly;
        }
        if (totalDays >= 3 && (vehicle.discount_three_days ?? 0) > 0) {
            return vehicle.discount_three_days;
        }
        return 0;
    }, [totalDays, vehicle.discount_weekly, vehicle.discount_three_days]);

    const basePrice = totalDays * Number(vehicle.price_per_day);
    const discountAmount = (basePrice * discountPercent) / 100;
    const deliveryFee = (data.pickup_preference !== 'host_location' && vehicle.delivery_available)
        ? Number(vehicle.delivery_fee || 0)
        : 0;
    const finalTotalPrice = Math.max(0, basePrice - discountAmount + deliveryFee);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/vehicles/${vehicle.slug}/book`);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-lg space-y-4">
            <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Reserve this vehicle
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Direct host request with instant availability check.</p>
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
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors"
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
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:bg-white transition-colors"
                            required
                        />
                        {errors.end_date && <p className="text-[11px] text-red-500 mt-1">{errors.end_date}</p>}
                    </div>
                </div>

                {/* Pickup / Delivery Preference (If Host offers delivery) */}
                {vehicle.delivery_available && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-primary-700" />
                            <span>Pickup Location Preference</span>
                        </label>
                        <select
                            value={data.pickup_preference}
                            onChange={e => setData('pickup_preference', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary-200"
                        >
                            <option value="host_location">Pickup at Host Location ({vehicle.location})</option>
                            <option value="airport">Deliver to Panglao Airport TAG {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                            <option value="seaport">Deliver to Tagbilaran Seaport {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                            <option value="hotel">Deliver to Resort / Hotel in Bohol {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                        </select>
                    </div>
                )}

                {/* Price Summary with Multi-Day Savings */}
                {totalDays > 0 && (
                    <div className="bg-primary-50/80 border border-primary-200/80 rounded-2xl p-4 space-y-2.5">
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>{formatCurrency(Number(vehicle.price_per_day))} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                            <span className="font-bold text-slate-800">{formatCurrency(basePrice)}</span>
                        </div>

                        {discountPercent > 0 && (
                            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                                <span className="flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{discountPercent}% Multi-Day Vacation Discount</span>
                                </span>
                                <span>-{formatCurrency(discountAmount)}</span>
                            </div>
                        )}

                        {deliveryFee > 0 && (
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Airport / Port Delivery Fee</span>
                                <span className="font-bold text-slate-800">+{formatCurrency(deliveryFee)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-primary-200/60">
                            <span>Estimated Total</span>
                            <span className="text-primary-700 text-lg font-black">{formatCurrency(finalTotalPrice)}</span>
                        </div>

                        {Number(vehicle.security_deposit) > 0 && (
                            <p className="text-[10px] text-slate-500 pt-1 font-medium border-t border-primary-100">
                                ℹ️ Plus <b>{formatCurrency(vehicle.security_deposit)}</b> refundable security deposit held at vehicle handover.
                            </p>
                        )}
                    </div>
                )}

                {/* Logged-In User Profile vs Guest Action Box */}
                {currentUser ? (
                    <div className="space-y-3 pt-1">
                        {/* Verified Renter Banner */}
                        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                                    {currentUser.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <span className="font-bold text-emerald-950 block">{currentUser.name}</span>
                                    <span className="text-[10px] text-emerald-700 block">{currentUser.email || currentUser.phone}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                                Verified Renter
                            </span>
                        </div>

                        {/* Contact Confirmation Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    value={data.renter_contact}
                                    onChange={e => setData('renter_contact', e.target.value)}
                                    placeholder="0917 123 4567"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary-200"
                                    required
                                />
                                {errors.renter_contact && <p className="text-[10px] text-red-500 mt-1">{errors.renter_contact}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.renter_email}
                                    onChange={e => setData('renter_email', e.target.value)}
                                    placeholder="you@email.com"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary-200"
                                />
                            </div>
                        </div>

                        {/* Privacy Guarantee Note */}
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-primary-700 shrink-0 mt-0.5" />
                            <span>Your contact details are encrypted and only revealed to the host once they accept your request.</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || totalDays === 0}
                            className="w-full py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'Submitting Request...' : 'Send Booking Request to Host'}</span>
                        </button>
                    </div>
                ) : (
                    /* Guest Account Required Prompt (Airbnb Style) */
                    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 text-center space-y-3 pt-2">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Account Required to Book</h4>
                            <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
                                Please log in or sign up to send your reservation request directly to the vehicle host.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <Link
                                href={`/login?intended=/vehicles/${vehicle.slug}`}
                                className="flex-1 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Log In to Book</span>
                            </Link>
                            <Link
                                href={`/register?role=renter&intended=/vehicles/${vehicle.slug}`}
                                className="flex-1 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    </div>
                )}
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
