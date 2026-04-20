import { useQuery } from '@tanstack/react-query';
import { formsDashboardService } from '../services/formsDashboardService';
import { useIsInitialized } from '@/features/authentication';
import type { FormStats } from '../types/formsDashboard.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useFormStats(): {
  data: FormStats[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['forms-dashboard'],
    queryFn: () => formsDashboardService.getStats(),
    staleTime: CACHE_DURATIONS.SHORT,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

