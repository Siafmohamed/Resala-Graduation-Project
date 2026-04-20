import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { emergencyCasesApi } from '../services/emergencyCases.service';
import { CreateSponsorshipPayload, UpdateSponsorshipPayload, EmergencyCase } from '../types/sponsorship.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

export const emergencyCaseQueryKeys = {
  all: ['emergencyCases'] as const,
  lists: () => [...emergencyCaseQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...emergencyCaseQueryKeys.lists(), { filters }] as const,
  details: () => [...emergencyCaseQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...emergencyCaseQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all emergency cases
 */
export function useEmergencyCases(filters?: any) {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: emergencyCaseQueryKeys.list(filters),
    queryFn: () => emergencyCasesApi.getAll(),
    placeholderData: (previousData) => previousData,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });
}

/**
 * Hook to fetch a single emergency case by ID
 */
export function useEmergencyCase(id: number) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: emergencyCaseQueryKeys.detail(id),
    queryFn: () => emergencyCasesApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<EmergencyCase[]>(emergencyCaseQueryKeys.lists())
        ?.find((s) => s.id === id);
    },
  });
}

/**
 * Hook to create a new emergency case
 */
export function useCreateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSponsorshipPayload) => emergencyCasesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emergencyCaseQueryKeys.lists() });
      toast.success('تم إنشاء حالة الطوارئ بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء حالة الطوارئ');
      toast.error(message);
    },
  });
}

/**
 * Hook to update an emergency case
 */
export function useUpdateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSponsorshipPayload }) =>
      emergencyCasesApi.update(id, payload),
    
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: emergencyCaseQueryKeys.detail(id) });
      const previousCase = queryClient.getQueryData(emergencyCaseQueryKeys.detail(id));
      
      queryClient.setQueryData(emergencyCaseQueryKeys.detail(id), (old: any) => ({
        ...old,
        ...payload,
      }));

      return { previousCase };
    },

    onError: (error: unknown, { id }, context) => {
      if (context?.previousCase) {
        queryClient.setQueryData(emergencyCaseQueryKeys.detail(id), context.previousCase);
      }
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث حالة الطوارئ');
      toast.error(message);
    },

    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: emergencyCaseQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: emergencyCaseQueryKeys.detail(data.id) });
      }
    },

    onSuccess: () => {
      toast.success('تم تحديث حالة الطوارئ بنجاح');
    },
  });
}

/**
 * Hook to delete an emergency case
 */
export function useDeleteEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emergencyCasesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emergencyCaseQueryKeys.lists() });
      toast.success('تم حذف حالة الطوارئ بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف حالة الطوارئ');
      toast.error(message);
    },
  });
}
