export interface Donor {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  registrationDate: string;
  totalDonations: number;
  lastDonationDate?: string;
  isRegular: boolean;
  notes?: string;
}

export interface DonorRegistrationPayload {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface DonorFilters {
  search?: string;
  isRegular?: boolean;
}
