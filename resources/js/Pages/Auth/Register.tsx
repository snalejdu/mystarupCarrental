import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Eye, EyeSlash, UserCheck, CarProfile } from '@phosphor-icons/react';
import GoogleIcon from '@/Components/GoogleIcon';
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
        window.location.href = '/auth/google/redirect';
    };

    return (
        <PublicLayout>
            <Head title="Create Account — RentBohol" />
            <div className="py-4 sm:py-12 bg-slate-50 sm:bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans min-h-[calc(100vh-140px)]">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[680px]">

                    {/* LEFT COLUMN: Registration Form */}
                    <div className="lg:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-4 sm:mb-6">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Create Account
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                                    Join Bohol's premier vehicle rental marketplace
                                </p>
                            </div>

                            {/* Role Selector Pills */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Account Type</label>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'renter')}
                                        className={`min-h-[48px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
                                            data.role === 'renter'
                                                ? 'glass-pill-active'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                                        <span>Rent a Vehicle</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'owner')}
                                        className={`min-h-[48px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
                                            data.role === 'owner'
                                                ? 'glass-pill-active'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <CarProfile className="w-4 h-4 text-teal-600 shrink-0" />
                                        <span>List My Vehicle</span>
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
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
                                        className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
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
                                        className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
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
                                            className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors pr-11"
                                            placeholder="At least 8 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="w-11 h-11 flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirm Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>

                                {/* Terms Notice */}
                                <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
                                    By registering, you agree to RentBohol's{' '}
                                    <Link href="/terms" className="text-teal-600 font-semibold hover:underline">
                                        Terms & Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy-policy" className="text-teal-600 font-semibold hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="glass-btn w-full min-h-[48px] py-3 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 mt-1 sm:mt-2 cursor-pointer"
                                >
                                    {processing ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>

                            {/* Google Sign-In Button */}
                            <div className="mt-2.5 sm:mt-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleSigningIn || processing}
                                    className="glass-btn-outline-light w-full min-h-[48px] py-3 text-slate-700 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <GoogleIcon className="w-5 h-5 shrink-0" />
                                    <span>{isGoogleSigningIn ? 'Signing up with Google...' : 'Continue with Google'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 sm:mt-8 pt-2 sm:pt-4 text-center text-xs text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="min-h-[44px] inline-flex items-center font-semibold text-teal-600 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Simple branded panel (Desktop Only) */}
                    <div className="hidden lg:flex lg:col-span-6 text-white flex-col justify-between rounded-2xl relative overflow-hidden m-3 lg:m-4 min-h-[500px]">
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
