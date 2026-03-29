import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { FullPageSpinner } from './FullPageSpinner';
import { Role } from '../types/role.types';

interface PublicRouteProps {
    redirectTo?: string;
    children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
    redirectTo,
    children,
}) => {
    const { isInitialized, isAuthenticated, userRole } = useAuthGuard();

    if (!isInitialized) {
        return <FullPageSpinner />;
    }

    if (isAuthenticated) {
        // If already authenticated, redirect to the appropriate dashboard based on role
        if (userRole === Role.ADMIN) {
            return <Navigate to="/admin-dashboard" replace />;
        }
        if (userRole === Role.RECEPTIONIST) {
            return <Navigate to="/reception-dashboard" replace />;
        }
        return <Navigate to={redirectTo ?? '/dashboard'} replace />;
    }

    return <>{children}</>;
};