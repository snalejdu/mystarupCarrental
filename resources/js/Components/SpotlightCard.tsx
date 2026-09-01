import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

/**
 * SpotlightCard — ReactBits Component (GPU High-Performance Edition)
 * Zero React re-renders: uses CSS custom properties directly on the DOM node for 120fps scrolling.
 */
export default function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(13, 148, 136, 0.15)',
    ...props
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const div = divRef.current;
        if (!div) return;
        const rect = div.getBoundingClientRect();
        div.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
        div.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
        div.style.setProperty('--spotlight-opacity', '1');
    };

    const handleMouseLeave = () => {
        const div = divRef.current;
        if (!div) return;
        div.style.setProperty('--spotlight-opacity', '0');
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn('relative overflow-hidden rounded-2xl transition-all duration-300', className)}
            style={{
                ['--spotlight-opacity' as any]: '0',
                ['--spotlight-x' as any]: '0px',
                ['--spotlight-y' as any]: '0px',
            }}
            {...props}
        >
            {/* Dynamic Spotlight Glow Overlay */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[inherit]"
                style={{
                    opacity: 'var(--spotlight-opacity, 0)',
                    background: `radial-gradient(500px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor}, transparent 45%)`,
                }}
            />
            {children}
        </div>
    );
}
