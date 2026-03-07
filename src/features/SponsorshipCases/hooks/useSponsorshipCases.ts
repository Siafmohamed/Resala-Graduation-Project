import { useQuery } from '@tanstack/react-query';
import { sponsorshipCasesService } from '../services/sponsorshipCasesService';
import type { SponsorshipCase } from '../types/sponsorshipCases.types';

export function useSponsorshipCases(): {
  data: SponsorshipCase[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sponsorship-cases'],
    queryFn: () => sponsorshipCasesService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

