import { useMemo } from 'react';
import { useSponsorships } from './useSponsorships';
import { useEmergencyCases } from './useEmergencyCases';
import { mergeSponsorshipCases } from '../utils/sponsorshipHelpers';

/**
 * Aggregator hook - combines sponsorships and emergency cases
 * Replaces the combinedData useMemo from SponsorshipManagementAPI.tsx
 */
export function useSponsorshipCases() {
  const { data: sponsorships = [], isLoading: loadingSponsorships, isError: errorSponsorships } = useSponsorships();
  const { data: emergencyCases = [], isLoading: loadingEmergency, isError: errorEmergency } = useEmergencyCases();

  const cases = useMemo(
    () => mergeSponsorshipCases(sponsorships, emergencyCases),
    [sponsorships, emergencyCases]
  );

  return {
    cases,
    isLoading: loadingSponsorships || loadingEmergency,
    isError: errorSponsorships || errorEmergency,
    error: errorSponsorships || errorEmergency ? 'Failed to load cases' : null,
  };
}

export default useSponsorshipCases;
