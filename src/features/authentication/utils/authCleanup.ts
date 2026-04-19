import { tokenManager } from './tokenManager';
import { clearAxiosInterceptorState } from '@/api/axiosInstance';
import type { SessionData } from '../types/auth.types';

/**
 * Performs complete authentication cleanup
 * Called on logout to ensure no stale state remains
 */
export const completeAuthCleanup = (): void => {
  // Clear axios interceptor state to cancel pending requests and clear request queue
  clearAxiosInterceptorState();
  
  // Clear tokens and session data
  tokenManager.clearTokens();
  
  // Clear any window-level auth state
  if ('auth' in window) {
    delete (window as any).auth;
  }
  
  // Clear any cached user/role data in window
  if ('currentUser' in window) {
    delete (window as any).currentUser;
  }
  if ('userRole' in window) {
    delete (window as any).userRole;
  }

  // Double-check localStorage is clean
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('session') || key.includes('token') || key.includes('resala_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
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
