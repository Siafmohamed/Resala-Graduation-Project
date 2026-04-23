import { tokenManager } from './tokenManager';
import { clearAxiosInterceptorState } from '@/api/axiosInstance';
import type { SessionData } from '../types/auth.types';

/**
 * Performs complete authentication cleanup
 * Called on logout to ensure no stale state remains
 */
export const completeAuthCleanup = (): void => {
  // 1. Clear axios interceptor state to cancel pending requests and abort in-flight refresh
  clearAxiosInterceptorState();
  
  // 2. Clear tokens and session data from storage
  tokenManager.clearTokens();
  
  // 3. Clear any window-level auth state
  const windowObj = window as any;
  const globalKeys = ['auth', 'currentUser', 'userRole', 'resala_auth'];
  globalKeys.forEach(key => {
    if (key in windowObj) {
      delete windowObj[key];
    }
  });

  if (import.meta.env.DEV) {
    console.log('[AuthCleanup] Complete authentication state cleared');
  }
};

/**
 * Performs complete authentication initialization for a new session
 * Called after successful login to ensure fresh state
 */
export const initializeNewSession = (session: SessionData): void => {
  // Clear any stale state first
  completeAuthCleanup();
  
  // Store the new session
  tokenManager.setSessionData(session);
  
  // Force axios to use the new token on next request
  const newToken = session.accessToken || (session as any).token;
  if (newToken) {
    tokenManager.setAccessToken(newToken);
  }
};

/**
 * Validates that the current auth session is still valid
 * Returns true if user is properly authenticated with current session
 */
export const validateCurrentSession = (): boolean => {
  const session = tokenManager.getSessionData<SessionData>();
  if (!session?.accessToken && !(session as any)?.token) {
    return false;
  }
  
  // Check if token is expired
  if (tokenManager.isAccessTokenExpired()) {
    return false;
  }
  
  return true;
};
