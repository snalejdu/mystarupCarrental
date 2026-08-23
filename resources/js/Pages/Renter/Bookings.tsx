import { useState, useMemo } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    CarFront, Calendar, MapPin, Phone, Mail, Clock,
    CheckCircle2, AlertCircle, XCircle, Star, ArrowRight, ShieldCheck, User,
    Upload, MessageSquare, ExternalLink, X, Check, Fuel, Gauge, Sparkles, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BookingItem {
    id: number;
    token: string;
    vehicle: any;
    start_date: string;
    end_date: string;
    total_days: number;
    total_price: number;
    status: string;
    checkin_odometer?: string;
    checkin_fuel?: string;
    checkin_notes?: string;
    checkout_odometer?: string;
    checkout_fuel?: string;
    checkout_deposit_refunded?: boolean;
    created_at: string;
    owner_contact: {
        name: string;
        phone: string;
        email: string;
    } | null;
    can_rate: boolean;
    renter_rating?: {
        stars: number;
        comment?: string;
    };
}

interface Props {
    bookings: BookingItem[];
    renter: {
        name: string;
        email: string;
        phone: string;
        driver_license_path?: string | null;
        driver_license_status: string;
    };
}

export default function RenterBookings({ bookings, renter }: Props) {
    const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'pending' | 'completed' | 'cancelled'>('all');
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [ratingBooking, setRatingBooking] = useState<BookingItem | null>(null);

    // Rating Form
    const { data: reviewData, setData: setReviewData, post: postReview, processing: ratingProcessing, reset: resetReview } = useForm({
        stars: 5,
        comment: '',
    });

    // License Upload Form
    const { data: licenseData, setData: setLicenseData, post: postLicense, processing: licenseProcessing, reset: resetLicense } = useForm<{
        license_photo: File | null;
    }>({
        license_photo: null,
    });

    const counts = useMemo(() => ({
        all: bookings.length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'declined').length,
    }), [bookings]);

    const filteredBookings = useMemo(() => {
        if (activeTab === 'all') return bookings;
        if (activeTab === 'cancelled') return bookings.filter(b => b.status === 'declined');
        return bookings.filter(b => b.status === activeTab);
    }, [bookings, activeTab]);

    const handleCancel = (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this pending booking request? The host will be notified.')) return;
        setCancellingId(bookingId);
        router.post(`/renter/bookings/${bookingId}/cancel`, {}, {
            onFinish: () => setCancellingId(null),
        });
    };

    const handleLicenseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postLicense('/renter/license/upload', {
            onSuccess: () => {
                setShowLicenseModal(false);
                resetLicense();
            },
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ratingBooking) return;
        postReview(`/renter/bookings/${ratingBooking.id}/rate`, {
            onSuccess: () => {
                setRatingBooking(null);
                resetReview();
            },
        });
    };

    const formatPhone = (phone: string) => {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.startsWith('09')) clean = '639' + clean.slice(2);
        return clean;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> PENDING HOST REVIEW
                    </span>
                );
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CONFIRMED & READY
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-800 rounded-xl text-xs font-bold border border-primary-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary-700" /> TRIP COMPLETED
                    </span>
                );
            case 'declined':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> CANCELLED
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <PublicLayout>
            <Head title="My Rental Trips — RentBohol" />

            <div className="min-h-screen bg-slate-50/70 py-8 sm:py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Dashboard Welcome Header Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-800 rounded-lg text-[11px] font-bold border border-primary-200/60">
                                    <User className="w-3.5 h-3.5" /> Registered Bohol Renter
                                </span>

                                {/* Driver's License Status Pill */}
                                {renter.driver_license_status === 'verified' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>Verified Driver</span>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setShowLicenseModal(true)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-lg text-[11px] font-bold border border-amber-200 transition-colors cursor-pointer"
                                    >
                                        <Upload className="w-3 h-3 text-amber-700" />
                                        <span>Upload Driver's License</span>
                                    </button>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Welcome, {renter.name}!
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Manage your Bohol rental reservations, connect directly with vehicle hosts, and track pickup schedules.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            <button
                                onClick={() => setShowLicenseModal(true)}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                            >
                                <ShieldCheck className="w-4 h-4 text-slate-600" />
                                <span>{renter.driver_license_status === 'verified' ? 'Driver License 🪪' : 'Upload License'}</span>
                            </button>

                            <Link
                                href="/vehicles"
                                className="px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
                            >
                                <CarFront className="w-4 h-4" />
                                <span>Browse More Vehicles</span>
                            </Link>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'all', label: 'All Trips', count: counts.all },
                            { id: 'accepted', label: 'Confirmed', count: counts.accepted },
                            { id: 'pending', label: 'Pending Review', count: counts.pending },
                            { id: 'completed', label: 'Completed', count: counts.completed },
                            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'bg-primary-700 text-white shadow-xs'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    activeTab === tab.id ? 'bg-primary-800 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Bookings List Section */}
                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                                <div className="w-16 h-16 bg-primary-50 text-primary-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                                    <CarFront className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg">No {activeTab !== 'all' ? activeTab : ''} Rental Trips</h3>
                                <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">
                                    Explore available cars, scooters, and vans across Bohol and reserve directly from verified local hosts.
                                </p>
                                <Link
                                    href="/vehicles"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-xl font-bold text-xs hover:bg-primary-800 transition-colors shadow-xs"
                                >
                                    <span>Browse Bohol Fleet</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBookings.map((b) => (
                                    <div
                                        key={b.id}
                                        className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5 hover:border-slate-300 transition-all"
                                    >
                                        {/* Top Header: Vehicle & Status */}
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                                            <div className="flex items-center gap-3.5">
                                                {b.vehicle?.photos?.[0] ? (
                                                    <img
                                                        src={b.vehicle.photos[0].url}
                                                        alt={b.vehicle.title}
                                                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200/80 shrink-0 shadow-2xs"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                        <CarFront className="w-8 h-8" />
                                                    </div>
                                                )}
                                                <div>
                                                    <Link
                                                        href={`/vehicles/${b.vehicle?.slug}`}
                                                        className="font-bold text-base text-slate-900 hover:text-primary-700 transition-colors block"
                                                    >
                                                        {b.vehicle?.title || 'Vehicle Listing'}
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
                                                        <span className="flex items-center gap-1 text-primary-700">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {b.vehicle?.location}, Bohol
                                                        </span>
                                                        <span>•</span>
                                                        <span className="capitalize">{b.vehicle?.type} ({b.vehicle?.transmission})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(b.status)}
                                            </div>
                                        </div>

                                        {/* Dates & Pricing Summary */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pickup Date</span>
                                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-primary-700" />
                                                    {b.start_date}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Return Date</span>
                                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-primary-700" />
                                                    {b.end_date} ({b.total_days} {b.total_days === 1 ? 'day' : 'days'})
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Price</span>
                                                <div className="font-black text-base text-primary-700">
                                                    {formatCurrency(b.total_price)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unlocked Owner Contact & Meetup Details */}
                                        {b.owner_contact && (
                                            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        Host Contact Details Unlocked!
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-emerald-700">Coordinate Handover</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    {/* 1-Click WhatsApp */}
                                                    {b.owner_contact.phone && (
                                                        <a
                                                            href={`https://wa.me/${formatPhone(b.owner_contact.phone)}?text=${encodeURIComponent(`Hi ${b.owner_contact.name}, I am your renter on RentBohol for ${b.vehicle?.title || 'the vehicle'} from ${b.start_date} to ${b.end_date}!`)}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
                                                        >
                                                            <MessageSquare className="w-3.5 h-3.5" />
                                                            <span>WhatsApp Host</span>
                                                        </a>
                                                    )}

                                                    {/* Call */}
                                                    {b.owner_contact.phone && (
                                                        <a
                                                            href={`tel:${b.owner_contact.phone}`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs transition-colors border border-emerald-200 shadow-2xs"
                                                        >
                                                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>Call ({b.owner_contact.phone})</span>
                                                        </a>
                                                    )}

                                                    {/* Google Maps Directions */}
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((b.vehicle?.location || 'Panglao') + ', Bohol, Philippines')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs transition-colors border border-emerald-200 shadow-2xs"
                                                    >
                                                        <MapPin className="w-3.5 h-3.5 text-primary-700" />
                                                        <span>Open Pickup on Google Maps</span>
                                                        <ExternalLink className="w-3 h-3 text-slate-400" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Digital Handover Checklist Info (If Available) */}
                                        {(b.checkin_odometer || b.checkin_fuel) && (
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                                                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                                    Digital Handover Inspection
                                                </span>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Check-in Odometer</span>
                                                        <span className="font-semibold">{b.checkin_odometer || 'Recorded at handover'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Check-in Fuel</span>
                                                        <span className="font-semibold">{b.checkin_fuel || 'Full'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Return Deposit</span>
                                                        <span className="font-semibold">{b.checkout_deposit_refunded ? '✅ Refunded' : 'Pending Return'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Review / Rating Status for Completed Trip */}
                                        {b.status === 'completed' && (
                                            <div className="p-3 bg-primary-50/70 border border-primary-200/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                                {b.renter_rating ? (
                                                    <div className="flex items-center gap-2 text-primary-900 font-bold">
                                                        <div className="flex items-center text-amber-500">
                                                            {[...Array(b.renter_rating.stars)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 fill-amber-400" />
                                                            ))}
                                                        </div>
                                                        <span>You rated this rental {b.renter_rating.stars}/5 Stars</span>
                                                        {b.renter_rating.comment && (
                                                            <span className="text-slate-600 font-normal italic">"{b.renter_rating.comment}"</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span className="font-bold text-primary-950 block">How was your Bohol trip?</span>
                                                            <span className="text-primary-700 text-[11px]">Share your rating to help other travelers rent with confidence.</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setRatingBooking(b)}
                                                            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                                                        >
                                                            <Star className="w-3.5 h-3.5" />
                                                            <span>Leave a Review</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Pending Status Explanation */}
                                        {b.status === 'pending' && (
                                            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                                                    The vehicle owner has been notified via SMS/Email and is reviewing your dates. Once accepted, their direct WhatsApp and phone number will unlock here!
                                                </p>
                                            </div>
                                        )}

                                        {/* Card Actions Footer */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                                            <Link
                                                href={`/booking/${b.token}`}
                                                className="font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                                            >
                                                <span>View Booking Status Page</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>

                                            {b.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(b.id)}
                                                    disabled={cancellingId === b.id}
                                                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 disabled:opacity-50"
                                                >
                                                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel Request'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* DRIVER'S LICENSE UPLOAD MODAL */}
            {showLicenseModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary-700" />
                                <h3 className="font-extrabold text-base text-slate-900">Driver's License Verification</h3>
                            </div>
                            <button onClick={() => setShowLicenseModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                            Philippine Driver's License or International Driving Permit (IDP). Upload a clear photo of the front of your license.
                        </p>

                        {renter.driver_license_path && (
                            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center gap-3">
                                <img src={renter.driver_license_path} alt="License" className="w-16 h-12 object-cover rounded-lg border border-emerald-300" />
                                <div>
                                    <span className="font-bold text-emerald-950 block">Current License on File</span>
                                    <span className="text-[11px] text-emerald-700">Verified for all Bohol rentals</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLicenseSubmit} className="space-y-4">
                            <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-slate-50/50">
                                <Upload className="w-8 h-8 text-primary-700 mx-auto" />
                                <label className="block text-xs font-bold text-slate-700 cursor-pointer">
                                    <span>Select License Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setLicenseData('license_photo', e.target.files?.[0] || null)}
                                        className="hidden"
                                        required
                                    />
                                </label>
                                <p className="text-[10px] text-slate-400">JPG, PNG, or WebP up to 5MB</p>
                                {licenseData.license_photo && (
                                    <p className="text-xs font-bold text-emerald-700 pt-1">
                                        Selected: {licenseData.license_photo.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLicenseModal(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={licenseProcessing || !licenseData.license_photo}
                                    className="flex-1 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                                >
                                    {licenseProcessing ? 'Uploading...' : 'Save & Verify'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RATE & REVIEW MODAL */}
            {ratingBooking && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                                <h3 className="font-extrabold text-base text-slate-900">Rate Your Rental Trip</h3>
                            </div>
                            <button onClick={() => setRatingBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                            How was your experience with <b>{ratingBooking.vehicle?.title}</b> and the host?
                        </p>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            {/* Star Selector */}
                            <div className="flex items-center justify-center gap-2 py-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReviewData('stars', star)}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= reviewData.stars
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-slate-200'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Your Feedback / Review (Optional)
                                </label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={e => setReviewData('comment', e.target.value)}
                                    placeholder="e.g. Smooth pickup at Panglao airport, clean car, very friendly host!"
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-primary-200 resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRatingBooking(null)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ratingProcessing}
                                    className="flex-1 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                                >
                                    {ratingProcessing ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
