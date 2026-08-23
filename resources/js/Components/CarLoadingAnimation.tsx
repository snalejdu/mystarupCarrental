import React from 'react';

interface CarLoadingAnimationProps {
    /**
     * Size preset of the animated loader
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Main loading title or status message
     */
    text?: string;
    /**
     * Subtitle or contextual detail
     */
    subtext?: string;
    /**
     * Display as a centered card with glassmorphism
     */
    card?: boolean;
    /**
     * Optional className for outer wrapper
     */
    className?: string;
}

export default function CarLoadingAnimation({
    size = 'md',
    text = 'Loading...',
    subtext = 'Preparing your Bohol travel experience...',
    card = false,
    className = '',
}: CarLoadingAnimationProps) {
    const sizeMap = {
        sm: 'w-36 h-20',
        md: 'w-56 h-28',
        lg: 'w-72 h-36',
        xl: 'w-96 h-48',
    };

    const textMap = {
        sm: 'text-xs',
        md: 'text-sm font-semibold',
        lg: 'text-base font-bold',
        xl: 'text-lg font-bold',
    };

    const content = (
        <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
            {/* Ambient Glow Aura (High-Performance Radial Gradient) */}
            <div className="relative flex items-center justify-center">
                <div className="absolute -inset-4 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(13, 148, 136, 0) 70%)' }} />
                
                {/* Embedded Animated Vector Car (Inline SVG) */}
                <div className={`relative ${sizeMap[size]}`}>
                    <svg viewBox="0 0 400 200" width="100%" height="100%" className="w-full h-full object-contain overflow-visible" style={{ contain: 'layout paint' }}>
                        <defs>
                            <linearGradient id={`cCarGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2dd4bf"/>
                                <stop offset="50%" stopColor="#0d9488"/>
                                <stop offset="100%" stopColor="#115e59"/>
                            </linearGradient>
                            <linearGradient id={`cGlassGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.95"/>
                                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7"/>
                            </linearGradient>
                            <linearGradient id={`cHeadlightBeam-${size}`} x1="0%" y1="50%" x2="100%" y2="50%">
                                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9"/>
                                <stop offset="40%" stopColor="#fef08a" stopOpacity="0.35"/>
                                <stop offset="100%" stopColor="#fef08a" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id={`cRoadGlow-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0d9488" stopOpacity="0"/>
                                <stop offset="50%" stopColor="#0d9488" stopOpacity="0.35"/>
                                <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
                            </linearGradient>
                        </defs>

                        {/* Speed Wind Lines */}
                        <g stroke="#5eead4" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                            <line className="rb-wind-1" x1="160" y1="55" x2="220" y2="55" />
                            <line className="rb-wind-2" x1="120" y1="75" x2="190" y2="75" />
                            <line className="rb-wind-3" x1="90" y1="95" x2="150" y2="95" />
                        </g>

                        {/* Exhaust Smoke Puffs */}
                        <g fill="#cbd5e1">
                            <circle className="rb-ex-1" cx="0" cy="0" r="5" />
                            <circle className="rb-ex-2" cx="0" cy="0" r="6" />
                            <circle className="rb-ex-3" cx="0" cy="0" r="4" />
                        </g>

                        {/* Headlight Light Beam Cone */}
                        <polygon points="292,125 395,95 400,158 292,131" fill={`url(#cHeadlightBeam-${size})`} opacity="0.85" />

                        {/* Road Base */}
                        <rect x="0" y="148" width="400" height="8" rx="4" fill="#e2e8f0" />
                        <rect x="50" y="148" width="300" height="3" fill={`url(#cRoadGlow-${size})`} />

                        {/* Animated Dashed Lane Road Markings */}
                        <g className="rb-road" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round">
                            <line x1="0" y1="152" x2="40" y2="152" />
                            <line x1="80" y1="152" x2="120" y2="152" />
                            <line x1="160" y1="152" x2="200" y2="152" />
                            <line x1="240" y1="152" x2="280" y2="152" />
                            <line x1="320" y1="152" x2="360" y2="152" />
                            <line x1="400" y1="152" x2="440" y2="152" />
                            <line x1="480" y1="152" x2="520" y2="152" />
                        </g>

                        {/* CAR ASSEMBLY */}
                        <g className="rb-car">
                            <ellipse cx="195" cy="148" rx="105" ry="7" fill="#0f172a" opacity="0.15" />

                            <path d="M 95 130 L 100 115 Q 105 105 120 102 L 155 100 L 185 70 Q 195 65 210 65 L 255 65 Q 275 65 285 85 L 300 105 Q 312 110 315 122 L 315 133 Q 315 138 310 138 L 278 138 A 20 20 0 0 0 238 138 L 158 138 A 20 20 0 0 0 118 138 L 98 138 Q 95 138 95 130 Z" fill={`url(#cCarGrad-${size})`} stroke="#0f766e" strokeWidth="1.5" />

                            <path d="M 188 73 L 162 99 L 218 99 L 218 73 Q 205 72 188 73 Z" fill={`url(#cGlassGrad-${size})`} />
                            <path d="M 224 73 L 224 99 L 290 99 L 277 82 Q 268 73 252 73 Z" fill={`url(#cGlassGrad-${size})`} />
                            <line x1="221" y1="72" x2="221" y2="100" stroke="#042f2e" strokeWidth="3" />
                            <path d="M 158 100 L 293 100" stroke="#134e4a" strokeWidth="1.5" />

                            <path d="M 221 100 L 221 136" stroke="#042f2e" strokeWidth="1" opacity="0.7"/>
                            <path d="M 160 100 L 155 136" stroke="#042f2e" strokeWidth="1" opacity="0.7"/>
                            <rect x="226" y="104" width="10" height="2.5" rx="1.2" fill="#042f2e" />

                            <path d="M 305 116 Q 314 118 314 125 L 302 125 Z" fill="#fef08a" />
                            <path d="M 96 112 Q 95 120 98 123 L 104 123 L 102 112 Z" fill="#f43f5e" />

                            <circle cx="138" cy="138" r="18" fill="#0f172a" />
                            <circle cx="258" cy="138" r="18" fill="#0f172a" />

                            {/* Front Wheel */}
                            <g transform="translate(258, 138)">
                                <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                                <circle cx="0" cy="0" r="11" fill="#475569" />
                                <g className="rb-wheel">
                                    <circle cx="0" cy="0" r="8.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#f1f5f9" strokeWidth="2" />
                                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#f1f5f9" strokeWidth="2" />
                                    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#f1f5f9" strokeWidth="1.5" />
                                    <line x1="-5" y1="5" x2="5" y2="-5" stroke="#f1f5f9" strokeWidth="1.5" />
                                    <circle cx="0" cy="0" r="3" fill="#2dd4bf" />
                                </g>
                            </g>

                            {/* Rear Wheel */}
                            <g transform="translate(138, 138)">
                                <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                                <circle cx="0" cy="0" r="11" fill="#475569" />
                                <g className="rb-wheel">
                                    <circle cx="0" cy="0" r="8.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#f1f5f9" strokeWidth="2" />
                                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#f1f5f9" strokeWidth="2" />
                                    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#f1f5f9" strokeWidth="1.5" />
                                    <line x1="-5" y1="5" x2="5" y2="-5" stroke="#f1f5f9" strokeWidth="1.5" />
                                    <circle cx="0" cy="0" r="3" fill="#2dd4bf" />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Status text */}
            {text && (
                <div className="mt-3 space-y-1">
                    <p className={`${textMap[size]} text-slate-800 tracking-tight`}>
                        {text}
                    </p>
                    {subtext && (
                        <p className="text-xs text-slate-500 max-w-xs mx-auto animate-pulse">
                            {subtext}
                        </p>
                    )}
                </div>
            )}

            {/* Smooth indeterminate mini-bar */}
            <div className="mt-4 w-32 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-teal-400 rounded-full animate-[marquee_2s_ease-in-out_infinite] w-1/2" />
            </div>
        </div>
    );

    if (card) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full mx-auto">
                {content}
            </div>
        );
    }

    return content;
}
