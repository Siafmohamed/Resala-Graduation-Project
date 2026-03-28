import type { Role } from '@/features/authentication';
import type { NavConfig } from './types';
import { receptionMenu } from './receptionMenu';
import { donorMenu } from './donorMenu';
import { formsMenu } from './formsMenu';
import { adminMenu } from './adminMenu';

export function getNavConfigForRole(role: Role): NavConfig {
  const roleMenus: Record<Role, NavConfig> = {
    ADMIN: adminMenu,
    RECEPTIONIST: receptionMenu,
    DONOR: donorMenu as any,
    FORM_MANAGER: formsMenu as any,
  };

  return roleMenus[role] || [];
}