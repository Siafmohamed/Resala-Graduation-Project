import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { successStoriesService, type SuccessStory, type SuccessStoriesResponse } from '../services/successStoriesService';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';
import { toast } from 'react-toastify';

export const successStoriesQueryKeys = {
  all: ['success-stories'] as const,
  lists: () => [...successStoriesQueryKeys.all, 'list'] as const,
  details: () => [...successStoriesQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...successStoriesQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all success stories
 */
export function useSuccessStories() {
  const isInitialized = useIsInitialized();

  return useQuery({
    queryKey: successStoriesQueryKeys.lists(),
    queryFn: () => successStoriesService.getAll(),
    staleTime: CACHE_DURATIONS.MEDIUM,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isInitialized === true,
  });
}

/**
 * Hook to fetch a single success story by ID
 */
export function useSuccessStory(id: number) {
  return useQuery({
    queryKey: successStoriesQueryKeys.detail(id),
    queryFn: () => successStoriesService.getById(id),
    enabled: !!id,
    staleTime: CACHE_DURATIONS.MEDIUM,
  });
}

/**
 * Hook to create a new success story
 */
export function useCreateSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => successStoriesService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: successStoriesQueryKeys.all });
      toast.success('تم إضافة قصة النجاح بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء إضافة قصة النجاح');
    },
  });
}

/**
 * Hook to delete a success story
 */
export function useDeleteSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => successStoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: successStoriesQueryKeys.all });
      toast.success('تم حذف قصة النجاح بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف قصة النجاح');
    },
  });
}

/**
 * Hook to update a success story
 */
export function useUpdateSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      successStoriesService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: successStoriesQueryKeys.all });
      toast.success('تم تحديث قصة النجاح بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث قصة النجاح');
    },
  });
}
