import { useQuery } from '@tanstack/react-query';
import { adminReportsService } from '../services/adminReportsService';
import { useIsInitialized } from '@/features/authentication';
import type { AdminReportsOverview } from '../types/adminReports.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useAdminReports(): {
  data: AdminReportsOverview | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-reports-overview'],
    queryFn: () => adminReportsService.getOverview(),
    staleTime: CACHE_DURATIONS.MEDIUM,
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

