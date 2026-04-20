import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { inKindDonationService } from '../services/donationService';
import type { 
  CreateInKindDonationPayload, 
  UpdateInKindDonationPayload 
} from '../types/donation.types';
import { toast } from 'react-toastify';

export const inKindDonationQueryKeys = {
  all: ['inKindDonations'] as const,
  lists: () => [...inKindDonationQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...inKindDonationQueryKeys.lists(), { filters }] as const,
  details: () => [...inKindDonationQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inKindDonationQueryKeys.details(), id] as const,
  byDonor: (donorId: string) => [...inKindDonationQueryKeys.all, 'byDonor', donorId] as const,
};

/** Hook to fetch all in-kind donations */
export function useInKindDonations() {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.lists(),
    queryFn: () => inKindDonationService.getAll(),
    select: (data) => data.data,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });
}

/** Hook to fetch a single in-kind donation by ID */
export function useInKindDonation(id: string) {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.detail(id),
    queryFn: () => inKindDonationService.getById(id),
    enabled: !!id && isInitialized === true,
    select: (data) => data.data,
  });
}

/** Hook to fetch in-kind donations by donor ID */
export function useInKindDonationsByDonor(donorId: string) {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.byDonor(donorId),
    queryFn: () => inKindDonationService.getByDonorId(donorId),
    enabled: !!donorId && isInitialized === true,
    select: (data) => data.data,
  });
}

/** Hook to create a new in-kind donation */
export function useCreateInKindDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInKindDonationPayload) => inKindDonationService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      toast.success('تم تسجيل التبرع العيني بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء تسجيل التبرع');
    },
  });
}

/** Hook to update an existing in-kind donation */
export function useUpdateInKindDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInKindDonationPayload }) =>
      inKindDonationService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inKindDonationQueryKeys.detail(data.data.id) });
      toast.success('تم تحديث بيانات التبرع بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء تحديث بيانات التبرع');
    },
  });
}

/** Hook to delete an in-kind donation (Admin only) */
export function useDeleteInKindDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inKindDonationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      toast.success('تم حذف التبرع العيني بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء حذف التبرع');
    },
  });
}
