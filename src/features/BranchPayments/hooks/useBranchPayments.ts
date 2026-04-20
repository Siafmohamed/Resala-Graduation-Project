import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { branchPaymentsService } from '../services/branchPaymentsService';
import type { BranchPayment } from '../types/branchPayments.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useBranchPayments(): {
  data: BranchPayment[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['branch-payments'],
    queryFn: () => branchPaymentsService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

