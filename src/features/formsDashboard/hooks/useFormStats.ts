import { useQuery } from '@tanstack/react-query';
import { formsDashboardService } from '../services/formsDashboardService';
import type { FormStats } from '../types/formsDashboard.types';

export function useFormStats(): {
  data: FormStats[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['forms-dashboard'],
    queryFn: () => formsDashboardService.getStats(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}

