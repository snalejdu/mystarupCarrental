import { ReactNode } from 'react';

interface ShinyTextProps {
    children: ReactNode;
    className?: string;
    /** Speed in seconds for one shimmer cycle */
    speed?: number;
    /** Whether the shimmer is disabled */
    disabled?: boolean;
}

/**
 * ShinyText — CSS-only light shimmer sweep effect.
 * Wraps inline text with a periodic shimmer highlight.
 * Zero dependencies, pure CSS animation.
 * Inspired by ReactBits ShinyText component.
 */
export default function ShinyText({
    children,
    className = '',
    speed = 3,
    disabled = false,
}: ShinyTextProps) {
    if (disabled) {
        return <span className={className}>{children}</span>;
    }

    return (
        <span
            className={`shiny-text-wrapper ${className}`}
            style={{
                ['--shiny-speed' as string]: `${speed}s`,
            }}
        >
            {children}
        </span>
    );
}
