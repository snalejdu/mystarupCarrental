import { Head, useForm } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';

interface Props {
    locations: string[];
    vehicleTypes: string[];
}

export default function VehicleCreate({ locations, vehicleTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: '',
        brand: '',
        model: '',
        price_per_day: '',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/owner/vehicles');
    };

    return (
        <OwnerLayout title="List a New Vehicle">
            <Head title="List a New Vehicle" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Listing Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Toyota Vios for Rent — Panglao Area"
                                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                required
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Vehicle Type</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                    required
                                >
                                    <option value="">Select type</option>
                                    {vehicleTypes.map(t => (
                                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Pickup Location</label>
                                <select
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                    required
                                >
                                    <option value="">Select location</option>
                                    {locations.map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    placeholder="e.g. Toyota"
                                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                    required
                                />
                                {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Model</label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={e => setData('model', e.target.value)}
                                    placeholder="e.g. Vios"
                                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                    required
                                />
                                {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Price per Day (₱)</label>
                            <input
                                type="number"
                                value={data.price_per_day}
                                onChange={e => setData('price_per_day', e.target.value)}
                                placeholder="e.g. 2500"
                                min="100"
                                max="100000"
                                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                                required
                            />
                            {errors.price_per_day && <p className="text-xs text-red-500 mt-1">{errors.price_per_day}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                placeholder="Tell renters about your vehicle — condition, features, pickup instructions..."
                                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Listing'}
                        </button>

                        <p className="text-xs text-[var(--color-sand-500)] text-center">
                            After creating, you'll be able to add photos and set your availability calendar.
                        </p>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
}
