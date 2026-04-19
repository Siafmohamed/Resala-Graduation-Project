import api from '@/api/axiosInstance';
import { tokenManager } from '@/features/authentication/utils/tokenManager';

// ---------------------------------------------------------------------------
// Shared response envelope
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
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

// ---------------------------------------------------------------------------
// URL helpers (memoised — only computed once at module load time)
// ---------------------------------------------------------------------------

const DEFAULT_IMAGE_URL = 'https://placehold.co/600x400?text=Resala';
const DEFAULT_ICON = '';

const API_ORIGIN: string = (() => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!envBaseUrl) return window.location.origin;
  try {
    return new URL(envBaseUrl, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

const resolveMediaUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  return `${API_ORIGIN}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

const normalizeImageUrl = (value?: string): string =>
  resolveMediaUrl(value) ?? DEFAULT_IMAGE_URL;

/**
 * Resolves a media URL, but preserves bare icon keys (e.g. "orphan-icon")
 * that are not URL-like and should be passed through as-is.
 */
const normalizeIcon = (value?: string): string => {
  if (!value) return DEFAULT_ICON;
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_ICON;
  return resolveMediaUrl(trimmed) ?? trimmed;
};

// ---------------------------------------------------------------------------
// Shared payload helpers
// ---------------------------------------------------------------------------


const getAuthorizedHeaders = (): Record<string, string> => {
  const token = tokenManager.getAccessToken() || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};



// ---------------------------------------------------------------------------
// Emergency payload normaliser  ← NEW: mirrors normalizeSponsorshipPayload
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Sponsorship types & normaliser
// ---------------------------------------------------------------------------

export interface SponsorshipProgram {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSponsorshipPayload {
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  imageFile?: File;
  iconFile?: File;
  targetAmount: number;
  isActive?: boolean;
  collectedAmount?: number;
}

export interface UpdateSponsorshipPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  imageFile?: File;
  iconFile?: File;
  targetAmount?: number;
  isActive?: boolean;
  collectedAmount?: number;
}

/**
 * Raw shape returned by the sponsorship endpoints — may differ from the
 * frontend model (e.g. amounts may be strings, URLs may be relative).
 */
interface RawSponsorshipProgram {
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

const toUiSponsorshipProgram = (item: RawSponsorshipProgram): SponsorshipProgram => ({
  id: item.id,
  name: item.name,
  description: item.description,
  imageUrl: normalizeImageUrl(item.imageUrl),
  icon: normalizeIcon(item.icon),
  targetAmount: Number(item.targetAmount) || 0,
  collectedAmount: Number(item.collectedAmount) || 0,
  isActive: Boolean(item.isActive),
  createdAt: item.createdAt ?? '',
});

// ---------------------------------------------------------------------------
// Emergency case types & normaliser
// ---------------------------------------------------------------------------

export interface EmergencyCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  /** ✅ ALWAYS numeric: 1 (Normal) | 2 (Urgent) | 3 (Critical) */
  urgencyLevel: number;
  requiredAmount: number;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  /** Derived: true when urgencyLevel === 3 (Critical). Not sent to the backend. */
  isCritical: boolean;
  createdAt?: string;
  createdOn?: string;
}

export interface CreateEmergencyCasePayload {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  /** ✅ ALWAYS numeric: 1 (Normal) | 2 (Urgent) | 3 (Critical) */
  urgencyLevel?: number;
  requiredAmount?: number;
  targetAmount: number;
  collectedAmount?: number;
  isActive?: boolean;
  isCompleted?: boolean;
}

/**
 * Explicitly omits UI-only and immutable fields so callers can safely spread
 * an `EmergencyCase` object without accidentally forwarding `isCritical` or `id`.
 */
export type UpdateEmergencyCasePayload = Omit<
  Partial<EmergencyCase>,
  'id' | 'isCritical' | 'createdAt' | 'createdOn'
> & {
  urgencyLevel?: number;
};
/**
 * Raw shape returned by the emergency-case endpoints.
 * `requiredAmount` is what the backend calls the target; `urgencyLevel` can
 * arrive as an integer enum or as a string label.
 */
interface RawEmergencyCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  urgencyLevel?: number | string;
  requiredAmount?: number | string;
  targetAmount?: number | string;
  collectedAmount?: number | string;
  isActive?: boolean;
  isCompleted?: boolean;
  createdAt?: string;
  createdOn?: string;
}

const toUiEmergencyCase = (item: RawEmergencyCase): EmergencyCase => {
  const requiredAmount = Number(item.requiredAmount ?? item.targetAmount ?? 0);
  // ✅ Keep urgencyLevel as numeric (no string conversion)
  const urgencyLevel = Number(item.urgencyLevel ?? 1) as number;
  // ✅ isCritical is a DERIVED field - computed from urgencyLevel
  const isCritical = urgencyLevel === 3; // 3 = Critical

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: resolveMediaUrl(item.imageUrl),
    urgencyLevel, // ✅ numeric, not string
    requiredAmount,
    targetAmount: requiredAmount,
    collectedAmount: Number(item.collectedAmount ?? 0),
    isActive: Boolean(item.isActive),
    isCompleted: Boolean(item.isCompleted),
    isCritical, // ✅ Derived: computed on-the-fly, not stored
    createdAt: item.createdAt,
    createdOn: item.createdOn,
  };
};

// ---------------------------------------------------------------------------
// Sponsorship API
// ---------------------------------------------------------------------------

export const sponsorshipApi = {
  create: async (payload: CreateSponsorshipPayload): Promise<SponsorshipProgram> => {
    // Send JSON payload - axios will automatically set Content-Type
    const apiPayload = {
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl && payload.imageUrl.trim() ? payload.imageUrl : null,
      icon: payload.icon && payload.icon.trim() ? payload.icon : null,
      targetAmount: payload.targetAmount,
      isActive: payload.isActive ?? true,
      collectedAmount: payload.collectedAmount ?? 0,
    };

    const raw = unwrapData<RawSponsorshipProgram>(
      await api.post('/v1/sponsorships', apiPayload),
    );
    return toUiSponsorshipProgram(raw);
  },

  update: async (id: number, payload: UpdateSponsorshipPayload): Promise<SponsorshipProgram> => {
    // ✅ PUT endpoints only accept JSON, not FormData
    // If files are provided, they must be uploaded separately first (2-step process)
    // For now, we send JSON with URLs only
    
    const apiPayload: {
      name?: string;
      description?: string;
      targetAmount?: number;
      isActive?: boolean;
      collectedAmount?: number;
      imageUrl?: string;
      icon?: string;
    } = {};
    
    // Only include fields that are provided
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.targetAmount !== undefined) apiPayload.targetAmount = Math.trunc(payload.targetAmount);
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
    if (payload.collectedAmount !== undefined) apiPayload.collectedAmount = payload.collectedAmount;
    
    // Handle image URL: prefer existing URL, ignore file uploads for now
    if (payload.imageUrl !== undefined) apiPayload.imageUrl = payload.imageUrl;
    else if (payload.imageFile) {
      console.warn('Image file upload on update not supported yet. Please upload file separately first.');
    }
    
    // Handle icon URL: prefer existing icon, ignore file uploads for now
    if (payload.icon !== undefined) apiPayload.icon = payload.icon;
    else if (payload.iconFile) {
      console.warn('Icon file upload on update not supported yet. Please upload file separately first.');
    }
    
    if (Object.keys(apiPayload).length === 0) {
      throw new Error('No valid fields provided for sponsorship update.');
    }
    
    const raw = unwrapData<RawSponsorshipProgram>(
      await api.put(`/v1/sponsorships/${id}`, apiPayload, {
        headers: getAuthorizedHeaders(),
      }),
    );
    return toUiSponsorshipProgram(raw);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/sponsorships/${id}`);
  },

  getAll: async (params?: { isActive?: boolean }): Promise<SponsorshipProgram[]> => {
    const raw = unwrapData<RawSponsorshipProgram[]>(
      await api.get('/v1/sponsorships', { params }),
    );
    return raw.map(toUiSponsorshipProgram);
  },

  getById: async (id: number): Promise<SponsorshipProgram> => {
    const raw = unwrapData<RawSponsorshipProgram>(
      await api.get(`/v1/sponsorships/${id}`),
    );
    return toUiSponsorshipProgram(raw);
  },
};

// ---------------------------------------------------------------------------
// Emergency case API
// ---------------------------------------------------------------------------

export const emergencyApi = {
  create: async (payload: CreateEmergencyCasePayload): Promise<EmergencyCase> => {
    // Build JSON payload - urgencyLevel is ALWAYS numeric (1, 2, or 3)
    const apiPayload = {
      title: payload.title,
      description: payload.description,
      requiredAmount: payload.requiredAmount ?? payload.targetAmount ?? 0,
      // ✅ urgencyLevel is always numeric - no string conversion
      urgencyLevel: Math.trunc(Number(payload.urgencyLevel ?? 1)),
    };

    const raw = unwrapData<RawEmergencyCase>(
      await api.post('/v1/emergency-cases', apiPayload),
    );
    return toUiEmergencyCase(raw);
  },

  update: async (id: number, payload: UpdateEmergencyCasePayload): Promise<EmergencyCase> => {
    // ✅ PUT endpoints only accept JSON, not FormData
    // If files are provided, they must be uploaded separately first (2-step process)
    // For now, we send JSON with URLs only
    
    const apiPayload: {
      title?: string;
      description?: string;
      requiredAmount?: number;
      urgencyLevel?: number; // ✅ NUMBER: 1 for High, 0 or 2 for Low
      isActive?: boolean;
      imageUrl?: string;
    } = {};
    
    // Only include fields that are provided
    if (payload.title !== undefined) apiPayload.title = payload.title;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    
    // Handle requiredAmount (map from targetAmount if needed)
    if (payload.requiredAmount !== undefined || payload.targetAmount !== undefined) {
      apiPayload.requiredAmount = Math.trunc(
        Number(payload.requiredAmount ?? payload.targetAmount ?? 0)
      );
    }
    
    // ✅ urgencyLevel is ALWAYS numeric (1, 2, or 3)
    // No string conversion - payload must already be numeric from upstream
    if (payload.urgencyLevel !== undefined) {
      apiPayload.urgencyLevel = Math.trunc(Number(payload.urgencyLevel));
    }
    
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
    
    // Handle image URL: prefer existing URL, ignore file uploads for now
    if (payload.imageUrl !== undefined) apiPayload.imageUrl = payload.imageUrl;
    else if ('imageFile' in payload && payload.imageFile) {
      console.warn('Image file upload on update not supported yet. Please upload file separately first.');
    }
    
    if (Object.keys(apiPayload).length === 0) {
      throw new Error('No valid fields provided for emergency case update.');
    }
    
    const raw = unwrapData<RawEmergencyCase>(
      await api.put(`/v1/emergency-cases/${id}`, apiPayload, {
        headers: getAuthorizedHeaders(),
      }),
    );
    return toUiEmergencyCase(raw);
  },

  getAll: async (): Promise<EmergencyCase[]> => {
    const raw = unwrapData<RawEmergencyCase[]>(
      await api.get('/v1/emergency-cases'),
    );
    return raw.map(toUiEmergencyCase);
  },

  getById: async (id: number): Promise<EmergencyCase> => {
    const raw = unwrapData<RawEmergencyCase>(
      await api.get(`/v1/emergency-cases/${id}`),
    );
    return toUiEmergencyCase(raw);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/emergency-cases/${id}`);
  },
};