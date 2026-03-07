import type { Role } from '@/features/authentication';
import type { NavConfig } from './types';
import { receptionMenu } from './receptionMenu';
import { donorMenu } from './donorMenu';
import { formsMenu } from './formsMenu';
import { adminMenu } from './adminMenu';

const BASE_CONFIG: NavConfig = [
  ...receptionMenu,
  ...donorMenu,
  ...formsMenu,
  ...adminMenu,
];

export function getNavConfigForRole(role: Role): NavConfig {
  return BASE_CONFIG
    .filter((group) => group.roles.includes(role))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

