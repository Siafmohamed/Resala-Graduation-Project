// Urgency levels for emergency cases
export const URGENCY_LEVELS = {
  NORMAL: 1,
  URGENT: 2,
  CRITICAL: 3,
} as const;

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];

// Sponsorship status
export type SponsorshipStatus = 'active' | 'inactive' | 'completed';

// Core Sponsorship type
export interface Sponsorship {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  createdAt: string;
}

// Emergency Case type
export interface EmergencyCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  urgencyLevel: UrgencyLevel;
  requiredAmount: number;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  isCritical: boolean;
  createdAt?: string;
  createdOn?: string;
}

// DTO for creating a sponsorship
export interface CreateSponsorshipDTO {
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  iconName?: string;
  imageFile?: File;
  iconFile?: File;
  targetAmount: number;
  isActive?: boolean;
  collectedAmount?: number;
}

// DTO for updating a sponsorship
export interface UpdateSponsorshipDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  iconName?: string;
  imageFile?: File;
  iconFile?: File;
  targetAmount?: number;
  isActive?: boolean;
  collectedAmount?: number;
}

// DTO for creating an emergency case
export interface CreateEmergencyCaseDTO {
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

// DTO for updating an emergency case
export type UpdateEmergencyCaseDTO = Omit<
  Partial<EmergencyCase>,
  'id' | 'isCritical' | 'createdAt' | 'createdOn'
> & {
  imageFile?: File;
};
