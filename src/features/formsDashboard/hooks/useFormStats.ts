import { useQuery } from '@tanstack/react-query';
import { formsDashboardService } from '../services/formsDashboardService';
import type { FormStats } from '../types/formsDashboard.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useFormStats(): {
  data: FormStats[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['forms-dashboard'],
    queryFn: () => formsDashboardService.getStats(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

