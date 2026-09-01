import React, { useEffect, useRef, useState, useMemo } from 'react';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'characters';
    direction?: 'top' | 'bottom';
    threshold?: number;
    onAnimationComplete?: () => void;
}

/**
 * BlurText — ReactBits Component
 * Words or characters smoothly blur-fade in from offset to sharp focus.
 */
export default function BlurText({
    text,
    delay = 90,
    className = '',
    animateBy = 'words',
    direction = 'bottom',
    threshold = 0.1,
    onAnimationComplete,
}: BlurTextProps) {
    const elements = useMemo(
        () => (animateBy === 'words' ? text.split(' ') : text.split('')),
        [text, animateBy]
    );
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Check if already in viewport on mount
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setInView(true);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    useEffect(() => {
        if (!inView || !onAnimationComplete) return;
        const totalDuration = elements.length * delay + 500;
        const timeout = setTimeout(onAnimationComplete, totalDuration);
        return () => clearTimeout(timeout);
    }, [inView, elements.length, delay, onAnimationComplete]);

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
            {elements.map((word, i) => (
                <span
                    key={i}
                    className="inline-block blur-text-element"
                    style={{
                        animationDelay: inView ? `${i * delay}ms` : undefined,
                        animationPlayState: inView ? 'running' : 'paused',
                        marginRight: animateBy === 'words' ? '0.28em' : '0em',
                        ['--blur-direction' as string]: direction === 'top' ? '-18px' : '18px',
                    }}
                >
                    {word === '' ? '\u00A0' : word}
                </span>
            ))}
        </span>
    );
}
