import type { Role } from '@/features/authentication/types/role.types';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  roles: Role[];
}

export interface NavGroup {
  id: string;
  label: string;
  roles: Role[];
  icon?: LucideIcon;
  items: NavItem[];
}

export type NavConfig = NavGroup[];

