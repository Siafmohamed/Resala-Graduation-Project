/**
 * @file useEmergencyCases.ts
 * @description Hooks for fetching emergency cases data.
 * Moved from: src/features/SponsorshipCases/hooks/useEmergencyCases.ts
 */

import { useQuery } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { emergencyCasesService } from '../services/emergencyCases.service';
import { CACHE_DURATIONS, QUERY_GC_TIME } from '@/shared/constants/cacheDurations';
import { useCreateEmergencyCase } from './useCreateEmergencyCase';
import { useUpdateEmergencyCase } from './useUpdateEmergencyCase';
import { useDeleteEmergencyCase } from './useDeleteEmergencyCase';

export const emergencyQueryKeys = {
  all: ['emergency-cases'] as const,
  lists: () => [...emergencyQueryKeys.all, 'list'] as const,
  details: () => [...emergencyQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...emergencyQueryKeys.details(), id] as const,
};

/**
 * Fetches all emergency cases. Waits for auth initialization before firing.
 */
export function useEmergencyCases() {
  const isInitialized = useIsInitialized();

  return useQuery({
    queryKey: emergencyQueryKeys.lists(),
    queryFn: () => emergencyCasesService.getAll(),
    staleTime: CACHE_DURATIONS.MEDIUM,
    gcTime: QUERY_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isInitialized === true,
  });
}

/**
 * Fetches a single emergency case by ID.
 */
export function useEmergencyCase(id: number) {
  return useQuery({
    queryKey: emergencyQueryKeys.detail(id),
    queryFn: () => emergencyCasesService.getById(id),
    enabled: !!id,
    staleTime: CACHE_DURATIONS.SHORT,
    gcTime: QUERY_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Backward-compatible exports for older imports aggregated from this hook module.
export { useCreateEmergencyCase, useUpdateEmergencyCase, useDeleteEmergencyCase };

export default useEmergencyCases;
