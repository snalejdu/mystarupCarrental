import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CarFront, Eye, EyeOff, Globe, UserCheck } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'renter', // default role
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    const handleGoogleSignIn = () => {
        setIsGoogleSigningIn(true);
        router.post('/login/google', { role: data.role }, {
            onFinish: () => setIsGoogleSigningIn(false),
        });
    };

    return (
        <PublicLayout>
            <Head title="Create Account — RentBohol" />

            <div className="py-8 sm:py-12 bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">

                    {/* LEFT COLUMN: Registration Form */}
                    <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Create Account
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Join Bohol's premier vehicle rental marketplace
                                </p>
                            </div>

                            {/* Role Selector Pills */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Account Type</label>
                                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'renter')}
                                        className={`py-3 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                                            data.role === 'renter'
                                                ? 'bg-primary-700 text-white shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>Rent a Vehicle</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'owner')}
                                        className={`py-3 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                                            data.role === 'owner'
                                                ? 'bg-primary-700 text-white shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <CarFront className="w-4 h-4" />
                                        <span>List My Vehicle</span>
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                        placeholder="Juan Dela Cruz"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                        placeholder="you@email.com"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Mobile Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                        placeholder="0917 123 4567"
                                        required
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors pr-10"
                                            placeholder="At least 8 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 mt-2"
                                >
                                    {processing ? 'Creating Account...' : data.role === 'renter' ? 'Create Renter Account' : 'Create Owner Account'}
                                </button>
                            </form>

                            {/* Google Sign-Up Button */}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleSigningIn || processing}
                                    className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-3 shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    <Globe className="w-5 h-5 shrink-0 text-blue-600" />
                                    <span>{isGoogleSigningIn ? 'Signing up with Google...' : 'Continue with Google'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 text-center text-xs text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary-700 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Simple branded panel */}
                    <div className="lg:col-span-6 text-white flex flex-col justify-between rounded-2xl relative overflow-hidden m-3 lg:m-4 min-h-[500px]">
                        {/* Background Image + Dark Overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.70), rgba(15,23,42,0.55)), url('/images/hero/car-fleet-steps.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-between h-full">
                            <div className="space-y-4 max-w-lg">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
                                    {data.role === 'renter' ? (
                                        <>Track all your <br />Bohol trips & rentals <br />in one place</>
                                    ) : (
                                        <>List your vehicle <br />for free & earn with <br />low 4% commission</>
                                    )}
                                </h2>

                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                                    {data.role === 'renter'
                                        ? 'Save your contact details for 1-click bookings, unlock owner contacts instantly upon acceptance, and manage your upcoming Bohol island vacations.'
                                        : 'Set your own daily rates, maintain your 90-day availability calendar, accept direct booking requests, and get paid with zero renter fees.'
                                    }
                                </p>
                            </div>

                            {/* Simple feature bullets */}
                            <div className="space-y-3 mt-8">
                                {data.role === 'renter' ? (
                                    <>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                            <span>Pre-filled checkout for faster bookings</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                            <span>Instant owner contact unlock on acceptance</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                            <span>Free vehicle listing, no upfront costs</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                            <span>90-day availability calendar management</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-700 pt-4 mt-8">
                                <span>RentBohol Platform</span>
                                <span>Tagbilaran • Panglao • Dauis</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
