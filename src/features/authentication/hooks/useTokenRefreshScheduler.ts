import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authSlice';
import { tokenManager } from '../utils/tokenManager';

const ONE_MINUTE_MS = 60_000;

const getTokenExpiryMs = (accessToken: string): number | null => {
  const decoded = tokenManager.decodeToken<{ exp?: number }>(accessToken);
  if (!decoded?.exp) return null;
  return decoded.exp * 1000;
};

/**
 * Hook that handles proactive token refresh scheduling.
 * Automatically refreshes tokens before they expire.
 */
export function useTokenRefreshScheduler(
  refresh: () => Promise<string | null>
): void {
  const session = useAuthStore((s) => s.session);
  const refreshTimerRef = useRef<number | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleSilentRefresh = useCallback(
    (accessToken: string | null) => {
      clearRefreshTimer();
      if (!accessToken) return;

      const expiryMs = getTokenExpiryMs(accessToken);
      if (!expiryMs) return;

      const msUntilRefresh = Math.max(0, expiryMs - Date.now() - ONE_MINUTE_MS);
      refreshTimerRef.current = window.setTimeout(async () => {
        try {
          await refresh();
        } catch {
          // If silent refresh fails, the interceptor and route guards handle logout/redirect.
        }
      }, msUntilRefresh);
    },
    [clearRefreshTimer, refresh],
  );

  // Schedule refresh whenever session token changes
  useEffect(() => {
    scheduleSilentRefresh(session?.accessToken ?? null);
  }, [scheduleSilentRefresh, session?.accessToken]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearRefreshTimer();
  }, [clearRefreshTimer]);
}
