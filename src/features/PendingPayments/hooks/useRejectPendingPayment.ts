import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface RejectPaymentPayload {
  paymentId: number;
  reason: string;
}

export const useRejectPendingPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: RejectPaymentPayload) =>
      pendingPaymentsService.rejectPayment(paymentId, reason),
    onSuccess: (response, { paymentId }) => {
      if (response.succeeded) {
        queryClient.setQueriesData(
          { queryKey: ['pendingPayments'] },
          (old: PendingPayment[] | undefined) =>
            Array.isArray(old) ? old.filter((payment) => payment.id !== paymentId) : old,
        );
        toast.success('تمت العملية بنجاح');
      } else {
        toast.error(response.message || 'عذراً، هناك مشكلة في رفض الدفعة المعلقة الخاصة بالكفالات');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error?.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
      toast.error(`عذراً، هناك مشكلة في رفض الدفعة المعلقة الخاصة بالكفالات: ${message}`);
    },
  });
};
