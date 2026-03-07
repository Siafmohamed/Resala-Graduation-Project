import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { donorService } from '../services/donorService';
import { useDonorStore } from '../store/donorSlice';
import type { DonorsListResponse } from '../types/donor.types';

export function useDonors(): {
  data: DonorsListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const filters = useDonorStore((s) => s.filters);
  const pagination = useDonorStore((s) => s.pagination);
  const sort = useDonorStore((s) => s.sort);
  const debouncedSearch = useDebounce(filters.search, 500);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['donors', effectiveFilters, pagination, sort],
    queryFn: () =>
      donorService.getDonors(effectiveFilters, pagination, sort),
    staleTime: 30_000,
  });

  return { data, isLoading, isError, error: error as Error | null, refetch };
}
