import api from '@/api/axiosInstance';
import type {
  InKindDonationResponse,
  InKindDonationsListResponse,
  CreateInKindDonationDTO,
  UpdateInKindDonationDTO,
  DonorOption,
  PaginatedDonors,
} from '@/features/donations/types/inKindDonation.types';

export const inKindDonationService = {
  create: async (payload: CreateInKindDonationDTO): Promise<InKindDonationResponse> => {
    const response = await api.post<InKindDonationResponse>('/v1/in-kind-donations', payload);
    return response.data;
  },

  getAll: async (): Promise<InKindDonation[]> => {
    const response = await api.get<InKindDonationsListResponse>('/v1/in-kind-donations');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<InKindDonationResponse> => {
    const response = await api.get<InKindDonationResponse>(`/v1/in-kind-donations/${id}`);
    return response.data;
  },

  update: async (id: number, payload: UpdateInKindDonationDTO): Promise<InKindDonationResponse> => {
    const response = await api.put<InKindDonationResponse>(`/v1/in-kind-donations/${id}`, payload);
    return response.data;
  },

  getByDonorId: async (donorId: number): Promise<InKindDonation[]> => {
    const response = await api.get<InKindDonationsListResponse>(`/v1/in-kind-donations/donor/${donorId}`);
    return response.data.data || [];
  },

  delete: (id: number): Promise<{ succeeded: boolean; message: string }> =>
    api.delete(`/v1/in-kind-donations/${id}`),

  fetchDonorDropdown: async (search: string): Promise<DonorOption[]> => {
    const response = await api.get<InKindDonationsListResponse & { data: DonorOption[] }>('/v1/in-kind-donations/donors/dropdown', { params: { search } });
    return response.data;
  },

  fetchDonorsPaginated: async (search: string, pageNumber: number, pageSize = 20): Promise<PaginatedDonors> => {
    const response = await api.get<any>('/v1/in-kind-donations/donors', { params: { search, pageNumber, pageSize } });
    return response.data;
  },
};
