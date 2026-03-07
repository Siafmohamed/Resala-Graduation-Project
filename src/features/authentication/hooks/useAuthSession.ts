import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '../utils/tokenManager';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authSlice';

// ── Initialize Auth (runs on app mount) ──────────────────
export function useInitializeAuth(): { isInitialized: boolean } {
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const setInitialized = useAuthStore((s) => s.setInitialized);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    const hasToken = !!tokenManager.getAccessToken();

    const { data, isSuccess, isError, isFetched } = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: authService.getMe,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: hasToken, // skip getMe when no token (avoids unnecessary 401)
    });

    // When no token, mark initialized immediately so login page can show
    useEffect(() => {
        if (!hasToken) {
            setInitialized(true);
        }
    }, [hasToken, setInitialized]);

    useEffect(() => {
        if (!hasToken || !isFetched) return;

        if (isSuccess && data) {
            setAuth(data.user, data.accessToken);
            setInitialized(true);
        }

        if (isError) {
            clearAuth();
            setInitialized(true);
        }
    }, [hasToken, isFetched, isSuccess, isError, data, setAuth, clearAuth, setInitialized]);

    return { isInitialized };
}

// ── Refresh Session (manual trigger) ─────────────────────
export function useRefreshSession(): () => void {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
    };
}