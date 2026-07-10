import api from '@/shared/api/axiosInstance';
import type {
  CreateStaffPayload,
  StaffListResponse,
  UpdateStaffPayload,
} from '@/features/AccountManagement/types/accountManagement.types';

const unwrapApiResponse = <T>(response: unknown): T => {
  if (response && typeof response === 'object' && 'isSuccess' in response && 'value' in response) {
    return (response as { value: T }).value;
  }

  if (response && typeof response === 'object' && 'succeeded' in response && 'data' in response) {
    return (response as { data: T }).data;
  }

  return response as T;
};

export const accountManagementService = {
  async getAll(params?: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<StaffListResponse> {
    const response = await api.get('/v1/admin/staff', { params });
    return unwrapApiResponse<StaffListResponse>(response);
  },

  async create(payload: CreateStaffPayload): Promise<void> {
    await api.post('/v1/auth/create-staff', payload);
  },

  async update(id: number, payload: UpdateStaffPayload): Promise<void> {
    await api.put(`/v1/admin/staff/${id}`, payload);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/v1/admin/staff/${id}`);
  },
};
