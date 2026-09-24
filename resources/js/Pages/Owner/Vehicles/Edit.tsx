import { Head, useForm, router, Link } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import {
    Upload, Trash, CaretLeft, CaretRight, Image as ImageIcon, Gauge, Users, Wind, Prohibit, Info, Eye, Star, ArrowSquareOut, MapPin, X, MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsOutCardinal, CornersOut, CornersIn, ArrowCounterClockwise, SquaresFour, Check, Calendar, LockSimple, CalendarCheck, CalendarX, CheckCircle, Airplane, ShieldCheck, Tag, GasPump, Percent, UserCheck, Pencil, CarProfile, ArrowRight } from '@phosphor-icons/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { broadcastVehicleUpdate } from '@/lib/vehicleSync';

interface Props {
    vehicle: any;
    availability: { date: string; status: string }[];
    bookings?: any[];
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

const DISTANCE_PRESETS = [
    'Unlimited',
    'Bohol Island Only',
    '100 km / day',
    '150 km / day',
    '200 km / day',
    '250 km / day',
    '300 km / day',
];

export default function VehicleEdit({ vehicle, availability, bookings = [], locations, vehicleTypes }: Props) {
    const [showPovModal, setShowPovModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { data, setData, put, processing, errors } = useForm<{
        title: string;
        description: string;
        type: string;
        brand: string;
        model: string;
        transmission: string;
        seats: number;
        has_aircon: boolean;
        distance_limit: string;
        fuel_type: string;
        features: string[];
        price_per_day: number | string;
        security_deposit: number;
        fuel_policy: string;
        delivery_available: boolean;
        delivery_fee: number;
        discount_three_days: number;
        discount_weekly: number;
        helmets_included: boolean;
        driver_available: boolean;
        location: string;
        status: string;
    }>({
        title: vehicle.title,
        description: vehicle.description || '',
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        transmission: vehicle.transmission || 'automatic',
        seats: vehicle.seats || 5,
        has_aircon: vehicle.has_aircon ?? true,
        distance_limit: vehicle.distance_limit || 'Unlimited',
        fuel_type: vehicle.fuel_type || (vehicle.type === 'van' ? 'Diesel' : 'Unleaded Gas'),
        features: Array.isArray(vehicle.features) && vehicle.features.length > 0
            ? vehicle.features
            : (vehicle.type === 'motorbike'
                ? ['2 Clean Helmets Included', 'Cell Phone Holder / Mount', 'Front Disc Brakes']
                : ['ABS Brakes', 'Dual Air Bags', 'Cruise Control', 'Cold Air Conditioner', 'Bluetooth Audio', 'Backup Camera']),
        price_per_day: vehicle.price_per_day,
        security_deposit: vehicle.security_deposit ?? 0,
        fuel_policy: vehicle.fuel_policy || 'same_to_same',
        delivery_available: vehicle.delivery_available ?? false,
        delivery_fee: vehicle.delivery_fee ?? 0,
        discount_three_days: vehicle.discount_three_days ?? 0,
        discount_weekly: vehicle.discount_weekly ?? 0,
        helmets_included: vehicle.helmets_included ?? (vehicle.type === 'motorbike'),
        driver_available: vehicle.driver_available ?? false,
        location: vehicle.location,
        status: vehicle.status,
    });

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

    const isMotorbike = data.type === 'motorbike';

    const [calendarChanges, setCalendarChanges] = useState<Record<string, string>>({});
    const [savingCalendar, setSavingCalendar] = useState(false);

    // Live preview vehicle reflecting real-time uncommitted & committed form edits
    const livePreviewVehicle = useMemo(() => ({
        ...vehicle,
        title: data.title || vehicle.title,
        brand: data.brand || vehicle.brand,
        model: data.model || vehicle.model,
        type: data.type || vehicle.type,
        location: data.location || vehicle.location,
        price_per_day: data.price_per_day || vehicle.price_per_day,
        transmission: data.transmission || vehicle.transmission,
        seats: data.seats || vehicle.seats,
        has_aircon: data.has_aircon,
        distance_limit: data.distance_limit || vehicle.distance_limit || 'Unlimited',
        fuel_type: data.fuel_type || vehicle.fuel_type,
        features: data.features || vehicle.features,
        description: data.description || vehicle.description,
        status: data.status || vehicle.status,
        delivery_available: data.delivery_available,
        delivery_fee: data.delivery_fee,
        security_deposit: data.security_deposit,
        discount_three_days: data.discount_three_days,
        discount_weekly: data.discount_weekly,
        fuel_policy: data.fuel_policy,
        helmets_included: data.helmets_included,
        driver_available: data.driver_available,
    }), [vehicle, data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasCalendarChanges = Object.keys(calendarChanges).length > 0;

        put(`/owner/vehicles/${vehicle.slug}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (hasCalendarChanges) {
                    setSavingCalendar(true);
                    const dates = Object.entries(calendarChanges).map(([date, status]) => ({ date, status }));
                    router.put(`/owner/vehicles/${vehicle.slug}/availability`, { dates }, {
                        preserveScroll: true,
                        onFinish: () => {
                            setSavingCalendar(false);
                            setCalendarChanges({});
                            setShowSuccessModal(true);
                            broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Details & Availability' });
                        },
                    });
                } else {
                    setShowSuccessModal(true);
                    broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Details & Specs' });
                }
            },
        });
    };

    return (
        <OwnerLayout title={`Edit: ${vehicle.title}`}>
            <Head title={`Edit ${vehicle.title}`} />

            <div className="space-y-6">
                {/* Header Action Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Manage Listing: {vehicle.title}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Adjust specs, photo gallery, cover image, and availability calendar.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowPovModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors shadow-xs"
                        >
                            <Eye className="w-4 h-4 text-emerald-300" />
                            <span>Preview Renter POV</span>
                        </button>
                        <a
                            href={`/vehicles/${vehicle.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                        >
                            <span>Live View</span>
                            <ArrowSquareOut className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                    </div>
                </div>

                {/* Vehicle Details Form */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <h2 className="font-semibold text-slate-900 text-lg mb-4">Vehicle Details</h2>
                    <form id="vehicle-edit-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Listing Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors" required />
                            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Type</label>
                                <select value={data.type} onChange={e => handleTypeChange(e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white" required>
                                    {vehicleTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Location</label>
                                <select value={data.location} onChange={e => setData('location', e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white" required>
                                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Brand</label>
                                <input type="text" value={data.brand} onChange={e => setData('brand', e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Model</label>
                                <input type="text" value={data.model} onChange={e => setData('model', e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Price/Day (₱)</label>
                                <input type="number" value={data.price_per_day} onChange={e => setData('price_per_day', e.target.value)} min="100" className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors" required />
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
                                        className="w-full h-11 sm:h-10 px-3 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
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
                                        className="w-full h-11 sm:h-10 px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
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
                                        min="1"
                                        max="60"
                                        className="w-full h-11 sm:h-10 px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
                                        required
                                    />
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
                                        className="w-full h-11 sm:h-10 px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed font-medium bg-white"
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
                                        className="w-full h-11 sm:h-10 px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors bg-white font-medium"
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
                                {(isMotorbike ? MOTORBIKE_EQUIPMENT_OPTIONS : CAR_EQUIPMENT_OPTIONS).map(feature => {
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
                        {/* Delivery Options, Discounts & Rental Terms */}
                        <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-primary-700" />
                                    Delivery, Discounts & Host Policies
                                </span>
                                <span className="text-xs text-slate-500 font-medium">Bohol Tourist Perks</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Airport / Seaport Delivery */}
                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <Airplane className="w-3.5 h-3.5 text-primary-700" />
                                            <span>Airport & Seaport Delivery</span>
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={data.delivery_available}
                                            onChange={e => setData('delivery_available', e.target.checked)}
                                            className="w-4 h-4 text-primary-700 rounded border-slate-300 focus:ring-primary-500 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Deliver vehicle to Panglao Airport (TAG) or Tagbilaran Port.</p>
                                    {data.delivery_available && (
                                        <div className="pt-2 border-t border-slate-100">
                                            <label className="block text-xs font-bold text-slate-500 uppercase">Delivery Fee (₱0 = Free)</label>
                                            <input
                                                type="number"
                                                value={data.delivery_fee}
                                                onChange={e => setData('delivery_fee', parseFloat(e.target.value) || 0)}
                                                min="0"
                                                step="50"
                                                placeholder="0 for Free Delivery"
                                                className="w-full mt-1 h-11 sm:h-9 px-3 rounded-lg border border-slate-200 text-base sm:text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Security Deposit */}
                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Refundable Security Deposit</span>
                                    </label>
                                    <p className="text-xs text-slate-500">Cash deposit returned to renter upon safe vehicle return.</p>
                                    <div className="pt-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase">Deposit Amount (₱)</label>
                                        <input
                                            type="number"
                                            value={data.security_deposit}
                                            onChange={e => setData('security_deposit', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            step="500"
                                            placeholder="e.g. 1000 or 2000"
                                            className="w-full mt-1 h-11 sm:h-9 px-3 rounded-lg border border-slate-200 text-base sm:text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary-200"
                                        />
                                    </div>
                                </div>

                                {/* Multi-day Discounts */}
                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Percent className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Multi-Day Vacation Discounts</span>
                                    </label>
                                    <p className="text-xs text-slate-500">Incentivize tourists to book longer island stays.</p>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase">3+ Days (% off)</label>
                                            <input
                                                type="number"
                                                value={data.discount_three_days}
                                                onChange={e => setData('discount_three_days', parseInt(e.target.value) || 0)}
                                                min="0"
                                                max="50"
                                                placeholder="e.g. 5%"
                                                className="w-full mt-1 h-11 sm:h-9 px-3 rounded-lg border border-slate-200 text-base sm:text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase">7+ Days / Week (% off)</label>
                                            <input
                                                type="number"
                                                value={data.discount_weekly}
                                                onChange={e => setData('discount_weekly', parseInt(e.target.value) || 0)}
                                                min="0"
                                                max="50"
                                                placeholder="e.g. 10%"
                                                className="w-full mt-1 h-11 sm:h-9 px-3 rounded-lg border border-slate-200 text-base sm:text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fuel Policy & Add-ons */}
                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <GasPump className="w-3.5 h-3.5 text-primary-700" />
                                        <span>Fuel Policy & Inclusions</span>
                                    </label>
                                    <select
                                        value={data.fuel_policy}
                                        onChange={e => setData('fuel_policy', e.target.value)}
                                        className="w-full h-11 sm:h-9 px-3 rounded-lg border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:ring-2 focus:ring-primary-200 bg-white"
                                    >
                                        <option value="same_to_same">Same-to-Same (Return at same level)</option>
                                        <option value="full_to_full">Full-to-Full (Full tank handover)</option>
                                    </select>
                                    <div className="pt-2 space-y-1.5">
                                        {isMotorbike && (
                                            <label className="min-h-[44px] flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.helmets_included}
                                                    onChange={e => setData('helmets_included', e.target.checked)}
                                                    className="w-4 h-4 text-primary-700 rounded border-slate-300"
                                                />
                                                <span>2 Free Standard Helmets Included</span>
                                            </label>
                                        )}
                                        {!isMotorbike && (
                                            <label className="min-h-[44px] flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.driver_available}
                                                    onChange={e => setData('driver_available', e.target.checked)}
                                                    className="w-4 h-4 text-primary-700 rounded border-slate-300"
                                                />
                                                <span>With Professional Driver Available</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full h-11 sm:h-10 px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors font-medium bg-white">
                                <option value="active">🟢 Active (Visible to renters & accepting bookings)</option>
                                <option value="maintenance">🔧 Under Maintenance (Hidden from renters, no bookings allowed)</option>
                                <option value="inactive">⚪ Inactive (Paused listing)</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Photo Upload & Position Manager */}
                <PhotoManager vehicle={vehicle} />

                {/* Availability Calendar */}
                <AvailabilityManager
                    vehicle={vehicle}
                    availability={availability}
                    bookings={bookings}
                    changes={calendarChanges}
                    setChanges={setCalendarChanges}
                />

                {/* Unified Bottom Action Bar with Single Save Button */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Save Vehicle Changes</h4>
                            <p className="text-xs text-slate-500 font-medium">
                                {Object.keys(calendarChanges).length > 0
                                    ? `Updates vehicle specifications, pricing, features, status, and ${Object.keys(calendarChanges).length} calendar date(s).`
                                    : 'Updates vehicle specifications, pricing, features, and listing status.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                        <Link
                            href="/owner/vehicles"
                            className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Back to Vehicles
                        </Link>
                        <button
                            type="submit"
                            form="vehicle-edit-form"
                            disabled={processing || savingCalendar}
                            className="glass-btn min-h-[44px] flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px] cursor-pointer"
                        >
                            {processing || savingCalendar ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Confirmation Modal */}
            {showSuccessModal && (
                <SaveSuccessModal
                    vehicleTitle={data.title || vehicle.title}
                    vehicleBrand={data.brand || vehicle.brand}
                    vehicleModel={data.model || vehicle.model}
                    pricePerDay={data.price_per_day || vehicle.price_per_day}
                    status={data.status || vehicle.status}
                    photoUrl={getPhotoUrl(vehicle.photos?.[0])}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}

            {/* Renter POV Modal */}
            {showPovModal && <RenterPOVModal vehicle={livePreviewVehicle} onClose={() => setShowPovModal(false)} />}
        </OwnerLayout>
    );
}

function SaveSuccessModal({
    vehicleTitle,
    vehicleBrand,
    vehicleModel,
    pricePerDay,
    status,
    photoUrl,
    onClose,
}: {
    vehicleTitle: string;
    vehicleBrand: string;
    vehicleModel: string;
    pricePerDay: number | string;
    status: string;
    photoUrl?: string | null;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative text-center animate-scaleUp p-6 sm:p-7">
                {/* Close (X) icon */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Close"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="space-y-4 pt-1">
                    {/* Animated Check + "Successfully Saved" Pill Badge */}
                    <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs">
                            {/* Animated Checkmark Circle */}
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center success-check-circle shadow-xs shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3] success-check-svg" />
                            </div>

                            {/* Text appearing beside the check after animation */}
                            <span className="text-xs sm:text-sm font-bold text-emerald-800 tracking-tight success-text-reveal">
                                Successfully Saved
                            </span>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
                            Vehicle Details Updated
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
                            Your specifications, equipment details, pricing, and availability updates have been saved and are now live.
                        </p>
                    </div>

                    {/* Vehicle Quick Summary Card */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3 text-left">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={vehicleTitle}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                <CarProfile className="w-6 h-6 text-slate-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                                {vehicleTitle}
                            </h4>
                            <p className="text-xs text-slate-500 capitalize truncate">
                                {vehicleBrand} {vehicleModel} • {formatCurrency(Number(pricePerDay))}/day
                            </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase shrink-0 border border-emerald-200">
                            {status}
                        </span>
                    </div>

                    {/* Action Buttons: "Go Back to My Vehicles" and "Want to Edit" */}
                    <div className="pt-2 space-y-2.5">
                        {/* Primary Button: Go Back to My Vehicles */}
                        <Link
                            href="/owner/vehicles"
                            className="glass-btn w-full min-h-[48px] py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform"
                        >
                            <CarProfile className="w-4 h-4" />
                            <span>Go Back to My Vehicles</span>
                        </Link>

                        {/* Secondary Button: Want to Edit */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5 text-slate-500" />
                            <span>Want to Edit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getPhotoUrl(photo?: any) {
    if (!photo) return null;
    if (photo.url && typeof photo.url === 'string' && photo.url.trim() !== '') {
        return photo.url;
    }
    if (photo.path && typeof photo.path === 'string' && photo.path.trim() !== '') {
        return photo.path.startsWith('/') ? photo.path : `/storage/${photo.path}`;
    }
    return null;
}

function PhotoManager({ vehicle }: { vehicle: any }) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
    const [photoFraming, setPhotoFraming] = useState<Record<number, { x: number; y: number }>>({});

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const formData = new FormData();
        Array.from(e.target.files).forEach(file => formData.append('photos[]', file));
        setUploading(true);
        router.post(`/owner/vehicles/${vehicle.slug}/photos`, formData, {
            onFinish: () => {
                setUploading(false);
                broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Photos Added' });
            },
            forceFormData: true,
        });
    };

    const deletePhoto = (photoId: number) => {
        if (confirm('Delete this photo from your vehicle listing?')) {
            router.delete(`/owner/vehicles/${vehicle.slug}/photos/${photoId}`, {
                onSuccess: () => {
                    broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Photo Deleted' });
                },
            });
        }
    };

    const setAsCover = (photoId: number) => {
        const sorted = [...(vehicle.photos || [])];
        const targetIdx = sorted.findIndex(p => p.id === photoId);
        if (targetIdx <= 0) return;
        const [target] = sorted.splice(targetIdx, 1);
        sorted.unshift(target);

        const payload = sorted.map((p, idx) => ({ id: p.id, order: idx }));
        router.put(`/owner/vehicles/${vehicle.slug}/photos/reorder`, { photos: payload }, {
            onSuccess: () => {
                broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Cover Photo Updated' });
            },
        });
    };

    const movePhoto = (index: number, direction: 'left' | 'right') => {
        const sorted = [...(vehicle.photos || [])];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sorted.length) return;

        const temp = sorted[index];
        sorted[index] = sorted[targetIndex];
        sorted[targetIndex] = temp;

        const payload = sorted.map((p, idx) => ({ id: p.id, order: idx }));
        router.put(`/owner/vehicles/${vehicle.slug}/photos/reorder`, { photos: payload }, {
            onSuccess: () => {
                broadcastVehicleUpdate({ slug: vehicle.slug, id: vehicle.id, action: 'Photos Reordered' });
            },
        });
    };    const getFocalStyle = (photo: any) => {
        const pos = photoFraming[photo.id] || { x: photo.position_x ?? 50, y: photo.position_y ?? 50 };
        return { objectPosition: `${pos.x}% ${pos.y}%` };
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-semibold text-slate-900 text-lg">Vehicle Photo Gallery & Image Adjuster</h2>
                    <p className="text-xs text-slate-500 mt-0.5">The first photo marked ⭐ COVER PHOTO is your primary listing image seen by renters.</p>
                </div>
                <button
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors disabled:opacity-50"
                >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                {vehicle.photos?.map((photo: any, index: number) => {
                    const isCover = index === 0;
                    const imgUrl = getPhotoUrl(photo);

                    return (
                        <div
                            key={photo.id}
                            className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 transition-all group ${
                                isCover ? 'border-primary-500 ring-2 ring-primary-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {imgUrl ? (
                                <img
                                    src={imgUrl}
                                    alt={photo.alt_text || vehicle.title}
                                    className="w-full h-full object-cover"
                                    style={getFocalStyle(photo)}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
                                    <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                                    <span className="text-xs font-medium">Image Preview</span>
                                </div>
                            )}

                            {/* Cover Badge */}
                            {isCover ? (
                                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-primary-700 text-white text-xs font-extrabold shadow-xs flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                    <span>COVER PHOTO</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setAsCover(photo.id)}
                                    className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xs"
                                >
                                    <Star className="w-3 h-3 text-amber-300" />
                                    <span>Set Cover</span>
                                </button>
                            )}

                            {/* Action Buttons Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPhoto(photo)}
                                        title="Edit Photo"
                                        className="px-2.5 py-1 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg text-xs font-bold backdrop-blur-xs transition-colors"
                                    >
                                        Edit Photo
                                    </button>

                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => movePhoto(index, 'left')}
                                            title="Move Left"
                                            className="w-7 h-7 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center backdrop-blur-xs transition-colors"
                                        >
                                            <CaretLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    {index < (vehicle.photos?.length || 0) - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => movePhoto(index, 'right')}
                                            title="Move Right"
                                            className="w-7 h-7 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center backdrop-blur-xs transition-colors"
                                        >
                                            <CaretRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => deletePhoto(photo.id)}
                                    title="Delete Photo"
                                    className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center shadow-xs transition-colors"
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Upload Trigger Dropzone Card */}
                <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/20 transition-all group cursor-pointer"
                >
                    {uploading ? (
                        <span className="text-xs font-semibold text-primary-600">Uploading...</span>
                    ) : (
                        <>
                            <Upload className="w-6 h-6 mb-1 text-slate-400 group-hover:text-primary-600" />
                            <span className="text-xs font-bold text-slate-700 group-hover:text-primary-700">Add Photo</span>
                            <span className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP</span>
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
            <p className="text-xs text-slate-400">Hover over photos to adjust position, set cover image, reorder, or delete images.</p>

            {/* Photo Editor Modal */}
            {editingPhoto && (
                <ImageCropModal
                    photo={editingPhoto}
                    currentPos={photoFraming[editingPhoto.id] || { x: editingPhoto.position_x ?? 50, y: editingPhoto.position_y ?? 50 }}
                    onClose={() => setEditingPhoto(null)}
                    onSave={(pos) => setPhotoFraming(prev => ({ ...prev, [editingPhoto.id]: pos }))}
                />
            )}
        </div>
    );
}

function ImageCropModal({ photo, currentPos, onClose, onSave }: { photo: any; currentPos: { x: number; y: number }; onClose: () => void; onSave: (pos: { x: number; y: number }) => void }) {
    const FIXED_MAX_WIDTH = 1200;
    const FIXED_QUALITY = 82; // Optimal WebP quality: crisp details, no blurriness, compact ~80KB-120KB

    const [zoom, setZoom] = useState(1.0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [showGrid, setShowGrid] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

    const viewportRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const imgUrl = getPhotoUrl(photo);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };

    // Mouse drag handlers for panning the photo inside the frame
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Touch drag handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        setPan({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y,
        });
    };

    // Wheel zoom handler inside the frame
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.0015;
        setZoom(prev => Math.min(3.0, Math.max(0.7, parseFloat((prev + delta).toFixed(2)))));
    };

    // Quick presets
    const handleReset = () => {
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
    };

    const handleFitEntire = () => {
        setZoom(0.85);
        setPan({ x: 0, y: 0 });
    };

    const handleFillFrame = () => {
        setZoom(1.15);
        setPan({ x: 0, y: 0 });
    };

    // Save & Canvas Cropping
    const handleApply = async () => {
        setSaving(true);
        const vehicleSlug = window.location.pathname.split('/').filter(Boolean).pop();

        try {
            const viewport = viewportRef.current;
            const img = imageRef.current;

            if (viewport && img && img.naturalWidth && img.naturalHeight) {
                const targetW = FIXED_MAX_WIDTH;
                const targetH = Math.round(targetW * (10 / 16)); // Fixed 16:10 aspect ratio

                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Fill dark background for letterboxed areas
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, targetW, targetH);

                    // Compute scale ratio from viewport DOM size to canvas target size
                    const vpRect = viewport.getBoundingClientRect();
                    const scaleFactor = targetW / vpRect.width;

                    // Base cover dimensions inside viewport DOM
                    const baseWidth = vpRect.width;
                    const baseHeight = vpRect.height;

                    // Calculate rendered dimensions inside canvas
                    const renderedW = baseWidth * zoom * scaleFactor;
                    const renderedH = (baseWidth * (img.naturalHeight / img.naturalWidth)) * zoom * scaleFactor;

                    const drawX = (targetW - renderedW) / 2 + (pan.x * scaleFactor);
                    const drawY = (targetH - renderedH) / 2 + (pan.y * scaleFactor);

                    ctx.drawImage(img, drawX, drawY, renderedW, renderedH);

                    // Convert to WebP blob with optimal compression quality
                    const blob = await new Promise<Blob | null>(resolve => {
                        canvas.toBlob(resolve, 'image/webp', FIXED_QUALITY / 100);
                    });

                    if (blob) {
                        const formData = new FormData();
                        formData.append('cropped_photo', blob, 'vehicle_cropped.webp');
                        formData.append('quality', String(FIXED_QUALITY));
                        formData.append('max_width', String(FIXED_MAX_WIDTH));

                        router.post(`/owner/vehicles/${vehicleSlug}/photos/${photo.id}/transform`, formData, {
                            forceFormData: true,
                            onFinish: () => {
                                setSaving(false);
                                onSave({ x: 50, y: 50 });
                                onClose();
                                broadcastVehicleUpdate({ slug: vehicleSlug, action: 'Photo Crop Transformed' });
                            },
                        });
                        return;
                    }
                }
            }
        } catch (err) {
            console.warn('Client-side canvas crop fallback:', err);
        }

        // Fallback to server transform if canvas fails
        router.put(`/owner/vehicles/${vehicleSlug}/photos/${photo.id}/transform`, {
            position_x: 50,
            position_y: 50,
            max_width: FIXED_MAX_WIDTH,
            quality: FIXED_QUALITY,
        }, {
            onFinish: () => {
                setSaving(false);
                onSave({ x: 50, y: 50 });
                onClose();
                broadcastVehicleUpdate({ slug: vehicleSlug, action: 'Photo Position Transformed' });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">Fit Photo to Card Frame</h3>
                            <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-extrabold border border-primary-100">16:10 Listing Size</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Drag to reposition or zoom to fit your vehicle inside the frame.</p>
                    </div>
                    <button onClick={onClose} className="min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer" aria-label="Close modal">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Fixed-Size Frame Viewport */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                            <ArrowsOutCardinal className="w-4 h-4 text-primary-600" />
                            <span>Fixed Frame Viewport</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGrid(!showGrid)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                    showGrid ? 'bg-primary-700 text-white border-primary-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}
                            >
                                <SquaresFour className="w-3.5 h-3.5" />
                                <span>Grid {showGrid ? 'On' : 'Off'}</span>
                            </button>
                            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Drag to pan • Scroll to zoom</span>
                        </div>
                    </div>

                    <div
                        ref={viewportRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => setIsDragging(false)}
                        onWheel={handleWheel}
                        className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-primary-500 shadow-inner select-none ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                    >
                        {/* The Zoomable & Draggable Photo */}
                        {imgUrl ? (
                            <img
                                ref={imageRef}
                                src={imgUrl}
                                alt="Frame preview"
                                onLoad={handleImageLoad}
                                draggable={false}
                                className="w-full h-full object-cover transition-transform duration-75 pointer-events-none"
                                style={{
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                    transformOrigin: 'center center',
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                                No Image Available
                            </div>
                        )}

                        {/* Rule of Thirds Alignment Grid Overlay */}
                        {showGrid && (
                            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div className="border-b border-white/25 border-dashed" />
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div className="border-b border-white/25 border-dashed" />
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div className="border-r border-b border-white/25 border-dashed" />
                                <div />
                            </div>
                        )}

                        {/* Top-Right Active Zoom Tag */}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold tracking-wide pointer-events-none">
                            {Math.round(zoom * 100)}%
                        </div>
                    </div>
                </div>

                {/* Framing & Zoom Controls Bar */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.max(0.7, parseFloat((z - 0.1).toFixed(2))))}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                            title="Zoom Out"
                        >
                            <MagnifyingGlassMinus className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="range"
                                min={0.7}
                                max={3.0}
                                step={0.05}
                                value={zoom}
                                onChange={e => setZoom(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.min(3.0, parseFloat((z + 0.1).toFixed(2))))}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                            title="Zoom In"
                        >
                            <MagnifyingGlassPlus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Quick Framing Presets */}
                    <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleFillFrame}
                                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs flex items-center gap-1"
                            >
                                <CornersOut className="w-3 h-3 text-primary-700" />
                                <span>Fill Frame</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleFitEntire}
                                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs flex items-center gap-1"
                            >
                                <CornersIn className="w-3 h-3 text-primary-700" />
                                <span>Fit Entire Image</span>
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs flex items-center gap-1"
                        >
                            <ArrowCounterClockwise className="w-3 h-3" />
                            <span>Center</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-700 text-white font-bold text-xs hover:bg-primary-800 transition-colors shadow-xs disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Compressing & Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Apply & Save Cropped Photo</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function RenterPOVModal({ vehicle, onClose }: { vehicle: any; onClose: () => void }) {
    const rawPhoto = vehicle.photos?.[0];
    const coverPhoto = getPhotoUrl(rawPhoto);
    const isMotorbike = vehicle.type === 'motorbike';
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
                {/* POV Header Banner */}
                <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Renter Point-of-View Preview</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="p-6 space-y-5">
                    {/* Simulated Renter Vehicle Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="relative aspect-[16/10] bg-slate-100 flex items-center justify-center">
                            {coverPhoto && !imgFailed ? (
                                <img
                                    src={coverPhoto}
                                    alt={vehicle.title}
                                    onError={() => setImgFailed(true)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-2xs">
                                        <ImageIcon className="w-7 h-7 text-primary-700" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 capitalize">{vehicle.brand || 'RentalHub'} {vehicle.model || vehicle.type}</span>
                                    <span className="text-xs text-slate-400 font-medium">Upload photos to display listing image</span>
                                </div>
                            )}
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-slate-900 capitalize shadow-xs">
                                {vehicle.type}
                            </div>
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary-900/90 backdrop-blur-xs text-xs font-extrabold text-white">
                                ₱{Number(vehicle.price_per_day).toLocaleString()}<span className="text-xs font-normal text-slate-200">/day</span>
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{vehicle.title}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                                    <span>{vehicle.location}, Bohol</span>
                                </p>
                            </div>

                            {/* Specifications Badges Strip */}
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100 flex-wrap">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 capitalize flex items-center gap-1 font-semibold">
                                    <Gauge className="w-3 h-3 text-primary-600" />
                                    {vehicle.transmission || 'Automatic'}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                                    <Users className="w-3 h-3 text-primary-600" />
                                    {vehicle.seats || (isMotorbike ? 2 : 5)} Seats
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold ${vehicle.has_aircon ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <Wind className="w-3 h-3 text-emerald-600" />
                                    {vehicle.has_aircon ? 'Aircon' : 'Non-Aircon'}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                                    <MapPin className="w-3 h-3 text-primary-600" />
                                    {vehicle.distance_limit || 'Unlimited'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                        <span>Host: {vehicle.user?.name || 'Verified RentalHub Host'}</span>
                        <a
                            href={`/vehicles/${vehicle.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-700 font-bold hover:underline flex items-center gap-1"
                        >
                            <span>Open full renter page</span>
                            <ArrowSquareOut className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-slate-700 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-xs"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}

function AvailabilityManager({
    vehicle,
    availability,
    bookings = [],
    changes,
    setChanges,
}: {
    vehicle: any;
    availability: any[];
    bookings?: any[];
    changes: Record<string, string>;
    setChanges: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
    const [month, setMonth] = useState(new Date());
    const [selectedDateDetail, setSelectedDateDetail] = useState<{
        dateStr: string;
        info: any;
        isPast: boolean;
        isOccupied: boolean;
    } | null>(null);

    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const startPad = firstDay.getDay();

    const todayObj = new Date();
    const today = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

    const availMap: Record<string, string> = {};
    availability.forEach(a => { availMap[a.date] = a.status; });

    // Map bookings to dates for occupancy history and details
    const occupancyMap = useMemo(() => {
        const map: Record<string, {
            bookingId: number;
            token: string;
            renterName: string;
            startDate: string;
            endDate: string;
            status: string;
            totalPrice: number;
        }> = {};

        bookings?.forEach(b => {
            if (['accepted', 'completed', 'in_progress'].includes(b.status)) {
                const [sy, sm, sd] = b.start_date.split('-').map(Number);
                const [ey, em, ed] = b.end_date.split('-').map(Number);
                const cur = new Date(sy, sm - 1, sd);
                const end = new Date(ey, em - 1, ed);

                while (cur <= end) {
                    const cy = cur.getFullYear();
                    const cm = String(cur.getMonth() + 1).padStart(2, '0');
                    const cd = String(cur.getDate()).padStart(2, '0');
                    const dStr = `${cy}-${cm}-${cd}`;
                    map[dStr] = {
                        bookingId: b.id,
                        token: b.token,
                        renterName: b.renter_name,
                        startDate: b.start_date,
                        endDate: b.end_date,
                        status: b.status,
                        totalPrice: b.total_price,
                    };
                    cur.setDate(cur.getDate() + 1);
                }
            }
        });
        return map;
    }, [bookings]);

    // Monthly occupancy statistics for host
    const monthStats = useMemo(() => {
        let occupiedDays = 0;
        let pastOccupiedDays = 0;
        let upcomingBookedDays = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            const dStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isOcc = Boolean(occupancyMap[dStr] || availMap[dStr] === 'booked');
            if (isOcc) {
                occupiedDays++;
                if (dStr < today) {
                    pastOccupiedDays++;
                } else {
                    upcomingBookedDays++;
                }
            }
        }

        const occupancyRate = Math.round((occupiedDays / daysInMonth) * 100);
        return { occupiedDays, pastOccupiedDays, upcomingBookedDays, occupancyRate };
    }, [year, m, daysInMonth, occupancyMap, availMap, today]);

    const getStatus = (dateStr: string) => {
        if (changes[dateStr]) return changes[dateStr];
        if (occupancyMap[dateStr] || availMap[dateStr] === 'booked') return 'booked';
        return availMap[dateStr] || 'available';
    };

    const toggleDate = (dateStr: string) => {
        if (dateStr < today) return;
        const current = getStatus(dateStr);
        if (current === 'booked') return;
        const next = current === 'available' ? 'blocked' : 'available';
        setChanges(prev => {
            const updated = { ...prev };
            const originalStatus = availMap[dateStr] || 'available';
            if (next === originalStatus) {
                delete updated[dateStr];
            } else {
                updated[dateStr] = next;
            }
            return updated;
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="font-bold text-primary-900 text-lg">Availability & Occupancy Calendar</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        View past occupied days, manage upcoming dates, and click any date to view occupancy details.
                    </p>
                </div>

                {/* Monthly Occupancy Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    <span>
                        {monthStats.occupiedDays} of {daysInMonth} days occupied ({monthStats.occupancyRate}%)
                    </span>
                </div>
            </div>

            {/* Centered Month Navigation with Previous/Next */}
            <div className="flex items-center justify-between px-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80">
                <button
                    type="button"
                    onClick={() => {
                        setMonth(new Date(year, m - 1, 1));
                        setSelectedDateDetail(null);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-2xs flex items-center gap-1 text-xs font-bold"
                    aria-label="Previous month"
                >
                    <CaretLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev Month</span>
                </button>
                <div className="text-center">
                    <span className="text-base font-bold text-slate-900">
                        {month.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}
                    </span>
                    {month < new Date(todayObj.getFullYear(), todayObj.getMonth(), 1) && (
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Historical View
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setMonth(new Date(year, m + 1, 1));
                        setSelectedDateDetail(null);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-2xs flex items-center gap-1 text-xs font-bold"
                    aria-label="Next month"
                >
                    <span className="hidden sm:inline">Next Month</span>
                    <CaretRight className="w-4 h-4" />
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 py-1 uppercase tracking-wider">{d}</div>
                ))}
                {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const bookingInfo = occupancyMap[dateStr];
                    const isOccupiedByBooking = Boolean(bookingInfo);
                    const isAvailBooked = availMap[dateStr] === 'booked';
                    const isOccupied = isOccupiedByBooking || isAvailBooked;
                    const isPast = dateStr < today;
                    const isToday = dateStr === today;
                    const isChanged = dateStr in changes;
                    const status = getStatus(dateStr);

                    let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 cursor-pointer shadow-2xs';
                    let tooltip = `${dateStr}: Available (Click to block)`;

                    if (isPast) {
                        if (isOccupied) {
                            bgClass = 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200 cursor-pointer font-bold shadow-2xs ring-1 ring-rose-300/50';
                            tooltip = `${dateStr}: Occupied by ${bookingInfo?.renterName || 'Renter'} (Click to view details)`;
                        } else {
                            bgClass = 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100/80 cursor-pointer';
                            tooltip = `${dateStr}: Past date (Unoccupied)`;
                        }
                    } else if (isOccupied || status === 'booked') {
                        bgClass = 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 cursor-pointer font-bold';
                        tooltip = `${dateStr}: Booked / Occupied (Click to view details)`;
                    } else if (status === 'blocked') {
                        bgClass = 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:border-slate-400 cursor-pointer';
                        tooltip = `${dateStr}: Blocked by host (Click to make available)`;
                    }

                    const isSelected = selectedDateDetail?.dateStr === dateStr;

                    return (
                        <button
                            key={day}
                            type="button"
                            title={tooltip}
                            onClick={() => {
                                if (isPast || isOccupied || status === 'booked') {
                                    setSelectedDateDetail({
                                        dateStr,
                                        info: bookingInfo,
                                        isPast,
                                        isOccupied,
                                    });
                                } else {
                                    toggleDate(dateStr);
                                    setSelectedDateDetail(null);
                                }
                            }}
                            className={`relative text-center py-2 px-1 min-h-[50px] flex flex-col items-center justify-center text-xs font-semibold rounded-xl border transition-all duration-150 ${bgClass} ${
                                isChanged ? 'ring-2 ring-primary-600 font-bold shadow-xs' : ''
                            } ${isToday ? 'ring-2 ring-emerald-500/80' : ''} ${isSelected ? 'ring-2 ring-slate-900 shadow-sm' : ''}`}
                        >
                            <span className="leading-tight">{day}</span>
                            {isOccupied && (
                                <span className={`block text-[9px] leading-tight font-extrabold uppercase mt-0.5 tracking-tight ${
                                    isPast ? 'text-rose-800' : 'text-rose-600'
                                }`}>
                                    {isPast ? 'Occupied' : 'Booked'}
                                </span>
                            )}
                            {isPast && !isOccupied && (
                                <span className="block text-[9px] leading-tight font-medium text-slate-400 mt-0.5">
                                    Past
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Date Occupancy Detail Card */}
            {selectedDateDetail && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedDateDetail.isOccupied
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-slate-200 text-slate-600'
                        }`}>
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">
                                    {new Date(selectedDateDetail.dateStr + 'T00:00:00').toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    selectedDateDetail.isOccupied
                                        ? selectedDateDetail.isPast
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-rose-50 text-rose-700'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {selectedDateDetail.isOccupied
                                        ? (selectedDateDetail.isPast ? 'Historical Occupancy' : 'Active Booking')
                                        : 'Unoccupied Past Date'}
                                </span>
                            </div>
                            {selectedDateDetail.info ? (
                                <p className="text-xs text-slate-600 mt-1">
                                    <span className="font-semibold text-slate-800">Renter:</span> {selectedDateDetail.info.renterName} •{' '}
                                    <span className="font-semibold text-slate-800">Booking:</span> #{selectedDateDetail.info.token.slice(0, 8)} •{' '}
                                    <span className="font-semibold text-slate-800">Rental:</span> {selectedDateDetail.info.startDate} to {selectedDateDetail.info.endDate} (₱{Number(selectedDateDetail.info.totalPrice).toLocaleString()})
                                </p>
                            ) : selectedDateDetail.isOccupied ? (
                                <p className="text-xs text-slate-600 mt-1">
                                    Marked as booked / occupied on vehicle schedule.
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 mt-1">
                                    No rental was scheduled for this date.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                            href="/owner/bookings"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                        >
                            <span>All Bookings</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setSelectedDateDetail(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                            aria-label="Close details"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Legend & Staged Changes Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 border border-emerald-400" />
                        <span>Available (Upcoming)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-slate-200 border border-slate-400" />
                        <span>Blocked by Host</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-400" />
                        <span>Occupied / Booked</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-slate-50 border border-slate-200" />
                        <span>Past (Unoccupied)</span>
                    </span>
                </div>

                {Object.keys(changes).length > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>{Object.keys(changes).length} date {Object.keys(changes).length === 1 ? 'change' : 'changes'} selected (click Save Changes below)</span>
                    </div>
                )}
            </div>
        </div>
    );
}
