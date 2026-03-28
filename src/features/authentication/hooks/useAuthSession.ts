import { useEffect } from 'react';
import { useAuthStore } from '../index';
import { tokenManager } from '../utils/tokenManager';
import type { SessionData } from '../types/auth.types';

// ── Initialize Auth (runs on app mount) ──────────────────
export function useInitializeAuth(): { isInitialized: boolean } {
    const setAuth = useAuthStore((s: any) => s.setAuth);
    const clearAuth = useAuthStore((s: any) => s.clearAuth);
    const setInitialized = useAuthStore((s: any) => s.setInitialized);
    const isInitialized = useAuthStore((s: any) => s.isInitialized);

    useEffect(() => {
        const initialize = async () => {
            // Check if we have a stored session
            if (!tokenManager.hasStoredSession()) {
                clearAuth();
                setInitialized(true);
                return;
            }

            // We have a stored refresh token — check the session data
            const storedSession = tokenManager.getSessionData<SessionData>();
            if (!storedSession) {
                clearAuth();
                setInitialized(true);
                return;
            }

            // If access token is still valid, just use the stored session
            if (tokenManager.hasValidAccessToken()) {
                setAuth(storedSession);
                setInitialized(true);
                return;
            }

            // Access token expired but refresh token exists —
            // Let the axios interceptor handle the refresh on next API call.
            // For now, trust the stored session so the user isn't kicked out.
            setAuth(storedSession);
            setInitialized(true);
        };

        initialize();
    }, [setAuth, clearAuth, setInitialized]);

    return { isInitialized };
}

// ── Refresh Session (manual trigger) ─────────────────────
export function useRefreshSession(): () => void {
    return () => {
        // Trigger a refresh by clearing only the access token
        // The next API call will trigger the interceptor's refresh logic
        tokenManager.updateAccessToken('');
    };
}