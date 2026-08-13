import { Head, useForm, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Upload, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
    vehicle: any;
    availability: { date: string; status: string }[];
    locations: string[];
    vehicleTypes: string[];
}

export default function VehicleEdit({ vehicle, availability, locations, vehicleTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: vehicle.title,
        description: vehicle.description || '',
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        price_per_day: vehicle.price_per_day,
        location: vehicle.location,
        status: vehicle.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/owner/vehicles/${vehicle.slug}`);
    };

    return (
        <OwnerLayout title={`Edit: ${vehicle.title}`}>
            <Head title={`Edit ${vehicle.title}`} />

            <div className="space-y-6">
                {/* Vehicle Details Form */}
                <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6">
                    <h2 className="font-semibold text-[var(--color-primary-900)] mb-4">Vehicle Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Listing Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required>
                                    {vehicleTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Location</label>
                                <select value={data.location} onChange={e => setData('location', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required>
                                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Brand</label>
                                <input type="text" value={data.brand} onChange={e => setData('brand', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Model</label>
                                <input type="text" value={data.model} onChange={e => setData('model', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Price/Day (₱)</label>
                                <input type="number" value={data.price_per_day} onChange={e => setData('price_per_day', e.target.value)} min="100" className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-sand-600)] uppercase tracking-wider mb-1">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-sand-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
                                <option value="active">Active (visible to renters)</option>
                                <option value="inactive">Inactive (hidden)</option>
                            </select>
                        </div>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[var(--color-primary-600)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-700)] disabled:opacity-50 transition-colors">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Photo Upload Section */}
                <PhotoManager vehicle={vehicle} />

                {/* Availability Calendar */}
                <AvailabilityManager vehicle={vehicle} availability={availability} />
            </div>
        </OwnerLayout>
    );
}

function PhotoManager({ vehicle }: { vehicle: any }) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const formData = new FormData();
        Array.from(e.target.files).forEach(file => formData.append('photos[]', file));
        setUploading(true);
        router.post(`/owner/vehicles/${vehicle.slug}/photos`, formData, {
            onFinish: () => setUploading(false),
            forceFormData: true,
        });
    };

    const deletePhoto = (photoId: number) => {
        if (confirm('Delete this photo?')) {
            router.delete(`/owner/vehicles/${vehicle.slug}/photos/${photoId}`);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6">
            <h2 className="font-semibold text-[var(--color-primary-900)] mb-4">Photos</h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {vehicle.photos?.map((photo: any) => (
                    <div key={photo.id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-sand-200)] group">
                        <img src={photo.url} alt={photo.alt_text} className="w-full h-full object-cover" />
                        <button
                            onClick={() => deletePhoto(photo.id)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {/* Upload trigger */}
                <button
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-[var(--color-sand-300)] flex flex-col items-center justify-center text-[var(--color-sand-400)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                >
                    {uploading ? (
                        <span className="text-xs">Uploading...</span>
                    ) : (
                        <>
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-xs">Add Photo</span>
                        </>
                    )}
                </button>
            </div>

            <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleUpload}
                className="hidden"
            />

            <p className="text-xs text-[var(--color-sand-500)]">JPEG, PNG, or WebP. Max 5MB per photo. Up to 10 photos.</p>
        </div>
    );
}

function AvailabilityManager({ vehicle, availability }: { vehicle: any; availability: any[] }) {
    const [month, setMonth] = useState(new Date());
    const [changes, setChanges] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const startPad = firstDay.getDay();
    const today = new Date().toISOString().split('T')[0];

    const availMap: Record<string, string> = {};
    availability.forEach(a => { availMap[a.date] = a.status; });

    const getStatus = (dateStr: string) => changes[dateStr] || availMap[dateStr] || 'available';

    const toggleDate = (dateStr: string) => {
        if (dateStr < today) return;
        const current = getStatus(dateStr);
        const next = current === 'available' ? 'blocked' : 'available';
        setChanges(prev => ({ ...prev, [dateStr]: next }));
    };

    const saveChanges = () => {
        if (Object.keys(changes).length === 0) return;
        setSaving(true);
        const dates = Object.entries(changes).map(([date, status]) => ({ date, status }));
        router.put(`/owner/vehicles/${vehicle.slug}/availability`, { dates }, {
            onFinish: () => { setSaving(false); setChanges({}); },
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6">
            <h2 className="font-semibold text-[var(--color-primary-900)] mb-4">Availability Calendar</h2>
            <p className="text-sm text-[var(--color-sand-500)] mb-4">Click dates to toggle between available and blocked. Booked dates (from confirmed bookings) cannot be changed.</p>

            <div className="flex items-center justify-between mb-3">
                <button onClick={() => setMonth(new Date(year, m - 1, 1))} className="p-2 rounded-lg hover:bg-[var(--color-sand-100)]"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-semibold">{month.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setMonth(new Date(year, m + 1, 1))} className="p-2 rounded-lg hover:bg-[var(--color-sand-100)]"><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-[var(--color-sand-500)] py-1">{d}</div>
                ))}
                {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = getStatus(dateStr);
                    const isPast = dateStr < today;
                    const isBooked = status === 'booked';
                    const isChanged = dateStr in changes;

                    let bgClass = 'bg-green-50 text-green-800 border-green-200 cursor-pointer hover:bg-green-100';
                    if (isPast) bgClass = 'bg-[var(--color-sand-100)] text-[var(--color-sand-400)] cursor-not-allowed';
                    else if (isBooked) bgClass = 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed';
                    else if (status === 'blocked') bgClass = 'bg-gray-200 text-gray-600 border-gray-300 cursor-pointer hover:bg-gray-300';

                    return (
                        <button
                            key={day}
                            onClick={() => !isPast && !isBooked && toggleDate(dateStr)}
                            disabled={isPast || isBooked}
                            className={`text-center py-1.5 text-xs rounded-lg border ${bgClass} ${isChanged ? 'ring-2 ring-[var(--color-accent-500)]' : ''}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex gap-3 text-xs text-[var(--color-sand-600)]">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Available</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-300" /> Blocked</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> Booked</span>
                </div>
                {Object.keys(changes).length > 0 && (
                    <button onClick={saveChanges} disabled={saving} className="px-4 py-2 bg-[var(--color-primary-600)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-700)] disabled:opacity-50">
                        {saving ? 'Saving...' : `Save ${Object.keys(changes).length} Changes`}
                    </button>
                )}
            </div>
        </div>
    );
}
