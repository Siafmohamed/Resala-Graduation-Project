import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deliveryAreasApi, type CreateDeliveryAreaPayload, type UpdateDeliveryAreaPayload } from '@/api/services/deliveryAreasService';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const deliveryAreaQueryKeys = {
  all: ['delivery-areas'] as const,
  lists: () => [...deliveryAreaQueryKeys.all, 'list'] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Hook to fetch all delivery areas (Admin)
 */
export function useDeliveryAreas() {
  return useQuery({
    queryKey: deliveryAreaQueryKeys.lists(),
    queryFn: () => deliveryAreasApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Hook to create a new delivery area
 */
export function useCreateDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeliveryAreaPayload) => deliveryAreasApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryAreaQueryKeys.lists() });
      toast.success('تم إضافة منطقة التوصيل بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إضافة منطقة التوصيل');
      toast.error(message);
    },
  });
}

/**
 * Hook to update a delivery area
 */
export function useUpdateDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDeliveryAreaPayload }) =>
      deliveryAreasApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryAreaQueryKeys.lists() });
      toast.success('تم تحديث منطقة التوصيل بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث منطقة التوصيل');
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a delivery area
 */
export function useDeleteDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deliveryAreasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryAreaQueryKeys.lists() });
      toast.success('تم حذف منطقة التوصيل بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف منطقة التوصيل');
      toast.error(message);
    },
  });
}
