import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import CarLoadingAnimation from '@/Components/CarLoadingAnimation';
import LoadingScreen from '@/Components/LoadingScreen';
import GlassIcons from '@/Components/GlassIcons';
import DriftWall from '@/Components/DriftWall';
import AccordionGallery from '@/Components/AccordionGallery';
import { 
    Play, Sliders, Stack, ArrowsClockwise, CheckCircle, FileText, Book, Heart, Cloud, PencilSimple, ChartBar, Car, Bus, Motorcycle, Key, ShieldCheck, Compass } from '@phosphor-icons/react';

export default function AnimationPreview() {
    const [activeSize, setActiveSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [customText, setCustomText] = useState('Finding island vehicles...');
    const [customSubtext, setCustomSubtext] = useState('Checking instant availability across Bohol');
    const [cardMode, setCardMode] = useState(true);

    const triggerFullscreenDemo = () => {
        setShowFullscreen(true);
        setTimeout(() => {
            setShowFullscreen(false);
        }, 3000);
    };

    return (
        <PublicLayout>
            <Head title="Car Loading Animation Showcase" />
            {/* Fullscreen Overlay Triggered by Button */}
            <LoadingScreen 
                show={showFullscreen}
                title="Confirming Reservation"
                subtitle="Locking vehicle calendar dates and notifying owner... (Auto-closes in 3s)"
                brandText="RentBohol Live Booking"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        RentBohol Animated Car Loader
                    </h1>
                    <p className="mt-3 text-base sm:text-lg text-slate-600">
                        Interactive preview of the vector SVG animation, inline React loading components, and fullscreen modal overlays.
                    </p>
                </div>

                {/* Main Interactive Stage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Controls Panel */}
                    <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                            <Sliders className="w-5 h-5 text-teal-600" />
                            <h2 className="text-lg font-bold text-slate-800">Animation Controls</h2>
                        </div>

                        {/* Size Picker */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                Component Size Preset
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setActiveSize(s)}
                                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all uppercase ${
                                            activeSize === s
                                                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/20'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title text input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                Primary Label Text
                            </label>
                            <input
                                type="text"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                placeholder="e.g. Loading vehicles..."
                            />
                        </div>

                        {/* Subtitle text input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                Subtitle Text
                            </label>
                            <input
                                type="text"
                                value={customSubtext}
                                onChange={(e) => setCustomSubtext(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                                placeholder="e.g. Checking availability..."
                            />
                        </div>

                        {/* Card wrapper toggle */}
                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Card Glassmorphism Frame</p>
                                <p className="text-xs text-slate-500">Wrap with white backdrop blur container</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={cardMode}
                                onChange={(e) => setCardMode(e.target.checked)}
                                className="w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                            />
                        </div>

                        {/* Fullscreen Demo Button */}
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={triggerFullscreenDemo}
                                className="w-full py-3 px-4 rounded-xl bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold transition-all shadow-md shadow-primary-700/25 flex items-center justify-center gap-2 group"
                            >
                                <Play className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
                                Test Fullscreen Modal Loading Screen (3s)
                            </button>
                        </div>
                    </div>

                    {/* Live Preview Display */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Live Canvas */}
                        <div className="bg-gradient-to-br from-slate-100 via-teal-50/50 to-slate-200 rounded-3xl p-8 sm:p-12 shadow-inner min-h-[420px] flex items-center justify-center relative overflow-hidden border border-slate-200/80">
                            {/* Decorative background grid pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948808_1px,transparent_1px),linear-gradient(to_bottom,#0d948808_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                            
                            {/* Ambient focal lights */}
                            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 w-full flex justify-center">
                                <CarLoadingAnimation
                                    size={activeSize}
                                    text={customText}
                                    subtext={customSubtext}
                                    card={cardMode}
                                />
                            </div>
                        </div>

                        {/* Asset Direct Access Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                    <Stack className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Direct SVG Vector Asset</h3>
                                    <p className="text-xs text-slate-500 font-mono">/animations/car-loader.svg</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <a
                                    href="/animations/car-loader.svg"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center flex-1 sm:flex-none"
                                >
                                    Open Raw SVG
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features & Best Practices */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Infinite Vector Crispness</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Crafted in pure scalable vector format with embedded keyframes. Stays sharp on 4K & mobile Retina displays at zero bandwidth overhead (&lt;3KB).
                        </p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Zero Dependencies</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Runs on native CSS animations without heavy external Lottie Web player scripts, ensuring instant page load speed and smooth 60fps rendering.
                        </p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Bohol Theme Synergy</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Matched to RentBohol's coastal teal palette with suspension physics, high-speed road lane markers, and night-drive headlight projections.
                        </p>
                    </div>
                </div>

                {/* Toast Motion HQ 5-Rules Live Interactive Suite */}
                <div className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Toasts Done Right Interactive Suite
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Desktop Bottom-Right • Mobile Top • Hover to Pause • Swipe to Dismiss • Color-Coded Accents
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                        <button
                            type="button"
                            onClick={() => {
                                import('@/Components/DynamicToast').then(({ triggerToast }) => {
                                    triggerToast({
                                        title: 'File uploaded',
                                        description: 'Cover.png — 2.4 MB (4s Auto-dismiss)',
                                        type: 'info'
                                    });
                                });
                            }}
                            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border-l-4 border-l-sky-500 border border-slate-800 shadow-sm transition-transform active:scale-95 group cursor-pointer"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">Rule 02 • Info (4s)</span>
                            <span className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors block">Trigger Info Toast</span>
                            <span className="text-xs text-slate-400 mt-0.5 block">Auto-dismiss in 4 seconds</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                import('@/Components/DynamicToast').then(({ triggerToast }) => {
                                    triggerToast({
                                        title: 'Booking Confirmed',
                                        description: 'Toyota Fortuner locked for 3 days',
                                        type: 'success'
                                    });
                                });
                            }}
                            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border-l-4 border-l-emerald-500 border border-slate-800 shadow-sm transition-transform active:scale-95 group cursor-pointer"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Rule 02 • Success (4s)</span>
                            <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors block">Trigger Success</span>
                            <span className="text-xs text-slate-400 mt-0.5 block">Auto-dismiss in 4 seconds</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                import('@/Components/DynamicToast').then(({ triggerToast }) => {
                                    triggerToast({
                                        title: 'Session Expiring',
                                        description: 'Save your booking work soon (7s hold)',
                                        type: 'warning'
                                    });
                                });
                            }}
                            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border-l-4 border-l-amber-500 border border-slate-800 shadow-sm transition-transform active:scale-95 group cursor-pointer"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">Rule 02 • Warning (7s)</span>
                            <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors block">Trigger Warning</span>
                            <span className="text-xs text-slate-400 mt-0.5 block">Holds longer for readability</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                import('@/Components/DynamicToast').then(({ triggerToast }) => {
                                    triggerToast({
                                        title: 'Payment Failed',
                                        description: 'Waiting for user action. Please retry.',
                                        type: 'error'
                                    });
                                });
                            }}
                            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border-l-4 border-l-rose-500 border border-slate-800 shadow-sm transition-transform active:scale-95 group cursor-pointer"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">Rule 02 • Error (∞ Persistent)</span>
                            <span className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors block">Trigger Error</span>
                            <span className="text-xs text-slate-400 mt-0.5 block">Requires user close</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                import('@/Components/DynamicToast').then(({ triggerToast }) => {
                                    triggerToast({
                                        title: 'Payment Received',
                                        description: '₱12,500 from Maria Lopez via Maya',
                                        type: 'payment'
                                    });
                                });
                            }}
                            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border-l-4 border-l-teal-400 border border-slate-800 shadow-sm transition-transform active:scale-95 group cursor-pointer"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-1">Rule 05 • Bohol Payment</span>
                            <span className="text-sm font-semibold text-white group-hover:text-teal-200 transition-colors block">Trigger Payment</span>
                            <span className="text-xs text-slate-400 mt-0.5 block">Teal ocean accent</span>
                        </button>
                    </div>
                </div>

                {/* React Bits: GlassIcons Component Showcase */}
                <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            3D Glassmorphism Icons (<code className="text-teal-400 font-mono text-xl">&lt;GlassIcons /&gt;</code>)
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Interactive 3D depth, frosted glass backdrop filters, smooth hover elevation, and responsive labels.
                        </p>
                    </div>

                    <div className="relative min-h-[480px] flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                        <GlassIcons
                            items={[
                                { icon: <FileText className="w-6 h-6" />, color: 'blue', label: 'Files' },
                                { icon: <Book className="w-6 h-6" />, color: 'purple', label: 'Books' },
                                { icon: <Heart className="w-6 h-6" />, color: 'red', label: 'Health' },
                                { icon: <Cloud className="w-6 h-6" />, color: 'indigo', label: 'Weather' },
                                { icon: <PencilSimple className="w-6 h-6" />, color: 'orange', label: 'Notes' },
                                { icon: <ChartBar className="w-6 h-6" />, color: 'green', label: 'Stats' },
                            ]}
                        />
                    </div>
                </div>

                {/* React Bits: DriftWall Component Showcase */}
                <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            3D Drifting Wall (<code className="text-teal-400 font-mono text-xl">&lt;DriftWall /&gt;</code>)
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Smooth infinite continuous 3D perspective drifting photo columns with parallax pointer tracking and active tile elevation.
                        </p>
                    </div>

                    <div className="relative h-[560px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80">
                        <DriftWall
                            items={[
                                { image: '/images/hero/car-fleet-option1.png', title: 'Island Fleet Handshake Deal', href: '/vehicles' },
                                { image: '/images/hero/car-fleet-option2.png', title: 'Bohol Vehicle Handover', href: '/vehicles' },
                                { image: '/images/hero/car-fleet-option3.png', title: 'Panglao Coastal Fleet', href: '/vehicles' },
                                { image: '/images/hero/car-fleet-option4.png', title: 'Tagbilaran Direct Pickup', href: '/vehicles' },
                                { image: '/images/destinations/chocolate_hills.jpg', title: 'Chocolate Hills', href: '/vehicles' },
                                { image: '/images/destinations/panglao_beach.jpg', title: 'Panglao Beach', href: '/vehicles' },
                                { image: '/images/demo/vios.png', title: 'Toyota Vios', href: '/vehicles' },
                                { image: '/images/destinations/tarsier_sanctuary.jpg', title: 'Tarsier Sanctuary', href: '/vehicles' },
                                { image: '/images/demo/montero.png', title: 'Mitsubishi Montero', href: '/vehicles' },
                                { image: '/images/destinations/loboc_river.jpg', title: 'Loboc River', href: '/vehicles' },
                                { image: '/images/demo/urvan.png', title: 'Nissan NV350', href: '/vehicles' },
                                { image: '/images/demo/click.png', title: 'Honda Click 125', href: '/vehicles' },
                            ]}
                            columns={4}
                            tileWidth={190}
                            tileHeight={125}
                            gap={16}
                            tilt={16}
                            turn={-14}
                            perspective={1200}
                            depth={120}
                            speed={42}
                            direction="up"
                            variance={0.45}
                            parallax={0.6}
                            lift={64}
                            fade={0.6}
                            dim={0.55}
                            overlayColor="#060010"
                        />
                    </div>
                </div>

                {/* React Bits: AccordionGallery Component Showcase */}
                <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Accordion Gallery (<code className="text-teal-400 font-mono text-xl">&lt;AccordionGallery /&gt;</code>)
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Smooth GSAP physics-powered interactive expanding accordion panels with 3D rotation, parallax image drift, and dynamic label reveals.
                        </p>
                    </div>

                    <div className="w-full relative">
                        <AccordionGallery
                            items={[
                                { image: '/images/destinations/chocolate_hills.jpg', label: 'Chocolate Hills — Carmen', link: '#' },
                                { image: '/images/destinations/panglao_beach.jpg', label: 'Panglao White Beach', link: '#' },
                                { image: '/images/demo/vios.png', label: 'Sedan Fleet — Toyota Vios', link: '#' },
                                { image: '/images/destinations/tarsier_sanctuary.jpg', label: 'Tarsier Sanctuary — Corella', link: '#' },
                                { image: '/images/destinations/loboc_river.jpg', label: 'Loboc River Cruise', link: '#' },
                            ]}
                            defaultIndex={2}
                            expandRatio={0.52}
                            trigger="hover"
                            accentColor="#14b8a6"
                            overlayColor="#090d16"
                            textColor="#ffffff"
                            height={480}
                            gap={10}
                            radius={18}
                            bezelLess={true}
                        />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
