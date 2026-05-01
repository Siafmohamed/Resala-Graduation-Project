import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/authentication/services/authService';
import type { LoginCredentials, SessionData } from '@/features/authentication/types/auth.types';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import { completeAuthCleanup } from '@/features/authentication/utils/authCleanup';
import { useAuthStore } from '@/features/authentication/store/authSlice';
import { useTokenRefreshScheduler } from '../hooks/useTokenRefreshScheduler';
import { useVisibilityTokenRefresh } from '../hooks/useVisibilityTokenRefresh';
import { useSessionExpiryListener } from '../hooks/useSessionExpiryListener';

interface AuthContextValue {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, setAuth, clearAuth, setInitialized, setLoading } = useAuthStore();
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

  // Extracted hooks handle their own concerns
  useTokenRefreshScheduler(refresh);
  useVisibilityTokenRefresh(refresh);
  useSessionExpiryListener();

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

      // 3. Store the new session in token manager (storage layer)
      const sessionData = response.data as SessionData;
      tokenManager.setSessionData(sessionData);
      
      // 4. Update auth store with new session (state layer)
      setAuth(sessionData);
      
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
      queryClient.clear();
      setLoading(false);
      
      console.log('[AuthProvider] Logout complete - all state cleared');
    }
  }, [clearAuth, queryClient, setLoading]);

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
