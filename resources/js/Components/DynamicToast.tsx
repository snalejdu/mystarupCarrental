import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CheckCircle, WarningCircle, Warning, Info, X, CreditCard } from '@phosphor-icons/react';

export interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type?: 'success' | 'info' | 'warning' | 'error' | 'payment';
    duration?: number; // 0 or Infinity = persistent until acknowledged
}

interface ToastItemProps {
    toast: ToastMessage;
    onDismiss: (id: string) => void;
}

/**
 * Dispatches a toast notification globally across the application.
 */
export function triggerToast(toast: Omit<ToastMessage, 'id'>) {
    if (typeof window !== 'undefined') {
        const id = Math.random().toString(36).substring(2, 9);
        window.dispatchEvent(new CustomEvent('RentalHub:toast', { detail: { ...toast, id } }));
    }
}

/**
 * Determine default timing based on Rule 02:
 * - Info / Success: 4s Auto-dismiss
 * - Warning: 7s Holds longer
 * - Error: Infinity / Persistent until user acknowledges
 * - Payment: 5s
 */
function getDefaultDuration(type?: ToastMessage['type']): number {
    switch (type) {
        case 'warning':
            return 7000;
        case 'error':
            return Infinity; // Persistent until user manually dismisses
        case 'payment':
            return 5000;
        case 'info':
        case 'success':
        default:
            return 4000;
    }
}

function ToastCard({ toast, onDismiss }: ToastItemProps) {
    const duration = toast.duration !== undefined ? toast.duration : getDefaultDuration(toast.type);
    const [isHovered, setIsHovered] = useState(false);
    const [touchOffset, setTouchOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const remainingTimeRef = useRef<number>(duration);
    const startTimeRef = useRef<number>(Date.now());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onDismiss(toast.id);
        }, 220);
    }, [onDismiss, toast.id]);

    // Setup and manage hover-to-pause countdown timer (Rule 04)
    useEffect(() => {
        if (duration === Infinity || duration <= 0) return;

        if (!isHovered) {
            startTimeRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                handleDismiss();
            }, remainingTimeRef.current);
        } else {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            const elapsed = Date.now() - startTimeRef.current;
            remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isHovered, duration, handleDismiss]);

    // Touch gesture: Swipe to dismiss on mobile (Rule 04)
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - touchStartX.current;
        const deltaY = currentY - (touchStartY.current || 0);

        // Prioritize horizontal swipe gestures
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setTouchOffset(deltaX);
        }
    };

    const handleTouchEnd = () => {
        if (Math.abs(touchOffset) > 80) {
            // Dismiss if swiped past threshold
            handleDismiss();
        } else {
            // Spring back
            setTouchOffset(0);
        }
        touchStartX.current = null;
        touchStartY.current = null;
        setIsSwiping(false);
    };

    // Color Coding & Left Border Accent (Rule 05)
    const getTypeStyles = (type?: ToastMessage['type']) => {
        switch (type) {
            case 'success':
                return {
                    borderLeft: 'border-l-emerald-500',
                    iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                    icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
                    badge: 'bg-emerald-500/20 text-emerald-300',
                };
            case 'warning':
                return {
                    borderLeft: 'border-l-amber-500',
                    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                    icon: <Warning className="w-5 h-5 text-amber-400 shrink-0" />,
                    badge: 'bg-amber-500/20 text-amber-300',
                };
            case 'error':
                return {
                    borderLeft: 'border-l-rose-500',
                    iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
                    icon: <WarningCircle className="w-5 h-5 text-rose-400 shrink-0" />,
                    badge: 'bg-rose-500/20 text-rose-300',
                };
            case 'payment':
                return {
                    borderLeft: 'border-l-teal-400',
                    iconBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
                    icon: <CreditCard className="w-5 h-5 text-teal-300 shrink-0" />,
                    badge: 'bg-teal-500/20 text-teal-300',
                };
            case 'info':
            default:
                return {
                    borderLeft: 'border-l-sky-500',
                    iconBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
                    icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
                    badge: 'bg-sky-500/20 text-sky-300',
                };
        }
    };

    const styles = getTypeStyles(toast.type);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-xl rounded-xl p-3.5 sm:px-4 sm:py-3.5 shadow-2xl border border-slate-800/80 border-l-4 ${styles.borderLeft} text-white flex items-center justify-between gap-3 select-none transition-all duration-200 ${
                isExiting ? 'opacity-0 scale-95 translate-x-10 sm:translate-x-12' : 'animate-toast-in'
            }`}
            style={{
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                transform: touchOffset ? `translateX(${touchOffset}px)` : undefined,
                opacity: touchOffset ? Math.max(0.2, 1 - Math.abs(touchOffset) / 200) : undefined,
                transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.2, 1.2, 0.3, 1), opacity 0.2s ease',
            }}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Icon Container with Left Color Coding */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${styles.iconBg}`}>
                    {styles.icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-100 truncate">
                            {toast.title}
                        </span>
                        {/* Subtle Hover Paused Indicator */}
                        {isHovered && duration !== Infinity && duration > 0 && (
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded text-center">
                                Paused
                            </span>
                        )}
                        {toast.type === 'error' && (
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded">
                                Action Required
                            </span>
                        )}
                    </div>
                    {toast.description && (
                        <div className="text-xs text-slate-300 font-normal truncate mt-0.5">
                            {toast.description}
                        </div>
                    )}
                </div>
            </div>

            {/* Close Button (Rule 04: Always offer a way out, min 44x44px touch area) */}
            <button
                type="button"
                onClick={handleDismiss}
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-slate-400"
                title="Dismiss notification"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

/**
 * Toast Container adhering to the 5 rules:
 * 1. Position: Desktop Bottom-Right, Mobile Top with safe area, Never Center
 * 2. Timing: Info/Success 4s, Warning 7s, Error Infinite
 * 3. Stacking: Max 3 visible, Spring physics
 * 4. Dismissible: Close button, Swipe on mobile, Hover to pause
 * 5. Color Coding: Icon + Left Accent Border
 */
export default function DynamicToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handleToast = (e: Event) => {
            const customEvent = e as CustomEvent<ToastMessage>;
            const newToast = customEvent.detail;

            // Rule 03: Stacking - Max 3 visible at once
            setToasts(prev => {
                const updated = [...prev, newToast];
                return updated.slice(-3);
            });
        };

        window.addEventListener('RentalHub:toast', handleToast);
        return () => window.removeEventListener('RentalHub:toast', handleToast);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    if (toasts.length === 0) return null;

    return (
        /* Rule 01: Mobile = Top (top-[calc(1rem+env(safe-area-inset-top,0px))] inset-x-4), Desktop = Bottom-Right (sm:top-auto sm:bottom-6 sm:right-6 sm:left-auto) */
        <aside
            aria-label="Notifications"
            className="fixed z-[999999] pointer-events-none flex flex-col gap-2.5 
                       top-[calc(1rem+env(safe-area-inset-top,0px))] left-4 right-4 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 sm:w-auto"
        >
            {toasts.map(toast => (
                <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </aside>
    );
}
