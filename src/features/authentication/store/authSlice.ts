import { create } from 'zustand';
import type { SessionData } from '../types/auth.types';
import { Role, type Permission } from '../types/role.types';
import { hasPermission, canAccess } from '../types/role.types';
import { tokenManager } from '../utils/tokenManager';

interface AuthStoreState {
  session: SessionData | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  userRole: Role | undefined;
}

interface AuthStoreActions {
  setAuth: (session: SessionData) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

/** Maps the API role string to internal Role constant */
function mapApiRole(apiRole: string): Role | undefined {
  switch (apiRole) {
    case 'Admin': return Role.ADMIN;
    case 'Reception': return Role.RECEPTIONIST;
    case 'FormManager':
    case 'Form_Manager':
    case 'FORM_MANAGER': return Role.FORM_MANAGER;
    case 'Donor': return Role.DONOR;
    default: return undefined;
  }
}

// ── Initial State (Synchronous Hydration) ────────────────
function getInitialState(): Pick<AuthStoreState, 'session' | 'isAuthenticated' | 'userRole'> {
  // Always start unauthenticated on app load to prevent role-state pollution
  // AuthProvider will handle initialization and set the correct state
  return { 
    session: null, 
    isAuthenticated: false, 
    userRole: undefined 
  };
}

const hydratedState = getInitialState();

export const useAuthStore = create<AuthStore>((set) => ({
  // ── State ──────────────────────────────────────────────
  session: hydratedState.session,
  isAuthenticated: hydratedState.isAuthenticated,
  userRole: hydratedState.userRole,
  isInitialized: false, // Remains false until AuthProvider initialization completes

  // ── Actions ────────────────────────────────────────────
  setAuth: (session: SessionData) => {
    // Validate that we have the required tokens
    // Some backends return 'token' instead of 'accessToken'
    const finalAccessToken = session.accessToken || (session as any).token;
    if (!finalAccessToken) {
      console.error('[setAuth] Missing tokens in session!', {
        hasAccessToken: !!finalAccessToken,
        session // Log the full session to see what's actually there
      });
      return;
    }

    // Ensure the session object we store has the expected 'accessToken' field
    const normalizedSession: SessionData = {
      ...session,
      accessToken: finalAccessToken
    };

    // Determine the role - prioritize token claims (more secure) if available
    const tokenRole = tokenManager.getRoleFromToken() || normalizedSession.role;

    // Persist session data to localStorage first
    tokenManager.setSessionData(normalizedSession);

    // Update Zustand state
    set({
      session: normalizedSession,
      isAuthenticated: true,
      userRole: mapApiRole(tokenRole || normalizedSession.role),
    });

    console.log('[setAuth] Session stored successfully, role:', tokenRole || normalizedSession.role);
  },

  clearAuth: () => {
    // Clear all tokens from localStorage and sessionStorage
    tokenManager.clearTokens();
    // Also clear any remaining session storage keys
    sessionStorage.clear();
    set({
      session: null,
      isAuthenticated: false,
      userRole: undefined,
      isInitialized: false, // Reset to false so next login triggers re-initialization
    });
  },

  setInitialized: (value: boolean) => {
    set({ isInitialized: value });
  },
}));

// ── Selectors (standalone hooks) ───────────────────────────
export const useCurrentUser = () =>
  useAuthStore((state) => state.session);

export const useIsAuthenticated = (): boolean =>
  useAuthStore((state) => state.isAuthenticated);

export const useIsInitialized = (): boolean =>
  useAuthStore((state) => state.isInitialized);

export const useAccessToken = (): string | null =>
  useAuthStore((state) => state.session?.accessToken ?? null);

export const useUserRole = (): Role | undefined =>
  useAuthStore((state) => state.userRole);

export const useHasPermission = (permission: Permission): boolean => {
  const roleStr = useAuthStore((state) => state.session?.role);
  if (!roleStr) return false;
  const typedRole = mapApiRole(roleStr);
  if (!typedRole) return false;
  return hasPermission(typedRole, permission);
};

export const useCanAccess = (requiredRole: Role): boolean => {
  const roleStr = useAuthStore((state) => state.session?.role);
  if (!roleStr) return false;
  const typedRole = mapApiRole(roleStr);
  if (!typedRole) return false;
  return canAccess(typedRole, requiredRole);
};
