import { sponsorshipService } from './sponsorship.service';
import { emergencyCasesService } from './emergencyCases.service';
import { mergeSponsorshipCases } from '../utils/sponsorshipHelpers';
import type { SponsorshipCase } from '../types/sponsorshipCases.types';

/**
 * Orchestration service - merges sponsorships and emergency cases
 * This is the ONLY place that combines the two domains for display
 */
export const sponsorshipCasesService = {
  getCombinedCases: async (): Promise<SponsorshipCase[]> => {
    const [sponsorships, emergencyCases] = await Promise.all([
      sponsorshipService.getAll(),
      emergencyCasesService.getAll(),
    ]);

    return mergeSponsorshipCases(sponsorships, emergencyCases);
  },
};

export default sponsorshipCasesService;
