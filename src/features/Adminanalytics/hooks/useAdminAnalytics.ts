import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsService } from '../services/adminAnalyticsService';
import type { AdminAnalyticsData } from '../types/adminAnalytics.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useAdminAnalytics(): {
  data: AdminAnalyticsData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminAnalyticsService.getAnalytics(),
    staleTime: CACHE_DURATIONS.MEDIUM,
  });

  return { data, isLoading, isError };
}

