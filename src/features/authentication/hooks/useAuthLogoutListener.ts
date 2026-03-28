import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../index';
import { tokenManager } from '../utils/tokenManager';

/**
 * Listens for auth:session-expired and clears auth + React Query cache.
 * Used when 401 occurs AND refresh token is also expired,
 * so the user is logged out and redirected to login.
 */
export function useAuthLogoutListener(): void {
    const clearAuth = useAuthStore((s: any) => s.clearAuth);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        const handleSessionExpired = () => {
            // Clear all stored tokens and session
            tokenManager.clearTokens();
            clearAuth();
            queryClient.clear();
            // Redirect to login
            navigate('/login', { replace: true });
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);

        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, [clearAuth, queryClient, navigate]);
}