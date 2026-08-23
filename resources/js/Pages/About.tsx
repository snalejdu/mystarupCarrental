import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    ShieldCheck, CheckCircle2, PhoneCall, Zap,
    MapPin, CarFront, HeartHandshake, Users, ArrowRight
} from 'lucide-react';

export default function About() {
    return (
        <PublicLayout>
            <Head>
                <title>About Us — RentBohol</title>
                <meta name="description" content="Learn about RentBohol, the fast, reliable, and efficient website connecting travelers directly with local Boholano vehicle owners." />
            </Head>

            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        About RentBohol
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16 lg:space-y-24">

                {/* Section 1: Our Story */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-snug sm:leading-tight">
                                Empowering Bohol Tourism with a Fast, Direct & Reliable Website
                            </h2>
                        </div>

                        <div className="space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed sm:leading-loose">
                            <p>
                                RentBohol was created to solve a common challenge across Bohol Island: finding and booking a rental vehicle used to mean endless phone calls, unreturned social media messages, and last-minute double-booking headaches.
                            </p>

                            <p>
                                We built a clean, fast, and reliable website designed specifically to streamline vehicle rentals. Rentees can easily browse sedans, 15-seater group vans, scooters, and 4x4 SUVs, select their trip dates, and connect directly with local Boholano vehicle owners in seconds.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 relative aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                                alt="Bohol Coastal Highway"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8 sm:p-10">
                                <div className="text-white space-y-1">
                                    <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Built for Bohol</span>
                                    <h3 className="text-xl sm:text-2xl font-bold leading-normal">Connecting Travelers & Boholano Hosts</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: How We Solve The Problem */}
                <div className="space-y-12 lg:space-y-16">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-snug">
                            How RentBohol Solves The Challenge
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Eliminating communication delays and double-booking stress for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Fast */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-md transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-lg bg-primary-700 text-white flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-slate-900">Fast & Instant Requests</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    No more waiting hours for replies. Rentees submit trip dates in seconds, and vehicle hosts receive instant notifications to review and accept requests.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Reliable */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-md transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-slate-900">Reliable Host Contacts</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Once a booking request is accepted, direct contact phone numbers and emails unlock immediately for 1-tap calls and easy island pickup coordination.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Efficient */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-md transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-slate-900">Direct Local Pricing</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Rentees get transparent daily rates set directly by local Boholano owners with zero middleman markups or surprise booking fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Empowering Local Boholanos */}
                <div className="bg-slate-900 rounded-2xl p-10 sm:p-14 lg:p-20 text-white shadow-lg space-y-12">
                    <div className="max-w-3xl space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug sm:leading-tight">
                            Helping Boholanos Build an Efficient & Reliable Rental Service
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed sm:leading-loose">
                            For local Boholano vehicle hosts, RentBohol provides a modern, high-speed website to showcase their vehicles without needing complicated tech setups. We empower local car, van, and scooter owners across Tagbilaran, Panglao, Dauis, Loboc, and beyond to manage their rental schedules efficiently and earn sustainable income.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-medium pt-8 border-t border-slate-700">
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>100% Free for Rentees</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Airport & Port Pickup Sync</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Fast Mobile Performance</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Direct Host Communication</span>
                        </div>
                    </div>
                </div>

                {/* Section 4: Call to Action */}
                <div className="bg-slate-50 rounded-2xl p-10 sm:p-14 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-sm sm:text-base text-slate-500">
                            Call customer care at <span className="font-semibold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="px-8 py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-sm transition-colors shrink-0 flex items-center gap-2"
                    >
                        <span>Browse Vehicles Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Section 5: Official Sponsor & Partner Brands — Infinite Horizontal Marquee */}
                <div className="bg-slate-50 rounded-2xl py-8 px-4 border border-slate-200 text-center overflow-hidden space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        OFFICIAL FLEET BRANDS & BOHOL TOURISM PARTNERS
                    </p>
                    <div className="relative w-full overflow-hidden flex">
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                        <div className="flex gap-12 sm:gap-16 md:gap-20 animate-marquee items-center">
                            {[
                                { name: 'Toyota Philippines', src: '/images/sponsors/toyota.svg' },
                                { name: 'Honda Philippines', src: '/images/sponsors/honda.svg' },
                                { name: 'Yamaha Motor', src: '/images/sponsors/yamaha.svg' },
                                { name: 'Mitsubishi Motors', src: '/images/sponsors/mitsubishi.svg' },
                                { name: 'Bohol Tourism Board', src: '/images/sponsors/bohol_tourism.svg' },
                                { name: 'Panglao Island Tourism', src: '/images/sponsors/panglao_tourism.svg' },
                                { name: 'Toyota Philippines', src: '/images/sponsors/toyota.svg' },
                                { name: 'Honda Philippines', src: '/images/sponsors/honda.svg' },
                                { name: 'Yamaha Motor', src: '/images/sponsors/yamaha.svg' },
                                { name: 'Mitsubishi Motors', src: '/images/sponsors/mitsubishi.svg' },
                                { name: 'Bohol Tourism Board', src: '/images/sponsors/bohol_tourism.svg' },
                                { name: 'Panglao Island Tourism', src: '/images/sponsors/panglao_tourism.svg' },
                            ].map((brand, i) => (
                                <div
                                    key={`${brand.name}-${i}`}
                                    className="px-7 py-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 h-16 min-w-[200px] hover:border-slate-300 transition-all cursor-pointer"
                                >
                                    <img src={brand.src} alt={brand.name} className="h-8 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
