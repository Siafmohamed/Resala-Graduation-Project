import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { FullPageSpinner } from './FullPageSpinner';

interface PublicRouteProps {
    redirectTo?: string;
    children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
    redirectTo,
    children,
}) => {
    const { isInitialized, isAuthenticated } = useAuthGuard();

    if (!isInitialized) {
        return <FullPageSpinner />;
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo ?? '/dashboard'} replace />;
    }

    return <>{children}</>;
};