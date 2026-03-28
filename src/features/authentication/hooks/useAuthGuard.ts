import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authSlice';
import type { Role, Permission } from '../types/role.types';
import { canAccess, hasPermission } from '../types/role.types';
import type { SessionData } from '../types/auth.types';

// Helper to map API role to internal Role
function mapApiRole(apiRole: string): Role | undefined {
    switch (apiRole) {
        case 'Admin': return 'ADMIN' as Role;
        case 'Reception': return 'RECEPTIONIST' as Role;
        case 'Donor': return 'DONOR' as Role;
        default: return undefined;
    }
}

// ── Core Guard ───────────────────────────────────────────
interface AuthGuardOptions {
    requiredRole?: Role;
    requiredPermission?: Permission;
    redirectTo?: string;
}

interface AuthGuardResult {
    isAuthenticated: boolean;
    isInitialized: boolean;
    isAuthorized: boolean;
    user: SessionData | null;
    userRole: Role | undefined;
}

export function useAuthGuard(options?: AuthGuardOptions): AuthGuardResult {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isInitialized = useAuthStore((s) => s.isInitialized);
    const session = useAuthStore((s) => s.session);
    const userRole = session?.role ? mapApiRole(session.role) : undefined;

    let isAuthorized = isAuthenticated;

    if (isAuthorized && options?.requiredRole && userRole) {
        isAuthorized = canAccess(userRole, options.requiredRole);
    } else if (options?.requiredRole && !userRole) {
        isAuthorized = false;
    }

    if (isAuthorized && options?.requiredPermission && userRole) {
        isAuthorized = hasPermission(userRole, options.requiredPermission);
    } else if (options?.requiredPermission && !userRole) {
        isAuthorized = false;
    }

    return {
        isAuthenticated,
        isInitialized,
        isAuthorized,
        user: session,
        userRole,
    };
}

// ── Require Auth (redirect if not authenticated) ─────────
interface RequireAuthResult {
    user: SessionData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export function useRequireAuth(
    redirectTo: string = '/login',
): RequireAuthResult {
    const navigate = useNavigate();
    const { isAuthenticated, isInitialized, user } = useAuthGuard();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isInitialized, isAuthenticated, redirectTo, navigate]);

    return { user, isLoading: !isInitialized, isAuthenticated };
}

// ── Require Role ─────────────────────────────────────────
interface RequireRoleResult {
    isAuthorized: boolean;
    isLoading: boolean;
}

export function useRequireRole(
    role: Role,
    redirectTo: string = '/unauthorized',
): RequireRoleResult {
    const navigate = useNavigate();
    const { isAuthenticated, isInitialized, isAuthorized } = useAuthGuard({
        requiredRole: role,
    });

    useEffect(() => {
        if (isInitialized && isAuthenticated && !isAuthorized) {
            navigate(redirectTo, { replace: true });
        }
    }, [isInitialized, isAuthenticated, isAuthorized, redirectTo, navigate]);

    return { isAuthorized, isLoading: !isInitialized };
}

// ── Redirect If Authenticated (for public pages) ─────────
export function useRedirectIfAuthenticated(
    redirectTo: string = '/dashboard',
): void {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isInitialized, isAuthenticated, redirectTo, navigate]);
}