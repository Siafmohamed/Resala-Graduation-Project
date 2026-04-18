import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { urgentCasesService } from '../services/urgentCasesService';
import type { CreateUrgentCasePayload, UpdateUrgentCasePayload, UrgentCase } from '../services/urgentCasesService';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';
import { QUERY_GC_TIME } from '@/shared/constants/cacheDurations';

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
  return useQuery({
    queryKey: urgentCaseQueryKeys.lists(),
    queryFn: async () => {
      const data = await urgentCasesService.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: QUERY_GC_TIME,
  });
}

/**
 * Hook to fetch a single urgent case by ID
 */
export function useUrgentCase(id: number) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: urgentCaseQueryKeys.detail(id),
    queryFn: () => urgentCasesService.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<UrgentCase[]>(urgentCaseQueryKeys.lists())
        ?.find((c) => c.id === id);
    },
  });
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
    
    // OPTIMISTIC UPDATE - Update both list and detail caches
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: urgentCaseQueryKeys.lists(), exact: false });
      await queryClient.cancelQueries({ queryKey: urgentCaseQueryKeys.detail(id) });

      // Snapshot the previous list value
      const previousList = queryClient.getQueryData<UrgentCase[]>(urgentCaseQueryKeys.lists());

      // Snapshot the previous detail value
      const previousCase = queryClient.getQueryData<UrgentCase>(urgentCaseQueryKeys.detail(id));
      
      // Optimistically update the list cache
      if (previousList) {
        queryClient.setQueryData(urgentCaseQueryKeys.lists(), (old: UrgentCase[] | undefined) => {
          if (!old) return old;
          return old.map(item => {
            if (item.id === id) {
              const updated = { ...item };
              if (payload.title !== undefined) updated.title = payload.title;
              if (payload.description !== undefined) updated.description = payload.description;
              if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
              if (payload.collectedAmount !== undefined) updated.collectedAmount = payload.collectedAmount;
              if (payload.isActive !== undefined) updated.isActive = payload.isActive;
              return updated;
            }
            return item;
          });
        });
      }

      // Optimistically update the detail cache
      queryClient.setQueryData<UrgentCase | undefined>(urgentCaseQueryKeys.detail(id), (old) => {
        if (!old) return old;
        const updated = { ...old };
        if (payload.title !== undefined) updated.title = payload.title;
        if (payload.description !== undefined) updated.description = payload.description;
        if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
        if (payload.collectedAmount !== undefined) updated.collectedAmount = payload.collectedAmount;
        if (payload.isActive !== undefined) updated.isActive = payload.isActive;
        return updated;
      });

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.lists() });
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
