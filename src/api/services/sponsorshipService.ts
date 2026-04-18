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
// Urgency helpers
// ---------------------------------------------------------------------------


const toUrgencyLabel = (raw: number | string | undefined): string => {
  const val = String(raw ?? '').trim();
  if (val === '1') return 'High';
  if (val === '2') return 'Medium';
  if (val.toLowerCase() === 'high') return 'High';
  if (val.toLowerCase() === 'medium') return 'Medium';
  return 'Low';
};

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
  urgencyLevel: string;
  requiredAmount: number;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  /** Derived: true when urgencyLevel === 'High'. Not sent to the backend. */
  isCritical: boolean;
  createdAt?: string;
  createdOn?: string;
}

export interface CreateEmergencyCasePayload {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  urgencyLevel?: string | number;
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
>;

/**
 * Raw shape returned by the emergency-case endpoints.
 * `requiredAmount` is what the backend calls the target; `urgencyLevel` can
 * arrive as an integer enum or as a string label.
 */
interface RawEmergencyCase {
  id: number;
  Title?: string;
  Description?: string;
  Image?: string;
  UrgencyLevel?: number | string;
  RequiredAmount?: number | string;
  TargetAmount?: number | string;
  ReceivedAmount?: number | string;
  IsActive?: boolean;
  IsCompleted?: boolean;
  CreatedAt?: string;
  CreatedOn?: string;
  // Fallbacks for older snake_case/camelCase
  title?: string;
  description?: string;
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
  const title = item.Title ?? item.title ?? '';
  const description = item.Description ?? item.description ?? '';
  const imageUrl = item.Image ?? item.imageUrl;
  const rawRequiredAmount = item.RequiredAmount ?? item.TargetAmount ?? item.requiredAmount ?? item.targetAmount ?? 0;
  const rawCollectedAmount = item.ReceivedAmount ?? item.collectedAmount ?? 0;
  const rawUrgency = item.UrgencyLevel ?? item.urgencyLevel;
  
  const requiredAmount = Number(rawRequiredAmount);
  const urgencyLevel = toUrgencyLabel(rawUrgency);

  return {
    id: item.id,
    title,
    description,
    imageUrl: resolveMediaUrl(imageUrl),
    urgencyLevel,
    requiredAmount,
    targetAmount: requiredAmount,
    collectedAmount: Number(rawCollectedAmount),
    isActive: Boolean(item.IsActive ?? item.isActive),
    isCompleted: Boolean(item.IsCompleted ?? item.isCompleted),
    // 1 = High, 2 = Medium
    isCritical: String(rawUrgency) === '1' || urgencyLevel.toLowerCase() === 'high',
    createdAt: item.CreatedAt ?? item.createdAt,
    createdOn: item.CreatedOn ?? item.createdOn,
  };
};

// ---------------------------------------------------------------------------
// Sponsorship API
// ---------------------------------------------------------------------------

export const sponsorshipApi = {
  create: async (payload: CreateSponsorshipPayload): Promise<SponsorshipProgram> => {
    // Send JSON payload matching the required schema: name, description, imageUrl, icon, targetAmount
    const apiPayload = {
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl && payload.imageUrl.trim() ? payload.imageUrl : "",
      icon: payload.icon && payload.icon.trim() ? payload.icon : "",
      targetAmount: Math.trunc(payload.targetAmount),
    };

    const raw = unwrapData<RawSponsorshipProgram>(
      await api.post('/v1/sponsorships', apiPayload),
    );
    return toUiSponsorshipProgram(raw);
  },

  update: async (id: number, payload: UpdateSponsorshipPayload): Promise<SponsorshipProgram> => {
    // ✅ Flattened payload: id, name, description, targetAmount
    const apiPayload: any = {
      id: id,
    };
    
    // Only include fields specified in the user's prompt: name, description, targetAmount
    if (payload.name !== undefined && payload.name !== null) apiPayload.name = payload.name;
    if (payload.description !== undefined && payload.description !== null) apiPayload.description = payload.description;
    if (payload.targetAmount !== undefined && payload.targetAmount !== null) apiPayload.targetAmount = Math.trunc(payload.targetAmount);
    
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
    // Build JSON payload matching backend PascalCase properties, without DTO wrapper
    // UrgencyLevel 1 (High/Critical) and UrgencyLevel 2 (Medium/Moderate)
    const apiPayload = {
      "Title": payload.title,
      "Description": payload.description,
      "RequiredAmount": payload.requiredAmount ?? payload.targetAmount ?? 0,
      "ReceivedAmount": payload.collectedAmount ?? 0,
      "Image": payload.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStFlDR2Ki3J3gtY-D1jSj42Crkii5du5NTlQ&s',
      "UrgencyLevel": (payload.urgencyLevel === 'High' || payload.urgencyLevel === 'high' || payload.urgencyLevel === 1) ? 1 : 2,
    };

    const raw = unwrapData<RawEmergencyCase>(
      await api.post('/v1/emergency-cases', apiPayload),
    );
    return toUiEmergencyCase(raw);
  },

  update: async (id: number, payload: UpdateEmergencyCasePayload): Promise<EmergencyCase> => {
    // ✅ PUT payload matching backend exactly: id, title, description, urgencyLevel, requiredAmount, imageUrl, isActive
    const apiPayload: any = {
      id: id,
    };

    // Only include fields specified in the user's prompt
    if (payload.title !== undefined && payload.title !== null) {
      apiPayload.title = payload.title;
    }

    if (payload.description !== undefined && payload.description !== null) {
      apiPayload.description = payload.description;
    }

    if (payload.urgencyLevel !== undefined && payload.urgencyLevel !== null) {
      let level: number;
      if (typeof payload.urgencyLevel === 'string') {
        const lower = payload.urgencyLevel.toLowerCase();
        level = (lower === 'high' || lower === 'critical') ? 1 : 2;
      } else {
        level = (payload.urgencyLevel === 1) ? 1 : 2;
      }
      apiPayload.urgencyLevel = level;
    }

    if ((payload.requiredAmount !== undefined && payload.requiredAmount !== null) || (payload.targetAmount !== undefined && payload.targetAmount !== null)) {
      apiPayload.requiredAmount = Math.trunc(
        Number(payload.requiredAmount ?? payload.targetAmount ?? 0)
      );
    }

    if (payload.imageUrl !== undefined && payload.imageUrl !== null) {
      apiPayload.imageUrl = payload.imageUrl;
    }

    if (payload.isActive !== undefined && payload.isActive !== null) {
      apiPayload.isActive = payload.isActive;
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