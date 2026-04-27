import api from '@/api/axiosInstance';
import type { PendingPayment, DeliveryArea, ApiResponse, PaymentMethod } from '../types/pendingPayments.types';

// Constants
const BASE_URL = '/v1/subscriptions/payments/pending';
const DELIVERY_AREAS_URL = '/v1/subscriptions/delivery-areas/admin';

export const pendingPaymentsService = {
  getPendingPayments: async (method: PaymentMethod): Promise<PendingPayment[]> => {
    let url = BASE_URL;
    
    switch (method) {
      case 'Representatives':
        url += '/representatives';
        break;
      case 'Branch':
        url += '/branch';
        break;
      case 'Vodafone Cash':
        url += '/vodafonecash';
        break;
      case 'InstaPay':
        url += '/instapay';
        break;
      default:
        // 'All' uses the base URL
        break;
    }

    const response = await api.get<ApiResponse<PendingPayment[]>>(url);
    return response.data;
  },

  getDeliveryAreas: async (): Promise<DeliveryArea[]> => {
    const response = await api.get<ApiResponse<DeliveryArea[]>>(DELIVERY_AREAS_URL);
    return response.data;
  },
};
