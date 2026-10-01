import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
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
import SpotlightCard from '@/Components/SpotlightCard';

export default function About() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <PublicLayout>
            <Head>
                <title>About Us — Waypt</title>
                <meta name="description" content="Learn about Waypt, the fast, reliable, and efficient website connecting travelers directly with local Boholano vehicle owners." />
            </Head>

            {/* Header Banner */}
            <div className="bg-white border-b border-slate-100 py-4.5 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1.5 sm:space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-teal-700 text-[11px] sm:text-[12.5px] font-bold uppercase tracking-wider">
                        Direct Island Marketplace
                    </span>
                    <h1 className="font-heading text-[20.5px] xs:text-[24.5px] sm:text-[30.5px] lg:text-[37px] font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
                        Empowering Bohol Tourism Direct & Fast
                    </h1>
                    <p className="text-slate-500 text-[12.5px] sm:text-[14.5px] max-w-2xl mx-auto font-medium leading-relaxed">
                        The simple, transparent, and direct marketplace connecting travelers with verified Boholano vehicle hosts.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-16 space-y-7 sm:space-y-14 lg:space-y-20">

                {/* Section 1: Our Mission + DepthCarousel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-16 items-center">
                    <div className="lg:col-span-6 space-y-2.5 sm:space-y-5">
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-widest text-primary-600">
                                OUR MISSION
                            </p>
                            <h2 className="font-heading text-[18.5px] xs:text-[20.5px] sm:text-[24.5px] lg:text-[30.5px] font-bold text-slate-900 tracking-tight leading-snug sm:leading-tight">
                                Empowering Bohol Tourism with a Fast, Direct & Reliable Platform
                            </h2>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3.5 text-slate-600 text-[13px] sm:text-[14.5px] leading-relaxed font-normal sm:font-medium">
                            <p>
                                Waypt was created to solve a common challenge across Bohol Island: finding and booking a rental vehicle used to mean endless phone calls, unreturned social media messages, and last-minute double-booking headaches.
                            </p>

                            <p>
                                We built a clean, fast, and reliable website designed specifically to streamline vehicle rentals. Rentees can easily browse sedans, 15-seater group vans, scooters, and 4x4 SUVs, select their trip dates, and connect directly with local Boholano vehicle owners in seconds.
                            </p>
                        </div>
                    </div>

                    {/* DepthCarousel Frame */}
                    <div className="lg:col-span-6">
                        <div className="relative w-full h-[315px] xs:h-[335px] sm:h-[450px]">
                            <DepthCarousel
                                items={[
                                    { image: '/images/hero/car-fleet-option1.png', alt: 'Waypt Fleet Handshake 1' },
                                    { image: '/images/hero/car-fleet-option2.png', alt: 'Waypt Fleet Handshake 2' },
                                    { image: '/images/hero/car-fleet-option3.png', alt: 'Waypt Fleet Handshake 3' },
                                    { image: '/images/hero/car-fleet-option4.png', alt: 'Waypt Fleet Handshake 4' },
                                    { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=1000', alt: 'Bohol Coastline' }
                                ]}
                                cardWidth={isMobile ? 220 : 310}
                                cardHeight={isMobile ? 275 : 385}
                                radius={16}
                                depth={isMobile ? 125 : 205}
                                spread={isMobile ? 42 : 88}
                                tilt={18}
                                tiltDirection="right"
                                perspective={1200}
                                visibleCards={isMobile ? 3 : 4}
                                falloff={0.2}
                                blur={5}
                                autoplay
                                autoplayDelay={3200}
                                loop
                                showControls={true}
                                disableSwipe={true}
                            />
                        </div>
                    </div>
                </div>

                    {/* Section 2: How We Solve The Problem */}
                    <div className="space-y-3 sm:space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
                            <p className="text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-widest text-primary-600">
                                CORE SOLUTION
                            </p>
                            <h2 className="font-heading text-[18.5px] xs:text-[20.5px] sm:text-[24.5px] lg:text-[30.5px] font-bold text-slate-900 tracking-tight leading-snug">
                                How Waypt Solves The Challenge
                            </h2>
                            <p className="text-slate-500 text-[12.5px] sm:text-[14.5px] font-medium leading-relaxed">
                                Eliminating communication delays and double-booking stress for everyone.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
                            {/* Card 1: Fast & Instant Requests */}
                            <SpotlightCard
                                spotlightColor="rgba(13, 148, 136, 0.12)"
                                className="h-full flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300/60 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between sm:w-full shrink-0 mb-0 sm:mb-3.5">
                                    <div className="glass-3d-badge shrink-0">
                                        <span
                                            className="glass-3d-badge__front"
                                            aria-hidden="true"
                                            style={{ boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)' }}
                                        >
                                            <LuZap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-[10.5px] font-bold text-teal-700 tracking-wide uppercase">
                                        Instant Sync
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1.5 mb-0.5 sm:mb-0">
                                        <h3 className="font-heading font-bold text-slate-900 text-[13.5px] sm:text-[16.5px] leading-snug">
                                            Fast & Instant Requests
                                        </h3>
                                        <span className="inline-flex sm:hidden shrink-0 items-center px-1.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-[10px] font-bold text-teal-700 tracking-wide uppercase">
                                            Instant Sync
                                        </span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] text-slate-600 mt-0.5 sm:mt-1.5 leading-relaxed font-medium">
                                        No more waiting hours for replies. Rentees submit trip dates in seconds, and vehicle hosts receive instant notifications to review and accept requests.
                                    </p>
                                </div>
                            </SpotlightCard>

                            {/* Card 2: Reliable Host Contacts */}
                            <SpotlightCard
                                spotlightColor="rgba(5, 150, 105, 0.12)"
                                className="h-full flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300/60 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between sm:w-full shrink-0 mb-0 sm:mb-3.5">
                                    <div className="glass-3d-badge glass-3d-badge--emerald shrink-0">
                                        <span
                                            className="glass-3d-badge__front"
                                            aria-hidden="true"
                                            style={{ boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)' }}
                                        >
                                            <LuHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10.5px] font-bold text-emerald-700 tracking-wide uppercase">
                                        Verified Hosts
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1.5 mb-0.5 sm:mb-0">
                                        <h3 className="font-heading font-bold text-slate-900 text-[13.5px] sm:text-[16.5px] leading-snug">
                                            Reliable Host Contacts
                                        </h3>
                                        <span className="inline-flex sm:hidden shrink-0 items-center px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-bold text-emerald-700 tracking-wide uppercase">
                                            Verified Hosts
                                        </span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] text-slate-600 mt-0.5 sm:mt-1.5 leading-relaxed font-medium">
                                        Once a booking request is accepted, direct contact phone numbers and emails unlock immediately for 1-tap calls and easy island pickup coordination.
                                    </p>
                                </div>
                            </SpotlightCard>

                            {/* Card 3: Direct Local Pricing */}
                            <SpotlightCard
                                spotlightColor="rgba(13, 148, 136, 0.12)"
                                className="h-full flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300/60 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between sm:w-full shrink-0 mb-0 sm:mb-3.5">
                                    <div className="glass-3d-badge shrink-0">
                                        <span
                                            className="glass-3d-badge__front"
                                            aria-hidden="true"
                                            style={{ boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)' }}
                                        >
                                            <LuBadgePercent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-[10.5px] font-bold text-teal-800 tracking-wide uppercase">
                                        0% Middleman
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1.5 mb-0.5 sm:mb-0">
                                        <h3 className="font-heading font-bold text-slate-900 text-[13.5px] sm:text-[16.5px] leading-snug">
                                            Direct Local Pricing
                                        </h3>
                                        <span className="inline-flex sm:hidden shrink-0 items-center px-1.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-[10px] font-bold text-teal-800 tracking-wide uppercase">
                                            0% Middleman
                                        </span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[12.5px] text-slate-600 mt-0.5 sm:mt-1.5 leading-relaxed font-medium">
                                        Rentees get transparent daily rates set directly by local Boholano owners with zero middleman markups or surprise booking fees.
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>

                    {/* Section 3: Empowering Local Boholanos */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-2xl sm:rounded-3xl p-4 sm:p-10 lg:p-14 text-white shadow-xl border border-primary-500/30 space-y-3.5 sm:space-y-8">
                        <div className="max-w-3xl space-y-1 sm:space-y-2.5 relative z-10">
                            <p className="text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-widest text-teal-400">
                                LOCAL COMMUNITY IMPACT
                            </p>
                            <h2 className="font-heading text-[18.5px] xs:text-[20.5px] sm:text-[24.5px] lg:text-[30.5px] font-extrabold leading-snug sm:leading-tight">
                                Helping Boholanos Build an Efficient & Reliable Rental Service
                            </h2>
                            <p className="text-slate-300 text-[12.5px] sm:text-[14.5px] leading-relaxed font-normal sm:font-medium">
                                For local Boholano vehicle hosts, Waypt provides a modern, high-speed platform to showcase their vehicles without needing complicated tech setups. We empower local car, van, and scooter owners across Tagbilaran, Panglao, Dauis, Loboc, and beyond to manage rental schedules efficiently and earn sustainable income.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 pt-3.5 sm:pt-6 border-t border-slate-800/80 relative z-10">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-2 sm:gap-3 backdrop-blur-md transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                    <LuShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                                </div>
                                <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-200 leading-tight">100% Free for Rentees</span>
                            </div>

                            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-2 sm:gap-3 backdrop-blur-md transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                    <LuPlane className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                                </div>
                                <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-200 leading-tight">Pier & Airport Sync</span>
                            </div>

                            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-2 sm:gap-3 backdrop-blur-md transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                                    <LuSmartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
                                </div>
                                <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-200 leading-tight">Mobile Performance</span>
                            </div>

                            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 flex items-center gap-2 sm:gap-3 backdrop-blur-md transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                                    <LuMessagesSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                                </div>
                                <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-slate-200 leading-tight">Direct Host Contact</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Call to Action */}
                    <div className="p-3.5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-center sm:text-left">
                        <div className="space-y-0.5 sm:space-y-1.5">
                            <h3 className="font-heading text-[16.5px] xs:text-[18.5px] sm:text-[24.5px] lg:text-[30.5px] font-extrabold text-slate-900 leading-snug">
                                Ready to explore Bohol Island?
                            </h3>
                            <p className="text-[11.5px] sm:text-[12.5px] text-slate-500 font-medium">
                                Call customer care at <span className="font-bold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                            </p>
                        </div>

                        <Link
                            href="/vehicles"
                            className="glass-btn w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl font-semibold text-[12.5px] sm:text-[14.5px] inline-flex items-center justify-center gap-2 shrink-0 shadow-sm"
                        >
                            <span>Browse Vehicles Now</span>
                            <LuArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-200" />
                        </Link>
                    </div>

                    {/* Section 5: Official Sponsor & Partner Brands — Infinite Horizontal Marquee */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl py-3.5 sm:py-6 px-3 sm:px-4 border border-slate-200/90 text-center overflow-hidden space-y-2 sm:space-y-3 shadow-xs">
                        <p className="text-[10.5px] sm:text-[12.5px] font-extrabold uppercase tracking-widest text-slate-400">
                            OFFICIAL FLEET BRANDS & BOHOL TOURISM PARTNERS
                        </p>
                        <div className="relative w-full overflow-hidden flex">
                            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                            <div className="flex gap-8 sm:gap-14 animate-marquee items-center">
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
                                        className="px-4 py-1.5 sm:px-6 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200/80 flex items-center justify-center shrink-0 h-10 sm:h-14 min-w-[130px] sm:min-w-[180px] hover:border-slate-300 transition-all cursor-pointer"
                                    >
                                        <img src={brand.src} alt={brand.name} className="h-5.5 sm:h-7.5 w-auto object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </PublicLayout>
            );
}

