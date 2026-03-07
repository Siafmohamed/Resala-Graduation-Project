import { useQuery } from '@tanstack/react-query';
import { complaintsService } from '../services/complaintsService';
import type { Complaint } from '../types/complaints.types';

export function useComplaints(): {
  data: Complaint[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintsService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

