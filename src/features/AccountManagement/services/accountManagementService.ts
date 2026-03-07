import type { Account } from '../types/accountManagement.types';
import { Role } from '@/features/authentication';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'ACC-001',
    fullName: 'مسؤول النظام',
    email: 'admin@resala.org',
    username: 'admin',
    role: Role.ADMIN,
    status: 'active',
    lastLoginAt: '2026-03-01 09:10',
  },
  {
    id: 'ACC-002',
    fullName: 'موظف استقبال 1',
    email: 'reception1@resala.org',
    username: 'reception1',
    role: Role.RECEPTIONIST,
    status: 'active',
    lastLoginAt: '2026-03-01 08:50',
  },
  {
    id: 'ACC-003',
    fullName: 'مسؤول النماذج',
    email: 'forms@resala.org',
    username: 'forms',
    role: Role.FORM_MANAGER,
    status: 'inactive',
    lastLoginAt: '2026-02-20 15:22',
  },
];

export const accountManagementService = {
  async getAll(): Promise<Account[]> {
    await delay(300);
    return MOCK_ACCOUNTS;
  },
};

