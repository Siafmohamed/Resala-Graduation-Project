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
    const { isInitialized, isAuthenticated, isAuthorized } = useAuthGuard({
        requiredRole,
        requiredPermission,
        redirectTo,
    });

    if (!isInitialized) {
        return <>{fallback ?? <FullPageSpinner />}</>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectTo ?? '/login'}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};