import { useQuery } from '@tanstack/react-query';
import { representativeOrdersService } from '../services/representativeOrdersService';
import type { RepresentativeOrder } from '../types/representativeOrders.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useRepresentativeOrders(): {
  data: RepresentativeOrder[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['representative-orders'],
    queryFn: () => representativeOrdersService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

