import { useQuery } from '@tanstack/react-query';
import { urgentCasesService } from '../services/urgentCasesService';
import type { UrgentCase } from '../types/urgentCases.types';

export function useUrgentCases(): {
  data: UrgentCase[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['urgent-cases'],
    queryFn: () => urgentCasesService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

