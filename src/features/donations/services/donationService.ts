import { axiosInstance } from '@/features/authentication/utils/axiosInstance';
import type { 
  CreateInKindDonationPayload, 
  UpdateInKindDonationPayload,
  InKindDonationResponse,
  InKindDonationsListResponse
} from '../types/donation.types';

export const inKindDonationService = {
  /** Register a new in-kind donation */
  async create(payload: CreateInKindDonationPayload): Promise<InKindDonationResponse> {
    const { data } = await axiosInstance.post<InKindDonationResponse>(
      '/v1/in-kind-donations',
      payload
    );
    return data;
  },

  /** Get all in-kind donations */
  async getAll(): Promise<InKindDonationsListResponse> {
    const { data } = await axiosInstance.get<InKindDonationsListResponse>(
      '/v1/in-kind-donations'
    );
    return data;
  },

  /** Get individual donation details */
  async getById(id: string): Promise<InKindDonationResponse> {
    const { data } = await axiosInstance.get<InKindDonationResponse>(
      `/v1/in-kind-donations/${id}`
    );
    return data;
  },

  /** Update an existing donation */
  async update(id: string, payload: UpdateInKindDonationPayload): Promise<InKindDonationResponse> {
    const { data } = await axiosInstance.put<InKindDonationResponse>(
      `/v1/in-kind-donations/${id}`,
      payload
    );
    return data;
  },

  /** Filter donations by specific donor */
  async getByDonorId(donorId: string): Promise<InKindDonationsListResponse> {
    const { data } = await axiosInstance.get<InKindDonationsListResponse>(
      `/v1/in-kind-donations/donor/${donorId}`
    );
    return data;
  },

  /** [Admin Only] Delete an in-kind donation */
  async delete(id: string): Promise<{ succeeded: boolean; message: string }> {
    const { data } = await axiosInstance.delete<{ succeeded: boolean; message: string }>(
      `/v1/in-kind-donations/${id}`
    );
    return data;
  },
};
