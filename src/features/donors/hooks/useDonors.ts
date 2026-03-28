import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { donorService } from '../services/donorService';
import { useDonorStore } from '../store/donorSlice';
import type { DonorsListResponse, DonorFormData } from '../types/donor.types';
import { toast } from 'react-toastify';

// ... existing donorQueryKeys ...

export function useCreateDonorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DonorFormData) => donorService.createDonor(data),
    onSuccess: () => {
      // Invalidate the donors list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.lists() });
      toast.success('تم إضافة المتبرع بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'فشل إضافة المتبرع');
    },
  });
}

export function useUpdateDonorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DonorFormData> }) =>
      donorService.updateDonor(id, data),
    
    // OPTIMISTIC UPDATE
    onMutate: async (newDonor) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: donorQueryKeys.detail(newDonor.id) });

      // Snapshot the previous value
      const previousDonor = queryClient.getQueryData(donorQueryKeys.detail(newDonor.id));

      // Optimistically update to the new value
      queryClient.setQueryData(donorQueryKeys.detail(newDonor.id), (old: any) => ({
        ...old,
        ...newDonor.data,
      }));

      return { previousDonor };
    },
    
    onError: (_err, newDonor, context) => {
      // Rollback to the previous value if mutation fails
      if (context?.previousDonor) {
        queryClient.setQueryData(donorQueryKeys.detail(newDonor.id), context.previousDonor);
      }
      toast.error('فشل تحديث بيانات المتبرع');
    },
    
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the correct server state
      if (data) {
        queryClient.invalidateQueries({ queryKey: donorQueryKeys.detail(data.id) });
        queryClient.invalidateQueries({ queryKey: donorQueryKeys.lists() });
      }
    },
    onSuccess: () => {
      toast.success('تم تحديث بيانات المتبرع بنجاح');
    }
  });
}

export const donorQueryKeys = {
  all: ['donors'] as const,
  lists: () => [...donorQueryKeys.all, 'list'] as const,
  list: (filters: any, pagination: any, sort: any) => 
    [...donorQueryKeys.lists(), { filters, pagination, sort }] as const,
  details: () => [...donorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...donorQueryKeys.details(), id] as const,
};

export function useDonors() {
  const queryClient = useQueryClient();
  const filters = useDonorStore((s) => s.filters);
  const pagination = useDonorStore((s) => s.pagination);
  const sort = useDonorStore((s) => s.sort);
  
  const debouncedSearch = useDebounce(filters.search, 400);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  const query = useQuery({
    queryKey: donorQueryKeys.list(effectiveFilters, pagination, sort),
    queryFn: () => donorService.getDonors(effectiveFilters, pagination, sort),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new (smoother transitions)
  });

  // Pre-fetch next page
  useEffect(() => {
    const totalPages = query.data ? Math.ceil(query.data.total / pagination.pageSize) : 0;
    if (pagination.page < totalPages) {
      const nextPage = pagination.page + 1;
      queryClient.prefetchQuery({
        queryKey: donorQueryKeys.list(effectiveFilters, { ...pagination, page: nextPage }, sort),
        queryFn: () => donorService.getDonors(effectiveFilters, { ...pagination, page: nextPage }, sort),
      });
    }
  }, [query.data, pagination, effectiveFilters, sort, queryClient]);

  return query;
}

export function useDonor(id: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: donorQueryKeys.detail(id),
    queryFn: () => donorService.getDonorById(id),
    enabled: !!id,
    initialData: () => {
      // Try to find the donor in any of the cached lists (which include filters/pagination in their keys)
      const cachedLists = queryClient.getQueriesData<DonorsListResponse>({ queryKey: donorQueryKeys.lists() });
      for (const [, data] of cachedLists) {
        if (data && data.donors) {
          const donor = data.donors.find((d) => d.id === id);
          if (donor) return donor;
        }
      }
      return undefined;
    },
  });
}
