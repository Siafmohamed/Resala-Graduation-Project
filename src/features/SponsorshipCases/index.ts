/**
 * @file index.ts
 * @description Public barrel export for the SponsorshipCases feature.
 */

// --- Pages ---
export { default as SponsorshipPage } from './pages/SponsorshipPage';
export { default as SponsorshipManagementDashboard } from './components/SponsorshipManagementAPI';

// --- Hooks ---
export {
  useSponsorships,
  useSponsorship,
  sponsorshipQueryKeys,
} from './hooks/useSponsorships';
export { useCreateSponsorship } from './hooks/useCreateSponsorship';
export { useUpdateSponsorship } from './hooks/useUpdateSponsorship';
export { useDeleteSponsorship } from './hooks/useDeleteSponsorship';
export { useSponsorshipManagementLogic } from './hooks/useSponsorshipManagementLogic';
export { useCaseManagementLogic } from './hooks/useCaseManagementLogic';

// --- Components ---
export { SponsorshipCard } from './components/sponsorship-list/SponsorshipCard';
export { SponsorshipTableRow } from './components/sponsorship-list/SponsorshipTableRow';
export { SponsorshipFormModal } from './components/modals/SponsorshipFormModal';

// --- Service ---
export { sponsorshipService } from './services/sponsorship.service';

// --- Types ---
export type {
  Sponsorship,
  SponsorshipStatus,
  CreateSponsorshipDTO,
  UpdateSponsorshipDTO,
} from './types/sponsorship.types';

// --- Utils ---
export {
  mergeSponsorshipCases,
  calculateProgress,
  formatCurrency,
  normalizeSponsorshipImageUrl,
} from './utils/sponsorshipHelpers';
