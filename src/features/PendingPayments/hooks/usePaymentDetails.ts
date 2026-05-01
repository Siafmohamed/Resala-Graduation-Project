import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';

export const usePaymentDetails = (paymentId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['paymentDetails', paymentId],
    queryFn: () => pendingPaymentsService.getPaymentDetails(paymentId),
    enabled: !!paymentId, // Only run the query if paymentId is available
    initialData: () => {
      const cachedLists =
        queryClient.getQueriesData<PendingPayment[]>({ queryKey: ['pendingPayments'] });
      for (const [, list] of cachedLists) {
        if (!Array.isArray(list)) continue;
        const found = list.find((payment) => payment.id === paymentId);
        if (found) return found;
      }
      return undefined;
    },
  });
};
