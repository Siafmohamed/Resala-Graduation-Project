import { useQuery } from '@tanstack/react-query';
import { accountManagementService } from '../services/accountManagementService';
import type { Account } from '../types/accountManagement.types';

export function useAccounts(): {
  data: Account[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountManagementService.getAll(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

