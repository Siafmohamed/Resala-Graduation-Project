import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import type { Permission, Role } from '../types/role.types';
import { FullPageSpinner } from './FullPageSpinner';

interface ProtectedRouteProps {
    requiredPermission?: Permission;
    requiredRole?: Role;
    redirectTo?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredPermission,
    requiredRole,
    redirectTo,
    children,
    fallback,
}) => {
    const location = useLocation();

    const {
        isInitialized,
        isAuthenticated,
        isAuthorized,
        userRole,
    } = useAuthGuard({
        requiredPermission,
        requiredRole,
        redirectTo,
    });

    // 1. Loading state
    if (!isInitialized) {
        return <>{fallback ?? <FullPageSpinner />}</>;
    }

    // 2. Not authenticated
    if (!isAuthenticated) {
        console.warn(
            `[ProtectedRoute] Unauthenticated access to ${location.pathname}`
        );

        return (
            <Navigate
                to={redirectTo ?? '/login'}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // 3. Not authorized (permission denied)
    if (!isAuthorized) {
        console.warn(
            `[ProtectedRoute] Forbidden access to ${location.pathname} for role ${userRole}`
        );

        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};