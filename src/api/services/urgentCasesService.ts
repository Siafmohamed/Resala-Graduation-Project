import api from '@/api/axiosInstance';

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
  isCritical: boolean;
  isActive: boolean;
  urgencyLevel?: string | number;
  createdOn?: string;
  createdAt?: string;
}

export interface CreateUrgentCasePayload {
  image?: File | string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount?: number;
  isCritical?: boolean;
  isActive?: boolean;
}

export interface UpdateUrgentCasePayload {
  image?: File | string;
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  isCritical?: boolean;
  isActive?: boolean;
}

const unwrapData = <T>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const toUiUrgentCase = (item: any): UrgentCase => {
  const title = item.Title ?? item.title ?? '';
  const description = item.Description ?? item.description ?? '';
  const imageUrl = item.Image ?? item.imageUrl;
  const rawRequiredAmount = item.RequiredAmount ?? item.TargetAmount ?? item.requiredAmount ?? item.targetAmount ?? 0;
  const rawCollectedAmount = item.ReceivedAmount ?? item.collectedAmount ?? 0;
  const rawUrgency = item.UrgencyLevel ?? item.urgencyLevel;

  const requiredAmount = Number(rawRequiredAmount);

  return {
    id: item.id,
    title,
    description,
    imageUrl,
    targetAmount: requiredAmount,
    collectedAmount: Number(rawCollectedAmount),
    isActive: Boolean(item.IsActive ?? item.isActive),
    // 1 = High, 2 = Medium
    isCritical: String(rawUrgency) === '1',
    urgencyLevel: rawUrgency,
    createdOn: item.CreatedOn ?? item.createdOn,
    createdAt: item.CreatedAt ?? item.createdAt,
  };
};

export const urgentCasesService = {
  getAll: async (): Promise<UrgentCase[]> => {
    const response = await api.get<ApiResponse<UrgentCase[]> | UrgentCase[]>('/v1/emergency-cases');
    const data = unwrapData(response.data) as any[];
    return Array.isArray(data) ? data.map(toUiUrgentCase) : [];
  },

  getById: async (id: number): Promise<UrgentCase> => {
    const response = await api.get<ApiResponse<UrgentCase>>(`/v1/emergency-cases/${id}`);
    return toUiUrgentCase(unwrapData(response.data));
  },

  create: async (payload: CreateUrgentCasePayload): Promise<UrgentCase> => {
    // Build JSON payload matching backend PascalCase properties, without DTO wrapper
    // UrgencyLevel 1 (High/Critical) and UrgencyLevel 2 (Medium/Moderate)
    const apiPayload = {
      "Title": payload.title,
      "Description": payload.description,
      "RequiredAmount": payload.targetAmount,
      "ReceivedAmount": payload.collectedAmount ?? 0,
      "Image": (typeof payload.image === 'string' ? payload.image : null) || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStFlDR2Ki3J3gtY-D1jSj42Crkii5du5NTlQ&s',
      "UrgencyLevel": payload.isCritical ? 1 : 2,
    };

    const response = await api.post<ApiResponse<UrgentCase> | UrgentCase>('/v1/emergency-cases', apiPayload);
    return toUiUrgentCase(unwrapData(response.data));
  },

  update: async (id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase> => {
    // ✅ Payload matching backend exactly: id, title, description, urgencyLevel, requiredAmount, imageUrl, isActive
    const apiPayload: any = {
      id: id
    };

    if (payload.title !== undefined && payload.title !== null) apiPayload.title = payload.title;
    if (payload.description !== undefined && payload.description !== null) apiPayload.description = payload.description;
    if (payload.targetAmount !== undefined && payload.targetAmount !== null) apiPayload.requiredAmount = payload.targetAmount;
    if (payload.isCritical !== undefined && payload.isCritical !== null) apiPayload.urgencyLevel = payload.isCritical ? 1 : 2;
    if (payload.isActive !== undefined && payload.isActive !== null) apiPayload.isActive = payload.isActive;
    
    // Use imageUrl if provided (this should match the backend's expected 'imageUrl' field name)
    if (payload.image !== undefined && payload.image !== null) {
      apiPayload.imageUrl = typeof payload.image === 'string' ? payload.image : "";
    }

    const response = await api.put<ApiResponse<UrgentCase>>(`/v1/emergency-cases/${id}`, apiPayload);
    return toUiUrgentCase(unwrapData(response.data));
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/emergency-cases/${id}`);
  },
};
