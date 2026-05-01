import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';
import { toast } from 'react-toastify';

export const useVerifyPendingPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => pendingPaymentsService.verifyPayment(paymentId),
    onSuccess: (_, paymentId) => {
      queryClient.setQueriesData(
        { queryKey: ['pendingPayments'] },
        (old: PendingPayment[] | undefined) =>
          Array.isArray(old) ? old.filter((payment) => payment.id !== paymentId) : old,
      );
      toast.success('تم تأكيد الدفعة بنجاح.');
    },
    onError: (error) => {
      toast.error(`فشل تأكيد الدفعة: ${error.message}`);
    },
  });
};
