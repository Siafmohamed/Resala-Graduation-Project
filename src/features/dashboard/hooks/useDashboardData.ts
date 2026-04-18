import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useDashboardData(): {
  data: DashboardData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: CACHE_DURATIONS.MEDIUM,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

