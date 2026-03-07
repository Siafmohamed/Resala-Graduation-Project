import type { Role } from '@/features/authentication/types/role.types';

export type AccountStatus = 'active' | 'inactive' | 'locked';

export interface Account {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: Role;
  status: AccountStatus;
  lastLoginAt: string;
}

