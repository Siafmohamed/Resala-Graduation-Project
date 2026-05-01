/**
 * @file emergencyCase.types.ts
 * @description Core domain types for the EmergencyCases feature.
 * Split from: src/features/SponsorshipCases/types/sponsorship.types.ts
 * and aligned with: src/api/services/sponsorshipService.ts (EmergencyCase interface)
 */

import type { UrgencyLevel } from '@/shared/constants/urgencyLevels';

// ---------------------------------------------------------------------------
// Core entity
// ---------------------------------------------------------------------------

export interface EmergencyCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  urgencyLevel: UrgencyLevel;
  /** Alias of requiredAmount — prefer requiredAmount for new code */
  targetAmount: number;
  requiredAmount: number;
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  /** Derived UI field: true when urgencyLevel === 3. Never sent to the API. */
  isCritical: boolean;
  createdAt?: string;
  createdOn?: string;
}

// ---------------------------------------------------------------------------
// API payloads
// ---------------------------------------------------------------------------

export interface CreateEmergencyCasePayload {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  urgencyLevel?: UrgencyLevel;
  requiredAmount?: number;
  targetAmount: number;
  collectedAmount?: number;
  isActive?: boolean;
  isCompleted?: boolean;
}

/**
 * Omits UI-only and immutable fields so callers can safely spread an
 * `EmergencyCase` object without accidentally sending `isCritical` or `id`.
 */
export type UpdateEmergencyCasePayload = Omit<
  Partial<EmergencyCase>,
  'id' | 'isCritical' | 'createdAt' | 'createdOn'
> & {
  imageFile?: File;
};
