/**
 * Cross-Tab Authentication Synchronization
 * 
 * Automatically detects when a user logs out, switches accounts, or logs into a different
 * account in another tab. When detected, any other open tabs will automatically log out
 * and redirect to the home page (/).
 */

let currentTabUserId: string | number | null = null;
let broadcastChannel: BroadcastChannel | null = null;

export function initAuthSync(initialUserId?: string | number | null) {
    if (typeof window === 'undefined') return;

    currentTabUserId = initialUserId ?? null;
    const currentIdStr = currentTabUserId !== null && currentTabUserId !== undefined ? String(currentTabUserId) : 'guest';

    // Store active user in localStorage on init
    try {
        localStorage.setItem('rentbohol_active_user_id', currentIdStr);
        localStorage.setItem('rentbohol_auth_timestamp', String(Date.now()));
    } catch {
        // Handle private browsing or storage disabled
    }

    // Initialize BroadcastChannel
    try {
        if ('BroadcastChannel' in window) {
            broadcastChannel = new BroadcastChannel('rentbohol_auth_sync');
            broadcastChannel.onmessage = (event) => {
                if (event.data && event.data.type === 'AUTH_STATE_CHANGE') {
                    handleAuthChangeFromOtherTab(event.data.userId);
                }
            };
        }
    } catch (err) {
        console.warn('BroadcastChannel not available:', err);
    }

    // Listen to localStorage storage events across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'rentbohol_active_user_id' && e.newValue) {
            handleAuthChangeFromOtherTab(e.newValue);
        }
    });

    // Check on tab focus / visibility change
    const checkStateOnFocus = () => {
        try {
            const stored = localStorage.getItem('rentbohol_active_user_id');
            if (stored && stored !== currentIdStr) {
                handleAuthChangeFromOtherTab(stored);
            }
        } catch {}
    };

    window.addEventListener('focus', checkStateOnFocus);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkStateOnFocus();
        }
    });
}

export function notifyAuthStateChange(newUserId?: string | number | null) {
    if (typeof window === 'undefined') return;

    const idStr = newUserId !== null && newUserId !== undefined ? String(newUserId) : 'guest';
    currentTabUserId = newUserId ?? null;

    try {
        localStorage.setItem('rentbohol_active_user_id', idStr);
        localStorage.setItem('rentbohol_auth_timestamp', String(Date.now()));

        if (broadcastChannel) {
            broadcastChannel.postMessage({
                type: 'AUTH_STATE_CHANGE',
                userId: idStr,
                timestamp: Date.now(),
            });
        }
    } catch {}
}

function handleAuthChangeFromOtherTab(newUserIdStr: string) {
    const currentIdStr = currentTabUserId !== null && currentTabUserId !== undefined ? String(currentTabUserId) : 'guest';

    // If the authenticated user in the other tab differs from this tab's user
    if (newUserIdStr !== currentIdStr) {
        // If this tab was authenticated OR is on a protected route (/owner, /admin, /renter)
        const isProtectedRoute = /^\/(owner|admin|renter)(\/|$)/.test(window.location.pathname);
        const wasAuthenticated = currentIdStr !== 'guest';

        if (wasAuthenticated || isProtectedRoute) {
            // Force clean reload back to home page
            window.location.href = '/';
        }
    }
}
