import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { feedbackService, type FeedbackListResponse, FeedbackStatus, FeedbackType } from '../services/feedbackService';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';
import { toast } from 'react-toastify';

export const feedbackQueryKeys = {
  all: ['feedback'] as const,
  lists: () => [...feedbackQueryKeys.all, 'list'] as const,
  list: (params: any) => [...feedbackQueryKeys.lists(), params] as const,
  details: () => [...feedbackQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...feedbackQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch feedback/complaints with pagination and filters
 */
export function useFeedbackList(params: {
  type?: FeedbackType;
  status?: FeedbackStatus;
  pageNumber: number;
  pageSize: number;
}) {
  const isInitialized = useIsInitialized();

  return useQuery({
    queryKey: feedbackQueryKeys.list(params),
    queryFn: () => feedbackService.getAll(params),
    staleTime: CACHE_DURATIONS.MEDIUM,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isInitialized === true,
  });
}

/**
 * Hook to fetch a single feedback/complaint by ID
 */
export function useFeedbackDetail(id: number) {
  return useQuery({
    queryKey: feedbackQueryKeys.detail(id),
    queryFn: () => feedbackService.getById(id),
    enabled: !!id,
    staleTime: CACHE_DURATIONS.MEDIUM,
  });
}

/**
 * Hook to update feedback status
 */
export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: FeedbackStatus }) =>
      feedbackService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.all });
      toast.success('تم تحديث الحالة بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث الحالة');
    },
  });
}
