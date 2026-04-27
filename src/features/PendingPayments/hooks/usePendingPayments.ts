import { useQuery } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PaymentMethod } from '../types/pendingPayments.types';

export const usePendingPayments = (method: PaymentMethod) => {
  return useQuery({
    queryKey: ['pendingPayments', method],
    queryFn: () => pendingPaymentsService.getPendingPayments(method),
    retry: 1,
  });
};
