import { create } from 'zustand';
import type { SessionData } from '../types/auth.types';
import { Role, type Permission } from '../types/role.types';
import { hasPermission, canAccess } from '../types/role.types';
import { tokenManager } from '../utils/tokenManager';

interface AuthStoreState {
  session: SessionData | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
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

// ── Hydrate from localStorage on store creation ──────────
function getInitialState(): Pick<AuthStoreState, 'session' | 'isAuthenticated'> {
  if (tokenManager.hasStoredSession()) {
    const stored = tokenManager.getSessionData<SessionData>();
    if (stored) {
      return { session: stored, isAuthenticated: true };
    }
  }
  return { session: null, isAuthenticated: false };
}

const initialState = getInitialState();

export const useAuthStore = create<AuthStore>((set) => ({
  // ── State ──────────────────────────────────────────────
  session: initialState.session,
  isAuthenticated: initialState.isAuthenticated,
  isInitialized: true, // Will be set to true after session validation

  // ── Actions ────────────────────────────────────────────
  setAuth: (session: SessionData) => {
    // Persist only non-sensitive session data to localStorage
    // Tokens are now in HTTP-only cookies
    tokenManager.setSessionData(session);
    set({
      session,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    // Clear stored tokens and session
    tokenManager.clearTokens();
    set({
      session: null,
      isAuthenticated: false,
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

export const useUserRole = (): Role | undefined => {
  const roleStr = useAuthStore((state) => state.session?.role);
  if (!roleStr) return undefined;
  return mapApiRole(roleStr);
};

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
