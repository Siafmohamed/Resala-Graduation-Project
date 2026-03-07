import { useQuery } from '@tanstack/react-query';
import { representativesService } from '../services/representativesService';
import type { Representative } from '../types/representatives.types';

export function useRepresentatives(): {
  data: Representative[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['representatives'],
    queryFn: () => representativesService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

