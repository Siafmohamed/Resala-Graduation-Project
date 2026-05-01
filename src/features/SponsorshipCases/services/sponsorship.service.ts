import api from '@/api/axiosInstance';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import type { Sponsorship } from '../types/sponsorship.types';
import { normalizeSponsorshipImageUrl } from '../utils/sponsorshipHelpers';

// ---------------------------------------------------------------------------
// Shared response envelope
// ---------------------------------------------------------------------------

interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

const unwrapData = <T>(response: unknown): T => {
  if (
    response !== null &&
    typeof response === 'object' &&
    'succeeded' in response &&
    'data' in response
  ) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const getAuthorizedHeaders = (): Record<string, string> => {
  const token = tokenManager.getAccessToken() || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------------------------------------------------------------------
// Raw types from backend
// ---------------------------------------------------------------------------

interface RawSponsorship {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  targetAmount?: number | string;
  collectedAmount?: number | string;
  isActive?: boolean;
  createdAt?: string;
}

const toUiSponsorship = (item: RawSponsorship): Sponsorship => ({
  id: item.id,
  name: item.name,
  description: item.description,
  imageUrl: normalizeSponsorshipImageUrl(item.imageUrl),
  icon: item.icon || '',
  targetAmount: Number(item.targetAmount) || 0,
  collectedAmount: Number(item.collectedAmount) || 0,
  isActive: Boolean(item.isActive),
  createdAt: item.createdAt ?? '',
});

// ---------------------------------------------------------------------------
// Sponsorship API
// ---------------------------------------------------------------------------

export const sponsorshipService = {
  getAll: async (params?: { isActive?: boolean }): Promise<Sponsorship[]> => {
    const raw = unwrapData<RawSponsorship[]>(
      await api.get('/v1/sponsorships', { params })
    );
    return raw.map(toUiSponsorship);
  },

  getById: async (id: number): Promise<Sponsorship> => {
    const raw = unwrapData<RawSponsorship>(
      await api.get(`/v1/sponsorships/${id}`)
    );
    return toUiSponsorship(raw);
  },

  create: async (payload: FormData): Promise<Sponsorship> => {
    const raw = unwrapData<RawSponsorship>(
      await api.post('/v1/sponsorships', payload)
    );
    return toUiSponsorship(raw);
  },

  update: async (id: number, payload: FormData): Promise<Sponsorship> => {
    const raw = unwrapData<RawSponsorship>(
      await api.put(`/v1/sponsorships/${id}`, payload)
    );
    return toUiSponsorship(raw);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/sponsorships/${id}`, {
      headers: getAuthorizedHeaders(),
    });
  },
};

export default sponsorshipService;
