import { useQuery } from '@tanstack/react-query';
import { donorService } from '../services/donorService';
import { useIsInitialized } from '@/features/authentication';
import type { DonorStatsData } from '../types/donor.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useDonorStats(): {
  stats: DonorStatsData | undefined;
  isLoading: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: donorService.getStats,
    staleTime: CACHE_DURATIONS.MEDIUM,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });

  return { stats: data, isLoading };
}
