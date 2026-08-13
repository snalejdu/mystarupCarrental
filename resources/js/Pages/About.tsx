import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Sparkles, ShieldCheck, CheckCircle2, PhoneCall, Zap,
    Clock, MapPin, CarFront, HeartHandshake, Shield, Users, ArrowRight
} from 'lucide-react';

export default function About() {
    return (
        <PublicLayout>
            <Head>
                <title>About Us — RentBohol</title>
                <meta name="description" content="Learn about RentBohol, the fast, reliable, and efficient website connecting travelers directly with local Boholano vehicle owners." />
            </Head>

            {/* Header — clean light banner */}
            <div className="bg-slate-50 border-b border-slate-200/80 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        About RentBohol
                    </h1>
                </div>
            </div>

            {/* Main Content Area — compact container fitting viewport height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16 lg:space-y-24">

                {/* Section 1: Our Story & Problem Solving */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    <div className="lg:col-span-6 space-y-10">
                        <div className="space-y-6">
                            <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-200/80 inline-flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-600" /> Our Story & Purpose
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-snug sm:leading-tight">
                                Empowering Bohol Tourism with a Fast, Direct & Reliable Website
                            </h2>
                        </div>

                        <div className="space-y-8 text-slate-600 text-base sm:text-lg font-normal leading-relaxed sm:leading-loose">
                            <p>
                                RentBohol was created to solve a common challenge across Bohol Island: finding and booking a rental vehicle used to mean endless phone calls, unreturned social media messages, and last-minute double-booking headaches.
                            </p>

                            <p>
                                We built a clean, fast, and reliable website designed specifically to streamline vehicle rentals. Rentees can easily browse sedans, 15-seater group vans, scooters, and 4x4 SUVs, select their trip dates, and connect directly with local Boholano vehicle owners in seconds.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 relative aspect-[4/3] group">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                                alt="Bohol Coastal Highway"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-8 sm:p-10">
                                <div className="text-white space-y-2">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Built for Bohol</span>
                                    <h3 className="text-xl sm:text-2xl font-bold leading-normal">Connecting Travelers & Boholano Hosts</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: How We Solve The Problem (3 Key Pillars Grid) */}
                <div className="space-y-16 lg:space-y-20">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
                            How RentBohol Solves The Challenge
                        </h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed">
                            Eliminating communication delays and double-booking stress for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Card 1: Fast */}
                        <div className="p-10 sm:p-12 lg:p-14 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-8 hover:shadow-xl hover:bg-white transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-xl text-slate-900 leading-snug">Fast & Instant Requests</h3>
                                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                                    No more waiting hours for replies. Rentees submit trip dates in seconds, and vehicle hosts receive instant notifications to review and accept requests.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Reliable */}
                        <div className="p-10 sm:p-12 lg:p-14 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-8 hover:shadow-xl hover:bg-white transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-xl text-slate-900 leading-snug">Reliable Host Contacts</h3>
                                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                                    Once a booking request is accepted, direct contact phone numbers and emails unlock immediately for 1-tap calls and easy island pickup coordination.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Efficient */}
                        <div className="p-10 sm:p-12 lg:p-14 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-8 hover:shadow-xl hover:bg-white transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                                <HeartHandshake className="w-7 h-7" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-xl text-slate-900 leading-snug">Direct Local Pricing</h3>
                                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                                    Rentees get transparent daily rates set directly by local Boholano owners with zero middleman markups or surprise booking fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Empowering Local Boholanos (Spacious Dark Card) */}
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-12 sm:p-16 lg:p-24 text-white shadow-2xl border border-indigo-500/30 space-y-14">
                    <div className="max-w-3xl space-y-8">
                        <span className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30 uppercase tracking-wider inline-flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-400" /> Empowering Local Boholanos
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug sm:leading-tight">
                            Helping Boholanos Build an Efficient & Reliable Rental Service
                        </h2>
                        <p className="text-indigo-100/90 text-base sm:text-lg font-normal leading-relaxed sm:leading-loose">
                            For local Boholano vehicle hosts, RentBohol provides a modern, high-speed website to showcase their vehicles without needing complicated tech setups. We empower local car, van, and scooter owners across Tagbilaran, Panglao, Dauis, Loboc, and beyond to manage their rental schedules efficiently and earn sustainable income.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm font-bold pt-10 border-t border-indigo-500/20">
                        <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>100% Free for Rentees</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Airport & Port Pickup Sync</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Fast Mobile Performance</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Direct Host Communication</span>
                        </div>
                    </div>
                </div>

                {/* Section 4: Call to Action */}
                <div className="bg-slate-50 rounded-3xl p-12 sm:p-16 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-sm">
                    <div className="space-y-4 text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-sm sm:text-base text-slate-500 font-medium">
                            Call customer care at <span className="font-bold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all shrink-0 flex items-center gap-2"
                    >
                        <span>Browse Vehicles Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </PublicLayout>
    );
}
