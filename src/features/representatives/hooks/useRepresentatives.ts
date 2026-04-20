import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { representativesService } from '../services/representativesService';
import type { Representative } from '../types/representatives.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useRepresentatives(): {
  data: Representative[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['representatives'],
    queryFn: () => representativesService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

