import axiosInstance from '@/api/axiosInstance';
import { API_PATH_GUIDE } from '@/shared/api/apiPathGuide';
import type { EmergencyPayment, EmergencyPaymentMethod, ApiResponse, DeliveryArea } from '../types/emergencyPayments.types';

export const emergencyPaymentsService = {
  getEmergencyPayments: async (method: EmergencyPaymentMethod): Promise<EmergencyPayment[]> => {
    let url = API_PATH_GUIDE.emergencyCases.payments.pending;
    if (method !== 'All') {
      url = API_PATH_GUIDE.emergencyCases.payments.pendingByMethod(method.toLowerCase().replace(' ', ''));
    }
    const response = await axiosInstance.get<ApiResponse<EmergencyPayment[]>>(url);
    return response.data;
  },

  verifyEmergencyPayment: async (paymentId: number): Promise<ApiResponse<null>> => {
    const url = API_PATH_GUIDE.emergencyCases.payments.verify(paymentId);
    return axiosInstance.post<ApiResponse<null>>(url);
  },

  rejectEmergencyPayment: async (paymentId: number, reason: string): Promise<ApiResponse<null>> => {
    const url = API_PATH_GUIDE.emergencyCases.payments.reject(paymentId);
    return axiosInstance.post<ApiResponse<null>>(url, { reason });
  },

  getDeliveryAreas: async (): Promise<DeliveryArea[]> => {
    const url = API_PATH_GUIDE.deliveryAreas.admin;
    const response = await axiosInstance.get<ApiResponse<DeliveryArea[]>>(url);
    return response.data;
  },
};
