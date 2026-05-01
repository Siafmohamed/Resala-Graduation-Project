import api from '@/api/axiosInstance';
import type { 
  Donor, 
  DonorRegistrationPayload, 
  DonorFilters 
} from '../types/donors.types';

export const donorsService = {
  getDonors: async (filters?: DonorFilters): Promise<Donor[]> => {
    const response = await api.get('/v1/donors', { params: filters });
    return response.data.data;
  },

  getDonorById: async (id: number): Promise<Donor> => {
    const response = await api.get(`/v1/donors/${id}`);
    return response.data.data;
  },

  registerDonor: async (payload: DonorRegistrationPayload): Promise<Donor> => {
    const response = await api.post('/v1/donors', payload);
    return response.data.data;
  },

  updateDonor: async (id: number, payload: Partial<DonorRegistrationPayload>): Promise<Donor> => {
    const response = await api.put(`/v1/donors/${id}`, payload);
    return response.data.data;
  },

  searchDonors: async (query: string): Promise<Donor[]> => {
    const response = await api.get('/v1/donors/search', { params: { query } });
    return response.data.data;
  }
};
