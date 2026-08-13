import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    CarFront, Calendar, MapPin, PhoneCall, Mail, Clock,
    CheckCircle2, AlertCircle, XCircle, Star, ArrowRight, ShieldCheck, User
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
    created_at: string;
    owner_contact: {
        name: string;
        phone: string;
        email: string;
    } | null;
    can_rate: boolean;
}

interface Props {
    bookings: BookingItem[];
    renter: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function RenterBookings({ bookings, renter }: Props) {
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleCancel = (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this pending booking request?')) return;
        setCancellingId(bookingId);
        router.post(`/renter/bookings/${bookingId}/cancel`, {}, {
            onFinish: () => setCancellingId(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black">
                        <Clock className="w-3.5 h-3.5" /> PENDING REVIEW
                    </span>
                );
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED & ACCEPTED
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-black">
                        <ShieldCheck className="w-3.5 h-3.5" /> RENTAL COMPLETED
                    </span>
                );
            case 'declined':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black">
                        <XCircle className="w-3.5 h-3.5" /> CANCELLED / DECLINED
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <PublicLayout>
            <Head title="My Rental Trips — RentBohol" />

            <div className="min-h-screen bg-slate-50 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Dashboard Welcome Header Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-extrabold mb-2 border border-indigo-100">
                                <User className="w-3.5 h-3.5" /> Registered Renter Account
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Welcome, {renter.name}!
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">
                                Track all your Bohol rental requests, unlocked owner contacts, and upcoming trip schedules.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/vehicles"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                            >
                                <CarFront className="w-4 h-4" />
                                <span>Book Another Vehicle</span>
                            </Link>
                        </div>
                    </div>

                    {/* Bookings List Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>My Rental Bookings ({bookings.length})</span>
                        </h2>

                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <CarFront className="w-8 h-8" />
                                </div>
                                <h3 className="font-extrabold text-slate-900 text-lg">No Rental Bookings Yet</h3>
                                <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">
                                    Explore 15+ Bohol municipalities and reserve sedans, scooters, or group vans directly from local hosts.
                                </p>
                                <Link
                                    href="/vehicles"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 shadow-md"
                                >
                                    <span>Browse Bohol Fleet</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((b) => (
                                    <div
                                        key={b.id}
                                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6 hover:shadow-md transition-shadow"
                                    >
                                        {/* Card Top Row: Header & Status */}
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                                            <div className="flex items-center gap-3">
                                                {b.vehicle?.photos?.[0] ? (
                                                    <img
                                                        src={b.vehicle.photos[0].url}
                                                        alt={b.vehicle.name}
                                                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                        <CarFront className="w-7 h-7" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-extrabold text-base text-slate-900">
                                                        {b.vehicle?.name || 'Vehicle'}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                                        {b.vehicle?.municipality}, Bohol
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(b.status)}
                                            </div>
                                        </div>

                                        {/* Card Middle: Dates & Pricing Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pickup Date</span>
                                                <div className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                    {b.start_date}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Return Date</span>
                                                <div className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                    {b.end_date} ({b.total_days} Days)
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Rental Price</span>
                                                <div className="font-black text-sm text-indigo-600">
                                                    {formatCurrency(b.total_price)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unlocked Owner Contact Details (If Accepted or Completed) */}
                                        {b.owner_contact && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-emerald-800 text-xs font-extrabold">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    <span>Owner Contact Details Unlocked!</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-800 pt-1">
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 font-semibold block">Host Name</span>
                                                        {b.owner_contact.name}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 font-semibold block">Mobile Phone</span>
                                                        <a href={`tel:${b.owner_contact.phone}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                                                            <PhoneCall className="w-3.5 h-3.5" /> {b.owner_contact.phone}
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 font-semibold block">Email Address</span>
                                                        <a href={`mailto:${b.owner_contact.email}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                                                            <Mail className="w-3.5 h-3.5" /> {b.owner_contact.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pending Status Explanation */}
                                        {b.status === 'pending' && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                                    The vehicle owner is currently reviewing your dates. Once accepted, their direct phone number will unlock right here!
                                                </p>
                                            </div>
                                        )}

                                        {/* Card Actions Footer */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                            <Link
                                                href={`/booking/${b.token}`}
                                                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                            >
                                                <span>View Public Status Token Page</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>

                                            {b.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(b.id)}
                                                    disabled={cancellingId === b.id}
                                                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 disabled:opacity-50"
                                                >
                                                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking Request'}
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
        </PublicLayout>
    );
}
