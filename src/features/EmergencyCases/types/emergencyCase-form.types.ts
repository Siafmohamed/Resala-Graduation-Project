/**
 * @file emergencyCase-form.types.ts
 * @description Form-specific types for EmergencyCase forms (add / edit).
 * Moved from: src/features/SponsorshipCases/types/sponsorship-form.types.ts (emergency section)
 */

import type { UrgencyLevel } from '@/shared/constants/urgencyLevels';

export type EmergencyCaseFormMode = 'add' | 'edit';

export interface EmergencyCaseFormValues {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;
  imageFile: File | null;
  imagePreview?: string | null;
  imageUrl?: string;
}

export interface EmergencyCaseFormErrors {
  title?: string;
  description?: string;
  targetAmount?: string;
  collectedAmount?: string;
  urgencyLevel?: string;
  imageFile?: string;
}
