import api from '@/api/axiosInstance';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubscriptionSlot {
  id: number;
  slotDate: string;
  openFrom: string;
  openTo: string;
  maxCapacity: number;
  bookedCount: number;
  availableSpots: number;
  notes?: string;
}

export interface CreateSlotPayload {
  slotDate: string;
  openFrom: string;
  openTo: string;
  maxCapacity: number;
  notes?: string;
}

export interface UpdateSlotPayload {
  slotDate?: string;
  openFrom?: string;
  openTo?: string;
  maxCapacity?: number;
  notes?: string;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors?: string[];
}

/**
 * Helper to unwrap API responses that may be wrapped in an ApiResponse envelope
 */
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
// Subscription Slots API
// ---------------------------------------------------------------------------

export const subscriptionSlotsApi = {
  /**
   * Get all slots (Admin) - includes expired and full slots
   */
  getAll: async (): Promise<SubscriptionSlot[]> => {
    const response = await api.get('/v1/subscriptions/slots/admin');
    return unwrapData<SubscriptionSlot[]>(response);
  },

  /**
   * Create a new slot
   */
  create: async (payload: CreateSlotPayload): Promise<SubscriptionSlot> => {
    const response = await api.post('/v1/subscriptions/slots', payload);
    return unwrapData<SubscriptionSlot>(response);
  },

  /**
   * Update an existing slot
   */
  update: async (id: number, payload: UpdateSlotPayload): Promise<SubscriptionSlot> => {
    const response = await api.put(`/v1/subscriptions/slots/${id}`, payload);
    return unwrapData<SubscriptionSlot>(response);
  },

  /**
   * Delete a slot
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/subscriptions/slots/${id}`);
  },
};
