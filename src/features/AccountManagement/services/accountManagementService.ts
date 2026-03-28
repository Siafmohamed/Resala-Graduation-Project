import axiosInstance from '@/features/authentication/utils/axiosInstance';
import type { Account, CreateStaffPayload, UpdateStaffPayload } from '../types/accountManagement.types';
import { Role } from '@/features/authentication';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for listing since we don't have a dedicated list endpoint yet
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
  {
    id: 'ACC-003',
    fullName: 'مسؤول النماذج',
    email: 'forms@resala.org',
    username: 'forms',
    role: Role.FORM_MANAGER,
    status: 'inactive',
    phoneNumber: '01212345678',
    createdAt: '2026-02-20',
    lastLoginAt: '2026-02-20 15:22',
  },
];

export const accountManagementService = {
  async getAll(): Promise<Account[]> {
    // In a real app, this would be: 
    // const { data } = await axiosInstance.get('/v1/auth/staff');
    // return data.data;
    await delay(500);
    return MOCK_ACCOUNTS;
  },

  async create(payload: CreateStaffPayload): Promise<void> {
    await axiosInstance.post('/v1/auth/create-staff', payload);
  },

  async update(id: string, payload: UpdateStaffPayload): Promise<void> {
    await axiosInstance.put(`/v1/auth/staff/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/auth/staff/${id}`);
  }
};

