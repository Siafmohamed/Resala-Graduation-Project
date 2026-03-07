import { useQuery } from '@tanstack/react-query';
import { donorService } from '../services/donorService';
import type { DonorStatsData } from '../types/donor.types';

export function useDonorStats(): {
  stats: DonorStatsData | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: donorService.getStats,
    staleTime: 60_000,
  });

  return { stats: data, isLoading };
}
