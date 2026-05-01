import api from '@/api/axiosInstance';
import { API_PATH_GUIDE } from '@/shared/api/apiPathGuide';
import type { 
  UnifiedPayment, 
  PaymentMethod, 
  PaymentType, 
  ApiResponse, 
  DeliveryArea 
} from '../types/payments.types';

const SUBSCRIPTION_BASE = '/v1/subscriptions/payments/pending';

export const paymentsService = {
  getPendingPayments: async (type: PaymentType, method: PaymentMethod): Promise<UnifiedPayment[]> => {
    let url = '';
    
    if (type === 'emergency') {
      url = API_PATH_GUIDE.emergencyCases.payments.pending;
      if (method !== 'All') {
        url = API_PATH_GUIDE.emergencyCases.payments.pendingByMethod(method.toLowerCase().replace(' ', ''));
      }
    } else {
      url = SUBSCRIPTION_BASE;
      const m = method.toLowerCase().replace(' ', '');
      if (m === 'representatives') url += '/representatives';
      else if (m === 'branch') url += '/branch';
      else if (m === 'vodafonecash') url += '/vodafonecash';
      else if (m === 'instapay') url += '/instapay';
    }

    const response = await api.get<ApiResponse<UnifiedPayment[]>>(url);
    return response.data;
  },

  getPaymentDetails: async (type: PaymentType, id: number): Promise<UnifiedPayment> => {
    let url = '';
    if (type === 'emergency') {
      // Assuming same pattern if not in guide, or use a general endpoint
      url = `/v1/emergency-cases/payments/${id}`;
    } else {
      url = API_PATH_GUIDE.subscriptions.payments.getDetails(id);
    }
    const response = await api.get<ApiResponse<UnifiedPayment>>(url);
    return response.data;
  },

  verifyPayment: async (type: PaymentType, id: number): Promise<ApiResponse<null>> => {
    const url = type === 'emergency' 
      ? API_PATH_GUIDE.emergencyCases.payments.verify(id)
      : API_PATH_GUIDE.subscriptions.payments.verify(id);
    const response = await api.post<ApiResponse<null>>(url);
    return response.data;
  },

  rejectPayment: async (type: PaymentType, id: number, reason: string): Promise<ApiResponse<null>> => {
    const url = type === 'emergency' 
      ? API_PATH_GUIDE.emergencyCases.payments.reject(id)
      : API_PATH_GUIDE.subscriptions.payments.reject(id);
    const response = await api.post<ApiResponse<null>>(url, { reason });
    return response.data;
  },

  getDeliveryAreas: async (): Promise<DeliveryArea[]> => {
    const response = await api.get<ApiResponse<DeliveryArea[]>>(API_PATH_GUIDE.deliveryAreas.admin);
    return response.data;
  },
};
