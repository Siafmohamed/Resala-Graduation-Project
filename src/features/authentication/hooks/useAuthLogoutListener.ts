import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authSlice';
import { tokenManager } from '../utils/tokenManager';

/**
 * Listens for auth:session-expired and clears auth + React Query cache.
 * Used when 401 occurs AND refresh token is also expired,
 * so the user is logged out and redirected to login.
 */
export function useAuthLogoutListener(): void {
    const clearAuth = useAuthStore((s: any) => s.clearAuth);
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleSessionExpired = () => {
            console.warn('[Auth] Session expired. Clearing state and redirecting...');
            // 1. Clear stored tokens and session
            tokenManager.clearTokens();
            // 2. Clear Zustand store
            clearAuth();
            // 3. Invalidate/Clear React Query cache
            queryClient.clear();
            // 4. Force full page reload to clear any remaining in-memory state
            // and redirect to login
            window.location.href = '/login';
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);

        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, [clearAuth, queryClient]);
}