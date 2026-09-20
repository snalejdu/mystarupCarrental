import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CheckCircle, Clock, XCircle, Star, MapPin, Calendar, Phone, EnvelopeSimple, User, CreditCard, ShareNetwork, Copy, ShieldCheck } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '@/lib/utils';
import PaymentModal from '@/Components/PaymentModal';
import { triggerToast } from '@/Components/DynamicToast';

interface Props {
    booking: any;
    ownerContact: { name: string; phone: string; email: string } | null;
}

export default function RenterStatus({ booking, ownerContact }: Props) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isPaid, setIsPaid] = useState(booking.is_paid || false);

    const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string; message: string }> = {
        pending: {
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50/80 border-amber-200/80 text-amber-900',
            label: 'Pending Host Review',
            message: 'Your booking request is being reviewed by the vehicle owner. You\'ll be notified once they respond.',
        },
        accepted: {
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900',
            label: 'Accepted & Confirmed!',
            message: 'Great news! The host accepted your reservation. Direct contact details and instant checkout are now unlocked below.',
        },
        declined: {
            icon: XCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50/80 border-rose-200/80 text-rose-900',
            label: 'Declined',
            message: 'Unfortunately, the owner was unable to accept this booking. The dates are still available for other vehicles.',
        },
        completed: {
            icon: CheckCircle,
            color: 'text-teal-600',
            bg: 'bg-teal-50/80 border-teal-200/80 text-teal-900',
            label: 'Rental Completed',
            message: 'This rental has been completed. Thank you for traveling with RentBohol!',
        },
        cancelled: {
            icon: XCircle,
            color: 'text-slate-600',
            bg: 'bg-slate-50 border-slate-200 text-slate-800',
            label: 'Cancelled',
            message: 'This booking was cancelled.',
        },
    };

    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const copyTrackingLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            triggerToast({
                title: 'Status Link Copied!',
                description: 'Unique tracking link copied to clipboard.',
                type: 'success',
                duration: 3000,
            });
        }
    };

    return (
        <PublicLayout>
            <Head title={`Booking Status — ${status.label}`} />

            <div className="max-w-2xl mx-auto px-4 py-10 lg:py-14 animate-spring-up">
                {/* Status Hero Card */}
                <div className={`rounded-3xl border p-6 sm:p-7 mb-6 shadow-xs ${status.bg} animate-spring-scale`}>
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center shrink-0 border border-white/60">
                            <StatusIcon className={`w-6 h-6 ${status.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="font-heading text-xl font-bold text-slate-900">
                                    {status.label}
                                </h1>
                                <button
                                    type="button"
                                    onClick={copyTrackingLink}
                                    className="glass-btn-outline-light inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-slate-700 text-xs font-semibold"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Link</span>
                                </button>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{status.message}</p>
                        </div>
                    </div>
                </div>

                {/* Instant Payment Banner for Accepted Bookings */}
                {booking.status === 'accepted' && (
                    <div className="apple-card bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 mb-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-200" />
                                    {isPaid ? 'Payment Confirmed' : 'Payment Ready'}
                                </span>
                                <h3 className="text-lg font-bold">
                                    {isPaid ? 'Your Trip Is Fully Guaranteed!' : 'Secure Your Reservation'}
                                </h3>
                                <p className="text-xs text-emerald-100 mt-0.5">
                                    {isPaid
                                        ? 'Payment verified via GCash/Card. Present your ID during pickup.'
                                        : 'Pay via GCash, Maya, or Card for instant 1-click rental confirmation.'}
                                </p>
                            </div>

                            {!isPaid && (
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(true)}
                                    className="glass-btn-accent px-6 py-3 font-bold rounded-2xl text-xs shrink-0 flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-4 h-4 text-white" />
                                    <span>Pay {formatCurrency(Number(booking.total_price))}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Owner Contact (only shown after acceptance) */}
                {ownerContact && (
                    <div className="apple-card bg-white rounded-3xl border border-slate-200/80 p-6 mb-6 shadow-xs">
                        <h2 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-700" />
                            Verified Host Contact Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle Host</span>
                                    <span className="text-xs font-bold text-slate-800">{ownerContact.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Direct Mobile / Viber</span>
                                    <a href={`tel:${ownerContact.phone}`} className="text-xs font-bold text-primary-700 hover:underline">
                                        {ownerContact.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Details */}
                <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6 mb-6">
                    <h2 className="font-semibold text-[var(--color-primary-900)] mb-4">Booking Details</h2>

                    {booking.vehicle && (
                        <div className="flex gap-4 mb-4 pb-4 border-b border-[var(--color-sand-100)]">
                            {booking.vehicle.photos?.[0] && (
                                <img
                                    src={booking.vehicle.photos[0].url}
                                    alt={booking.vehicle.title}
                                    className="w-24 h-18 rounded-xl object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-[var(--color-primary-900)]">{booking.vehicle.title}</h3>
                                <p className="text-sm text-[var(--color-sand-500)] flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" /> {booking.vehicle.location}, Bohol
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Pickup Date</p>
                            <p className="font-medium flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                                {formatDate(booking.start_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Return Date</p>
                            <p className="font-medium flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                                {formatDate(booking.end_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Duration</p>
                            <p className="font-medium mt-0.5">{booking.total_days} day{booking.total_days !== 1 ? 's' : ''}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Total Price</p>
                            <p className="font-bold text-[var(--color-primary-600)] text-lg mt-0.5">{formatCurrency(Number(booking.total_price))}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Form */}
                {booking.can_rate && (
                    <RatingForm token={booking.token} />
                )}

                <p className="text-center text-xs text-slate-400 mt-6">
                    Bookmark this page to check your booking status. Your unique booking link won't change.
                </p>
            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <PaymentModal
                    show={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    booking={{
                        id: booking.id,
                        vehicle_name: booking.vehicle?.title || 'Island Rental Vehicle',
                        total_price: Number(booking.total_price),
                        start_date: booking.start_date,
                        end_date: booking.end_date,
                        days: booking.total_days,
                    }}
                    onPaymentSuccess={(receipt) => {
                        setIsPaid(true);
                        setShowPaymentModal(false);
                    }}
                />
            )}
        </PublicLayout>
    );
}

function RatingForm({ token }: { token: string }) {
    const { data, setData, post, processing, errors } = useForm({
        stars: 0,
        comment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/booking/${token}/rate`);
    };

    return (
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6 animate-slide-up">
            <h2 className="font-semibold text-[var(--color-primary-900)] mb-3">Rate Your Experience</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setData('stars', star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${
                                        star <= data.stars
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-[var(--color-sand-300)] hover:text-yellow-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    {errors.stars && <p className="text-xs text-red-500 mt-1">{errors.stars}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Comment (optional)</label>
                    <textarea
                        value={data.comment}
                        onChange={e => setData('comment', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"
                        placeholder="How was your experience?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing || data.stars === 0}
                    className="glass-btn px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
                >
                    {processing ? 'Submitting...' : 'Submit Rating'}
                </button>
            </form>
        </div>
    );
}
