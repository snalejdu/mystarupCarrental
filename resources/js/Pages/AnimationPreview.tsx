import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import CarLoadingAnimation from '@/Components/CarLoadingAnimation';
import LoadingScreen from '@/Components/LoadingScreen';
import { Play, Sparkles, Sliders, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

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
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        Animation & Loading Showcase
                    </div>
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
                                    <Layers className="w-6 h-6" />
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
                        <CheckCircle2 className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Infinite Vector Crispness</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Crafted in pure scalable vector format with embedded keyframes. Stays sharp on 4K & mobile Retina displays at zero bandwidth overhead (&lt;3KB).
                        </p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Zero Dependencies</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Runs on native CSS animations without heavy external Lottie Web player scripts, ensuring instant page load speed and smooth 60fps rendering.
                        </p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Bohol Theme Synergy</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Matched to RentBohol's coastal teal palette with suspension physics, high-speed road lane markers, and night-drive headlight projections.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
