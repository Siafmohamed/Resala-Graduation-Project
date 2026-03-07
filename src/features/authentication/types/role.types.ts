/** Role values (const object for erasableSyntaxOnly compatibility) */
export const Role = {
    ADMIN: 'ADMIN',
    RECEPTIONIST: 'RECEPTIONIST',
    FORM_MANAGER: 'FORM_MANAGER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/** Arabic display labels for roles (for UI) */
export const ROLE_LABELS_AR: Record<Role, string> = {
    [Role.ADMIN]: 'مدير',
    [Role.RECEPTIONIST]: 'موظف استقبال',
    [Role.FORM_MANAGER]: 'مدير النماذج',
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
    ],
    [Role.RECEPTIONIST]: [
        'read:self',
        'write:self',
        'read:forms',
        'write:forms'
    ],
    [Role.FORM_MANAGER]: [
        'read:self',
        'write:self',
        'read:forms',
        'write:forms'
    ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccess(userRole: Role, requiredRole: Role): boolean {
    const hierarchy = [Role.RECEPTIONIST, Role.FORM_MANAGER, Role.ADMIN];
    return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}