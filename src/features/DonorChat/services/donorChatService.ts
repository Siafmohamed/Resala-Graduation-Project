import api from '@/shared/api/axiosInstance';
import type { DonorListResponse } from '../types/donor';

// Helper function to handle both response formats
const handleApiResponse = <T>(response: any): T => {
  if (response && 'isSuccess' in response && 'value' in response) {
    return response.value;
  } else if (response && 'succeeded' in response && 'data' in response) {
    return response.data;
  } else if (response && 'data' in response) {
    return response.data;
  }
  return response;
};

export const donorChatService = {
  async getDonors(params: { search?: string; pageNumber: number; pageSize: number }) {
    const response = await api.get('/v1/in-kind-donations/donors', { params });
    return handleApiResponse<DonorListResponse>(response.data);
  },
};
