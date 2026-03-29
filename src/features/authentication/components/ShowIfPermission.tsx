import React, { type ReactNode } from 'react';
import { useHasPermission } from '../store/authSlice';
import type { Permission } from '../types/role.types';

interface ShowIfPermissionProps {
    permission: Permission;
    children: ReactNode;
}

export const ShowIfPermission: React.FC<ShowIfPermissionProps> = ({
    permission,
    children,
}) => {
    const hasPermission = useHasPermission(permission);

    if (!hasPermission) {
        return null;
    }

    return <>{children}</>;
};