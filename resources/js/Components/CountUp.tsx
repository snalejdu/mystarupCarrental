import { useEffect, useRef, useState, useCallback } from 'react';

interface CountUpProps {
    to: number;
    from?: number;
    duration?: number;
    delay?: number;
    separator?: string;
    decimals?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    onEnd?: () => void;
}

/**
 * CountUp — Animates a number from `from` to `to` with easing.
 * Pure JS requestAnimationFrame, no Framer Motion.
 * Inspired by ReactBits CountUp component.
 */
export default function CountUp({
    to,
    from = 0,
    duration = 2,
    delay = 0,
    separator = '',
    decimals = 0,
    className = '',
    prefix = '',
    suffix = '',
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    const formatNumber = useCallback(
        (value: number) => {
            const fixed = value.toFixed(decimals);
            if (!separator) return `${prefix}${fixed}${suffix}`;

            const [intPart, decPart] = fixed.split('.');
            const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            return `${prefix}${decPart ? `${formatted}.${decPart}` : formatted}${suffix}`;
        },
        [separator, decimals, prefix, suffix]
    );

    // Intersection observer to trigger on scroll into view
    useEffect(() => {
        if (!ref.current) return;
        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observerRef.current?.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );
        observerRef.current.observe(ref.current);
        return () => observerRef.current?.disconnect();
    }, []);

    // Animate the count
    useEffect(() => {
        if (!hasStarted || !ref.current) return;

        const el = ref.current;
        el.textContent = formatNumber(from);

        const delayTimeout = setTimeout(() => {
            const startTime = performance.now();
            const durationMs = duration * 1000;

            // Ease-out cubic for smooth deceleration
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

            const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / durationMs, 1);
                const eased = easeOutCubic(progress);
                const current = from + (to - from) * eased;

                el.textContent = formatNumber(current);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    el.textContent = formatNumber(to);
                    onEnd?.();
                }
            };

            requestAnimationFrame(animate);
        }, delay * 1000);

        return () => clearTimeout(delayTimeout);
    }, [hasStarted, from, to, duration, delay, formatNumber, onEnd]);

    return <span ref={ref} className={className}>{formatNumber(from)}</span>;
}
