import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { useIsInitialized } from '@/features/authentication';
import type { DashboardData } from '../types/dashboard.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useDashboardData(): {
  data: DashboardData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: CACHE_DURATIONS.MEDIUM,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

