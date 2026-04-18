import { useQuery } from '@tanstack/react-query';
import { representativesService } from '../services/representativesService';
import type { Representative } from '../types/representatives.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useRepresentatives(): {
  data: Representative[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['representatives'],
    queryFn: () => representativesService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

