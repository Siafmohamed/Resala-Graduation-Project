import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import { toast } from 'react-toastify';

export const useRejectEmergencyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number; reason: string }) =>
      emergencyPaymentsService.rejectEmergencyPayment(paymentId, reason),
    onSuccess: (response) => {
      if (response.succeeded) {
        toast.success('تم رفض الدفعة بنجاح');
        queryClient.invalidateQueries({ queryKey: ['emergencyPayments'] });
      } else {
        toast.error(response.message || 'فشل في رفض الدفعة');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'حدث خطأ أثناء رفض الدفعة');
    },
  });
};
