import api from '@/api/axiosInstance';

export interface DeliveryArea {
  id: number;
  name: string;
  governorate: string;
  city: string;
  isActive: boolean;
}

export interface CreateDeliveryAreaPayload {
  name: string;
  governorate: string;
  city: string;
}

export interface UpdateDeliveryAreaPayload {
  id: number;
  name: string;
  governorate: string;
  city: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors?: string[];
}

const unwrapData = <T>(response: any): T => {
  if (response && response.succeeded !== undefined) {
    return response.data;
  }
  return response;
};

export const deliveryAreasApi = {
  /**
   * Get all delivery areas (Admin)
   */
  getAll: async (): Promise<DeliveryArea[]> => {
    const response = await api.get('/v1/subscriptions/delivery-areas/admin');
    return unwrapData<DeliveryArea[]>(response);
  },

  /**
   * Create a new delivery area
   */
  create: async (payload: CreateDeliveryAreaPayload): Promise<DeliveryArea> => {
    const response = await api.post('/v1/subscriptions/delivery-areas', payload);
    return unwrapData<DeliveryArea>(response);
  },

  /**
   * Update an existing delivery area
   */
  update: async (id: number, payload: UpdateDeliveryAreaPayload): Promise<DeliveryArea> => {
    const response = await api.put(`/v1/subscriptions/delivery-areas/${id}`, payload);
    return unwrapData<DeliveryArea>(response);
  },

  /**
   * Delete a delivery area
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/subscriptions/delivery-areas/${id}`);
  },
};
