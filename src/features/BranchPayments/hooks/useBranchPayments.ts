import { useQuery } from '@tanstack/react-query';
import { branchPaymentsService } from '../services/branchPaymentsService';
import type { BranchPayment } from '../types/branchPayments.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useBranchPayments(): {
  data: BranchPayment[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['branch-payments'],
    queryFn: () => branchPaymentsService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

