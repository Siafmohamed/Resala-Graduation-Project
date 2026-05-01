/**
 * @file useUpdateEmergencyCase.ts
 * @description Mutation hook for updating emergency cases.
 * Moved from: src/features/SponsorshipCases/hooks/useUpdateEmergencyCase.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyCasesService } from '../services/emergencyCases.service';
import { emergencyQueryKeys } from './useEmergencyCases';
import type { EmergencyCase } from '../types/emergencyCase.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage, getApiErrorStatus } from '@/api/errorUtils';

export function useUpdateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      emergencyCasesService.update(id, payload),
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<EmergencyCase[]>(
        emergencyQueryKeys.lists(),
        (old = []) => old.map((item) => (item.id === id ? updated : item)),
      );
      queryClient.setQueryData(emergencyQueryKeys.detail(id), updated);
      toast.success('تم تحديث الحالة الحرجة بنجاح');
    },
    onError: (error: unknown) => {
      const status = getApiErrorStatus(error);
      if (status === 400) {
        toast.error('بيانات التحديث غير صحيحة (400). يرجى مراجعة الحقول المطلوبة.');
        return;
      }
      if (status === 404) {
        toast.error('الحالة الحرجة غير موجودة (404).');
        return;
      }
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث الحالة الحرجة');
      toast.error(message);
    },
  });
}

export default useUpdateEmergencyCase;
