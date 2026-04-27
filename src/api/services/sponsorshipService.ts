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

export const URGENCY_LEVELS = {
  NORMAL: 1,
  URGENT: 2,
  CRITICAL: 3,
} as const;

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];

export const normalizeUrgencyLevel = (level: unknown): UrgencyLevel => {
  if (typeof level === 'number') {
    // Ensure it's one of our valid levels (1, 2, 3)
    if (level === 3) return URGENCY_LEVELS.CRITICAL; // حرج جداً
    if (level === 2) return URGENCY_LEVELS.URGENT;   // عاجل / حرج
    if (level === 1) return URGENCY_LEVELS.NORMAL;   // عادي / عادية
    return URGENCY_LEVELS.NORMAL; // Default fallback
  }
  if (typeof level === 'string') {
    const lower = level.toLowerCase().trim();
    
    // Arabic labels (most important for this backend)
    // Check for Critical (Level 3) first to avoid partial matches with "حرج"
    if (lower.includes('حرج جدا') || lower.includes('حرجة جدا') || lower.includes('شديدة')) {
      return URGENCY_LEVELS.CRITICAL; // حرج جداً / حرجة جداً = 3
    }
    // "حرج" or "حرجة" alone is now Level 2 (Urgent)
    if (lower.includes('عاجل') || lower.includes('عالية') || lower.includes('حرج') || lower.includes('حرجة')) {
      return URGENCY_LEVELS.URGENT;   // عاجل / حرج / حرجة = 2
    }
    if (lower.includes('عادي') || lower.includes('عادية') || lower.includes('منخفضة')) {
      return URGENCY_LEVELS.NORMAL; // عادي / عادية = 1
    }
    
    // English labels
    // Level 3: "Very Critical", "Critical", "High"
    if (lower.includes('very critical') || lower === 'critical' || lower === '3' || lower === 'high') {
      return URGENCY_LEVELS.CRITICAL;
    }
    // Level 2: "Urgent", "Medium"
    if (lower === 'urgent' || lower === '2' || lower === 'medium' || lower.includes('urgent')) {
      return URGENCY_LEVELS.URGENT;
    }
    // Level 1: "Normal", "Low"
    if (lower === 'normal' || lower === 'low' || lower === '1' || lower === '0') {
      return URGENCY_LEVELS.NORMAL;
    }
  }
  return URGENCY_LEVELS.NORMAL; // Default to عادي (1)
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
// Emergency payload normaliser
// ---------------------------------------------------------------------------

// toUrgencyLabel removed - UI now only uses numeric `UrgencyLevel`

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
  iconName?: string;
  imageFile?: File;
  iconFile?: File;
  targetAmount: number;
  isActive?: boolean;
  collectedAmount?: number;
}

// Allow FormData as well
export type CreateSponsorshipInput = CreateSponsorshipPayload | FormData;

export interface UpdateSponsorshipPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  iconName?: string;
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
  urgencyLevel: UrgencyLevel;
  requiredAmount: number;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  /** Derived: true when urgencyLevel === URGENCY_LEVELS.CRITICAL. Not sent to the backend. */
  isCritical: boolean;
  createdAt?: string;
  createdOn?: string;
}

export interface CreateEmergencyCasePayload {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  urgencyLevel?: UrgencyLevel;
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
  imageFile?: File;
};

/**
 * Raw shape returned by the emergency-case endpoints.
 * Field names from backend: image, receivedAmount, urgencyLevel (string)
 */
interface RawEmergencyCase {
  id: number;
  title: string;
  description: string;
  image?: string; // Backend returns 'image' not 'imageUrl'
  imageUrl?: string; // Fallback
  urgencyLevel?: number | string;
  requiredAmount?: number | string;
  targetAmount?: number | string;
  receivedAmount?: number | string; // Backend returns 'receivedAmount'
  collectedAmount?: number | string; // Fallback
  isActive?: boolean;
  isCompleted?: boolean;
  createdAt?: string;
  createdOn?: string;
}

const toUiEmergencyCase = (item: RawEmergencyCase): EmergencyCase => {
  const requiredAmount = Number(item.requiredAmount ?? item.targetAmount ?? 0);
  const urgencyLevel = normalizeUrgencyLevel(item.urgencyLevel);
  // Backend returns 'image' field, fallback to 'imageUrl'
  const imageUrl = item.image ?? item.imageUrl;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: resolveMediaUrl(imageUrl),
    urgencyLevel,
    requiredAmount,
    targetAmount: requiredAmount,
    // Backend returns 'receivedAmount', fallback to 'collectedAmount'
    collectedAmount: Number(item.receivedAmount ?? item.collectedAmount ?? 0),
    isActive: Boolean(item.isActive),
    isCompleted: Boolean(item.isCompleted),
    // isCritical is a pure derived field — never read from or sent to the backend.
    isCritical: urgencyLevel === URGENCY_LEVELS.CRITICAL,
    createdAt: item.createdAt,
    createdOn: item.createdOn,
  };
};

// ---------------------------------------------------------------------------
// Sponsorship API
// ---------------------------------------------------------------------------

export const sponsorshipApi = {
  create: async (payload: CreateSponsorshipInput): Promise<SponsorshipProgram> => {
    // If payload is already FormData, send it directly
    if (payload instanceof FormData) {
      const raw = unwrapData<RawSponsorshipProgram>(
        await api.post('/v1/sponsorships', payload),
      );
      return toUiSponsorshipProgram(raw);
    }

    // Otherwise build FormData from object payload
    // Backend expects FormData with file uploads (multipart/form-data)
    // Use PascalCase field names to match backend
    const formData = new FormData();
    formData.append('Name', payload.name);
    formData.append('Description', payload.description);
    formData.append('TargetAmount', String(payload.targetAmount));
    formData.append('IsActive', String(payload.isActive ?? true));
    formData.append('CollectedAmount', String(payload.collectedAmount ?? 0));

    // Add icon if provided (URL or string)
    if (payload.icon && payload.icon.trim()) {
      formData.append('Icon', payload.icon.trim());
    }

    // Add icon name if provided
    if (payload.iconName && payload.iconName.trim()) {
      formData.append('IconName', payload.iconName.trim());
    }

    // Add icon FILE if provided (actual binary file)
    if (payload.iconFile) {
      formData.append('IconFile', payload.iconFile);
    }

    // Add image FILE if provided (actual binary file, not URL)
    if (payload.imageFile) {
      formData.append('ImageFile', payload.imageFile);
    } else if (payload.imageUrl && payload.imageUrl.trim()) {
      // Fallback to URL if no file
      formData.append('ImageUrl', payload.imageUrl.trim());
    }

    // Don't set Content-Type header - axios/browser will automatically set
    // multipart/form-data with the correct boundary for FormData
    const raw = unwrapData<RawSponsorshipProgram>(
      await api.post('/v1/sponsorships', formData),
    );
    return toUiSponsorshipProgram(raw);
  },

  update: async (id: number, payload: UpdateSponsorshipPayload | FormData): Promise<SponsorshipProgram> => {
    // If payload is already FormData, send it directly with the id
    if (payload instanceof FormData) {
      const raw = unwrapData<RawSponsorshipProgram>(
        await api.put(`/v1/sponsorships/${id}`, payload),
      );
      return toUiSponsorshipProgram(raw);
    }

    // Otherwise build FormData from object payload
    const formData = new FormData();
    
    if (payload.name !== undefined) formData.append('Name', payload.name);
    if (payload.description !== undefined) formData.append('Description', payload.description);
    if (payload.targetAmount !== undefined) formData.append('TargetAmount', String(payload.targetAmount));
    if (payload.isActive !== undefined) formData.append('IsActive', String(payload.isActive));
    if (payload.collectedAmount !== undefined) formData.append('CollectedAmount', String(payload.collectedAmount));
    
    // Handle icon
    if (payload.icon !== undefined && payload.icon.trim()) {
      formData.append('Icon', payload.icon.trim());
    }
    if (payload.iconName !== undefined && payload.iconName.trim()) {
      formData.append('IconName', payload.iconName.trim());
    }
    if (payload.iconFile) {
      formData.append('IconFile', payload.iconFile);
    }
    
    // Handle image
    if (payload.imageFile) {
      formData.append('ImageFile', payload.imageFile);
    } else if (payload.imageUrl !== undefined && payload.imageUrl.trim()) {
      formData.append('ImageUrl', payload.imageUrl.trim());
    }

    const raw = unwrapData<RawSponsorshipProgram>(
      await api.put(`/v1/sponsorships/${id}`, formData),
    );
    return toUiSponsorshipProgram(raw);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/sponsorships/${id}`, {
      headers: getAuthorizedHeaders(),
    });
  },

  cancelSubscription: async (id: number, reason?: string): Promise<void> => {
    const payload = reason ? { reason } : undefined;
    await api.delete(`/v1/subscriptions/${id}`, {
      data: payload,
      headers: getAuthorizedHeaders(),
    });
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
  create: async (payload: CreateEmergencyCasePayload | FormData): Promise<EmergencyCase> => {
    // If payload is already FormData, send it directly
    if (payload instanceof FormData) {
      const raw = unwrapData<RawEmergencyCase>(
        await api.post('/v1/emergency-cases', payload),
      );
      return toUiEmergencyCase(raw);
    }

    // Otherwise build FormData from object payload
    // Backend expects FormData with file uploads (multipart/form-data)
    // Use PascalCase field names to match backend
    const formData = new FormData();
    formData.append('Title', payload.title);
    formData.append('Description', payload.description);
    formData.append('UrgencyLevel', String(payload.urgencyLevel ?? URGENCY_LEVELS.NORMAL));
    formData.append('RequiredAmount', String(payload.requiredAmount ?? payload.targetAmount ?? 0));

    // Add image FILE if provided (actual binary file)
    if (payload.imageFile) {
      formData.append('Attachment', payload.imageFile);
    } else if (payload.imageUrl && payload.imageUrl.trim()) {
      // Fallback to URL if no file
      formData.append('ImageUrl', payload.imageUrl.trim());
    }

    // Don't set Content-Type header - axios/browser will automatically set
    // multipart/form-data with the correct boundary for FormData
    const raw = unwrapData<RawEmergencyCase>(
      await api.post('/v1/emergency-cases', formData),
    );
    return toUiEmergencyCase(raw);
  },

  update: async (id: number, payload: UpdateEmergencyCasePayload | FormData): Promise<EmergencyCase> => {
    // If payload is already FormData, send it directly with the id
    if (payload instanceof FormData) {
      const raw = unwrapData<RawEmergencyCase>(
        await api.put(`/v1/emergency-cases/${id}`, payload),
      );
      return toUiEmergencyCase(raw);
    }

    // Otherwise build FormData from object payload
    const formData = new FormData();
    
    if (payload.title !== undefined) formData.append('Title', payload.title);
    if (payload.description !== undefined) formData.append('Description', payload.description);
    if (payload.urgencyLevel !== undefined) formData.append('UrgencyLevel', String(payload.urgencyLevel));
    if (payload.requiredAmount !== undefined || payload.targetAmount !== undefined) {
      formData.append('RequiredAmount', String(payload.requiredAmount ?? payload.targetAmount ?? 0));
    }
    if (payload.isActive !== undefined) formData.append('IsActive', String(payload.isActive));
    
    // Handle image
    if ('imageFile' in payload && payload.imageFile) {
      formData.append('Attachment', payload.imageFile);
    } else if (payload.imageUrl !== undefined && payload.imageUrl.trim()) {
      formData.append('ImageUrl', payload.imageUrl.trim());
    }

    const raw = unwrapData<RawEmergencyCase>(
      await api.put(`/v1/emergency-cases/${id}`, formData),
    );
    return toUiEmergencyCase(raw);
  },

getAll: async (params?: { isActive?: boolean }): Promise<EmergencyCase[]> => {
  const raw = unwrapData<RawEmergencyCase[]>(
    await api.get('/v1/emergency-cases', { params }),
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
    await api.delete(`/v1/emergency-cases/${id}`, {
      headers: getAuthorizedHeaders(),
    });
  },
};