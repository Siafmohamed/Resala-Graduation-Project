import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import type { EmergencyPaymentMethod } from '../types/emergencyPayments.types';

export const useEmergencyPayments = (method: EmergencyPaymentMethod) => {
  return useQuery({
    queryKey: ['emergencyPayments', method],
    queryFn: async () => {
      const data = await emergencyPaymentsService.getEmergencyPayments(method);
      // Sort by deliveryAreaName alphabetically
      return [...data].sort((a, b) => 
        (a.deliveryAreaName || '').localeCompare(b.deliveryAreaName || '', 'ar')
      );
    },
    placeholderData: keepPreviousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
