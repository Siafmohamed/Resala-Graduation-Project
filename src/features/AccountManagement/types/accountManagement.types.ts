import type { Role } from '@/features/authentication/types/role.types';

export type AccountStatus = 'active' | 'inactive' | 'locked';

export interface Account {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: Role;
  status: AccountStatus;
  phoneNumber?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface CreateStaffPayload {
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  staffType: 1 | 2; // 1 = Admin, 2 = Reception
}

export interface UpdateStaffPayload extends Partial<Omit<CreateStaffPayload, 'password'>> {
  status?: AccountStatus;
}

