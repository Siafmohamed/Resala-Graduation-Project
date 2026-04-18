import { useQuery } from '@tanstack/react-query';
import { sponsorshipCasesService } from '../services/sponsorshipCasesService';
import type { SponsorshipCase } from '../types/sponsorshipCases.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useSponsorshipCases(): {
  data: SponsorshipCase[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sponsorship-cases'],
    queryFn: () => sponsorshipCasesService.getAll(),
    staleTime: CACHE_DURATIONS.REAL_TIME,
  });

  return { data, isLoading, isError };
}

