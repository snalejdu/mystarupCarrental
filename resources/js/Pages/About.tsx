import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    UserCircle, CheckCircle, PhoneCall, Lightning, MapPin, CarProfile, Tag, Users, ArrowRight, Medal, LockSimple, Money, CalendarCheck } from '@phosphor-icons/react';
import DepthCarousel from '@/Components/DepthCarousel';

export default function About() {
    return (
        <PublicLayout>
            <Head>
                <title>About Us — RentBohol</title>
                <meta name="description" content="Learn about RentBohol, the fast, reliable, and efficient website connecting travelers directly with local Boholano vehicle owners." />
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
                                RentBohol was created to solve a common challenge across Bohol Island: finding and booking a rental vehicle used to mean endless phone calls, unreturned social media messages, and last-minute double-booking headaches.
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
                                    { image: '/images/hero/car-fleet-option1.png', alt: 'RentBohol Fleet Handshake 1' },
                                    { image: '/images/hero/car-fleet-option2.png', alt: 'RentBohol Fleet Handshake 2' },
                                    { image: '/images/hero/car-fleet-option3.png', alt: 'RentBohol Fleet Handshake 3' },
                                    { image: '/images/hero/car-fleet-option4.png', alt: 'RentBohol Fleet Handshake 4' },
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
                            How RentBohol Solves The Challenge
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">
                            Eliminating communication delays and double-booking stress for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Card 1: Fast */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white mb-2">
                                    <Lightning className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading font-bold text-lg text-slate-900">Fast & Instant Requests</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                        No more waiting hours for replies. Rentees submit trip dates in seconds, and vehicle hosts receive instant notifications to review and accept requests.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Reliable */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-2">
                                    <UserCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading font-bold text-lg text-slate-900">Reliable Host Contacts</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                        Once a booking request is accepted, direct contact phone numbers and emails unlock immediately for 1-tap calls and easy island pickup coordination.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Direct Pricing */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white mb-2">
                                    <Tag className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading font-bold text-lg text-slate-900">Direct Local Pricing</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
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
                            For local Boholano vehicle hosts, RentBohol provides a modern, high-speed website to showcase their vehicles without needing complicated tech setups. We empower local car, van, and scooter owners across Tagbilaran, Panglao, Dauis, Loboc, and beyond to manage their rental schedules efficiently and earn sustainable income.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold pt-8 border-t border-slate-800 relative z-10">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md">
                            <CheckCircle className="w-5 h-5 text-primary-400 shrink-0" />
                            <span>100% Free for Rentees</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md">
                            <CheckCircle className="w-5 h-5 text-primary-400 shrink-0" />
                            <span>Airport & Port Pickup Sync</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md">
                            <CheckCircle className="w-5 h-5 text-primary-400 shrink-0" />
                            <span>Fast Mobile Performance</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md">
                            <CheckCircle className="w-5 h-5 text-primary-400 shrink-0" />
                            <span>Direct Host Communication</span>
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
                        <ArrowRight className="w-4 h-4" />
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
