import { UrgencyLevel } from './urgency-level.types';

/**
 * Represents an urgent case in the system
 */
export interface UrgentCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;
  isActive: boolean;
  createdOn?: string;
  createdAt?: string;
}

/**
 * Payload for creating a new urgent case
 */
export interface CreateUrgentCasePayload {
  image?: File | string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount?: number;
  urgencyLevel: UrgencyLevel;
  isActive?: boolean;
}

/**
 * Payload for updating an existing urgent case
 */
export interface UpdateUrgentCasePayload {
  image?: File | string;
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  urgencyLevel?: UrgencyLevel;
  isActive?: boolean;
}

/**
 * Form values for urgent case forms
 */
export interface UrgentCaseFormValues {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;
  isActive: boolean;
  imageFile?: File | null;
  imagePreview?: string | null;
}
