// Components
export { InKindDonationForm } from './components/InKindDonationForm';
export { InKindDonationsListPage } from './components/InKindDonationsListPage';
export { RegisterDonationPage } from './components/RegisterDonationPage';
export { DonorSearchModal } from './components/DonorSearchModal';
export { DonorSearchSelect } from './components/DonorSearchSelect';

// Hooks
export * from './hooks/useInKindDonations';

// Types (single source of truth)
export type * from './types/inKindDonation.types';

// Service (re-export for convenience)
export { inKindDonationService } from './services/donationService';
