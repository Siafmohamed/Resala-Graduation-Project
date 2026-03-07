import { useQuery } from '@tanstack/react-query';
import { receiptVerificationService } from '../services/receiptVerificationService';
import type { Receipt } from '../types/receiptVerification.types';

export function useReceipts(): {
  data: Receipt[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['receipt-verification'],
    queryFn: () => receiptVerificationService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

