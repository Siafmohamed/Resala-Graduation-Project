import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { adminAnalyticsService } from '../services/adminAnalyticsService';
import type { AdminAnalyticsData } from '../types/adminAnalytics.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useAdminAnalytics(): {
  data: AdminAnalyticsData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminAnalyticsService.getAnalytics(),
    staleTime: CACHE_DURATIONS.MEDIUM,
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

