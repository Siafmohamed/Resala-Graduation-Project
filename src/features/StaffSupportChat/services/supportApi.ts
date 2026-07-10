import api from '@/api/axiosInstance';
import type { ChatHistoryResponse } from '../types/support';

const handleApiResponse = <T>(response: any): T => {
  if (response && 'isSuccess' in response && 'value' in response) {
    return response.value;
  } else if (response && 'succeeded' in response && 'data' in response) {
    return response.data;
  } else if (response && 'data' in response) {
    return response.data;
  }
  return response;
};

export const supportApi = {
  async getChatHistory(params: { chatOwnerUserId: string; pageNumber?: number; pageSize?: number }) {
    const response = await api.get('/v1/support/history', { params });
    return handleApiResponse<ChatHistoryResponse>(response);
  },

  async getLatestMessage(chatOwnerUserId: string) {
    const history = await this.getChatHistory({
      chatOwnerUserId,
      pageNumber: 1,
      pageSize: 50,
    });

    if (!history.items.length) return null;

    return history.items.reduce((latest, message) =>
      new Date(message.createdOn) > new Date(latest.createdOn) ? message : latest,
    );
  },

  async markMessagesAsRead(userId: string) {
    const response = await api.post(`/v1/support/read/${userId}`);
    return handleApiResponse<boolean>(response);
  },
};
