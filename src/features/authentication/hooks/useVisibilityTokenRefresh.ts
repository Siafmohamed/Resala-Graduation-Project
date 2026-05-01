import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authSlice';
import { tokenManager } from '../utils/tokenManager';

const ONE_MINUTE_MS = 60_000;

const getTokenExpiryMs = (accessToken: string): number | null => {
  const decoded = tokenManager.decodeToken<{ exp?: number }>(accessToken);
  if (!decoded?.exp) return null;
  return decoded.exp * 1000;
};

/**
 * Hook that handles visibility change and focus events to refresh tokens
 * when the user returns to the tab (handles laptop sleep/wake scenarios).
 */
export function useVisibilityTokenRefresh(
  refresh: () => Promise<string | null>
): void {
  const session = useAuthStore((s) => s.session);

  const refreshIfTokenNearExpiry = useCallback(async () => {
    const token = session?.accessToken ?? null;
    if (!token) return;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) return;

    const shouldRefreshNow = expiryMs - Date.now() <= ONE_MINUTE_MS;
    if (!shouldRefreshNow) return;

    try {
      await refresh();
    } catch {
      // Keep this best-effort. The interceptor queue is the safety net.
    }
  }, [refresh, session?.accessToken]);

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'hidden') return;
      // Handles laptop sleep/wake where timeout scheduling may be delayed.
      void refreshIfTokenNearExpiry();
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [refreshIfTokenNearExpiry]);
}
