import api from '@/shared/api/axiosInstance';
import type { PaymentNumber, UpsertPaymentNumberDTO } from '../types/paymentSettings.types';

const unwrapValue = <T>(response: unknown): T => {
  console.log('unwrapValue input:', response);
  
  // Handle axios response structure
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as { data: unknown }).data;
    console.log('unwrapValue found axios data:', data);
    
    if (data && typeof data === 'object' && 'isSuccess' in data && 'value' in data) {
      console.log('unwrapValue returning value:', (data as { value: T }).value);
      return (data as { value: T }).value;
    }
    
    return data as T;
  }
  
  // Handle if already unwrapped
  if (response && typeof response === 'object' && 'isSuccess' in response && 'value' in response) {
    console.log('unwrapValue returning value (already unwrapped):', (response as { value: T }).value);
    return (response as { value: T }).value;
  }
  
  console.log('unwrapValue returning response as-is:', response);
  return response as T;
};

export const paymentSettingsService = {
  /**
   * Get all payment numbers
   * GET /api/v1/admin/payment-numbers
   */
  async getPaymentNumbers(): Promise<PaymentNumber[]> {
    console.log('getPaymentNumbers calling API...');
    const response = await api.get('/v1/admin/payment-numbers');
    console.log('getPaymentNumbers full API response:', response);
    const result = unwrapValue<PaymentNumber[]>(response);
    console.log('getPaymentNumbers returning result:', result);
    
    // Ensure we always return an array, even if API returns null/undefined
    if (!Array.isArray(result)) {
      console.warn('getPaymentNumbers: result not array, returning empty array');
      return [];
    }
    
    return result;
  },

  /**
   * Add or update a payment number (Upsert)
   * POST /api/v1/admin/payment-numbers
   */
  async upsertPaymentNumber(payload: UpsertPaymentNumberDTO): Promise<void> {
    await api.post('/v1/admin/payment-numbers', payload);
  },
};
