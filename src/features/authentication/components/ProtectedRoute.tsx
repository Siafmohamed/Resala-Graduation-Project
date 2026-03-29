import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import type { Role, Permission } from '../types/role.types';
import { FullPageSpinner } from './FullPageSpinner';

interface ProtectedRouteProps {
    requiredRole?: Role;
    requiredPermission?: Permission;
    redirectTo?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredRole,
    requiredPermission,
    redirectTo,
    children,
    fallback,
}) => {
    const location = useLocation();
    const { isInitialized, isAuthenticated, isAuthorized, userRole } = useAuthGuard({
        requiredRole,
        requiredPermission,
        redirectTo,
    });

    // 1. Loading state (blocks rendering)
    if (!isInitialized) {
        return <>{fallback ?? <FullPageSpinner />}</>;
    }

    // 2. Auth check
    if (!isAuthenticated) {
        console.warn(`[ProtectedRoute] Unauthenticated access to ${location.pathname}. Redirecting to ${redirectTo ?? '/login'}...`);
        return (
            <Navigate
                to={redirectTo ?? '/login'}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // 3. Authorization check (Role/Permission)
    if (!isAuthorized) {
        console.warn(`[ProtectedRoute] Forbidden access to ${location.pathname} for role ${userRole}. Redirecting to /unauthorized...`);
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. Double-check for role mix-up in case of stale state
    if (requiredRole && userRole !== requiredRole) {
        // Fallback check: if user is logged in as something else, ensure they can't cross-render
        console.error(`[ProtectedRoute] Role mismatch! Required: ${requiredRole}, Current: ${userRole}`);
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};