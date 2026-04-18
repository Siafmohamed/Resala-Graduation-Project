import { useQuery } from '@tanstack/react-query';
import { complaintsService } from '../services/complaintsService';
import type { Complaint } from '../types/complaints.types';
import { CACHE_DURATIONS } from '@/shared/constants/cacheDurations';

export function useComplaints(): {
  data: Complaint[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintsService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
  });

  return { data, isLoading, isError };
}

