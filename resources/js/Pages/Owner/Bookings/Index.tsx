import { Head, Link, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import {
    Calendar, CheckCircle, XCircle, Clock, MapPin, Phone, EnvelopeSimple, User, ShieldCheck, Prohibit, ArrowRight, Check, WarningCircle, ChatCircle } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface Props {
    bookings: any;
}

export default function BookingsIndex({ bookings }: Props) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');

    const handleAccept = (id: number) => {
        if (confirm('Accept this booking? Renter contact details will be unlocked.')) {
            router.put(`/owner/bookings/${id}/accept`);
        }
    };

    const handleDecline = (id: number) => {
        if (confirm('Decline this booking request? The dates will remain available on your calendar.')) {
            router.put(`/owner/bookings/${id}/decline`);
        }
    };

    const handleCancel = (id: number) => {
        if (confirm('Are you sure you want to cancel this booking? The dates will be freed up on your calendar.')) {
            router.put(`/owner/bookings/${id}/cancel`);
        }
    };

    const handleComplete = (id: number) => {
        if (confirm('Mark this rental as completed (vehicle returned)?')) {
            router.put(`/owner/bookings/${id}/complete`);
        }
    };

    const allBookings = bookings?.data || [];

    // Counts for filter tabs
    const counts = {
        all: allBookings.length,
        pending: allBookings.filter((b: any) => b.status === 'pending').length,
        accepted: allBookings.filter((b: any) => b.status === 'accepted').length,
        completed: allBookings.filter((b: any) => b.status === 'completed').length,
        cancelled: allBookings.filter((b: any) => b.status === 'cancelled' || b.status === 'declined').length,
    };

    // Filtered list
    const filteredBookings = allBookings.filter((b: any) => {
        if (filter === 'all') return true;
        if (filter === 'cancelled') return b.status === 'cancelled' || b.status === 'declined';
        return b.status === filter;
    });

    return (
        <OwnerLayout title="Booking Requests">
            <Head title="Booking Requests — RentalHub Host" />

            <div className="space-y-4">
                {/* Header Toolbar & Category Filter Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                        <h2 className="font-bold text-slate-900 text-base">Booking Management</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Review, accept incoming rental requests, coordinate pickups, and track status.</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center justify-center ${
                                filter === 'all'
                                    ? 'bg-primary-700 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All ({counts.all})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('pending')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center justify-center gap-1.5 ${
                                filter === 'pending'
                                    ? 'bg-amber-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Pending</span>
                            {counts.pending > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-200 text-amber-800'}`}>
                                    {counts.pending}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('accepted')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center justify-center ${
                                filter === 'accepted'
                                    ? 'bg-emerald-700 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Accepted ({counts.accepted})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('completed')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center justify-center ${
                                filter === 'completed'
                                    ? 'bg-primary-700 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Completed ({counts.completed})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('cancelled')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center justify-center ${
                                filter === 'cancelled'
                                    ? 'bg-rose-700 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Cancelled ({counts.cancelled})
                        </button>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
                        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h3 className="font-bold text-base text-slate-900 mb-0.5">No {filter !== 'all' ? filter : ''} bookings found</h3>
                        <p className="text-slate-500 text-xs font-medium">When rental requests match this category, they will appear here.</p>
                    </div>
                ) : (
                    filteredBookings.map((booking: any) => {
                        const isPending = booking.status === 'pending';
                        const isAccepted = booking.status === 'accepted';
                        const isCompleted = booking.status === 'completed';
                        const isCancelled = booking.status === 'cancelled' || booking.status === 'declined';
                        const netEarnings = Number(booking.total_price) - Number(booking.commission_amount);

                        return (
                            <div
                                key={booking.id}
                                className={`bg-white rounded-2xl border transition-all shadow-xs p-4 sm:p-5 space-y-3.5 ${
                                    isPending
                                        ? 'border-amber-200/90 ring-1 ring-amber-200/50'
                                        : isCancelled
                                        ? 'border-slate-200/70 opacity-80'
                                        : 'border-slate-200/80 hover:border-slate-300'
                                }`}
                            >
                                {/* Top Row: Vehicle Info + Status Badge */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {booking.vehicle?.photos?.[0] ? (
                                            <img
                                                 src={booking.vehicle.photos[0].url}
                                                 alt=""
                                                 className="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                                             />
                                        ) : (
                                            <div className="w-14 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400 font-semibold shrink-0">
                                                No photo
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 text-sm truncate">
                                                {booking.vehicle?.title || 'Vehicle Rental'}
                                            </h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                                                <MapPin className="w-3 h-3 text-primary-600 shrink-0" />
                                                <span className="truncate">{booking.vehicle?.location}, Bohol</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 border uppercase ${
                                            isPending
                                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                : isAccepted
                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                : isCompleted
                                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                isPending
                                                    ? 'bg-amber-500'
                                                    : isAccepted
                                                    ? 'bg-emerald-500'
                                                    : isCompleted
                                                    ? 'bg-slate-500'
                                                    : 'bg-rose-500'
                                            }`}
                                        />
                                        <span>{booking.status}</span>
                                    </span>
                                </div>

                                {/* Metrics Data Strip (Minimal & Compact) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                                    {/* Renter Name */}
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Renter</span>
                                        <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5 truncate">
                                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span className="truncate">{booking.renter_display_name}</span>
                                        </span>
                                    </div>

                                    {/* Dates & Duration */}
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Rental Dates</span>
                                        <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                                            <Calendar className="w-3 h-3 text-primary-600 shrink-0" />
                                            <span>{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</span>
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">({booking.total_days} {booking.total_days === 1 ? 'day' : 'days'})</span>
                                    </div>

                                    {/* Total Price */}
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Price</span>
                                        <span className="font-extrabold text-primary-700 text-sm mt-0.5 block">
                                            {formatCurrency(Number(booking.total_price))}
                                        </span>
                                    </div>

                                    {/* Net Earnings & Fee */}
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Net Host Payout</span>
                                        <span className="font-bold text-emerald-700 mt-0.5 block">
                                            {formatCurrency(netEarnings)}
                                        </span>
                                        <span className="text-xs text-slate-400">({booking.commission_rate}% platform fee: {formatCurrency(Number(booking.commission_amount))})</span>
                                    </div>
                                </div>

                                {/* Compact Renter Contact Strip (When Unlocked) */}
                                {(isAccepted || isCompleted) && (
                                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Renter Contact Details</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap text-xs">
                                            {/* WhatsApp 1-Click Button */}
                                            {booking.renter_phone && (
                                                <a
                                                    href={`https://wa.me/${(() => {
                                                        let p = booking.renter_phone.replace(/[^0-9]/g, '');
                                                        if (p.startsWith('09')) p = '639' + p.slice(2);
                                                        return p;
                                                    })()}?text=${encodeURIComponent(`Hi ${booking.renter_display_name}, I am your host on RentalHub for your ${booking.vehicle?.title || 'rental vehicle'} booking!`)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="min-h-[44px] inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold transition-colors bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-xl border border-emerald-300 shadow-2xs"
                                                    title="Chat with renter on WhatsApp"
                                                >
                                                    <ChatCircle className="w-4 h-4 text-emerald-700" />
                                                    <span>WhatsApp</span>
                                                </a>
                                            )}

                                            {/* Phone Call */}
                                            {booking.renter_phone && (
                                                <a
                                                    href={`tel:${booking.renter_phone}`}
                                                    className="min-h-[44px] inline-flex items-center gap-1.5 text-slate-700 hover:text-primary-700 font-semibold transition-colors bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs"
                                                    title="Direct Phone Call"
                                                >
                                                    <Phone className="w-4 h-4 text-emerald-600" />
                                                    <span>{booking.renter_phone}</span>
                                                </a>
                                            )}

                                            {/* Email */}
                                            {booking.renter_email && (
                                                <a
                                                    href={`mailto:${booking.renter_email}`}
                                                    className="min-h-[44px] inline-flex items-center gap-1.5 text-slate-700 hover:text-primary-700 font-semibold transition-colors bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs"
                                                    title="Send Email"
                                                >
                                                    <EnvelopeSimple className="w-4 h-4 text-emerald-600" />
                                                    <span className="truncate max-w-[200px]">{booking.renter_email}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Cancelled / Declined Detailed Note */}
                                {isCancelled && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <Prohibit className="w-3.5 h-3.5 text-rose-500" />
                                            <span className="font-semibold text-slate-700">
                                                {booking.status === 'declined' ? 'Booking request declined' : 'Booking was cancelled'}
                                            </span>
                                            <span className="text-slate-400 hidden sm:inline">• Vehicle dates released on calendar</span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons Strip */}
                                {isPending && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                                        <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                            <span>Accepting unlocks verified phone & email</span>
                                        </span>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleDecline(booking.id)}
                                                className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center justify-center"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAccept(booking.id)}
                                                className="flex-1 sm:flex-initial min-h-[48px] glass-btn px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center"
                                            >
                                                Accept Request
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isAccepted && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking.id)}
                                            className="min-h-[44px] inline-flex items-center text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
                                        >
                                            Cancel Booking
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleComplete(booking.id)}
                                            className="w-full sm:w-auto min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Mark Rental Completed</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </OwnerLayout>
    );
}
