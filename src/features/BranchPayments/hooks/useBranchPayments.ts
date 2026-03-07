import { useQuery } from '@tanstack/react-query';
import { branchPaymentsService } from '../services/branchPaymentsService';
import type { BranchPayment } from '../types/branchPayments.types';

export function useBranchPayments(): {
  data: BranchPayment[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['branch-payments'],
    queryFn: () => branchPaymentsService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

