import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { urgentCasesService } from '../services/urgentCasesService';
import type { CreateUrgentCasePayload, UpdateUrgentCasePayload, UrgentCase } from '../services/urgentCasesService';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';
import { CACHE_DURATIONS, QUERY_GC_TIME } from '@/shared/constants/cacheDurations';

export const urgentCaseQueryKeys = {
  all: ['urgent-cases'] as const,
  lists: () => [...urgentCaseQueryKeys.all, 'list'] as const,
  details: () => [...urgentCaseQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...urgentCaseQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all urgent cases
 */
export function useUrgentCases() {
  const isInitialized = useIsInitialized();
  
  const query = useQuery({
    queryKey: urgentCaseQueryKeys.lists(),
    queryFn: async () => {
      const data = await urgentCasesService.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: CACHE_DURATIONS.MEDIUM, // 1 minute
    gcTime: QUERY_GC_TIME,
    // Critical: Prevent API request before auth initialization completes
    enabled: isInitialized === true,
  });

  // Return enhanced loading state that includes auth initialization
  return {
    ...query,
    isLoading: query.isLoading || isInitialized === false,
  };
}

/**
 * Hook to fetch a single urgent case by ID
 */
export function useUrgentCase(id: number) {
  const queryClient = useQueryClient();
  const isInitialized = useIsInitialized();

  const query = useQuery({
    queryKey: urgentCaseQueryKeys.detail(id),
    queryFn: () => urgentCasesService.getById(id),
    enabled: !!id && isInitialized === true,
    staleTime: CACHE_DURATIONS.SHORT, // 30 seconds
    gcTime: QUERY_GC_TIME,
    initialData: () => {                          
      return queryClient
        .getQueryData<UrgentCase[]>(urgentCaseQueryKeys.lists())
        ?.find((c) => c.id === id);
    },
  });

  return {
    ...query,
    isLoading: query.isLoading || isInitialized === false,
  };
}
/**
 * Hook to create a new urgent case
 */
export function useCreateUrgentCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUrgentCasePayload) => urgentCasesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.lists() });
      toast.success('تم إنشاء الحالة العاجلة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء الحالة العاجلة');
      toast.error(message);
    },
  });
}

/**
 * Hook to update an urgent case
 */
export function useUpdateUrgentCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUrgentCasePayload }) =>
      urgentCasesService.update(id, payload),
    
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: urgentCaseQueryKeys.lists(), exact: false });
      await queryClient.cancelQueries({ queryKey: urgentCaseQueryKeys.detail(id) });

      const previousList = queryClient.getQueryData<UrgentCase[]>(urgentCaseQueryKeys.lists());
      const previousCase = queryClient.getQueryData<UrgentCase>(urgentCaseQueryKeys.detail(id));

      // ✅ Optimistic update helper
      const applyPatch = (item: UrgentCase): UrgentCase => {
        const updated = { ...item };
        if (payload.title !== undefined) updated.title = payload.title;
        if (payload.description !== undefined) updated.description = payload.description;
        if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
        if (payload.collectedAmount !== undefined) updated.collectedAmount = payload.collectedAmount;
        // ✅ FIXED: Only update urgencyLevel, no isCritical (doesn't exist in UrgentCase type)
        if (payload.urgencyLevel !== undefined) {
          updated.urgencyLevel = payload.urgencyLevel;
        }
        if (payload.isActive !== undefined) updated.isActive = payload.isActive;
        return updated;
      };

      // ✅ Update list cache
      if (previousList) {
        queryClient.setQueryData(
          urgentCaseQueryKeys.lists(),
          (old: UrgentCase[] | undefined) =>
            old?.map((item) => (item.id === id ? applyPatch(item) : item))
        );
      }

      // ✅ Update detail cache
      queryClient.setQueryData<UrgentCase | undefined>(
        urgentCaseQueryKeys.detail(id),
        (old) => (old ? applyPatch(old) : old)
      );

      return { previousList, previousCase };
    },

    onError: (error: unknown, { id }, context) => {
      // Rollback both caches on error
      if (context?.previousList) {
        queryClient.setQueryData(urgentCaseQueryKeys.lists(), context.previousList);
      }
      if (context?.previousCase) {
        queryClient.setQueryData(urgentCaseQueryKeys.detail(id), context.previousCase);
      }
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث الحالة العاجلة');
      toast.error(message);
    },

    onSuccess: (data, { id }) => {
      // ✅ Set real server data to ensure accuracy
      if (data) {
        queryClient.setQueryData(urgentCaseQueryKeys.detail(id), data);
      }
      // ✅ Invalidate to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.detail(id) });
      toast.success('تم تحديث الحالة العاجلة بنجاح');
    },
  });
}

/**
 * Hook to delete an urgent case
 */
export function useDeleteUrgentCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => urgentCasesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.lists() });
      toast.success('تم حذف الحالة العاجلة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف الحالة العاجلة');
      toast.error(message);
    },
  });
}
