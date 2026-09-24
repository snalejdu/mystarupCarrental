import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    LuZap,
    LuHandshake,
    LuBadgePercent,
    LuShieldCheck,
    LuPlane,
    LuSmartphone,
    LuMessagesSquare,
    LuArrowRight
} from 'react-icons/lu';
import DepthCarousel from '@/Components/DepthCarousel';

export default function About() {
    return (
        <PublicLayout>
            <Head>
                <title>About Us — RentalHub</title>
                <meta name="description" content="Learn about RentalHub, the fast, reliable, and efficient website connecting travelers directly with local Boholano vehicle owners." />
            </Head>

            {/* Header Banner */}
            <div className="bg-white border-b border-slate-100 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Empowering Bohol Tourism Direct & Fast
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
                        The simple, transparent, and direct marketplace connecting travelers with verified Boholano vehicle hosts.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16 lg:space-y-24">

                {/* Section 1: Our Story + DepthCarousel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-snug sm:leading-tight">
                            Empowering Bohol Tourism with a Fast, Direct & Reliable Website
                        </h2>

                        <div className="space-y-5 text-slate-600 text-base leading-relaxed font-medium">
                            <p>
                                RentalHub was created to solve a common challenge across Bohol Island: finding and booking a rental vehicle used to mean endless phone calls, unreturned social media messages, and last-minute double-booking headaches.
                            </p>

                            <p>
                                We built a clean, fast, and reliable website designed specifically to streamline vehicle rentals. Rentees can easily browse sedans, 15-seater group vans, scooters, and 4x4 SUVs, select their trip dates, and connect directly with local Boholano vehicle owners in seconds.
                            </p>
                        </div>
                    </div>

                    {/* Replace Static Image Frame with React Bits <DepthCarousel /> */}
                    <div className="lg:col-span-6">
                        <div className="relative w-full h-[440px] sm:h-[480px]">
                            <DepthCarousel
                                items={[
                                    { image: '/images/hero/car-fleet-option1.png', alt: 'RentalHub Fleet Handshake 1' },
                                    { image: '/images/hero/car-fleet-option2.png', alt: 'RentalHub Fleet Handshake 2' },
                                    { image: '/images/hero/car-fleet-option3.png', alt: 'RentalHub Fleet Handshake 3' },
                                    { image: '/images/hero/car-fleet-option4.png', alt: 'RentalHub Fleet Handshake 4' },
                                    { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=1000', alt: 'Bohol Coastline' }
                                ]}
                                cardWidth={290}
                                cardHeight={360}
                                radius={20}
                                depth={200}
                                spread={85}
                                tilt={20}
                                tiltDirection="right"
                                perspective={1300}
                                visibleCards={4}
                                falloff={0.2}
                                blur={5}
                                autoplay
                                autoplayDelay={3200}
                                loop
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: How We Solve The Problem */}
                <div className="space-y-10 lg:space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-primary-600">
                            Core Solution
                        </p>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                            How RentalHub Solves The Challenge
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">
                            Eliminating communication delays and double-booking stress for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Card 1: Fast & Instant Requests */}
                        <div className="group relative p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
                            {/* Ambient corner glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="relative">
                                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 opacity-25 blur-md group-hover:opacity-50 transition-opacity duration-300" />
                                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 ring-1 ring-white/30 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300">
                                            <LuZap className="w-7 h-7 stroke-[2.2] drop-shadow-xs" />
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-[11px] font-bold text-teal-700 tracking-wide uppercase">
                                        Instant Sync
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight group-hover:text-teal-950 transition-colors">
                                        Fast & Instant Requests
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                        No more waiting hours for replies. Rentees submit trip dates in seconds, and vehicle hosts receive instant notifications to review and accept requests.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Reliable Host Contacts */}
                        <div className="group relative p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
                            {/* Ambient corner glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="relative">
                                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 opacity-25 blur-md group-hover:opacity-50 transition-opacity duration-300" />
                                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 ring-1 ring-white/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                                            <LuHandshake className="w-7 h-7 stroke-[2.2] drop-shadow-xs" />
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
                                        Verified Hosts
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight group-hover:text-emerald-950 transition-colors">
                                        Reliable Host Contacts
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                        Once a booking request is accepted, direct contact phone numbers and emails unlock immediately for 1-tap calls and easy island pickup coordination.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Direct Local Pricing */}
                        <div className="group relative p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
                            {/* Ambient corner glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-600/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="relative">
                                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 opacity-25 blur-md group-hover:opacity-50 transition-opacity duration-300" />
                                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-700/30 ring-1 ring-white/30 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300">
                                            <LuBadgePercent className="w-7 h-7 stroke-[2.2] drop-shadow-xs" />
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-[11px] font-bold text-teal-800 tracking-wide uppercase">
                                        0% Middleman
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight group-hover:text-teal-950 transition-colors">
                                        Direct Local Pricing
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                        Rentees get transparent daily rates set directly by local Boholano owners with zero middleman markups or surprise booking fees.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Empowering Local Boholanos */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-primary-500/30 space-y-10">
                    <div className="max-w-3xl space-y-4 relative z-10">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-primary-400">
                            LOCAL COMMUNITY IMPACT
                        </p>
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                            Helping Boholanos Build an Efficient & Reliable Rental Service
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                            For local Boholano vehicle hosts, RentalHub provides a modern, high-speed website to showcase their vehicles without needing complicated tech setups. We empower local car, van, and scooter owners across Tagbilaran, Panglao, Dauis, Loboc, and beyond to manage their rental schedules efficiently and earn sustainable income.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold pt-8 border-t border-slate-800/80 relative z-10">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-3.5 backdrop-blur-md transition-all duration-200 group/pill">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover/pill:scale-105 transition-transform">
                                <LuShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="font-semibold text-slate-200">100% Free for Rentees</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-3.5 backdrop-blur-md transition-all duration-200 group/pill">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover/pill:scale-105 transition-transform">
                                <LuPlane className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="font-semibold text-slate-200">Airport & Port Pickup Sync</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-3.5 backdrop-blur-md transition-all duration-200 group/pill">
                            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover/pill:scale-105 transition-transform">
                                <LuSmartphone className="w-5 h-5 text-teal-300" />
                            </div>
                            <span className="font-semibold text-slate-200">Fast Mobile Performance</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-3.5 backdrop-blur-md transition-all duration-200 group/pill">
                            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover/pill:scale-105 transition-transform">
                                <LuMessagesSquare className="w-5 h-5 text-teal-400" />
                            </div>
                            <span className="font-semibold text-slate-200">Direct Host Communication</span>
                        </div>
                    </div>
                </div>

                {/* Section 4: Call to Action */}
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            Call customer care at <span className="font-bold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="glass-btn px-8 py-4 rounded-2xl font-bold text-xs shrink-0 flex items-center gap-2"
                    >
                        <span>Browse Vehicles Now</span>
                        <LuArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Section 5: Official Sponsor & Partner Brands — Infinite Horizontal Marquee */}
                <div className="bg-white rounded-3xl py-8 px-4 border border-slate-200/90 text-center overflow-hidden space-y-4 shadow-xs">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                        OFFICIAL FLEET BRANDS & BOHOL TOURISM PARTNERS
                    </p>
                    <div className="relative w-full overflow-hidden flex">
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

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
                                    className="px-7 py-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-center shrink-0 h-16 min-w-[200px] hover:border-slate-300 transition-all cursor-pointer"
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
