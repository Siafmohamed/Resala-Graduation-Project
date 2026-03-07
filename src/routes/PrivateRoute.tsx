import React, { type ReactNode } from 'react';
import { ProtectedRoute } from '../features/authentication';

interface PrivateRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

/**
 * Wraps content that requires authentication.
 * Redirects to login if not authenticated; preserves intended URL in location state.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({
    children,
    redirectTo = '/login',
}) => {
    return (
        <ProtectedRoute redirectTo={redirectTo}>
            {children}
        </ProtectedRoute>
    );
};

export default PrivateRoute;
