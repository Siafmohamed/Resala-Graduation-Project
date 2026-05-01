// Form-specific types for sponsorship forms
export type SponsorshipFormMode = 'add' | 'edit';
export type SponsorshipType = 'regular' | 'urgent';

export interface SponsorshipFormValues {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  urgencyLevel?: number;
  imageFile: File | null;
  iconFile?: File | null;
  imageUrl?: string;
  icon?: string;
}

export interface SponsorshipFormErrors {
  title?: string;
  description?: string;
  targetAmount?: string;
  collectedAmount?: string;
  urgencyLevel?: string;
  imageFile?: string;
  iconFile?: string;
}
