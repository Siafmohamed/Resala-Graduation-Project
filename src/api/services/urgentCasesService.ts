import api from '@/api/axiosInstance';
import { UrgencyLevel } from './sponsorshipService';

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

export interface UrgentCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;
  isActive: boolean;
  createdOn?: string;
  createdAt?: string;
}

export interface CreateUrgentCasePayload {
  image?: File | string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount?: number;
  urgencyLevel?: UrgencyLevel;
  isActive?: boolean;
}

export interface UpdateUrgentCasePayload {
  image?: File | string;
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  urgencyLevel?: UrgencyLevel;
  isActive?: boolean;
}

const unwrapData = <T>(response: any): T => {
  if (response === null || response === undefined) return response as T;
  
  // If the response itself has a 'data' property and is a successful envelope
  if (typeof response === 'object' && 'succeeded' in response && 'data' in response) {
    return response.data as T;
  }
  
  // If we already have the data (either directly or from axios interceptor)
  return response as T;
};

export const urgentCasesService = {
  getAll: async (): Promise<UrgentCase[]> => {
    const response = await api.get<ApiResponse<UrgentCase[]> | UrgentCase[]>('/v1/emergency-cases');
    // The axios interceptor returns response.data, so 'response' here is already the body
    return unwrapData<UrgentCase[]>(response);
  },

  getById: async (id: number): Promise<UrgentCase> => {
    const response = await api.get<ApiResponse<UrgentCase>>(`/v1/emergency-cases/${id}`);
    return unwrapData<UrgentCase>(response);
  },

  create: async (payload: CreateUrgentCasePayload): Promise<UrgentCase> => {
    // Build JSON payload wrapped in dto object
    const apiPayload = {
      dto: {
        title: payload.title,
        description: payload.description,
        requiredAmount: payload.targetAmount,
        urgencyLevel: payload.urgencyLevel ?? 1,  
      }
    };

    const response = await api.post<ApiResponse<UrgentCase> | UrgentCase>('/v1/emergency-cases', apiPayload);
    return unwrapData<UrgentCase>(response);
  },

  update: async (id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase> => {
    const response = await api.put<ApiResponse<UrgentCase>>(`/v1/emergency-cases/${id}`, payload);
    return unwrapData<UrgentCase>(response);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/emergency-cases/${id}`);
  },
};
