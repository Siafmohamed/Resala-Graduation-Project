import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsService } from '../services/adminAnalyticsService';
import type { AdminAnalyticsData } from '../types/adminAnalytics.types';

export function useAdminAnalytics(): {
  data: AdminAnalyticsData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminAnalyticsService.getAnalytics(),
    staleTime: 60_000,
  });

  return { data, isLoading, isError };
}

