import React from 'react';
import CarLoadingAnimation from './CarLoadingAnimation';

interface LoadingScreenProps {
    /**
     * Controls whether the loading screen is visible
     */
    show?: boolean;
    /**
     * Primary loading heading text
     */
    title?: string;
    /**
     * Secondary message or step description
     */
    subtitle?: string;
    /**
     * Optional brand tag or indicator
     */
    brandText?: string;
    /**
     * Fullscreen modal overlay mode (fixed 0,0,0,0) or container-relative mode
     */
    fullscreen?: boolean;
}

export default function LoadingScreen({
    show = true,
    title = 'RentBohol',
    subtitle = 'Finding the best island vehicles for you...',
    brandText = 'Island Mobility Made Simple',
    fullscreen = true,
}: LoadingScreenProps) {
    if (!show) return null;

    const containerClasses = fullscreen
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl transition-all duration-300'
        : 'w-full py-16 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/80';

    return (
        <div className={containerClasses}>
            <div className="bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full mx-4 text-center transform transition-all animate-fade-in">
                {/* Brand Badge */}
                {brandText && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping" />
                        {brandText}
                    </div>
                )}

                {/* Animated Car */}
                <CarLoadingAnimation
                    size="lg"
                    text={title}
                    subtext={subtitle}
                    className="my-2"
                />
            </div>
        </div>
    );
}
