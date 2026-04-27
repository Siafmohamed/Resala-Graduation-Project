import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionSlotsApi, type CreateSlotPayload, type UpdateSlotPayload } from '@/api/services/subscriptionSlotsService';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const slotQueryKeys = {
  all: ['subscription-slots'] as const,
  lists: () => [...slotQueryKeys.all, 'list'] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Hook to fetch all subscription slots (Admin)
 */
export function useSubscriptionSlots() {
  return useQuery({
    queryKey: slotQueryKeys.lists(),
    queryFn: () => subscriptionSlotsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Hook to create a new subscription slot
 */
export function useCreateSubscriptionSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSlotPayload) => subscriptionSlotsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slotQueryKeys.lists() });
      toast.success('تم إنشاء الموعد بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء الموعد');
      toast.error(message);
    },
  });
}

/**
 * Hook to update a subscription slot
 */
export function useUpdateSubscriptionSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSlotPayload }) =>
      subscriptionSlotsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slotQueryKeys.lists() });
      toast.success('تم تحديث الموعد بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث الموعد');
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a subscription slot
 */
export function useDeleteSubscriptionSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionSlotsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slotQueryKeys.lists() });
      toast.success('تم حذف الموعد بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف الموعد');
      toast.error(message);
    },
  });
}
