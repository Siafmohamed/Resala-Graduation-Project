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
  create: (payload: CreateInKindDonationDTO): Promise<InKindDonationResponse> =>
    api.post('/v1/in-kind-donations', payload),

  getAll: (): Promise<InKindDonationsListResponse> => api.get('/v1/in-kind-donations'),

  getById: (id: number): Promise<InKindDonationResponse> => api.get(`/v1/in-kind-donations/${id}`),

  update: (id: number, payload: UpdateInKindDonationDTO): Promise<InKindDonationResponse> =>
    api.put(`/v1/in-kind-donations/${id}`, payload),

  getByDonorId: (donorId: number): Promise<InKindDonationsListResponse> =>
    api.get(`/v1/in-kind-donations/donor/${donorId}`),

  delete: (id: number): Promise<{ succeeded: boolean; message: string }> =>
    api.delete(`/v1/in-kind-donations/${id}`),

  fetchDonorDropdown: (search: string): Promise<DonorOption[]> =>
    api.get('/v1/in-kind-donations/donors/dropdown', { params: { search } }),

  fetchDonorsPaginated: (search: string, pageNumber: number, pageSize = 20): Promise<PaginatedDonors> =>
    api.get('/v1/in-kind-donations/donors', { params: { search, pageNumber, pageSize } }),
};
