import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import type { EmergencyPayment } from '../types/emergencyPayments.types';
import { toast } from 'react-toastify';

export const useVerifyEmergencyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) => emergencyPaymentsService.verifyEmergencyPayment(paymentId),
    onSuccess: (response, paymentId) => {
      if (response.succeeded) {
        toast.success('تم تأكيد الدفعة بنجاح');
        queryClient.setQueriesData(
          { queryKey: ['emergencyPayments'] },
          (old: EmergencyPayment[] | undefined) =>
            Array.isArray(old) ? old.filter((payment) => payment.id !== paymentId) : old,
        );
      } else {
        toast.error(response.message || 'فشل في تأكيد الدفعة');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'حدث خطأ أثناء تأكيد الدفعة');
    },
  });
};
