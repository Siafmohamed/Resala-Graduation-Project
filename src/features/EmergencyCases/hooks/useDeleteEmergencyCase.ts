/**
 * @file useDeleteEmergencyCase.ts
 * @description Mutation hook for deleting emergency cases.
 * Moved from: src/features/SponsorshipCases/hooks/useDeleteEmergencyCase.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyCasesService } from '../services/emergencyCases.service';
import { emergencyQueryKeys } from './useEmergencyCases';
import type { EmergencyCase } from '../types/emergencyCase.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

export function useDeleteEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emergencyCasesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<EmergencyCase[]>(
        emergencyQueryKeys.lists(),
        (old = []) => old.filter((item) => item.id !== id),
      );
      queryClient.removeQueries({ queryKey: emergencyQueryKeys.detail(id), exact: true });
      toast.success('تم حذف الحالة الحرجة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف الحالة الحرجة');
      toast.error(message);
    },
  });
}

export default useDeleteEmergencyCase;
