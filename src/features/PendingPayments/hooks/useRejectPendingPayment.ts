import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';
import { toast } from 'react-toastify';

interface RejectPaymentPayload {
  paymentId: number;
  reason: string;
}

export const useRejectPendingPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: RejectPaymentPayload) =>
      pendingPaymentsService.rejectPayment(paymentId, reason),
    onSuccess: (_, { paymentId }) => {
      queryClient.setQueriesData(
        { queryKey: ['pendingPayments'] },
        (old: PendingPayment[] | undefined) =>
          Array.isArray(old) ? old.filter((payment) => payment.id !== paymentId) : old,
      );
      toast.success('تم رفض الدفعة بنجاح.');
    },
    onError: (error) => {
      toast.error(`فشل رفض الدفعة: ${error.message}`);
    },
  });
};
