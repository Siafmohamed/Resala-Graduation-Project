import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard.types';

export function useDashboardData(): {
  data: DashboardData | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 60_000,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

