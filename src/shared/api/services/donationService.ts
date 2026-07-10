import api from '@/shared/api/axiosInstance';
import type {
  InKindDonation,
  InKindDonationsListResponse,
  CreateInKindDonationDTO,
  UpdateInKindDonationDTO,
  DonorDropdownOption,
  PaginatedDonors,
} from '@/features/donations/types/inKindDonation.types';

const handleApiResponse = <T>(response: unknown): T => {
  if (response && typeof response === 'object') {
    if ('succeeded' in response && 'data' in response) {
      return (response as { data: T }).data;
    }
    if ('isSuccess' in response && 'value' in response) {
      return (response as { value: T }).value;
    }
    if ('data' in response) {
      return (response as { data: T }).data;
    }
  }
  return response as T;
};

export const inKindDonationService = {
  create: async (payload: CreateInKindDonationDTO): Promise<InKindDonation> => {
    const response = await api.post('/v1/in-kind-donations', payload);
    return handleApiResponse<InKindDonation>(response);
  },

  getAll: async (): Promise<InKindDonation[]> => {
    const response = await api.get<InKindDonationsListResponse>('/v1/in-kind-donations');
    const data = handleApiResponse<InKindDonation[]>(response);
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: number): Promise<InKindDonation> => {
    const response = await api.get(`/v1/in-kind-donations/${id}`);
    return handleApiResponse<InKindDonation>(response);
  },

  update: async (id: number, payload: UpdateInKindDonationDTO): Promise<InKindDonation> => {
    const response = await api.put(`/v1/in-kind-donations/${id}`, payload);
    return handleApiResponse<InKindDonation>(response);
  },

  getByDonorId: async (donorId: number): Promise<InKindDonation[]> => {
    const response = await api.get<InKindDonationsListResponse>(`/v1/in-kind-donations/donor/${donorId}`);
    const data = handleApiResponse<InKindDonation[]>(response);
    return Array.isArray(data) ? data : [];
  },

  delete: (id: number): Promise<{ succeeded: boolean; message: string }> =>
    api.delete(`/v1/in-kind-donations/${id}`),

  fetchDonorDropdown: async (search: string): Promise<DonorDropdownOption[]> => {
    const response = await api.get('/v1/in-kind-donations/donors/dropdown', { params: { search } });
    const data = handleApiResponse<DonorDropdownOption[]>(response);
    return Array.isArray(data) ? data : [];
  },

  fetchDonorsPaginated: async (search: string, pageNumber: number, pageSize = 20): Promise<PaginatedDonors> => {
    const response = await api.get('/v1/in-kind-donations/donors', { params: { search, pageNumber, pageSize } });
    return handleApiResponse<PaginatedDonors>(response);
  },
};
