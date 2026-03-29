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
  if (tokenManager.hasStoredSession()) {
    const stored = tokenManager.getSessionData<SessionData>();
    if (stored) {
      const tokenRole = tokenManager.getRoleFromToken();
      const effectiveRole = tokenRole || stored.role;
      return { 
        session: stored, 
        isAuthenticated: true,
        userRole: mapApiRole(effectiveRole)
      };
    }
  }
  return { session: null, isAuthenticated: false, userRole: undefined };
}

const hydratedState = getInitialState();

export const useAuthStore = create<AuthStore>((set) => ({
  // ── State ──────────────────────────────────────────────
  session: hydratedState.session,
  isAuthenticated: hydratedState.isAuthenticated,
  userRole: hydratedState.userRole,
  isInitialized: false, // Remains false until useInitializeAuth completes

  // ── Actions ────────────────────────────────────────────
  setAuth: (session: SessionData) => {
    // If we already have a session, merge the new data with existing tokens
    // This handles cases where the validation endpoint returns a profile without tokens
    const currentSession = useAuthStore.getState().session;
    const sessionToStore = {
      ...currentSession,
      ...session,
      // Ensure we keep the tokens if the new session doesn't have them
      accessToken: session.accessToken || currentSession?.accessToken,
      refreshToken: session.refreshToken || currentSession?.refreshToken,
    };

    // Determine the role — prioritize token claims if available for security, fallback to response role
    const tokenRole = tokenManager.getRoleFromToken() || sessionToStore.role;

    // Persist session data to localStorage
    tokenManager.setSessionData(sessionToStore);
    set({
      session: sessionToStore,
      isAuthenticated: true,
      userRole: mapApiRole(tokenRole),
    } as any);
  },

  clearAuth: () => {
    // Clear stored tokens and session
    tokenManager.clearTokens();
    set({
      session: null,
      isAuthenticated: false,
      userRole: undefined,
      isInitialized: true,
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
