import api from '@/shared/api/axiosInstance';

export interface BroadcastNotificationPayload {
  title: string;
  message: string;
  type: number;
  relatedEntityId: number;
}

export interface ApiResponse<T = any> {
  succeeded: boolean;
  message?: string;
  errors?: string[];
  data?: T;
}

export const notificationService = {
  async broadcast(data: BroadcastNotificationPayload): Promise<ApiResponse> {
    const response = await api.post('/v1/notifications/broadcast', data);
    return response;
  },
};
