import { useEffect } from 'react';
import { useAuthStore } from '../store/authSlice';

/**
 * Hook that listens for session expiry events and clears auth state.
 * Triggered when refresh token is also expired (401 on refresh).
 */
export function useSessionExpiryListener(): void {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('[Auth] Session expired. Clearing auth state.');
      clearAuth();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [clearAuth]);
}
