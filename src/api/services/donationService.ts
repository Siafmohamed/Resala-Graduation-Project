import api from '@/api/axiosInstance';
import type {
  CreateInKindDonationPayload,
  InKindDonationResponse,
  InKindDonationsListResponse,
  UpdateInKindDonationPayload,
} from '@/features/donations/types/donation.types';

export const inKindDonationService = {
  create: (payload: CreateInKindDonationPayload): Promise<InKindDonationResponse> =>
    api.post('/v1/in-kind-donations', payload),

  getAll: (): Promise<InKindDonationsListResponse> => api.get('/v1/in-kind-donations'),

  getById: (id: string): Promise<InKindDonationResponse> => api.get(`/v1/in-kind-donations/${id}`),

  update: (id: string, payload: UpdateInKindDonationPayload): Promise<InKindDonationResponse> =>
    api.put(`/v1/in-kind-donations/${id}`, payload),

  getByDonorId: (donorId: string): Promise<InKindDonationsListResponse> =>
    api.get(`/v1/in-kind-donations/donor/${donorId}`),

  delete: (id: string): Promise<{ succeeded: boolean; message: string }> =>
    api.delete(`/v1/in-kind-donations/${id}`),
};
