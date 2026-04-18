import api from '@/api/axiosInstance';
import type { Account, CreateStaffPayload, UpdateStaffPayload } from '@/features/AccountManagement/types/accountManagement.types';
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
    phoneNumber: '01012345678',
    createdAt: '2026-01-01',
    lastLoginAt: '2026-03-01 09:10',
  },
  {
    id: 'ACC-002',
    fullName: 'موظف استقبال 1',
    email: 'reception1@resala.org',
    username: 'reception1',
    role: Role.RECEPTIONIST,
    status: 'active',
    phoneNumber: '01112345678',
    createdAt: '2026-02-15',
    lastLoginAt: '2026-03-01 08:50',
  },
];

export const accountManagementService = {
  async getAll(): Promise<Account[]> {
    await delay(500);
    return MOCK_ACCOUNTS;
  },

  async create(payload: CreateStaffPayload): Promise<void> {
    await api.post('/v1/auth/create-staff', payload);
  },

  async update(id: string, payload: UpdateStaffPayload): Promise<void> {
    await api.put(`/v1/auth/staff/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/v1/auth/staff/${id}`);
  },
};
