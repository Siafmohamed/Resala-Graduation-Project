/**
 * @file sponsorshipStatus.constants.ts
 * @description Runtime display configuration for SponsorshipStatus values.
 *
 * Previously misplaced as runtime values inside:
 *   src/features/SponsorshipCases/types/sponsorship-status.types.ts
 *
 * Rule: .types.ts files should contain ONLY type/interface declarations.
 * Runtime constants (objects, arrays) belong in .constants.ts files.
 */

import type { SponsorshipStatus } from '../types/sponsorship-status.types';

export interface SponsorshipStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<SponsorshipStatus, SponsorshipStatusConfig> = {
  active: {
    label: 'نشط',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  inactive: {
    label: 'غير نشط',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  completed: {
    label: 'مكتمل',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};
