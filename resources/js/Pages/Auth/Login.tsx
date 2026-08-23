import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CarFront, Eye, EyeOff, Globe, Shield, UserCheck } from 'lucide-react';
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
        router.post('/login/google', { role: 'renter' }, {
            onFinish: () => setIsGoogleSigningIn(false),
        });
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
            <Head title="Sign In — RentBohol" />

            <div className="py-8 sm:py-12 bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

                    {/* LEFT COLUMN: Sign In Form */}
                    <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Sign In
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Welcome back! Please enter your details
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
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
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors pr-10"
                                            placeholder="••••••••"
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

                                {/* Remember me & Forgot password */}
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-primary-700 focus:ring-primary-500"
                                        />
                                        <span>Remember for 30 Days</span>
                                    </label>

                                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to host email.'); }} className="font-semibold text-primary-700 hover:underline">
                                        Forgot password
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 mt-2"
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            {/* Google Sign-In Button */}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleSigningIn || processing}
                                    className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-3 shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    <Globe className="w-5 h-5 shrink-0 text-blue-600" />
                                    <span>{isGoogleSigningIn ? 'Signing in with Google...' : 'Continue with Google'}</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                                <span className="relative px-3 bg-white text-xs uppercase font-semibold text-slate-400">OR DEMO ACCOUNTS</span>
                            </div>

                            {/* Quick Demo Login Pills */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('renter@gmail.com')}
                                    className="px-2 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <UserCheck className="w-3.5 h-3.5 text-primary-700" /> Demo Renter
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('maria@boholrentals.ph')}
                                    className="px-2 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <CarFront className="w-3.5 h-3.5 text-primary-700" /> Demo Owner
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('admin@rentbohol.com')}
                                    className="px-2 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5 text-amber-500" /> Demo Admin
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 text-center text-xs text-slate-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-primary-700 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Simple branded panel with fleet photo */}
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
                                    Welcome back to{' '}
                                    <span className="text-primary-300">RentBohol</span>
                                </h2>

                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                                    Manage your Bohol vehicle fleet, accept rental requests, unlock encrypted renter contacts, and monitor your platform activity.
                                </p>
                            </div>

                            {/* Simple feature list instead of fake dashboard widget */}
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
