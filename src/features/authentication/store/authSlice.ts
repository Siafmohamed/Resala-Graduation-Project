import { create } from 'zustand';
import type { SessionData } from '../types/auth.types';
import {
  mapApiRole,
  hasPermission,
  canAccess,
  Role,
  type Permission
} from '../types/role.types';
import { tokenManager } from '../utils/tokenManager';

interface AuthStoreState {
  session: SessionData | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  userRole: Role | undefined;
  isLoading: boolean;
}

interface AuthStoreActions {
  setAuth: (session: SessionData) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

// ── Initial State ────────────────────────────────
function getInitialState(): Pick<
  AuthStoreState,
  'session' | 'isAuthenticated' | 'userRole'
> {
  return {
    session: null,
    isAuthenticated: false,
    userRole: undefined,
  };
}

const hydratedState = getInitialState();

export const useAuthStore = create<AuthStore>((set, get) => ({
  // ── State ──────────────────────────────────────
  session: hydratedState.session,
  isAuthenticated: hydratedState.isAuthenticated,
  userRole: hydratedState.userRole,
  isInitialized: false,
  isLoading: false,

  // ── Actions ────────────────────────────────────

  setLoading: (value: boolean) => {
    set({ isLoading: value });
  },

  setAuth: (session: SessionData) => {
    const finalAccessToken = session.accessToken || (session as any).token;

    if (!finalAccessToken) {
      console.error('[setAuth] Missing token in session', session);
      return;
    }

    const normalizedSession: SessionData = {
      ...session,
      accessToken: finalAccessToken,
    };

    const tokenRole =
      tokenManager.getRoleFromToken() || normalizedSession.role;

    tokenManager.setSessionData(normalizedSession);

    set({
      session: normalizedSession,
      isAuthenticated: true,
      userRole: mapApiRole(tokenRole || normalizedSession.role),
      isLoading: false,
    });

    console.log('[setAuth] success:', tokenRole || normalizedSession.role);
  },

  clearAuth: () => {
    tokenManager.clearTokens();
    sessionStorage.clear();

    set({
      session: null,
      isAuthenticated: false,
      userRole: undefined,
      isInitialized: false,
      isLoading: false,
    });
  },

  setInitialized: (value: boolean) => {
    set({ isInitialized: value });
  },
}));

// ── Selectors ─────────────────────────────────────

export const useCurrentUser = () =>
  useAuthStore((state) => state.session);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useIsInitialized = () =>
  useAuthStore((state) => state.isInitialized);

export const useIsLoading = () =>
  useAuthStore((state) => state.isLoading);

export const useAccessToken = () =>
  useAuthStore((state) => state.session?.accessToken ?? null);

export const useUserRole = () =>
  useAuthStore((state) => state.userRole);

// ── Permission Hooks ─────────────────────────────

export const useHasPermission = (permission: Permission): boolean => {
  const roleStr = useAuthStore((state) => state.session?.role);
  if (!roleStr) return false;

  const role = mapApiRole(roleStr);
  if (!role) return false;

  return hasPermission(role, permission);
};

export const useCanAccess = (requiredRole: Role): boolean => {
  const roleStr = useAuthStore((state) => state.session?.role);
  if (!roleStr) return false;

  const role = mapApiRole(roleStr);
  if (!role) return false;

  return canAccess(role, requiredRole);
};