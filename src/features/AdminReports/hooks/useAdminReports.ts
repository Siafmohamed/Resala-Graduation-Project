import { useQuery } from '@tanstack/react-query';
import { adminReportsService } from '../services/adminReportsService';
import type { AdminReportsOverview } from '../types/adminReports.types';

export function useAdminReports(): {
  data: AdminReportsOverview | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-reports-overview'],
    queryFn: () => adminReportsService.getOverview(),
    staleTime: 60_000,
  });

  return { data, isLoading, isError };
}

