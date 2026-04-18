import { useQuery } from '@tanstack/react-query';
import { donorService } from '../services/donorService';
import type { DonorStatsData } from '../types/donor.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useDonorStats(): {
  stats: DonorStatsData | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: donorService.getStats,
    staleTime: CACHE_DURATIONS.MEDIUM,
  });

  return { stats: data, isLoading };
}
