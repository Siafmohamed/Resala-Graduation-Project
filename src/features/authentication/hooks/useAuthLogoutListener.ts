import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authSlice';

/**
 * Listens for auth:session-expired and clears auth + React Query cache.
 * Used when 401 occurs (token expired) so user gets a clean state.
 */
export function useAuthLogoutListener(): void {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleSessionExpired = () => {
            clearAuth();
            queryClient.clear();
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);

        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, [clearAuth, queryClient]);
}