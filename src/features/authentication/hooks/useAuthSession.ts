import { useEffect } from 'react';
import { useAuthStore } from '../store/authSlice';
import { tokenManager } from '../utils/tokenManager';
import { authService } from '../services/authService';
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

            // We have a stored session — try to validate it with the backend
            try {
                // Perform real validation against the backend on app load
                const validated = await authService.validateSession();
                
                if (validated.succeeded && validated.data) {
                    // Update session with fresh data from backend
                    // Our setAuth action handles merging the new profile with existing tokens
                    setAuth(validated.data as unknown as SessionData);
                } else {
                    // If the backend explicitly says the session is invalid
                    clearAuth();
                }
            } catch (err: any) {
                console.error('[AuthInit] Session validation error:', err);
                
                // ONLY clear auth if it's a definitive authentication error (401 or 403)
                // For network errors (status 0) or server errors (500), we keep the cached session
                // so the user isn't kicked out due to transient issues.
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    console.warn('[AuthInit] Definite auth failure. Clearing session.');
                    clearAuth();
                } else {
                    console.warn('[AuthInit] Transient error. Continuing with cached session.');
                    // Don't clearAuth(), just let the app continue with what's in the store
                }
            } finally {
                // IMPORTANT: Only set isInitialized to true AFTER the backend check
                setInitialized(true);
            }
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