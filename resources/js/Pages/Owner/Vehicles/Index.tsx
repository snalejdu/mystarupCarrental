import { Head, Link } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Plus, MapPin, Star, Eye, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
    vehicles: any[];
}

export default function VehiclesIndex({ vehicles }: Props) {
    return (
        <OwnerLayout title="My Vehicles">
            <Head title="My Vehicles" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-[var(--color-sand-500)]">
                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} listed
                </p>
                <Link
                    href="/owner/vehicles/create"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" />
                    Add Vehicle
                </Link>
            </div>

            {vehicles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-12 text-center">
                    <div className="w-16 h-16 bg-[var(--color-sand-100)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-[var(--color-sand-400)]" />
                    </div>
                    <h3 className="font-semibold text-lg text-[var(--color-primary-900)] mb-2">No vehicles yet</h3>
                    <p className="text-[var(--color-sand-500)] mb-6 max-w-sm mx-auto">
                        List your first vehicle and start receiving booking requests from travelers in Bohol.
                    </p>
                    <Link
                        href="/owner/vehicles/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-700)]"
                    >
                        <Plus className="w-4 h-4" /> List Your First Vehicle
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 stagger-children">
                    {vehicles.map((vehicle: any) => (
                        <Link
                            key={vehicle.id}
                            href={`/owner/vehicles/${vehicle.slug}`}
                            className="flex gap-4 bg-white rounded-2xl border border-[var(--color-sand-200)] p-4 card-hover"
                        >
                            <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl bg-[var(--color-sand-200)] overflow-hidden shrink-0">
                                {vehicle.photos?.[0] ? (
                                    <img src={vehicle.photos[0].url} alt={vehicle.title} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-sand-400)] text-xs">No photo</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-primary-900)] truncate">{vehicle.title}</h3>
                                        <p className="text-sm text-[var(--color-sand-500)] flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3.5 h-3.5" /> {vehicle.location}
                                        </p>
                                    </div>
                                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                        vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                                        vehicle.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {vehicle.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="font-semibold text-[var(--color-primary-600)]">{formatCurrency(Number(vehicle.price_per_day))}/day</span>
                                    {vehicle.avg_rating > 0 && (
                                        <span className="flex items-center gap-1 text-[var(--color-sand-600)]">
                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                            {Number(vehicle.avg_rating).toFixed(1)}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-[var(--color-sand-600)]">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {vehicle.bookings_count} booking{vehicle.bookings_count !== 1 ? 's' : ''}
                                    </span>
                                    {vehicle.pending_bookings_count > 0 && (
                                        <span className="flex items-center gap-1 text-[var(--color-accent-600)] font-medium">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {vehicle.pending_bookings_count} pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </OwnerLayout>
    );
}
