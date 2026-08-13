import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CheckCircle, Clock, XCircle, Star, MapPin, Calendar, Phone, Mail, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    booking: any;
    ownerContact: { name: string; phone: string; email: string } | null;
}

export default function RenterStatus({ booking, ownerContact }: Props) {
    const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string; message: string }> = {
        pending: {
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50 border-yellow-200',
            label: 'Pending Review',
            message: 'Your booking request is being reviewed by the vehicle owner. You\'ll be notified once they respond.',
        },
        accepted: {
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50 border-green-200',
            label: 'Accepted!',
            message: 'Great news! The owner has accepted your booking. Contact details are now available below.',
        },
        declined: {
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50 border-red-200',
            label: 'Declined',
            message: 'Unfortunately, the owner was unable to accept this booking. The dates are still available for other vehicles.',
        },
        completed: {
            icon: CheckCircle,
            color: 'text-blue-600',
            bg: 'bg-blue-50 border-blue-200',
            label: 'Completed',
            message: 'This rental has been completed. Thank you for using RentBohol!',
        },
        cancelled: {
            icon: XCircle,
            color: 'text-gray-600',
            bg: 'bg-gray-50 border-gray-200',
            label: 'Cancelled',
            message: 'This booking was cancelled.',
        },
    };

    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <PublicLayout>
            <Head title={`Booking Status — ${status.label}`} />

            <div className="max-w-2xl mx-auto px-4 py-10 lg:py-16">
                {/* Status Card */}
                <div className={`rounded-2xl border p-6 mb-6 ${status.bg} animate-fade-in`}>
                    <div className="flex items-start gap-4">
                        <StatusIcon className={`w-8 h-8 ${status.color} shrink-0 mt-0.5`} />
                        <div>
                            <h1 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-primary-900)]">
                                {status.label}
                            </h1>
                            <p className="text-sm text-[var(--color-sand-700)] mt-1">{status.message}</p>
                        </div>
                    </div>
                </div>

                {/* Owner Contact (only shown after acceptance) */}
                {ownerContact && (
                    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6 mb-6 animate-slide-up">
                        <h2 className="font-semibold text-[var(--color-primary-900)] mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-[var(--color-primary-600)]" />
                            Owner Contact Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-[var(--color-sand-400)]" />
                                <span className="text-sm font-medium">{ownerContact.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[var(--color-sand-400)]" />
                                <a href={`tel:${ownerContact.phone}`} className="text-sm text-[var(--color-primary-600)] font-medium hover:underline">
                                    {ownerContact.phone}
                                </a>
                            </div>
                            {ownerContact.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[var(--color-sand-400)]" />
                                    <a href={`mailto:${ownerContact.email}`} className="text-sm text-[var(--color-primary-600)] font-medium hover:underline">
                                        {ownerContact.email}
                                    </a>
                                </div>
                            )}
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

                <p className="text-center text-xs text-[var(--color-sand-400)] mt-6">
                    Bookmark this page to check your booking status. Your unique booking link won't change.
                </p>
            </div>
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
                    className="px-6 py-2.5 bg-[var(--color-primary-600)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-700)] disabled:opacity-50 transition-colors"
                >
                    {processing ? 'Submitting...' : 'Submit Rating'}
                </button>
            </form>
        </div>
    );
}
