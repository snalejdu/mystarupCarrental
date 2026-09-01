import React from 'react';

interface AuroraBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    showRadialGradient?: boolean;
}

/**
 * AuroraBackground — High Performance ReactBits Background Component
 * Optimized GPU-accelerated organic glow with zero scroll lag.
 */
export default function AuroraBackground({
    children,
    className = '',
    showRadialGradient = true,
}: AuroraBackgroundProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none contain-strict">
                {/* Hardware-accelerated soft glowing orbs */}
                <div
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-35"
                    style={{
                        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.4) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 70%)',
                        transform: 'translate3d(0, 0, 0)',
                    }}
                />
                <div
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(232, 108, 58, 0.3) 0%, rgba(45, 212, 191, 0.15) 50%, transparent 70%)',
                        transform: 'translate3d(0, 0, 0)',
                    }}
                />
                <div
                    className="absolute top-[30%] left-[20%] w-[50%] h-[50%] rounded-full opacity-25"
                    style={{
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(13, 148, 136, 0.1) 50%, transparent 70%)',
                        transform: 'translate3d(0, 0, 0)',
                    }}
                />
            </div>
            {showRadialGradient && (
                <div className="absolute inset-0 bg-radial from-transparent via-slate-900/10 to-slate-900/40 pointer-events-none" />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
