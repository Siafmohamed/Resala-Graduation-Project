import api from '@/api/axiosInstance';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import { normalizeUrgencyLevel, type UrgencyLevel } from './sponsorshipService';

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

// ... existing interfaces ...

const toUiUrgentCase = (item: any): UrgentCase => ({
  id: item.id,
  title: item.title,
  description: item.description,
  imageUrl: item.imageUrl ?? item.image ?? null,
  targetAmount: Number(item.targetAmount ?? item.requiredAmount ?? 0),
  collectedAmount: Number(item.collectedAmount ?? item.receivedAmount ?? 0),
  urgencyLevel: normalizeUrgencyLevel(item.urgencyLevel),
  isActive: Boolean(item.isActive),
  createdOn: item.createdOn,
  createdAt: item.createdAt,
});

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
    const response = await api.get<ApiResponse<UrgentCase[]> | any[]>('/v1/emergency-cases');
    const data = unwrapData<any[]>(response);
    return (Array.isArray(data) ? data : []).map(toUiUrgentCase);
  },

  getById: async (id: number): Promise<UrgentCase> => {
    const response = await api.get<ApiResponse<any>>(`/v1/emergency-cases/${id}`);
    const data = unwrapData<any>(response);
    return toUiUrgentCase(data);
  },

  create: async (payload: CreateUrgentCaseInput): Promise<UrgentCase> => {
    // If payload is already FormData, send it directly
    if (payload instanceof FormData) {
      const response = await api.post<ApiResponse<UrgentCase> | UrgentCase>('/v1/emergency-cases', payload);
      return unwrapData<UrgentCase>(response);
    }

    // Otherwise build FormData from object payload
    // Backend expects FormData with file uploads (multipart/form-data)
    // Use PascalCase field names to match backend
    const formData = new FormData();
    formData.append('Title', payload.title);
    formData.append('Description', payload.description);
    formData.append('UrgencyLevel', String(payload.urgencyLevel ?? 1));
    formData.append('RequiredAmount', String(payload.targetAmount));

    // Add attachment FILE if provided (actual binary file)
    if (payload.image instanceof File) {
      formData.append('Attachment', payload.image);
    } else if (typeof payload.image === 'string' && payload.image.trim()) {
      // Fallback to URL if no file
      formData.append('ImageUrl', payload.image.trim());
    }

    // Don't set Content-Type header - axios/browser will automatically set
    // multipart/form-data with the correct boundary for FormData
    const response = await api.post<ApiResponse<UrgentCase> | UrgentCase>('/v1/emergency-cases', formData);
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
