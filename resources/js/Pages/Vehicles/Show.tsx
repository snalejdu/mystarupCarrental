import { Head, useForm, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Star, Calendar, CaretLeft, CaretRight, Phone, User, EnvelopeSimple, PaperPlaneTilt, CarProfile, Wind, ShieldCheck, Users, Thermometer, CheckCircle, ArrowRight, ArrowLeft, Airplane, GasPump, Tag, Percent, Check, Info, Motorcycle, LockSimple, UserCheck, CaretDown, Question, ChatCircle, Compass } from '@phosphor-icons/react';
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

    const displayFeatures = useMemo(() => {
        if (Array.isArray(vehicle.features) && vehicle.features.length > 0) {
            return vehicle.features;
        }
        return vehicle.type === 'motorbike'
            ? ['2 Clean Helmets Included', 'Cell Phone Holder / Mount', 'Front Disc Brakes']
            : ['ABS Brakes', 'Dual Air Bags', 'Cruise Control', 'Cold Air Conditioner', 'Bluetooth Audio', 'Backup Camera'];
    }, [vehicle.features, vehicle.type]);

    return (
        <PublicLayout>
            <Head>
                <title>{`${vehicle.title} — Rent in ${vehicle.location}, Bohol | RentBohol`}</title>
                <meta name="description" content={`Rent ${vehicle.title} in ${vehicle.location}, Bohol for ${formatCurrency(vehicle.price_per_day)}/day. Unlimited mileage & local owner booking.`} />
            </Head>

            {/* Main Page Container — compact high-density layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
                
                {/* Back Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/vehicles"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-700 transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to all vehicles</span>
                    </Link>
                </div>

                {/* Top Section: Vehicle Hero Header + Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: Photo Showcase, Description & Calendar */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* Title & Price Header */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-extrabold uppercase tracking-wider mb-1 border border-primary-100">
                                    {vehicle.type}
                                </span>
                                <h1 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-primary-700 shrink-0" />
                                    <span>{vehicle.location}, Bohol</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Host verified</span>
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="flex items-baseline gap-1 justify-end">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-primary-700 font-heading">
                                        {formatCurrency(vehicle.price_per_day)}
                                    </span>
                                    <span className="text-xs text-slate-500 font-semibold">/ day</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-100">
                                    Best Rate Guaranteed
                                </span>
                            </div>
                        </div>

                        {/* Photo Gallery with Interactive Focal Positioning Preview */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 shadow-inner group">
                                {vehicle.photos && vehicle.photos.length > 0 ? (
                                    <>
                                        <img
                                            src={vehicle.photos[currentPhoto]?.url}
                                            alt={vehicle.photos[currentPhoto]?.alt_text || vehicle.title}
                                            className="w-full h-full object-cover transition-all duration-300"
                                            style={{
                                                objectPosition: `${vehicle.photos[currentPhoto]?.focal_x ?? 50}% ${vehicle.photos[currentPhoto]?.focal_y ?? 50}%`,
                                            }}
                                        />
                                        {vehicle.photos.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => (p > 0 ? p - 1 : vehicle.photos.length - 1))}
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                                                    aria-label="Previous photo"
                                                >
                                                    <CaretLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => (p < vehicle.photos.length - 1 ? p + 1 : 0))}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                                                    aria-label="Next photo"
                                                >
                                                    <CaretRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-950/70 text-white text-xs font-bold backdrop-blur-sm">
                                            {currentPhoto + 1} / {vehicle.photos.length} Photos
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                                        <CarProfile className="w-10 h-10 mb-2 opacity-30 text-white" />
                                        <span>No photos provided yet</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {vehicle.photos && vehicle.photos.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {vehicle.photos.map((photo: any, index: number) => (
                                        <button
                                            key={photo.id || index}
                                            onClick={() => setCurrentPhoto(index)}
                                            className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                                currentPhoto === index
                                                    ? 'border-primary-600 ring-2 ring-primary-200'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={photo.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                style={{
                                                    objectPosition: `${photo.focal_x ?? 50}% ${photo.focal_y ?? 50}%`,
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Description */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2.5">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                About this Vehicle
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                {vehicle.description || "Clean, fully registered, and island-ready vehicle. Managed directly by verified Boholano owners."}
                            </p>
                        </div>

                        {/* Availability Calendar Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                        Live Availability Calendar
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">Real-time schedule maintained directly by host.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                                    <span className="flex items-center gap-1.5 text-emerald-700">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                                        Available
                                    </span>
                                    <span className="flex items-center gap-1.5 text-rose-700">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                                        Booked
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                                        Past / Unavailable
                                    </span>
                                </div>
                            </div>

                            {/* Mini Calendar View */}
                            <AvailabilityCalendar availability={availability} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                        </div>

                        {/* Renter Reviews Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Renter Reviews & Ratings
                                </h3>
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span>{vehicle.avg_rating || '5.0'}</span>
                                    <span className="text-slate-400 font-normal">({vehicle.total_reviews || ratings.length} reviews)</span>
                                </div>
                            </div>

                            {ratings.length > 0 ? (
                                <div className="space-y-3">
                                    {ratings.map((rating: any) => (
                                        <div key={rating.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900">{rating.renter_name || 'Verified Renter'}</span>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${
                                                                i < rating.rating
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-slate-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {rating.comment && (
                                                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                                                    "{rating.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-500 font-medium">
                                    <span>No reviews yet. Be the first to review this {vehicle.brand} {vehicle.model}!</span>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Technical Spec, Rent Button, Equipment, Terms & Booking Form */}
                    <div className="lg:col-span-5 space-y-5">
                        
                        {/* 1. TECHNICAL SPECIFICATIONS CARD (Compact 6 Grid) */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                Technical Specification
                            </h3>

                            {/* 6 Compact Spec Tiles */}
                            <div className="grid grid-cols-2 gap-2">
                                {/* Transmission */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <CarProfile className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transmission</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.transmission ? (vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)) : 'Automatic'}
                                    </p>
                                </div>

                                {/* Fuel */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Wind className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fuel</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{vehicle.fuel_type || 'Unleaded Gas'}</p>
                                </div>

                                {/* Pickup Location */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <MapPin className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{vehicle.location}</p>
                                </div>

                                {/* Air Conditioner */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Thermometer className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Air Conditioner</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.has_aircon === false ? 'No (Non-Aircon)' : 'Yes (Cold AC)'}
                                    </p>
                                </div>

                                {/* Seats */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Users className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Seats</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.seats ? `${vehicle.seats} Seats` : (vehicle.type === 'van' ? '15 Seats' : vehicle.type === 'motorbike' ? '2 Seats' : '5 Seats')}
                                    </p>
                                </div>

                                {/* Distance */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <MapPin className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Distance</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.distance_limit || 'Unlimited'}
                                    </p>
                                </div>
                            </div>

                            {/* Prominent "Rent a car" Button */}
                            <button
                                onClick={scrollToBooking}
                                className="glass-btn-accent w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <span>{vehicle.type === 'motorbike' ? 'Rent this scooter' : 'Rent a car'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* VEHICLE EQUIPMENT & INCLUSIONS CHECKLIST */}
                            <div className="pt-3 border-t border-slate-100 space-y-2.5">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                                    {vehicle.type === 'motorbike' ? 'Motorbike Equipment & Inclusions' : 'Vehicle Equipment'}
                                </h4>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                                    {displayFeatures.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                            <span className="truncate">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RENTAL TERMS & HOST POLICIES CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-primary-600" />
                                <span>Host Rental Terms & Inclusions</span>
                            </h3>

                            <div className="space-y-2 text-xs">
                                {/* Driver License */}
                                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">Valid Driver's License Required</span>
                                        <span className="text-slate-500 text-xs">Philippine License or International Permit at handover.</span>
                                    </div>
                                </div>

                                {/* Security Deposit */}
                                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <Tag className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">
                                            Refundable Deposit: {vehicle.security_deposit > 0 ? formatCurrency(vehicle.security_deposit) : '₱0 (No Deposit)'}
                                        </span>
                                        <span className="text-slate-500 text-xs">Held in cash upon pickup, returned upon safe vehicle return.</span>
                                    </div>
                                </div>

                                {/* Fuel Policy */}
                                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <GasPump className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">
                                            Fuel Policy: {vehicle.fuel_policy === 'full_to_full' ? 'Full-to-Full' : 'Same-to-Same'}
                                        </span>
                                        <span className="text-slate-500 text-xs">Return with same fuel level received.</span>
                                    </div>
                                </div>

                                {/* Delivery */}
                                {vehicle.delivery_available && (
                                    <div className="flex items-start gap-2 p-2.5 bg-primary-50/70 rounded-lg border border-primary-100">
                                        <Airplane className="w-4 h-4 text-primary-700 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-primary-900 block text-xs">
                                                Airport & Port Delivery {vehicle.delivery_fee > 0 ? `(${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}
                                            </span>
                                            <span className="text-primary-700 text-xs">Direct pickup at Panglao Airport (TAG) or Tagbilaran Port.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOOKING FORM CARD */}
                        <div id="booking-form-card">
                            <BookingForm vehicle={vehicle} availability={availability} />
                        </div>

                    </div>
                </div>

                {/* BOTTOM SECTION: "Other cars" */}
                {otherVehicles && otherVehicles.length > 0 && (
                    <div className="pt-8 border-t border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                    Other Recommended Cars
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">Explore more available rental vehicles in Bohol</p>
                            </div>
                            <Link
                                href="/vehicles"
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors group"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Other Cars 2x2 Grid on Mobile, 4-Cols on Desktop */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
                            {otherVehicles.slice(0, 4).map((v: any) => (
                                <div key={v.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                                    <div>
                                        {/* Car Photo */}
                                        <div className="aspect-[4/3] sm:aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                            {v.photos && v.photos[0] ? (
                                                <img
                                                    src={v.photos[0].url}
                                                    alt={v.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                    No photo
                                                </div>
                                            )}
                                            {/* Rating Pill on Photo */}
                                            {v.avg_rating > 0 && (
                                                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-900/80 text-amber-400 rounded-md text-[9px] sm:text-xs font-semibold shadow-xs">
                                                    <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400" />
                                                    <span>{Number(v.avg_rating).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details — Responsive for 2x2 Mobile and Desktop */}
                                        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2.5">
                                            {/* Title & Type */}
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-primary-700 transition-colors line-clamp-1 leading-snug">
                                                    {v.brand} {v.model}
                                                </h3>
                                                <span className="text-[10px] sm:text-xs font-bold text-slate-400 block uppercase tracking-wider truncate">
                                                    {v.type}
                                                </span>
                                            </div>

                                            {/* Price Header */}
                                            <div className="flex items-baseline justify-between border-t border-slate-100 pt-1.5 sm:pt-2">
                                                <div>
                                                    <span className="text-xs sm:text-base font-extrabold text-primary-700 block leading-tight">
                                                        {formatCurrency(v.price_per_day)}
                                                    </span>
                                                    <span className="text-[8px] sm:text-xs text-slate-400 font-semibold block">/ day</span>
                                                </div>
                                                {/* Desktop Specs Icons (hidden on compact mobile) */}
                                                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                                    <span className="capitalize">{v.transmission || 'Auto'}</span>
                                                </div>
                                            </div>

                                            {/* Specs Row — Mobile (Compact 1-line) */}
                                            <div className="flex sm:hidden items-center gap-1 text-[9px] text-slate-500 font-medium truncate pt-0.5">
                                                <span className="capitalize truncate">{v.transmission || 'Auto'}</span>
                                                <span>•</span>
                                                <span className="capitalize truncate">{v.fuel_type || 'Gas'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-2.5 pt-0 sm:p-4 sm:pt-0">
                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="glass-btn w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all"
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

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const availabilityMap = useMemo(() => {
        const map: Record<string, string> = {};
        availability?.forEach(item => {
            map[item.date] = item.status;
        });
        return map;
    }, [availability]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.start_date || data.start_date < todayStr) {
            alert('Please select a pickup date that is today or in the future.');
            return;
        }
        if (!data.end_date || data.end_date <= data.start_date) {
            alert('Return date must be after pickup date.');
            return;
        }

        // Validate that no date in range is booked or blocked or in the past
        const [sy, sm, sd] = data.start_date.split('-').map(Number);
        const [ey, em, ed] = data.end_date.split('-').map(Number);
        const cur = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        let conflictDate = '';
        while (cur <= end) {
            const y = cur.getFullYear();
            const m = String(cur.getMonth() + 1).padStart(2, '0');
            const d = String(cur.getDate()).padStart(2, '0');
            const ds = `${y}-${m}-${d}`;
            if (ds < todayStr || availabilityMap[ds] === 'booked' || availabilityMap[ds] === 'blocked') {
                conflictDate = ds;
                break;
            }
            cur.setDate(cur.getDate() + 1);
        }

        if (conflictDate) {
            alert(`Selected date range contains unavailable or past dates (${conflictDate}). Please select available dates.`);
            return;
        }

        post(`/vehicles/${vehicle.slug}/book`);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div>
                <h3 className="text-base font-bold text-slate-900">
                    Reserve this vehicle
                </h3>
                <p className="text-xs text-slate-500 font-medium">Direct host request with instant availability check.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pickup Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                            min={todayStr}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white font-medium"
                            required
                        />
                        {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Return Date</label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                            min={data.start_date || todayStr}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white font-medium"
                            required
                        />
                        {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>}
                    </div>
                </div>

                {/* Pickup / Delivery Preference */}
                {vehicle.delivery_available && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                            <Airplane className="w-3.5 h-3.5 text-primary-700" />
                            <span>Pickup Location Preference</span>
                        </label>
                        <select
                            value={data.pickup_preference}
                            onChange={e => setData('pickup_preference', e.target.value)}
                            className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-base sm:text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-primary-500"
                        >
                            <option value="host_location">Pickup at Host Location ({vehicle.location})</option>
                            <option value="airport">Deliver to Panglao Airport TAG {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                            <option value="seaport">Deliver to Tagbilaran Seaport {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                            <option value="hotel">Deliver to Resort / Hotel in Bohol {vehicle.delivery_fee > 0 ? `(+${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}</option>
                        </select>
                    </div>
                )}

                {/* Price Summary */}
                {totalDays > 0 && (
                    <div className="bg-primary-50/80 border border-primary-200/80 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>{formatCurrency(Number(vehicle.price_per_day))} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                            <span className="font-bold text-slate-800">{formatCurrency(basePrice)}</span>
                        </div>

                        {discountPercent > 0 && (
                            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded-md border border-emerald-200">
                                <span className="flex items-center gap-1">
                                    <Percent className="w-3 h-3" />
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

                        <div className="pt-2 border-t border-primary-200 flex justify-between items-center text-slate-900 font-extrabold text-sm">
                            <span>Total Rental Price</span>
                            <span className="text-base text-primary-700 font-heading">{formatCurrency(finalTotalPrice)}</span>
                        </div>
                    </div>
                )}

                {/* Renter Information Fields */}
                <div className="space-y-2.5 pt-1 border-t border-slate-100">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Full Name</label>
                        <input
                            type="text"
                            value={data.renter_name}
                            onChange={e => setData('renter_name', e.target.value)}
                            placeholder="John Doe"
                            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs text-slate-800 focus:bg-white font-medium"
                            required
                        />
                        {errors.renter_name && <p className="text-xs text-red-500 mt-1">{errors.renter_name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={data.renter_contact}
                                onChange={e => setData('renter_contact', e.target.value)}
                                placeholder="0917 123 4567"
                                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs text-slate-800 focus:bg-white font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={data.renter_email}
                                onChange={e => setData('renter_email', e.target.value)}
                                placeholder="john@example.com"
                                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs text-slate-800 focus:bg-white font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full min-h-[48px] py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                >
                    <PaperPlaneTilt className="w-4 h-4" />
                    <span>{processing ? 'Submitting Request...' : 'Send Booking Request to Host'}</span>
                </button>

                <p className="text-xs text-slate-500 text-center leading-relaxed">
                    By submitting, you agree to Bohol driver guidelines and our{' '}
                    <a href="/terms" target="_blank" rel="noreferrer" className="text-primary-700 underline font-semibold hover:text-primary-800">
                        Rental Terms
                    </a>.
                </p>
            </form>
        </div>
    );
}

{/* Availability Calendar Component */}
function AvailabilityCalendar({ availability, selectedMonth, onMonthChange }: { availability: any[]; selectedMonth: Date; onMonthChange: (d: Date) => void }) {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;

    const isCurrentMonthOrPast = year < todayYear || (year === todayYear && month <= todayMonth);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const availabilityMap = useMemo(() => {
        const map: Record<string, string> = {};
        availability?.forEach(item => {
            map[item.date] = item.status;
        });
        return map;
    }, [availability]);

    const prevMonth = () => {
        if (!isCurrentMonthOrPast) {
            onMonthChange(new Date(year, month - 1, 1));
        }
    };
    const nextMonth = () => onMonthChange(new Date(year, month + 1, 1));

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                    {monthNames[month]} {year}
                </span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={prevMonth}
                        disabled={isCurrentMonthOrPast}
                        className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
                            isCurrentMonthOrPast
                                ? 'opacity-25 cursor-not-allowed text-slate-300'
                                : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        aria-label="Previous month"
                        title={isCurrentMonthOrPast ? 'Cannot view past months' : 'Previous month'}
                    >
                        <CaretLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Next month"
                        title="Next month"
                    >
                        <CaretRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isPast = dateStr < todayStr;
                    const isToday = dateStr === todayStr;
                    const status = availabilityMap[dateStr] || 'available';

                    let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    let title = `${monthNames[month]} ${dayNum}, ${year}: Available`;

                    if (isPast) {
                        bgClass = 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed opacity-60';
                        title = `${monthNames[month]} ${dayNum}, ${year}: Past date (not available)`;
                    } else if (status === 'booked') {
                        bgClass = 'bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed font-medium';
                        title = `${monthNames[month]} ${dayNum}, ${year}: Booked`;
                    } else if (status === 'blocked') {
                        bgClass = 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed';
                        title = `${monthNames[month]} ${dayNum}, ${year}: Unavailable`;
                    } else if (isToday) {
                        bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20 font-bold';
                        title = `${monthNames[month]} ${dayNum}, ${year}: Today (Available)`;
                    }

                    return (
                        <div
                            key={dayNum}
                            title={title}
                            className={`h-8 rounded-lg border flex items-center justify-center text-xs select-none transition-colors ${bgClass}`}
                        >
                            {dayNum}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
