import { Head, useForm, router } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Gauge, Users, Wind, Prohibit, Info, UploadSimple, Image as ImageIcon, X, GasPump, CheckCircle, MapPin } from '@phosphor-icons/react';
import { useState, useRef } from 'react';

const DISTANCE_PRESETS = [
    'Unlimited',
    'Bohol Island Only',
    '100 km / day',
    '150 km / day',
    '200 km / day',
    '250 km / day',
    '300 km / day',
];

interface Props {
    locations: string[];
    vehicleTypes: string[];
}

const CAR_EQUIPMENT_OPTIONS = [
    'ABS Brakes',
    'Dual Air Bags',
    'Cruise Control',
    'Cold Air Conditioner',
    'Bluetooth Audio',
    'Backup Camera',
    'Front Dashcam',
    'USB Charging Ports',
    'GPS Navigation',
    'Leather Seats',
];

const MOTORBIKE_EQUIPMENT_OPTIONS = [
    '2 Clean Helmets Included',
    'Cell Phone Holder / Mount',
    'Rear Top Box / Storage',
    'Front Disc Brakes',
    'Raincoat / Rain Poncho',
    'USB Phone Charger Port',
    'Anti-Theft Disc Lock',
];

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
        distance_limit: 'Unlimited',
        fuel_type: 'Unleaded Gas',
        features: ['ABS Brakes', 'Dual Air Bags', 'Cruise Control', 'Cold Air Conditioner', 'Bluetooth Audio', 'Backup Camera'],
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
                fuel_type: 'Unleaded Gas',
                features: ['2 Clean Helmets Included', 'Cell Phone Holder / Mount', 'Front Disc Brakes'],
            }));
        } else if (selectedType === 'van') {
            setData(prev => ({
                ...prev,
                type: selectedType,
                has_aircon: true,
                seats: prev.seats === 2 ? 15 : prev.seats,
                fuel_type: 'Diesel',
                features: ['ABS Brakes', 'Dual Air Bags', 'Cold Air Conditioner', 'Bluetooth Audio', 'Backup Camera', 'USB Charging Ports'],
            }));
        } else {
            setData(prev => ({
                ...prev,
                type: selectedType,
                has_aircon: true,
                seats: prev.seats === 2 ? 5 : prev.seats,
                fuel_type: 'Unleaded Gas',
                features: ['ABS Brakes', 'Dual Air Bags', 'Cruise Control', 'Cold Air Conditioner', 'Bluetooth Audio', 'Backup Camera'],
            }));
        }
    };

    const toggleFeature = (feature: string) => {
        setData('features', 
            data.features.includes(feature)
                ? data.features.filter(f => f !== feature)
                : [...data.features, feature]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            if (key === 'features' && Array.isArray(val)) {
                val.forEach(item => formData.append('features[]', item));
            } else {
                formData.append(key, String(val));
            }
        });
        selectedPhotos.forEach(file => {
            formData.append('photos[]', file);
        });

        router.post('/owner/vehicles', formData, {
            forceFormData: true,
        });
    };

    const isMotorbike = data.type === 'motorbike';
    const availableEquipment = isMotorbike ? MOTORBIKE_EQUIPMENT_OPTIONS : CAR_EQUIPMENT_OPTIONS;

    return (
        <OwnerLayout title="List a New Vehicle">
            <Head title="List a New Vehicle — RentBohol Host" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Listing Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Toyota Vios for Rent — Panglao Area"
                                className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                required
                            />
                            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Vehicle Type</label>
                                <select
                                    value={data.type}
                                    onChange={e => handleTypeChange(e.target.value)}
                                    className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors capitalize bg-white"
                                    required
                                >
                                    <option value="">Select type</option>
                                    {vehicleTypes.map(t => (
                                        <option key={t} value={t} className="capitalize">{t}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.type}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Pickup Location</label>
                                <select
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white"
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Brand</label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    placeholder="e.g. Toyota"
                                    className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                    required
                                />
                                {errors.brand && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.brand}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Model</label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={e => setData('model', e.target.value)}
                                    placeholder="e.g. Vios"
                                    className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
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
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                        <Prohibit className="w-3.5 h-3.5 text-slate-400" />
                                        <span>AC N/A for Motorbikes</span>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                                {/* Transmission */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Gauge className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Transmission</span>
                                    </label>
                                    <select
                                        value={data.transmission}
                                        onChange={e => setData('transmission', e.target.value)}
                                        className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                    {errors.transmission && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.transmission}</p>}
                                </div>

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <GasPump className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Fuel Type</span>
                                    </label>
                                    <select
                                        value={data.fuel_type}
                                        onChange={e => setData('fuel_type', e.target.value)}
                                        className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    >
                                        <option value="Unleaded Gas">Unleaded Gas</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Electric">Electric</option>
                                    </select>
                                </div>

                                {/* Seats */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Seats</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.seats}
                                        onChange={e => setData('seats', parseInt(e.target.value) || 1)}
                                        placeholder="e.g. 5"
                                        min="1"
                                        max="60"
                                        className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    />
                                    {errors.seats && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.seats}</p>}
                                </div>

                                {/* Air Conditioning */}
                                <div className={isMotorbike ? 'opacity-80' : ''}>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Wind className="w-3.5 h-3.5 text-primary-700" />
                                        <span>AC Unit</span>
                                    </label>
                                    <select
                                        value={data.has_aircon ? '1' : '0'}
                                        onChange={e => setData('has_aircon', e.target.value === '1')}
                                        disabled={isMotorbike}
                                        className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed font-medium bg-white"
                                        required
                                    >
                                        <option value="1">Air Conditioned</option>
                                        <option value="0">Non-Aircon</option>
                                    </select>
                                    {isMotorbike ? (
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>Open-air vehicle</span>
                                        </p>
                                    ) : (
                                        errors.has_aircon && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.has_aircon}</p>
                                    )}
                                </div>

                                {/* Distance / Mileage Limit */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Distance Limit</span>
                                    </label>
                                    <select
                                        value={DISTANCE_PRESETS.includes(data.distance_limit) ? data.distance_limit : 'custom'}
                                        onChange={e => {
                                            if (e.target.value !== 'custom') {
                                                setData('distance_limit', e.target.value);
                                            } else {
                                                setData('distance_limit', '150 km / day');
                                            }
                                        }}
                                        className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    >
                                        <option value="Unlimited">Unlimited Mileage</option>
                                        <option value="Bohol Island Only">Bohol Island Only</option>
                                        <option value="100 km / day">100 km / day</option>
                                        <option value="150 km / day">150 km / day</option>
                                        <option value="200 km / day">200 km / day</option>
                                        <option value="250 km / day">250 km / day</option>
                                        <option value="300 km / day">300 km / day</option>
                                        <option value="custom">Custom Limit...</option>
                                    </select>
                                    {!DISTANCE_PRESETS.includes(data.distance_limit) && (
                                        <input
                                            type="text"
                                            value={data.distance_limit}
                                            onChange={e => setData('distance_limit', e.target.value)}
                                            placeholder="e.g. 180 km / day"
                                            className="w-full mt-1.5 h-10 px-3 rounded-lg border border-primary-300 text-base sm:text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary-200 bg-primary-50/40"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Equipment & Features Checkbox Section */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Vehicle Equipment & Inclusions
                                    </label>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Check all features available on this {isMotorbike ? 'motorbike' : 'vehicle'} for renters.
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                                    {data.features.length} selected
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {availableEquipment.map(feature => {
                                    const isChecked = data.features.includes(feature);
                                    return (
                                        <button
                                            key={feature}
                                            type="button"
                                            onClick={() => toggleFeature(feature)}
                                            className={`min-h-[48px] p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                                isChecked
                                                    ? 'bg-primary-50/70 border-primary-300 text-primary-950 font-semibold shadow-2xs'
                                                    : 'bg-slate-50/60 border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="text-xs font-medium">{feature}</span>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                                isChecked
                                                    ? 'bg-primary-600 border-primary-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {isChecked && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Price per Day (₱)</label>
                            <input
                                type="number"
                                value={data.price_per_day}
                                onChange={e => setData('price_per_day', e.target.value)}
                                placeholder="e.g. 2500"
                                min="100"
                                max="100000"
                                className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                required
                            />
                            {errors.price_per_day && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price_per_day}</p>}
                        </div>

                        {/* Vehicle Photos Upload Section */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-primary-700" />
                                    <span>Vehicle Photos</span>
                                </label>
                                <span className="text-xs font-semibold text-slate-500">
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
                                    <UploadSimple className="w-5 h-5" />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-slate-800">
                                    Click here to select vehicle photos from your device
                                </p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">
                                    Upload JPG, PNG, WebP up to 5MB (multiple photos allowed)
                                </p>
                            </div>

                            {/* Photo Previews Grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    {previews.map((url, i) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
                                            <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(i)}
                                                className="absolute top-1.5 right-1.5 min-w-[36px] min-h-[36px] rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                                                aria-label="Remove photo"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                placeholder="Tell renters about your vehicle — condition, features, pickup instructions..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors resize-none"
                            />
                            {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="glass-btn w-full min-h-[48px] py-3.5 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 cursor-pointer"
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
