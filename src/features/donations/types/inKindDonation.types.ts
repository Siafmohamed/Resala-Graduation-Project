export interface InKindDonation {
  id: number;
  donorId: number;
  donorName: string;
  donationTypeName: string;
  quantity: number;
  description: string;
  recordedByStaffId: number;
  recordedByStaffName: string;
  recordedAt: string; // ISO 8601
  createdOn: string; // ISO 8601
}

export interface CreateInKindDonationDTO {
  donorId: number;
  donationTypeName: string;
  quantity: number;
  description?: string;
}

export interface UpdateInKindDonationDTO {
  donorId: number;
  donationTypeName: string;
  quantity: number;
  description?: string;
}

export interface InKindDonationResponse {
  succeeded: boolean;
  data: InKindDonation;
}

export interface InKindDonationsListResponse {
  succeeded: boolean;
  data: InKindDonation[];
}

export interface DonorOption {
  id: number;
  name: string;
}

interface PaginatedDonorItem {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

/** The backend may return either a paginated envelope OR a plain array */
export type PaginatedDonors =
  | {
      data: PaginatedDonorItem[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
    }
  | PaginatedDonorItem[];
