import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/authentication/services/authService';
import type { LoginCredentials, SessionData, User } from '@/features/authentication/types/auth.types';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import { useAuthStore } from '@/features/authentication/store/authSlice';
import { Role } from '@/features/authentication/types/role.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ONE_MINUTE_MS = 60_000;

const mapApiRole = (role: SessionData['role']): Role => {
  switch (role) {
    case 'Admin':
      return Role.ADMIN;
    case 'Reception':
      return Role.RECEPTIONIST;
    case 'Donor':
      return Role.DONOR;
    default:
      return Role.RECEPTIONIST;
  }
};

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
  const { session, isAuthenticated, setAuth, clearAuth, setInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await authService.login(credentials);
      if (!response.succeeded) {
        throw new Error(response.message || 'Login failed');
      }
      setAuth(response.data);
      queryClient.invalidateQueries();
    },
    [setAuth, queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Cleanup still must proceed even if logout endpoint fails.
    } finally {
      clearAuth();
      clearRefreshTimer();
      queryClient.clear();
    }
  }, [clearAuth, clearRefreshTimer, queryClient]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    initialize();
  }, [clearAuth, refresh, setAuth, setInitialized]);

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
      setIsLoading(false);
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
      user: mapSessionToUser(session),
      isAuthenticated,
      isLoading,
      login,
      logout,
      refresh,
    }),
    [session, isAuthenticated, isLoading, login, logout, refresh],
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
