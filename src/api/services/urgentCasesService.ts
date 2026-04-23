import api from '@/api/axiosInstance';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import type { UrgencyLevel } from './sponsorshipService';

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

const unwrapData = <T>(response: unknown): T => {
  if (response === null || response === undefined) return response as T;
  
  // If the response itself has a 'data' property and is a successful envelope
  if (typeof response === 'object' && 'succeeded' in response && 'data' in response) {
    return (response as ApiResponse<T>).data as T;
  }
  
  // If we already have the data (either directly or from axios interceptor)
  return response as T;
};

const getAuthorizedHeaders = (): Record<string, string> => {
  const token = tokenManager.getAccessToken() || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
    // Build JSON payload with image as URL only
    const apiPayload: Record<string, unknown> = {
      title: payload.title,
      description: payload.description,
      requiredAmount: payload.targetAmount,
      urgencyLevel: payload.urgencyLevel ?? 1,
    };

    // Only add imageUrl if it's a string URL
    if (typeof payload.image === 'string' && payload.image.trim()) {
      apiPayload.imageUrl = payload.image.trim();
    }

    const response = await api.post<ApiResponse<UrgentCase> | UrgentCase>('/v1/emergency-cases', apiPayload, {
      headers: getAuthorizedHeaders(),
    });
    return unwrapData<UrgentCase>(response);
  },

  update: async (id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase> => {
    const response = await api.put<ApiResponse<UrgentCase>>(`/v1/emergency-cases/${id}`, payload);
    return unwrapData<UrgentCase>(response);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/emergency-cases/${id}`, {
      headers: getAuthorizedHeaders(),
    });
  },
};
