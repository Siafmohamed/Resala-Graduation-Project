export interface InKindDonation {
  id: string;
  donorId: string;
  donorName?: string;
  donationTypeName: string;
  quantity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInKindDonationPayload {
  donorId: string;
  donationTypeName: string;
  quantity: number;
  description: string;
}

export interface UpdateInKindDonationPayload {
  donationTypeName?: string;
  quantity?: number;
  description?: string;
}

export interface InKindDonationResponse {
  succeeded: boolean;
  message: string;
  data: InKindDonation;
}

export interface InKindDonationsListResponse {
  succeeded: boolean;
  message: string;
  data: InKindDonation[];
}
