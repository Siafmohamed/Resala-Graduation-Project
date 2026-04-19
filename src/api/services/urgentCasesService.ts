import api from '@/api/axiosInstance';

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

/** Normalized model — urgencyLevel is 1 = Normal, 2 = Urgent, 3 = Critical */
export interface UrgentCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: number;
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
  /** 1 = Normal, 2 = Urgent, 3 = Critical */
  urgencyLevel?: number;
  /** Fallback when urgencyLevel omitted — maps to Critical vs Normal */
  isCritical?: boolean;
  isActive?: boolean;
}

export interface UpdateUrgentCasePayload {
  image?: File | string;
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  urgencyLevel?: number;
  isActive?: boolean;
}

interface RawEmergencyCaseResponse {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string | null;
  urgencyLevel?: number | string;
  requiredAmount?: number | string;
  targetAmount?: number | string;
  collectedAmount?: number | string;
  isActive?: boolean;
  createdOn?: string;
  createdAt?: string;
}

const unwrapData = <T>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

/**
 * Maps API urgency to UI levels (1–3). Supports native 1–3, legacy 0–2 tiers,
 * booleans, and common string labels.
 */
function normalizeUrgencyLevelFromApi(raw: unknown): number {
  if (raw === undefined || raw === null) return 1;
  if (typeof raw === 'boolean') return raw ? 3 : 1;
  if (typeof raw === 'string') {
    const lower = raw.trim().toLowerCase();
    if (lower === 'high' || lower === 'critical') return 3;
    if (lower === 'medium' || lower === 'urgent') return 2;
    if (lower === 'low' || lower === 'normal') return 1;
    const parsed = parseInt(lower, 10);
    if (!Number.isFinite(parsed)) return 1;
    raw = parsed;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1;
  if (n >= 1 && n <= 3) return Math.trunc(n);
  if (n >= 0 && n <= 2) return Math.trunc(n) + 1;
  return 1;
}

function clampApiUrgencyLevel(level: number): number {
  return Math.min(3, Math.max(1, Math.trunc(level)));
}

function mapRawToUrgentCase(raw: RawEmergencyCaseResponse): UrgentCase {
  const targetAmount = Number(raw.requiredAmount ?? raw.targetAmount ?? 0);
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    imageUrl: raw.imageUrl ?? undefined,
    targetAmount,
    collectedAmount: Number(raw.collectedAmount ?? 0),
    urgencyLevel: normalizeUrgencyLevelFromApi(raw.urgencyLevel),
    isActive: Boolean(raw.isActive),
    createdOn: raw.createdOn,
    createdAt: raw.createdAt,
  };
}

export const urgentCasesService = {
  getAll: async (): Promise<UrgentCase[]> => {
    const response = await api.get<
      ApiResponse<RawEmergencyCaseResponse[]> | RawEmergencyCaseResponse[]
    >('/v1/emergency-cases');
    const data = response.data;
    const list = Array.isArray(data)
      ? data
      : unwrapData<RawEmergencyCaseResponse[]>(data as ApiResponse<RawEmergencyCaseResponse[]>);
    return (list ?? []).map(mapRawToUrgentCase);
  },

  getById: async (id: number): Promise<UrgentCase> => {
    const response = await api.get<ApiResponse<RawEmergencyCaseResponse>>(`/v1/emergency-cases/${id}`);
    const raw = unwrapData(response.data);
    return mapRawToUrgentCase(raw);
  },

  create: async (payload: CreateUrgentCasePayload): Promise<UrgentCase> => {
    const level =
      payload.urgencyLevel !== undefined
        ? clampApiUrgencyLevel(Number(payload.urgencyLevel))
        : payload.isCritical
          ? 3
          : 1;

    // The backend stores strings: "Normal", "Urgent", "Critical"
    const levelString = level === 3 ? "Critical" : level === 2 ? "Urgent" : "Normal";

    const apiPayload: Record<string, unknown> = {
      title: payload.title,
      description: payload.description,
      requiredAmount: Math.trunc(Number(payload.targetAmount)),
      urgencyLevel: levelString,
    };

    // ✅ Handle image: File for upload, string for imageUrl
    if (payload.image !== undefined) {
      if (typeof payload.image === 'string') {
        apiPayload.imageUrl = payload.image;
      } else if (payload.image instanceof File) {
        apiPayload.image = payload.image;
      }
    }

    let requestBody: any = apiPayload;
    if (apiPayload.image instanceof File) {
      requestBody = new FormData();
      Object.entries(apiPayload).forEach(([key, val]) => {
        if (val !== undefined) {
          requestBody.append(key, val instanceof File ? val : String(val));
        }
      });
    }

    const response = await api.post<
      ApiResponse<RawEmergencyCaseResponse> | RawEmergencyCaseResponse
    >('/v1/emergency-cases', requestBody);
    const raw = unwrapData(response.data);
    return mapRawToUrgentCase(raw as RawEmergencyCaseResponse);
  },

  update: async (id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase> => {
    const body: Record<string, unknown> = {};

    if (payload.title !== undefined) body.title = payload.title;
    if (payload.description !== undefined) body.description = payload.description;

    if (payload.targetAmount !== undefined) {
      body.requiredAmount = Math.trunc(Number(payload.targetAmount));
    }
    if (payload.collectedAmount !== undefined) {
      body.collectedAmount = Math.trunc(Number(payload.collectedAmount));
    }
    if (payload.urgencyLevel !== undefined) {
      const level = clampApiUrgencyLevel(Number(payload.urgencyLevel));
      body.urgencyLevel = level === 3 ? "Critical" : level === 2 ? "Urgent" : "Normal";
    }
    if (payload.isActive !== undefined) body.isActive = payload.isActive;

    // ✅ Fixed: Handle both File and string image types
    if (payload.image !== undefined) {
      if (typeof payload.image === 'string') {
        body.imageUrl = payload.image;  // Keep existing image URL
      } else if (payload.image instanceof File) {
        body.image = payload.image;  // Send new File for upload
      }
    }

    if (Object.keys(body).length === 0) {
      throw new Error('No valid fields provided for urgent case update.');
    }

    // Convert to FormData if there's a file, so Axios interceptor triggers multipart/form-data
    let requestBody: any = body;
    if (body.image instanceof File) {
      requestBody = new FormData();
      Object.entries(body).forEach(([key, val]) => {
        if (val !== undefined) {
          requestBody.append(key, val instanceof File ? val : String(val));
        }
      });
    }

    const response = await api.put<ApiResponse<RawEmergencyCaseResponse>>(
      `/v1/emergency-cases/${id}`,
      requestBody,
    );
    const raw = unwrapData(response.data);
    return mapRawToUrgentCase(raw);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/emergency-cases/${id}`);
  },
};
