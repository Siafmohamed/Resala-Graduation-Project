import { create } from 'zustand';
import { tokenManager } from '../utils/tokenManager';
import type { User } from '../types/auth.types';
import type { Role, Permission } from '../types/role.types';
import { hasPermission, canAccess } from '../types/role.types';

interface AuthStoreState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

interface AuthStoreActions {
    setAuth: (user: User, accessToken: string) => void;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
    setInitialized: (value: boolean) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set) => ({
    // ── State ──────────────────────────────────────────────
    user: null,
    accessToken: null,
    isAuthenticated: true,
    isInitialized: true,

    // ── Actions ────────────────────────────────────────────
    setAuth: (user: User, accessToken: string) => {
        tokenManager.setAccessToken(accessToken);
        set({
            user,
            accessToken,
            isAuthenticated: true,
        });
    },

    setAccessToken: (token: string) => {
        tokenManager.setAccessToken(token);
        set({ accessToken: token });
    },

    clearAuth: () => {
        tokenManager.clearAccessToken();
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        });
    },

    setInitialized: (value: boolean) => {
        set({ isInitialized: value });
    },
}));

// ── Selectors (standalone hooks) ───────────────────────────
export const useCurrentUser = (): User | null =>
    useAuthStore((state) => state.user);

export const useIsAuthenticated = (): boolean =>
    useAuthStore((state) => state.isAuthenticated);

export const useIsInitialized = (): boolean =>
    useAuthStore((state) => state.isInitialized);

export const useAccessToken = (): string | null =>
    useAuthStore((state) => state.accessToken);

export const useUserRole = (): Role | undefined =>
    useAuthStore((state) => state.user?.role);

export const useHasPermission = (permission: Permission): boolean => {
    const role = useAuthStore((state) => state.user?.role);
    if (!role) return false;
    return hasPermission(role, permission);
};

export const useCanAccess = (requiredRole: Role): boolean => {
    const role = useAuthStore((state) => state.user?.role);
    if (!role) return false;
    return canAccess(role, requiredRole);
};