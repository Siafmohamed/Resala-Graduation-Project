/**
 * @file useCreateEmergencyCase.ts
 * @description Mutation hook for creating emergency cases.
 * Moved from: src/features/SponsorshipCases/hooks/useCreateEmergencyCase.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyCasesService } from '../services/emergencyCases.service';
import { emergencyQueryKeys } from './useEmergencyCases';
import type { EmergencyCase } from '../types/emergencyCase.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

export function useCreateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => emergencyCasesService.create(data),
    onSuccess: (created) => {
      queryClient.setQueryData<EmergencyCase[]>(
        emergencyQueryKeys.lists(),
        (old = []) => [created, ...old],
      );
      queryClient.setQueryData(emergencyQueryKeys.detail(created.id), created);
      toast.success('تم إنشاء الحالة الحرجة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء الحالة الحرجة');
      toast.error(message);
    },
  });
}

export default useCreateEmergencyCase;
