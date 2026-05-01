import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import type { EmergencyPayment } from '../types/emergencyPayments.types';

export const useEmergencyPaymentDetails = (paymentId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['emergencyPaymentDetails', paymentId],
    queryFn: async () => {
      const list = await emergencyPaymentsService.getEmergencyPayments('All');
      const found = list.find((payment) => payment.id === paymentId);
      if (!found) {
        throw new Error('Emergency payment not found');
      }
      return found;
    },
    enabled: !!paymentId,
    initialData: () => {
      const cachedLists =
        queryClient.getQueriesData<EmergencyPayment[]>({ queryKey: ['emergencyPayments'] });
      for (const [, list] of cachedLists) {
        if (!Array.isArray(list)) continue;
        const found = list.find((payment) => payment.id === paymentId);
        if (found) return found;
      }
      return undefined;
    },
  });
};
