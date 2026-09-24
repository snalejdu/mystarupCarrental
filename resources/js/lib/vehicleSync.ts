import { useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { triggerToast } from '@/Components/DynamicToast';

export const VEHICLE_SYNC_CHANNEL = 'RentalHub-vehicle-sync';
export const VEHICLE_SYNC_STORAGE_KEY = 'RentalHub_last_vehicle_sync';

export interface VehicleSyncMessage {
    type: 'VEHICLE_UPDATED';
    slug?: string;
    id?: number;
    action?: string;
    timestamp: number;
    senderId: string;
}

// Unique tab/window session ID to identify the message origin
const SENDER_ID = typeof window !== 'undefined'
    ? Math.random().toString(36).substring(2, 11)
    : 'server';

/**
 * Broadcasts a vehicle update event across browser tabs, windows, and local storage.
 * Call this whenever an owner saves vehicle details, availability, photos, or status.
 */
export function broadcastVehicleUpdate(payload: {
    slug?: string;
    id?: number;
    action?: string;
}) {
    if (typeof window === 'undefined') return;

    const message: VehicleSyncMessage = {
        type: 'VEHICLE_UPDATED',
        slug: payload.slug,
        id: payload.id,
        action: payload.action || 'update',
        timestamp: Date.now(),
        senderId: SENDER_ID,
    };

    // 1. Modern BroadcastChannel API (fastest cross-tab message delivery)
    try {
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel(VEHICLE_SYNC_CHANNEL);
            channel.postMessage(message);
            channel.close();
        }
    } catch (e) {
        // Fallback safely if BroadcastChannel is restricted in some environments
    }

    // 2. LocalStorage event (fires 'storage' event across other tabs & windows)
    try {
        localStorage.setItem(VEHICLE_SYNC_STORAGE_KEY, JSON.stringify(message));
    } catch (e) {
        // Fallback safely
    }

    // 3. Custom DOM event on window (for any in-page listeners)
    try {
        window.dispatchEvent(new CustomEvent('RentalHub:vehicle-sync', { detail: message }));
    } catch (e) {
        // Fallback safely
    }
}

/**
 * Retrieves the last stored vehicle sync message from localStorage.
 */
export function getLastVehicleSync(): VehicleSyncMessage | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(VEHICLE_SYNC_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as VehicleSyncMessage;
    } catch (e) {
        return null;
    }
}

export interface UseVehicleAutoSyncOptions {
    activeVehicleSlug?: string;
    enablePolling?: boolean;
    pollingIntervalMs?: number;
    showToastOnSync?: boolean;
}

/**
 * React hook for public/renter views to automatically reload props in real-time
 * without the user having to manually refresh (F5).
 */
export function useVehicleAutoSync({
    activeVehicleSlug,
    enablePolling = false,
    pollingIntervalMs = 8000,
    showToastOnSync = true,
}: UseVehicleAutoSyncOptions = {}) {
    const lastSyncTimeRef = useRef<number>(Date.now());
    const isReloadingRef = useRef<boolean>(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Trigger Inertia reload with state & scroll preservation
    const performReload = useCallback((actionMsg?: string, isSilentPoll: boolean = false) => {
        if (isReloadingRef.current) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            isReloadingRef.current = true;
            lastSyncTimeRef.current = Date.now();

            router.reload({
                onFinish: () => {
                    isReloadingRef.current = false;
                },
                onSuccess: () => {
                    isReloadingRef.current = false;
                    // Only show HUD toast if this was a broadcasted change, not a silent background poll
                    if (showToastOnSync && !isSilentPoll) {
                        triggerToast({
                            title: '⚡ Listing Updated Live',
                            description: actionMsg
                                ? `Vehicle details updated (${actionMsg}).`
                                : 'Vehicle details & schedule have been synced.',
                            type: 'info',
                            duration: 3500,
                        });
                    }
                },
                onError: () => {
                    isReloadingRef.current = false;
                },
            });
        }, 150); // 150ms debounce
    }, [showToastOnSync]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if message is relevant for this page
        const isRelevant = (msg: VehicleSyncMessage) => {
            // If sender is current tab, skip
            if (msg.senderId === SENDER_ID) return false;

            // If this is a vehicle details page, check if slug matches or if it's general
            if (activeVehicleSlug) {
                return !msg.slug || msg.slug === activeVehicleSlug;
            }
            // For general public pages (/vehicles or /), any vehicle update is relevant
            return true;
        };

        // 1. BroadcastChannel Listener
        let channel: BroadcastChannel | null = null;
        try {
            if ('BroadcastChannel' in window) {
                channel = new BroadcastChannel(VEHICLE_SYNC_CHANNEL);
                channel.onmessage = (event) => {
                    const data = event.data as VehicleSyncMessage;
                    if (data && data.type === 'VEHICLE_UPDATED' && isRelevant(data)) {
                        performReload(data.action, false);
                    }
                };
            }
        } catch (e) {
            console.warn('BroadcastChannel error:', e);
        }

        // 2. Storage Event Listener (cross-tab fallback)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === VEHICLE_SYNC_STORAGE_KEY && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue) as VehicleSyncMessage;
                    if (data && data.type === 'VEHICLE_UPDATED' && isRelevant(data)) {
                        performReload(data.action, false);
                    }
                } catch (err) {}
            }
        };
        window.addEventListener('storage', handleStorage);

        // 3. Focus & Visibility Change Listener (Tab switching from Owner to Renter)
        const handleVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible') {
                const last = getLastVehicleSync();
                if (last && last.timestamp > lastSyncTimeRef.current && isRelevant(last)) {
                    performReload(last.action, false);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityOrFocus);
        window.addEventListener('focus', handleVisibilityOrFocus);

        // 4. Subtle periodic polling (only active when page is visible, e.g. on vehicle detail page)
        let pollTimer: ReturnType<typeof setInterval> | null = null;
        if (enablePolling && pollingIntervalMs > 0) {
            pollTimer = setInterval(() => {
                if (document.visibilityState === 'visible' && !isReloadingRef.current) {
                    performReload(undefined, true);
                }
            }, pollingIntervalMs);
        }

        return () => {
            if (channel) {
                channel.close();
            }
            window.removeEventListener('storage', handleStorage);
            document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
            window.removeEventListener('focus', handleVisibilityOrFocus);
            if (pollTimer) {
                clearInterval(pollTimer);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [activeVehicleSlug, enablePolling, pollingIntervalMs, performReload]);
}
