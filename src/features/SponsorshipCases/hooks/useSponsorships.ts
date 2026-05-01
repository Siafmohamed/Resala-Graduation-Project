import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { sponsorshipService } from '../services/sponsorship.service';
import { useCreateSponsorship } from './useCreateSponsorship';
import { useUpdateSponsorship } from './useUpdateSponsorship';
import { useDeleteSponsorship } from './useDeleteSponsorship';

export const sponsorshipQueryKeys = {
  all: ['sponsorships'] as const,
  lists: () => [...sponsorshipQueryKeys.all, 'list'] as const,
  details: () => [...sponsorshipQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...sponsorshipQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all sponsorship programs
 */
export function useSponsorships() {
  const isInitialized = useIsInitialized();

  return useQuery({
    queryKey: sponsorshipQueryKeys.lists(),
    queryFn: () => sponsorshipService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isInitialized === true,
  });
}

/**
 * Hook to fetch a single sponsorship by ID
 */
export function useSponsorship(id: number) {
  return useQuery({
    queryKey: sponsorshipQueryKeys.detail(id),
    queryFn: () => sponsorshipService.getById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Backward-compatible exports kept for modules that still import all hooks from this file.
export { useCreateSponsorship, useUpdateSponsorship, useDeleteSponsorship };

export default useSponsorships;
