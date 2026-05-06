import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import type { EmergencyPayment } from '../types/emergencyPayments.types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useRejectEmergencyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number; reason: string }) =>
      emergencyPaymentsService.rejectEmergencyPayment(paymentId, reason),
    onSuccess: (response, { paymentId }) => {
      if (response.succeeded) {
        toast.success('تمت العملية بنجاح');
        queryClient.setQueriesData(
          { queryKey: ['emergencyPayments'] },
          (old: EmergencyPayment[] | undefined) =>
            Array.isArray(old) ? old.filter((payment) => payment.id !== paymentId) : old,
        );
      } else {
        toast.error('عذراً، هناك مشكلة في رفض الدفعة المعلقة الخاصة بحالات الطوارئ');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(`عذراً، هناك مشكلة في رفض الدفعة المعلقة الخاصة بحالات الطوارئ: ${error?.response?.data?.message || error.message}`);
    },
  });
};
