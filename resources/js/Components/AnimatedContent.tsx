import { ReactNode, useEffect, useRef, useState } from 'react';

interface AnimatedContentProps {
    children: ReactNode;
    /** Delay before animation starts, in ms */
    delay?: number;
    /** Direction the element slides in from */
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    /** Distance in px */
    distance?: number;
    /** IntersectionObserver threshold */
    threshold?: number;
    /** Additional classes */
    className?: string;
    /** Animation duration in ms */
    duration?: number;
    /** Whether to blur in */
    blur?: boolean;
}

/**
 * AnimatedContent — Scroll-triggered fade+slide animation.
 * Uses IntersectionObserver + CSS transitions. Zero dependencies.
 * Inspired by ReactBits AnimatedContent / FadeContent.
 */
export default function AnimatedContent({
    children,
    delay = 0,
    direction = 'up',
    distance = 30,
    threshold = 0.1,
    className = '',
    duration = 600,
    blur = false,
}: AnimatedContentProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    const getTranslate = () => {
        switch (direction) {
            case 'up': return `translate3d(0, ${distance}px, 0)`;
            case 'down': return `translate3d(0, -${distance}px, 0)`;
            case 'left': return `translate3d(${distance}px, 0, 0)`;
            case 'right': return `translate3d(-${distance}px, 0, 0)`;
            case 'none': return 'translate3d(0, 0, 0)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate3d(0, 0, 0)' : getTranslate(),
                filter: blur ? (isVisible ? 'blur(0px)' : 'blur(6px)') : undefined,
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms${blur ? `, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` : ''}`,
                willChange: isVisible ? 'auto' : 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
