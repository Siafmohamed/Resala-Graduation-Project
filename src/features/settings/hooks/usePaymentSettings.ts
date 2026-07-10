import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentSettingsService } from '../services/paymentSettingsService';
import { UpsertPaymentNumberDTO } from '../types/paymentSettings.types';
import { toast } from 'react-toastify';

export const usePaymentNumbers = () => {
  return useQuery({
    queryKey: ['payment-numbers'],
    queryFn: () => paymentSettingsService.getPaymentNumbers(),
  });
};

export const useUpsertPaymentNumber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: UpsertPaymentNumberDTO) => 
      paymentSettingsService.upsertPaymentNumber(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-numbers'] });
      toast.success('تم تحديث رقم الدفع بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث رقم الدفع');
    },
  });
};
