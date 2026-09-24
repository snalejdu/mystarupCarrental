import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Eye, EyeSlash, Shield, UserCheck, CarProfile } from '@phosphor-icons/react';
import GoogleIcon from '@/Components/GoogleIcon';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const handleGoogleSignIn = () => {
        setIsGoogleSigningIn(true);
        window.location.href = '/auth/google/redirect';
    };

    // Quick demo login fill helper
    const fillDemoUser = (email: string) => {
        setData({
            email: email,
            password: 'password123',
            remember: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Sign In — RentalHub" />

            <div className="py-4 sm:py-12 bg-slate-50 sm:bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans min-h-[calc(100vh-140px)]">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[640px]">

                    {/* LEFT COLUMN: Sign In Form */}
                    <div className="lg:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-4 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Sign In
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                                    Welcome back! Please enter your details
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                                        placeholder="Enter your email"
                                        required
                                        autoFocus
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                                            placeholder="••••••••"
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

                                {/* Remember me & Forgot password */}
                                <div className="flex items-center justify-between text-xs pt-0.5 gap-2">
                                    <label className="min-h-[44px] inline-flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        />
                                        <span className="sm:hidden text-xs">Remember me</span>
                                        <span className="hidden sm:inline text-xs">Remember for 30 Days</span>
                                    </label>

                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); alert('Password reset link sent to host email.'); }}
                                        className="min-h-[44px] inline-flex items-center font-semibold text-teal-600 hover:underline shrink-0 text-xs"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="glass-btn w-full min-h-[48px] py-3 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 mt-1 sm:mt-2 cursor-pointer"
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
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
                                    <span>{isGoogleSigningIn ? 'Signing in with Google...' : 'Continue with Google'}</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative my-4 sm:my-6 text-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                                <span className="relative px-3 bg-white text-xs uppercase font-semibold text-slate-400">OR DEMO ACCOUNTS</span>
                            </div>

                            {/* Quick Demo Login Pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('renter@gmail.com')}
                                    className="glass-pill min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
                                >
                                    <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Demo Renter</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('maria@boholrentals.ph')}
                                    className="glass-pill min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
                                >
                                    <CarProfile className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Demo Owner</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('admin@RentalHub.com')}
                                    className="glass-pill min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
                                >
                                    <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Demo Admin</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 sm:mt-8 pt-2 sm:pt-4 text-center text-xs text-slate-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="min-h-[44px] inline-flex items-center font-semibold text-teal-600 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Branded panel with fleet photo (Desktop Only) */}
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
                                    Welcome back to{' '}
                                    <span className="text-primary-300">RentalHub</span>
                                </h2>

                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                                    Manage your Bohol vehicle fleet, accept rental requests, unlock encrypted renter contacts, and monitor your platform activity.
                                </p>
                            </div>

                            {/* Simple feature list */}
                            <div className="space-y-3 mt-8">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                    <span>Direct owner-to-renter booking system</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                    <span>Real-time availability calendar management</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                    <span>Encrypted contact privacy until acceptance</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                    <span>Low 4% owner commission, zero renter fees</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-700 pt-4 mt-8">
                                <span>RentalHub Platform</span>
                                <span>Tagbilaran • Panglao • Dauis</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
