import { Head, useForm, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Gauge, Users, Wind, Ban, Info, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useState, useRef } from 'react';

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
        transmission: 'automatic',
        seats: 5,
        has_aircon: true,
        price_per_day: '',
        location: '',
    });

    const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const newFiles = Array.from(e.target.files);
        setSelectedPhotos(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePhoto = (index: number) => {
        setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleTypeChange = (selectedType: string) => {
        if (selectedType === 'motorbike') {
            setData(prev => ({
                ...prev,
                type: selectedType,
                has_aircon: false,
                seats: 2,
            }));
        } else if (selectedType === 'van') {
            setData(prev => ({
                ...prev,
                type: selectedType,
                has_aircon: true,
                seats: prev.seats === 2 ? 15 : prev.seats,
            }));
        } else {
            setData(prev => ({
                ...prev,
                type: selectedType,
                has_aircon: true,
                seats: prev.seats === 2 ? 5 : prev.seats,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            formData.append(key, String(val));
        });
        selectedPhotos.forEach(file => {
            formData.append('photos[]', file);
        });

        router.post('/owner/vehicles', formData, {
            forceFormData: true,
        });
    };

    const isMotorbike = data.type === 'motorbike';

    return (
        <OwnerLayout title="List a New Vehicle">
            <Head title="List a New Vehicle — RentBohol Host" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Listing Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Toyota Vios for Rent — Panglao Area"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                required
                            />
                            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Vehicle Type</label>
                                <select
                                    value={data.type}
                                    onChange={e => handleTypeChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                    required
                                >
                                    <option value="">Select type</option>
                                    {vehicleTypes.map(t => (
                                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.type}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Pickup Location</label>
                                <select
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                    required
                                >
                                    <option value="">Select location</option>
                                    {locations.map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                                {errors.location && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    placeholder="e.g. Toyota"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                    required
                                />
                                {errors.brand && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.brand}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Model</label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={e => setData('model', e.target.value)}
                                    placeholder="e.g. Vios"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                    required
                                 />
                                {errors.model && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.model}</p>}
                            </div>
                        </div>

                        {/* Vehicle Key Specifications Header */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Key Specifications
                                </span>
                                {isMotorbike && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                        <Ban className="w-3 h-3 text-slate-400" />
                                        <span>AC N/A for Motorbikes</span>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Transmission */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Gauge className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Transmission</span>
                                    </label>
                                    <select
                                        value={data.transmission}
                                        onChange={e => setData('transmission', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                    {errors.transmission && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.transmission}</p>}
                                </div>

                                {/* Seats */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Seats (Capacity)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.seats}
                                        onChange={e => setData('seats', parseInt(e.target.value) || 1)}
                                        placeholder="e.g. 5"
                                        min="1"
                                        max="60"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    />
                                    {errors.seats && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.seats}</p>}
                                </div>

                                {/* Air Conditioning */}
                                <div className={isMotorbike ? 'opacity-80' : ''}>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Wind className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Air Conditioning</span>
                                    </label>
                                    <select
                                        value={data.has_aircon ? '1' : '0'}
                                        onChange={e => setData('has_aircon', e.target.value === '1')}
                                        disabled={isMotorbike}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed font-medium"
                                        required
                                    >
                                        <option value="1">Air Conditioned</option>
                                        <option value="0">Non-Aircon (Open Air)</option>
                                    </select>
                                    {isMotorbike ? (
                                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                            <Info className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span>Open-air vehicle type (no AC unit)</span>
                                        </p>
                                    ) : (
                                        errors.has_aircon && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.has_aircon}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Price per Day (₱)</label>
                            <input
                                type="number"
                                value={data.price_per_day}
                                onChange={e => setData('price_per_day', e.target.value)}
                                placeholder="e.g. 2500"
                                min="100"
                                max="100000"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                required
                            />
                            {errors.price_per_day && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price_per_day}</p>}
                        </div>

                        {/* Vehicle Photos Upload Section */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-primary-700" />
                                    <span>Vehicle Photos</span>
                                </label>
                                <span className="text-[11px] font-semibold text-slate-500">
                                    {selectedPhotos.length} photo{selectedPhotos.length === 1 ? '' : 's'} selected
                                </span>
                            </div>

                            {/* Drop Zone Box */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-primary-50/30 transition-all group"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoSelect}
                                    className="hidden"
                                />
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-600 group-hover:text-primary-700 shadow-2xs">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-800">
                                    Click here to select vehicle photos from your device
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                    Upload JPG, PNG, WebP up to 5MB (multiple photos allowed)
                                </p>
                            </div>

                            {/* Photo Previews Grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 pt-2">
                                    {previews.map((url, i) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
                                            <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(i)}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                placeholder="Tell renters about your vehicle — condition, features, pickup instructions..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors resize-none"
                            />
                            {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="glass-btn w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
                        >
                            {processing ? 'Creating Listing...' : 'Create Listing'}
                        </button>

                        <p className="text-xs text-slate-500 text-center font-medium">
                            After creating, you'll be able to add photos and set your availability calendar.
                        </p>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
}
