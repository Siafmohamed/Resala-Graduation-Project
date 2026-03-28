import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sponsorshipApi, type CreateSponsorshipPayload, type UpdateSponsorshipPayload, type SponsorshipProgram } from '../services/sponsorship.service';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const sponsorshipQueryKeys = {
  all: ['sponsorships'] as const,
  lists: () => [...sponsorshipQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...sponsorshipQueryKeys.lists(), { filters }] as const,
  details: () => [...sponsorshipQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...sponsorshipQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all sponsorship programs
 */
export function useSponsorships(filters?: any) {
  return useQuery({
    queryKey: sponsorshipQueryKeys.list(filters),
    queryFn: () => sponsorshipApi.getAll(),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single sponsorship program by ID
 */
export function useSponsorship(id: number) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: sponsorshipQueryKeys.detail(id),
    queryFn: () => sponsorshipApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<SponsorshipProgram[]>(sponsorshipQueryKeys.lists())
        ?.find((s) => s.id === id);
    },
  });
}

/**
 * Hook to create a new sponsorship program
 */
export function useCreateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSponsorshipPayload) => sponsorshipApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.lists() });
      toast.success('تم إنشاء برنامج الكفالة بنجاح');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || error.message || 'حدث خطأ أثناء إنشاء برنامج الكفالة';
      toast.error(message);
    },
  });
}

/**
 * Hook to update a sponsorship program
 */
export function useUpdateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSponsorshipPayload }) =>
      sponsorshipApi.update(id, payload),
    
    // OPTIMISTIC UPDATE
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: sponsorshipQueryKeys.detail(id) });
      const previousSponsorship = queryClient.getQueryData(sponsorshipQueryKeys.detail(id));
      
      queryClient.setQueryData(sponsorshipQueryKeys.detail(id), (old: any) => ({
        ...old,
        ...payload,
      }));

      return { previousSponsorship };
    },

    onError: (error: AxiosError<{ message?: string }>, { id }, context) => {
      if (context?.previousSponsorship) {
        queryClient.setQueryData(sponsorshipQueryKeys.detail(id), context.previousSponsorship);
      }
      const message = error.response?.data?.message || error.message || 'حدث خطأ أثناء تحديث برنامج الكفالة';
      toast.error(message);
    },

    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.detail(data.id) });
      }
    },

    onSuccess: () => {
      toast.success('تم تحديث برنامج الكفالة بنجاح');
    },
  });
}

/**
 * Hook to delete a sponsorship program
 */
export function useDeleteSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sponsorshipApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.lists() });
      toast.success('تم حذف برنامج الكفالة بنجاح');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || error.message || 'حدث خطأ أثناء حذف برنامج الكفالة';
      toast.error(message);
    },
  });
}
