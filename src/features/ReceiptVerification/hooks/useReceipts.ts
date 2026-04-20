import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { receiptVerificationService } from '../services/receiptVerificationService';
import type { Receipt } from '../types/receiptVerification.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useReceipts(): {
  data: Receipt[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const isInitialized = useIsInitialized();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['receipt-verification'],
    queryFn: () => receiptVerificationService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
    enabled: isInitialized === true,
  });

  return { data, isLoading, isError };
}

