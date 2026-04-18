import api from '@/api/axiosInstance';

export interface UserPayload {
  [key: string]: unknown;
}

export const userService = {
  getUser: (id: string | number) => api.get(`/v1/users/${id}`),
  updateUser: (id: string | number, payload: UserPayload) => api.put(`/v1/users/${id}`, payload),
  deleteUser: (id: string | number) => api.delete(`/v1/users/${id}`),
};
