/** Role values (const object for erasableSyntaxOnly compatibility) */
export const Role = {
    ADMIN: 'ADMIN',
    RECEPTIONIST: 'RECEPTIONIST',
    FORM_MANAGER: 'FORM_MANAGER',
    DONOR: 'DONOR',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/** Arabic display labels for roles (for UI) */
export const ROLE_LABELS_AR: Record<Role, string> = {
    [Role.ADMIN]: 'مدير',
    [Role.RECEPTIONIST]: 'موظف استقبال',
    [Role.FORM_MANAGER]: 'مدير النماذج',
    [Role.DONOR]: 'متبرع',
};

export type Permission =
    | "read:self"
    | "write:self"
    | "read:forms"
    | "write:forms"
    | "create:accounts"
    | "delete:accounts"
    | "read:all"
    | "read:own-profile"
    | "write:own-profile"
    | "moderate:content"
    | "manage:roles"
    | "read:users"
    | "write:users"
    | "delete:users";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.ADMIN]: [
        'read:users',
        'write:users',
        'delete:users',
        'manage:roles',
        'read:own-profile',
        'write:own-profile',
        'moderate:content',
        'read:all',
        'create:accounts',
        'delete:accounts',
    ],
    [Role.RECEPTIONIST]: [
        'read:self',
        'write:self',
        'read:forms',
        'write:forms',
        'read:own-profile',
        'write:own-profile',
    ],
    [Role.FORM_MANAGER]: [
        'read:self',
        'write:self',
        'read:forms',
        'write:forms',
        'read:own-profile',
        'write:own-profile',
    ],
    [Role.DONOR]: [
        'read:self',
        'write:self',
        'read:own-profile',
    ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccess(userRole: Role, requiredRole: Role): boolean {
    const hierarchy = [Role.DONOR, Role.RECEPTIONIST, Role.FORM_MANAGER, Role.ADMIN];
    return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
export function mapApiRole(apiRole: string): Role | undefined {
    if (!apiRole) return undefined;
    
    const normalizedRole = apiRole.toUpperCase();
    
    const roleMap: Record<string, Role> = {
        FORM_MANAGER: Role.FORM_MANAGER,
        RECEPTIONIST: Role.RECEPTIONIST,
        RECEPTION: Role.RECEPTIONIST,
        ADMIN: Role.ADMIN,
        DONOR: Role.DONOR,
    };

    return roleMap[normalizedRole];
}
