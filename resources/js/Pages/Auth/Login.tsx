import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CarFront, Eye, EyeOff, Shield, UserCheck, TrendingUp, DollarSign, CalendarCheck, Users } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
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

            <div className="py-8 sm:py-12 bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-600 selection:text-white">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

                    {/* LEFT COLUMN: Sign In Form */}
                    <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Sign In
                                </h1>
                                <p className="text-slate-500 text-sm font-medium mt-1">
                                    Welcome back! Please enter your details
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        placeholder="Enter your email"
                                        required
                                        autoFocus
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all pr-10"
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
                                    {errors.password && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.password}</p>}
                                </div>

                                {/* Remember me & Forgot password */}
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>Remember for 30 Days</span>
                                    </label>

                                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to host email.'); }} className="font-bold text-indigo-600 hover:underline">
                                        Forgot password
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-indigo-200 transition-all disabled:opacity-50 mt-2"
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                                <span className="relative px-3 bg-white text-xs uppercase font-bold text-slate-400">OR DEMO ACCOUNTS</span>
                            </div>

                            {/* Quick Demo Login Pills */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('renter@gmail.com')}
                                    className="px-2 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Demo Renter
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('maria@boholrentals.ph')}
                                    className="px-2 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <CarFront className="w-3.5 h-3.5 text-indigo-600" /> Demo Owner
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('admin@rentbohol.com')}
                                    className="px-2 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5 text-amber-500" /> Demo Admin
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 text-center text-xs text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-extrabold text-indigo-600 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Blue Feature Graphic Banner */}
                    <div className="lg:col-span-6 p-8 sm:p-12 text-white flex flex-col justify-between rounded-3xl relative overflow-hidden m-3 lg:m-4 shadow-xl min-h-[500px]">
                        {/* Background Image + Overlay combined via CSS background to avoid Firefox subpixel rendering lines */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `linear-gradient(to top, rgba(2,6,23,0.95), rgba(30,27,75,0.80), rgba(49,46,129,0.65)), url('/images/hero/car-fleet-steps.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        <div className="relative z-10 space-y-4 max-w-lg">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                                Welcome back! <br />
                                Please sign in to your <br />
                                <span className="underline decoration-amber-400 decoration-4">RentBohol</span> account
                            </h2>

                            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-md">
                                Manage your Bohol vehicle fleet, accept rental requests, unlock encrypted renter contacts, and monitor 4% platform commissions.
                            </p>
                        </div>

                        {/* Floating Dashboard Widget Graphic */}
                        <div className="relative z-10 my-8">
                            <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-5 shadow-2xl border border-white/50 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <h4 className="font-extrabold text-xs text-slate-900">Rental Performance Report</h4>
                                        <p className="text-[10px] text-slate-500 font-medium">Bohol Marketplace Overview</p>
                                    </div>
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-extrabold">
                                        +24% Growth
                                    </span>
                                </div>

                                {/* Simulated Bar Chart */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                        <span>Completed Rentals</span>
                                        <span className="text-indigo-600 font-extrabold">₱89,897 Total</span>
                                    </div>
                                    <div className="h-16 flex items-end justify-between gap-2 pt-2">
                                        {[40, 65, 50, 80, 95, 70, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                                <div className="w-full bg-indigo-600 rounded-t-sm transition-all" style={{ height: `${h * 0.6}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-[10px]">
                                    <div>
                                        <span className="text-slate-400 block font-medium">Active Hosts</span>
                                        <span className="font-bold text-slate-900">20 Owners</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block font-medium">Commission</span>
                                        <span className="font-bold text-indigo-600">4% Global</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block font-medium">Rating</span>
                                        <span className="font-bold text-amber-500">4.9 / 5.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Carousel Dots Footer */}
                        <div className="relative z-10 flex justify-center items-center gap-1.5">
                            <div className="w-6 h-2 rounded-full bg-white" />
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
