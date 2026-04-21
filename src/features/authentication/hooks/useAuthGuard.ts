import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authSlice';
import type { Permission, Role } from '../types/role.types';
import { hasPermission, mapApiRole, canAccess } from '../types/role.types';
import type { SessionData } from '../types/auth.types';

interface AuthGuardOptions {
    requiredPermission?: Permission;
    requiredRole?: Role;
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
    const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated);
    const isInitialized = useAuthStore((s: any) => s.isInitialized);
    const session = useAuthStore((s: any) => s.session);

    const userRole = session?.role ? mapApiRole(session.role) : undefined;

    // default: not authorized if role requires checking
    let isAuthorized = isAuthenticated;

    if (options?.requiredRole && userRole) {
        isAuthorized = canAccess(userRole, options.requiredRole);
    } else if (options?.requiredPermission && userRole) {
        isAuthorized = hasPermission(userRole, options.requiredPermission);
    } else if ((options?.requiredPermission || options?.requiredRole) && !userRole) {
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