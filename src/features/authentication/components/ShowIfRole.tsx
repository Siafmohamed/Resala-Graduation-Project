import React, { type ReactNode } from 'react';
import { useUserRole } from '../store/authSlice';

interface ShowIfRoleProps {
    role: string;
    children: ReactNode;
}

export const ShowIfRole: React.FC<ShowIfRoleProps> = ({
    role,
    children,
}) => {
    const userRole = useUserRole();

    if (userRole !== role) {
        return null;
    }

    return <>{children}</>;
};