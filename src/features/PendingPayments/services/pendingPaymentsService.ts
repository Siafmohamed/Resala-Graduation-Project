import api from '@/api/axiosInstance';
import type { PendingPayment, DeliveryArea, ApiResponse, PaymentMethod } from '../types/pendingPayments.types';
import { API_PATH_GUIDE } from '@/shared/api/apiPathGuide';

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

  verifyPayment: async (paymentId: number): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_PATH_GUIDE.subscriptions.payments.verify(paymentId));
  },

  getPaymentDetails: async (paymentId: number): Promise<PendingPayment> => {
    const response = await api.get<ApiResponse<PendingPayment>>(API_PATH_GUIDE.subscriptions.payments.getDetails(paymentId));
    return response.data;
  },

  rejectPayment: async (paymentId: number, reason: string): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_PATH_GUIDE.subscriptions.payments.reject(paymentId), { reason });
  },
};
