import type { SponsorshipStatus } from './sponsorship.types';

// Unified type for displaying both Sponsorships and EmergencyCases in a single list
// This type is ONLY for UI display — never sent to the API
export interface SponsorshipCase {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  status: SponsorshipStatus;
  type: 'regular' | 'urgent';
  imageUrl?: string;
  icon?: string;
  urgencyLevel?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
