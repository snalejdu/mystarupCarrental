import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
    /**
     * 'full': Badge + Typography (RentBohol)
     * 'icon': Standalone Circular Badge Emblem
     * 'badge': Large Centered Badge
     */
    variant?: 'full' | 'icon' | 'badge';
    /**
     * Sub-label for specific dashboards e.g. 'Host', 'Admin', 'Car & Van Rental'
     */
    subtitle?: string;
    /**
     * Color theme mode
     */
    theme?: 'light' | 'dark' | 'auto';
    /**
     * Size scale
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Whether to show interactive hover scale & glow
     */
    interactive?: boolean;
}

export default function BrandLogo({
    variant = 'full',
    subtitle,
    theme = 'auto',
    size = 'md',
    className = '',
    interactive = true,
}: BrandLogoProps) {
    const [imgError, setImgError] = useState(false);

    // Size tokens for the emblem
    const emblemSizeMap = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20',
    };

    // Typography sizing
    const textSizeMap = {
        sm: 'text-base',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
    };

    const subtitleSizeMap = {
        sm: 'text-xs tracking-wider',
        md: 'text-xs tracking-widest',
        lg: 'text-xs tracking-widest',
        xl: 'text-sm tracking-widest',
    };

    const isDark = theme === 'dark';

    // If variant is 'badge' (large centered display)
    if (variant === 'badge') {
        return (
            <div className={`flex flex-col items-center text-center ${className}`}>
                <div
                    className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                        interactive ? 'hover:scale-105 hover:drop-shadow-lg' : ''
                    } ${emblemSizeMap[size]}`}
                >
                    <img
                        src="/images/logo/logo-circle.png"
                        alt="RentBohol All Vehicle Rentals"
                        className="w-full h-full object-contain"
                    />
                </div>
                {subtitle && (
                    <span className="mt-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                        {subtitle}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-3 select-none',
                interactive && 'group cursor-pointer',
                className
            )}
        >
            {/* Option 1 Tourist Van Emblem Badge (Transparent Circle) */}
            <div
                className={`relative shrink-0 rounded-full overflow-hidden transition-all duration-300 ${
                    interactive ? 'group-hover:scale-105 group-hover:drop-shadow-md' : ''
                } ${emblemSizeMap[size]}`}
            >
                {!imgError ? (
                    <img
                        src="/images/logo/logo-circle.png"
                        alt="RentBohol"
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    /* Fallback vector if image not loaded */
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-teal-400 font-bold text-xs">
                        RB
                    </div>
                )}
            </div>

            {/* Brand Typography (when variant === 'full') */}
            {variant === 'full' && (
                <div className="flex flex-col leading-tight">
                    <div
                        className={`font-heading font-extrabold tracking-tight transition-colors ${textSizeMap[size]} ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}
                    >
                        Rent
                        <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            Bohol
                        </span>
                    </div>

                    {/* Subtitle / Department Badge */}
                    {subtitle ? (
                        <div
                            className={`font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider mt-0.5 ${subtitleSizeMap[size]}`}
                        >
                            {subtitle}
                        </div>
                    ) : (
                        <span
                            className={`text-slate-400 font-semibold tracking-wide text-xs uppercase hidden sm:block`}
                        >
                            All Vehicle Rentals
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
