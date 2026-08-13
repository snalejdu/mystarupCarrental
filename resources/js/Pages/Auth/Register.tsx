import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CarFront, Eye, EyeOff, UserCheck, KeyRound, Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <PublicLayout>
            <Head title="Create Account — RentBohol" />

            <div className="py-8 sm:py-12 bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-600 selection:text-white">
                {/* Split Screen Card Container */}
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">

                    {/* LEFT COLUMN: Registration Form */}
                    <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
                        <div>
                            {/* Title & Subtitle */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Create Account
                                </h1>
                                <p className="text-slate-500 text-sm font-medium mt-1">
                                    Join Bohol's premier vehicle rental marketplace
                                </p>
                            </div>

                            {/* Role Selector Pills */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Account Type</label>
                                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'renter')}
                                        className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                                            data.role === 'renter'
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>Rent a Vehicle</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'owner')}
                                        className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                                            data.role === 'owner'
                                                ? 'bg-indigo-600 text-white shadow-md'
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
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        placeholder="Juan Dela Cruz"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        placeholder="you@email.com"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mobile Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        placeholder="0917 123 4567"
                                        required
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone}</p>}
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
                                    {errors.password && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-indigo-200 transition-all disabled:opacity-50 mt-2"
                                >
                                    {processing ? 'Creating Account...' : data.role === 'renter' ? 'Create Renter Account' : 'Create Owner Account'}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 text-center text-xs text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="font-extrabold text-indigo-600 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Feature Banner Card */}
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
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/20">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {data.role === 'renter' ? 'Renter Profile Benefits' : 'Vehicle Host Benefits'}
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                                {data.role === 'renter' ? (
                                    <>Track all your <br />Bohol trips & rentals <br />in one place</>
                                ) : (
                                    <>List your vehicle <br />for free & earn with <br />low 4% commission</>
                                )}
                            </h2>

                            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-md">
                                {data.role === 'renter'
                                    ? 'Save your contact details for 1-click bookings, unlock owner contacts instantly upon acceptance, and manage your upcoming Bohol island vacations.'
                                    : 'Set your own daily rates, maintain your 90-day availability calendar, accept direct booking requests, and get paid with zero renter fees.'
                                }
                            </p>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-3 my-6">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                                    ⚡
                                </div>
                                <h4 className="font-extrabold text-xs text-white">1-Click Booking</h4>
                                <p className="text-[10px] text-indigo-100 mt-0.5">Pre-filled checkout details</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                                <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                                    📱
                                </div>
                                <h4 className="font-extrabold text-xs text-white">Mobile Sync</h4>
                                <p className="text-[10px] text-indigo-100 mt-0.5">Ready for iOS & Android app</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 flex justify-between items-center text-[10px] text-indigo-200 font-bold border-t border-white/10 pt-4">
                            <span>RentBohol Ecosystem</span>
                            <span>Tagbilaran • Panglao • Dauis</span>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
