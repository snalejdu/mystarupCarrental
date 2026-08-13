import { Head, Link, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Calendar, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, User, ShieldAlert, Check, X, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    bookings: any;
}

export default function BookingsIndex({ bookings }: Props) {
    const handleAccept = (id: number) => {
        if (confirm('Accept this booking? Renter contact details will be unlocked.')) {
            router.put(`/owner/bookings/${id}/accept`);
        }
    };

    const handleDecline = (id: number) => {
        if (confirm('Decline this booking request?')) {
            router.put(`/owner/bookings/${id}/decline`);
        }
    };

    const handleComplete = (id: number) => {
        if (confirm('Mark this rental as completed (vehicle returned)?')) {
            router.put(`/owner/bookings/${id}/complete`);
        }
    };

    return (
        <OwnerLayout title="Booking Requests">
            <Head title="Booking Requests" />

            <div className="space-y-4">
                {bookings.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-12 text-center">
                        <Calendar className="w-12 h-12 text-[var(--color-sand-300)] mx-auto mb-3" />
                        <h3 className="font-semibold text-lg text-[var(--color-primary-900)] mb-1">No booking requests yet</h3>
                        <p className="text-[var(--color-sand-500)] text-sm">When renters request your vehicles, they will appear here for your review.</p>
                    </div>
                ) : (
                    bookings.data.map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-sand-100)]">
                                <div className="flex items-center gap-3">
                                    {booking.vehicle?.photos?.[0] ? (
                                        <img src={booking.vehicle.photos[0].url} alt="" className="w-14 h-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-14 h-12 rounded-lg bg-[var(--color-sand-100)] flex items-center justify-center text-xs text-[var(--color-sand-400)]">No photo</div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-primary-900)] text-base">{booking.vehicle?.title}</h4>
                                        <p className="text-xs text-[var(--color-sand-500)] flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {booking.vehicle?.location}, Bohol
                                        </p>
                                    </div>
                                </div>

                                <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    booking.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Renter</p>
                                    <p className="font-medium text-[var(--color-primary-900)] mt-0.5">{booking.renter_display_name}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Dates</p>
                                    <p className="font-medium text-[var(--color-primary-900)] mt-0.5">
                                        {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                    </p>
                                    <p className="text-xs text-[var(--color-sand-500)]">({booking.total_days} days)</p>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Total Price</p>
                                    <p className="font-bold text-[var(--color-primary-600)] text-base mt-0.5">{formatCurrency(Number(booking.total_price))}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--color-sand-500)] uppercase tracking-wider">Platform Commission ({booking.commission_rate}%)</p>
                                    <p className="font-medium text-[var(--color-sand-700)] mt-0.5">{formatCurrency(Number(booking.commission_amount))}</p>
                                </div>
                            </div>

                            {/* Contact Box (Unlocked vs Masked) */}
                            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                                booking.status === 'accepted' || booking.status === 'completed'
                                    ? 'bg-green-50/70 border-green-200 text-green-900'
                                    : 'bg-[var(--color-sand-50)] border-[var(--color-sand-200)] text-[var(--color-sand-700)]'
                            }`}>
                                {booking.status === 'accepted' || booking.status === 'completed' ? (
                                    <div className="space-y-1">
                                        <p className="font-semibold text-green-800 flex items-center gap-1.5 text-xs mb-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" /> Contact Details Unlocked
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                                            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-green-700" /> <a href={`tel:${booking.renter_contact}`} className="underline">{booking.renter_contact}</a></span>
                                            {booking.renter_email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-green-700" /> <a href={`mailto:${booking.renter_email}`} className="underline">{booking.renter_email}</a></span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-sand-600)]">
                                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                                        <span>Renter contact number is hidden until you accept this booking request.</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                                {booking.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleDecline(booking.id)}
                                            className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" /> Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(booking.id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Accept Request
                                        </button>
                                    </>
                                )}

                                {booking.status === 'accepted' && (
                                    <button
                                        onClick={() => handleComplete(booking.id)}
                                        className="px-4 py-2 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" /> Mark as Returned / Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </OwnerLayout>
    );
}
