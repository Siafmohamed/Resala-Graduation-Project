import { useQuery } from '@tanstack/react-query';
import { representativeOrdersService } from '../services/representativeOrdersService';
import type { RepresentativeOrder } from '../types/representativeOrders.types';

export function useRepresentativeOrders(): {
  data: RepresentativeOrder[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['representative-orders'],
    queryFn: () => representativeOrdersService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

