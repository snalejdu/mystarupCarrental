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
                                <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-primary-100">
                                    {vehicle.type}
                                </span>
                                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" /> {vehicle.location}, Bohol Island
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-700 leading-tight">
                                    {formatCurrency(vehicle.price_per_day)}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ day</span>
                            </div>
                        </div>

                        {/* Compact Photo Viewer */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm relative group">
                            <div className="aspect-[16/10] sm:aspect-[16/9] max-h-[380px] relative bg-slate-100">
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
                                                    className="glass-btn-icon absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-800"
                                                    aria-label="Previous photo"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPhoto(p => p < vehicle.photos.length - 1 ? p + 1 : 0)}
                                                    className="glass-btn-icon absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-800"
                                                    aria-label="Next photo"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                                        No photos available
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery Strip */}
                            {vehicle.photos && vehicle.photos.length > 1 && (
                                <div className="flex gap-2 p-2.5 bg-slate-50 border-t border-slate-200/80 overflow-x-auto">
                                    {vehicle.photos.map((photo: any, i: number) => (
                                        <button
                                            key={photo.id || i}
                                            onClick={() => setCurrentPhoto(i)}
                                            className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-colors ${
                                                i === currentPhoto
                                                    ? 'border-primary-600 shadow-xs'
                                                    : 'border-slate-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Compact Description Section */}
                        {vehicle.description && (
                            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2">
                                <h3 className="text-sm font-bold text-slate-900">About this vehicle</h3>
                                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                                    {vehicle.description}
                                </p>
                            </div>
                        )}

                        {/* Compact Availability Calendar Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-primary-600" />
                                <span>Availability Calendar</span>
                            </h3>
                            <AvailabilityCalendar availability={availability} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-400" /> Available</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-100 border border-rose-400" /> Booked</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400" /> Blocked</span>
                            </div>
                        </div>

                        {/* Verified Renter Reviews Section */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                                        <span>Verified Renter Reviews</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Authentic feedback from Bohol tourists</p>
                                </div>
                                {ratings && ratings.length > 0 && (
                                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-black text-amber-900">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                        <span>{(ratings.reduce((acc: number, r: any) => acc + Number(r.stars), 0) / ratings.length).toFixed(1)} / 5.0</span>
                                    </div>
                                )}
                            </div>

                            {ratings && ratings.length > 0 ? (
                                <div className="space-y-3 divide-y divide-slate-100">
                                    {ratings.map((rating: any) => (
                                        <div key={rating.id} className="pt-3 first:pt-0 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                                                        {rating.rater_identifier?.[0] || 'R'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-xs text-slate-900 block leading-none">
                                                            {rating.rater_identifier || 'Verified Renter'}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                                                            ✓ Verified Bohol Rental
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
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
                                    <CarFront className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Transmission</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.transmission ? (vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)) : 'Automatic'}
                                    </p>
                                </div>

                                {/* Fuel */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Wind className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Fuel</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{vehicle.fuel_type || 'Unleaded Gas'}</p>
                                </div>

                                {/* Pickup Location */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <MapPin className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{vehicle.location}</p>
                                </div>

                                {/* Air Conditioner */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Thermometer className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Air Conditioner</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.has_aircon === false ? 'No (Non-Aircon)' : 'Yes (Cold AC)'}
                                    </p>
                                </div>

                                {/* Seats */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <Users className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Seats</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {vehicle.seats ? `${vehicle.seats} Seats` : (vehicle.type === 'van' ? '15 Seats' : vehicle.type === 'motorbike' ? '2 Seats' : '5 Seats')}
                                    </p>
                                </div>

                                {/* Distance */}
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <MapPin className="w-4 h-4 text-primary-600 mb-0.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Distance</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">Unlimited</p>
                                </div>
                            </div>

                            {/* Prominent "Rent a car" Button */}
                            <button
                                onClick={scrollToBooking}
                                className="glass-btn-accent w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <span>Rent a car</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* CAR EQUIPMENT CHECKLIST */}
                            <div className="pt-3 border-t border-slate-100 space-y-2.5">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Car Equipment</h4>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>ABS Brakes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>Dual Air Bags</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>Cruise Control</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>Cold Air Conditioner</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>Bluetooth Audio</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                        <CircleCheckBig className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                        <span>Backup Camera</span>
                                    </div>
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
                                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">Valid Driver's License Required</span>
                                        <span className="text-slate-500 text-[10px]">Philippine License or International Permit at handover.</span>
                                    </div>
                                </div>

                                {/* Security Deposit */}
                                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <Tag className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">
                                            Refundable Deposit: {vehicle.security_deposit > 0 ? formatCurrency(vehicle.security_deposit) : '₱0 (No Deposit)'}
                                        </span>
                                        <span className="text-slate-500 text-[10px]">Held in cash upon pickup, returned upon safe vehicle return.</span>
                                    </div>
                                </div>

                                {/* Fuel Policy */}
                                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <Fuel className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-xs">
                                            Fuel Policy: {vehicle.fuel_policy === 'full_to_full' ? 'Full-to-Full' : 'Same-to-Same'}
                                        </span>
                                        <span className="text-slate-500 text-[10px]">Return with same fuel level received.</span>
                                    </div>
                                </div>

                                {/* Delivery */}
                                {vehicle.delivery_available && (
                                    <div className="flex items-start gap-2 p-2 bg-primary-50/70 rounded-lg border border-primary-100">
                                        <Plane className="w-3.5 h-3.5 text-primary-700 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-primary-900 block text-xs">
                                                Airport & Port Delivery {vehicle.delivery_fee > 0 ? `(${formatCurrency(vehicle.delivery_fee)})` : '(FREE)'}
                                            </span>
                                            <span className="text-primary-700 text-[10px]">Direct pickup at Panglao Airport (TAG) or Tagbilaran Port.</span>
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

                        {/* Other Cars 3-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {otherVehicles.slice(0, 3).map((v: any) => (
                                <div key={v.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                                    <div>
                                        {/* Car Photo */}
                                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
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
                                        </div>

                                        {/* Details */}
                                        <div className="p-4 space-y-2.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-primary-700 transition-colors line-clamp-1">
                                                        {v.brand} {v.model}
                                                    </h3>
                                                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{v.type}</span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-base font-bold text-primary-700">{formatCurrency(v.price_per_day)}</span>
                                                    <span className="text-[9px] text-slate-400 block">/ day</span>
                                                </div>
                                            </div>

                                            {/* Specs Row */}
                                            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 border-t border-b border-slate-100 py-2">
                                                <span className="flex items-center gap-1">
                                                    <CarFront className="w-3 h-3 text-primary-600" />
                                                    {v.transmission || 'Automatic'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wind className="w-3 h-3 text-primary-600" />
                                                    {v.fuel_type || 'Gasoline'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wind className="w-3 h-3 text-primary-600" />
                                                    Cold AC
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-4 pt-0">
                                        <Link
                                            href={`/vehicles/${v.slug}`}
                                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div>
                <h3 className="text-base font-bold text-slate-900">
                    Reserve this vehicle
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Direct host request with instant availability check.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pickup Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white font-medium"
                            required
                        />
                        {errors.start_date && <p className="text-[10px] text-red-500 mt-1">{errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Return Date</label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                            min={data.start_date || new Date().toISOString().split('T')[0]}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white font-medium"
                            required
                        />
                        {errors.end_date && <p className="text-[10px] text-red-500 mt-1">{errors.end_date}</p>}
                    </div>
                </div>

                {/* Pickup / Delivery Preference */}
                {vehicle.delivery_available && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                            <Plane className="w-3.5 h-3.5 text-primary-700" />
                            <span>Pickup Location Preference</span>
                        </label>
                        <select
                            value={data.pickup_preference}
                            onChange={e => setData('pickup_preference', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-primary-500"
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
                            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded-md border border-emerald-200">
                                <span className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
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
                <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Your Full Name</label>
                        <input
                            type="text"
                            value={data.renter_name}
                            onChange={e => setData('renter_name', e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white font-medium"
                            required
                        />
                        {errors.renter_name && <p className="text-[10px] text-red-500 mt-0.5">{errors.renter_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Phone Number</label>
                            <input
                                type="tel"
                                value={data.renter_contact}
                                onChange={e => setData('renter_contact', e.target.value)}
                                placeholder="0917 123 4567"
                                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Email Address</label>
                            <input
                                type="email"
                                value={data.renter_email}
                                onChange={e => setData('renter_email', e.target.value)}
                                placeholder="john@example.com"
                                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>{processing ? 'Submitting Request...' : 'Send Booking Request to Host'}</span>
                </button>
            </form>
        </div>
    );
}

{/* Availability Calendar Component */}
function AvailabilityCalendar({ availability, selectedMonth, onMonthChange }: { availability: any[]; selectedMonth: Date; onMonthChange: (d: Date) => void }) {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

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

    const prevMonth = () => onMonthChange(new Date(year, month - 1, 1));
    const nextMonth = () => onMonthChange(new Date(year, month + 1, 1));

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">
                    {monthNames[month]} {year}
                </span>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-600" aria-label="Previous month">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-600" aria-label="Next month">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const status = availabilityMap[dateStr] || 'available';

                    let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    if (status === 'booked') bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
                    if (status === 'blocked') bgClass = 'bg-slate-100 text-slate-400 border-slate-200';

                    return (
                        <div
                            key={dayNum}
                            className={`h-7 rounded-lg border flex items-center justify-center text-[11px] ${bgClass}`}
                        >
                            {dayNum}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
