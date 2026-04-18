import { useQuery } from '@tanstack/react-query';
import { receiptVerificationService } from '../services/receiptVerificationService';
import type { Receipt } from '../types/receiptVerification.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useReceipts(): {
  data: Receipt[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['receipt-verification'],
    queryFn: () => receiptVerificationService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

