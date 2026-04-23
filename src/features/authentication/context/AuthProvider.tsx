import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/authentication/services/authService';
import type { LoginCredentials, SessionData, User } from '@/features/authentication/types/auth.types';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import { completeAuthCleanup, initializeNewSession } from '@/features/authentication/utils/authCleanup';
import { useAuthStore } from '@/features/authentication/store/authSlice';
import { mapApiRole, Role } from '@/features/authentication/types/role.types';

interface AuthContextValue {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ONE_MINUTE_MS = 60_000;



const mapSessionToUser = (session: SessionData | null): User | null => {
  if (!session) return null;
  return {
    id: String(session.userId),
    username: session.name || String(session.userId),
    fullName: session.name || 'User',
    role: mapApiRole(session.role),
    phoneNumber: session.phoneNumber,
  };
};

const getTokenExpiryMs = (accessToken: string): number | null => {
  const decoded = tokenManager.decodeToken<{ exp?: number }>(accessToken);
  if (!decoded?.exp) return null;
  return decoded.exp * 1000;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, setAuth, clearAuth, setInitialized, setLoading } = useAuthStore();
  const refreshTimerRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  const refresh = useCallback(async (): Promise<string | null> => {
    const refreshed = await authService.refreshToken();
    if (!refreshed?.succeeded || !refreshed?.data?.token) {
      return null;
    }

    const previousSession = tokenManager.getSessionData<SessionData>();
    if (!previousSession) {
      tokenManager.setAccessToken(refreshed.data.token);
      return refreshed.data.token;
    }

    const nextSession: SessionData = {
      ...previousSession,
      accessToken: refreshed.data.token,
      refreshToken: refreshed.data.refreshToken || previousSession.refreshToken,
    };
    setAuth(nextSession);
    return nextSession.accessToken;
  }, [setAuth]);

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

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // 1. Perform complete cleanup to remove any stale state from previous session
      // This includes clearing axios interceptor state which is critical for role switches
      completeAuthCleanup();
      queryClient.clear();

      // 2. Perform login
      const response = await authService.login(credentials);
      if (!response.succeeded) {
        throw new Error(response.message || 'Login failed');
      }

      // 3. Initialize fresh session with new data
      initializeNewSession(response.data);
      
      // 4. Update auth store with new session
      setAuth(response.data);
      
      // 5. Mark initialization as complete so route guards and components 
      // that depend on isInitialized flag know auth state is ready
      // This is critical for logout/login cycles without page reload (role switches)
      setInitialized(true);
      
      console.log('[AuthProvider] Login successful:', { role: response.data.role, userId: response.data.userId });
    },
    [setAuth, setInitialized, queryClient],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      // Cleanup still must proceed even if logout endpoint fails
      if (import.meta.env.DEV) {
        console.warn('[AuthProvider] Logout API call failed, proceeding with cleanup:', error);
      }
    } finally {
      // Perform comprehensive cleanup
      // This clears axios interceptor state which is critical when role changes
      completeAuthCleanup();
      clearAuth();
      clearRefreshTimer();
      queryClient.clear();
      setLoading(false);
      
      console.log('[AuthProvider] Logout complete - all state cleared');
    }
  }, [clearAuth, clearRefreshTimer, queryClient, setLoading]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const storedSession = tokenManager.getSessionData<SessionData>();
        if (storedSession?.accessToken) {
          setAuth(storedSession);
        } else {
          await refresh();
        }
      } catch {
        clearAuth();
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    initialize();
  }, [clearAuth, refresh, setAuth, setInitialized, setLoading]);

  useEffect(() => {
    scheduleSilentRefresh(session?.accessToken ?? null);
  }, [scheduleSilentRefresh, session?.accessToken]);

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

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuth();
      clearRefreshTimer();
      setLoading(false);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [clearAuth, clearRefreshTimer]);

  useEffect(() => {
    return () => clearRefreshTimer();
  }, [clearRefreshTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      logout,
      refresh,
    }),
    [login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
