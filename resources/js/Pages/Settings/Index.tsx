import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    LuUser,
    LuIdCard,
    LuShieldCheck,
    LuCar,
    LuPhone,
    LuMail,
    LuMapPin,
    LuCalendar,
    LuUpload,
    LuCheck,
    LuArrowRight,
    LuSparkles,
    LuArrowLeftRight,
    LuCircleAlert,
    LuCircleCheck
} from 'react-icons/lu';

interface Props {
    profile: {
        id: number;
        name: string;
        email: string;
        phone: string;
        address?: string | null;
        date_of_birth?: string | null;
        emergency_contact_name?: string | null;
        emergency_contact_phone?: string | null;
        role: 'renter' | 'owner' | 'admin';
        avatar?: string | null;
        driver_license_number?: string | null;
        driver_license_expiry?: string | null;
        driver_license_path?: string | null;
        driver_license_status: string;
        is_host_qualified: boolean;
        is_owner: boolean;
        is_admin: boolean;
    };
}

export default function SettingsIndex({ profile }: Props) {
    const [activeTab, setActiveTab] = useState<'host' | 'profile'>('host');

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
    });

    // Become Host form
    const {
        data: hostData,
        setData: setHostData,
        post: postHost,
        processing: hostProcessing,
        errors: hostErrors,
    } = useForm<{
        driver_license_number: string;
        driver_license_expiry: string;
        license_photo: File | null;
    }>({
        driver_license_number: profile.driver_license_number || '',
        driver_license_expiry: profile.driver_license_expiry || '',
        license_photo: null,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postProfile('/settings/profile', {
            preserveScroll: true,
        });
    };

    const handleHostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postHost('/settings/host/apply', {
            preserveScroll: true,
        });
    };

    const handleToggleMode = () => {
        router.post('/settings/host/toggle', {}, {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Account Settings — Waypt" />

            <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Page Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-xl text-xs font-bold border border-teal-200/70">
                                    <LuUser className="w-3.5 h-3.5 text-teal-600" />
                                    <span>Account Settings</span>
                                </span>

                                {profile.is_owner ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                                        <LuCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Active Host</span>
                                    </span>
                                ) : profile.is_host_qualified ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold border border-amber-200">
                                        <LuSparkles className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Qualified Host (License Verified)</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                                        <span>Standard Renter</span>
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {profile.name}
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                {profile.email} • Member of Waypt Bohol
                            </p>
                        </div>

                        {/* Navigation / Switch Mode button */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {profile.is_host_qualified && !profile.is_admin && (
                                <button
                                    type="button"
                                    onClick={handleToggleMode}
                                    className="min-h-[44px] px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs border border-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <LuArrowLeftRight className="w-4 h-4 text-teal-600" />
                                    <span>{profile.is_owner ? 'Switch to Renter Mode' : 'Switch to Host Mode'}</span>
                                </button>
                            )}

                            {profile.is_owner ? (
                                <Link
                                    href="/owner/vehicles"
                                    className="glass-btn min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
                                >
                                    <LuCar className="w-4 h-4" />
                                    <span>Host Vehicle Dashboard</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/renter/bookings"
                                    className="glass-btn min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
                                >
                                    <LuCar className="w-4 h-4" />
                                    <span>My Rental Trips</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 border-b border-slate-200/80 pb-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('host')}
                            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                                activeTab === 'host'
                                    ? 'bg-white text-teal-900 border border-slate-200 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <LuIdCard className="w-4 h-4 text-teal-600" />
                            <span>Host Account & Qualification</span>
                            {profile.is_host_qualified && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                                activeTab === 'profile'
                                    ? 'bg-white text-teal-900 border border-slate-200 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <LuUser className="w-4 h-4 text-teal-600" />
                            <span>Personal Profile</span>
                        </button>
                    </div>

                    {/* TAB 1: Host Account & Qualification */}
                    {activeTab === 'host' && (
                        <div className="space-y-6">

                            {/* Qualification Rule Banner */}
                            <div className="bg-gradient-to-r from-teal-50 via-teal-50/70 to-emerald-50/70 border border-teal-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <LuIdCard className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base sm:text-lg font-extrabold text-teal-950">
                                                Host Qualification: Just a Valid Driver's License 🪪
                                            </h2>
                                            <span className="bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                                Simple & Fast
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-teal-900/90 leading-relaxed max-w-2xl">
                                            Creating a host account on Waypt is completely optional. To ensure trust, safety, and legitimate vehicle operations across Bohol, the <b>only qualification required</b> to become a host is submitting your valid <b>Driver's License</b>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Specific Section */}
                            {profile.is_owner ? (
                                /* ACTIVE HOST CARD */
                                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                                <LuCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 text-base">You are an Active Waypt Host</h3>
                                                <p className="text-xs text-slate-500">Your vehicle host privileges and listings are active.</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleToggleMode}
                                            className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <LuArrowLeftRight className="w-4 h-4" />
                                            <span>Switch to Renter Mode</span>
                                        </button>
                                    </div>

                                    {/* Driver's License Info Card */}
                                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Verified Qualification</span>
                                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
                                                <LuCheck className="w-3.5 h-3.5" /> Driver's License Verified
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-slate-500 block">License Number:</span>
                                                <span className="font-mono font-bold text-slate-900 text-sm">
                                                    {profile.driver_license_number || 'Verified on file'}
                                                </span>
                                            </div>
                                            {profile.driver_license_expiry && (
                                                <div>
                                                    <span className="text-slate-500 block">Expiry Date:</span>
                                                    <span className="font-bold text-slate-900 text-sm">
                                                        {profile.driver_license_expiry}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Link
                                            href="/owner/vehicles"
                                            className="glass-btn min-h-[48px] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2"
                                        >
                                            <LuCar className="w-4 h-4" />
                                            <span>Manage My Vehicles</span>
                                        </Link>
                                        <Link
                                            href="/owner/vehicles/create"
                                            className="min-h-[48px] px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs sm:text-sm border border-slate-200 transition-colors flex items-center gap-2"
                                        >
                                            <LuSparkles className="w-4 h-4 text-teal-600" />
                                            <span>List a New Vehicle</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : profile.is_host_qualified ? (
                                /* QUALIFIED BUT CURRENTLY RENTER CARD */
                                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                                                <LuSparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 text-base">You are Qualified to Host</h3>
                                                <p className="text-xs text-slate-500">Your driver's license is already verified on file.</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleToggleMode}
                                            className="glass-btn min-h-[48px] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                                        >
                                            <LuCar className="w-4 h-4" />
                                            <span>Activate Host Account Now</span>
                                        </button>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                                        <div className="space-y-0.5">
                                            <span className="text-slate-500">Verified Driver's License Number:</span>
                                            <p className="font-mono font-bold text-slate-900 text-sm">
                                                {profile.driver_license_number || 'Verified on file'}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                                            <LuCheck className="w-3.5 h-3.5" /> Verified 🪪
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                /* NOT QUALIFIED YET - SUBMIT LICENSE FORM */
                                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900">
                                            Apply for a Host Account
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                            Enter your driver's license details to verify your qualification and begin listing vehicles on Waypt.
                                        </p>
                                    </div>

                                    {hostErrors.driver_license_number && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                                            <LuCircleAlert className="w-4 h-4 shrink-0" />
                                            <span>{hostErrors.driver_license_number}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleHostSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Driver's License Number */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                    Driver's License Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={hostData.driver_license_number}
                                                    onChange={e => setHostData('driver_license_number', e.target.value)}
                                                    placeholder="e.g. G01-18-012345"
                                                    className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                                    required
                                                />
                                            </div>

                                            {/* Expiry Date */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                    License Expiry Date (Optional)
                                                </label>
                                                <input
                                                    type="date"
                                                    value={hostData.driver_license_expiry}
                                                    onChange={e => setHostData('driver_license_expiry', e.target.value)}
                                                    className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                                />
                                            </div>
                                        </div>

                                        {/* License Photo Upload */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Driver's License Photo (Front)
                                            </label>
                                            <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl cursor-pointer transition-colors text-center">
                                                <LuUpload className="w-8 h-8 text-teal-600 mb-2" />
                                                <span className="text-xs font-bold text-slate-700">
                                                    {hostData.license_photo ? hostData.license_photo.name : 'Click to select license image'}
                                                </span>
                                                <span className="text-[11px] text-slate-400 mt-0.5">
                                                    JPG, PNG, or WebP up to 5MB
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => setHostData('license_photo', e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {hostErrors.license_photo && (
                                                <p className="text-xs text-red-500 mt-1">{hostErrors.license_photo}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={hostProcessing}
                                            className="glass-btn w-full min-h-[48px] py-3 rounded-xl font-bold text-xs sm:text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <LuShieldCheck className="w-4 h-4" />
                                            <span>{hostProcessing ? 'Verifying License...' : 'Submit Driver\'s License & Become a Host'}</span>
                                        </button>
                                    </form>
                                </div>
                            )}

                        </div>
                    )}

                    {/* TAB 2: Personal Profile */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900">
                                    Personal Profile
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    Update your contact and residential information for bookings and host communication.
                                </p>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={e => setProfileData('name', e.target.value)}
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                            required
                                        />
                                        {profileErrors.name && (
                                            <p className="text-xs text-red-500 mt-1">{profileErrors.name}</p>
                                        )}
                                    </div>

                                    {/* Mobile Phone */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Mobile Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={e => setProfileData('phone', e.target.value)}
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                            required
                                        />
                                        {profileErrors.phone && (
                                            <p className="text-xs text-red-500 mt-1">{profileErrors.phone}</p>
                                        )}
                                    </div>

                                    {/* Email (Read only) */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">Email is locked to your authenticated login.</p>
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={profileData.date_of_birth}
                                            onChange={e => setProfileData('date_of_birth', e.target.value)}
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Residential Address (Bohol or Home Address)
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={e => setProfileData('address', e.target.value)}
                                            placeholder="e.g. Purok 4, Tawala, Panglao, Bohol"
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                        />
                                    </div>

                                    {/* Emergency Contact Name */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Emergency Contact Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.emergency_contact_name}
                                            onChange={e => setProfileData('emergency_contact_name', e.target.value)}
                                            placeholder="e.g. Maria Dela Cruz"
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                        />
                                    </div>

                                    {/* Emergency Contact Phone */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Emergency Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.emergency_contact_phone}
                                            onChange={e => setProfileData('emergency_contact_phone', e.target.value)}
                                            placeholder="0918 765 4321"
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="glass-btn min-h-[48px] px-8 py-3 rounded-xl font-bold text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {profileProcessing ? 'Saving Changes...' : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </PublicLayout>
    );
}
