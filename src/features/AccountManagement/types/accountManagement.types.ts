import type { Role } from '@/features/authentication/types/role.types';

export type AccountStatus = 'active' | 'inactive' | 'locked';

// Match the API's actual field names:
export interface StaffAccount {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  staffType: string;
  accountStatus: string;
  isActive: boolean;
  createdOn: string;
}

// Paginated result shape from API's "value" property
export interface StaffPagedResult {
  totalRows: number;
  pageSize: number;
  pageIndex: number;
  items: StaffAccount[];
}

// StaffListResponse is now the paginated result
export type StaffListResponse = StaffPagedResult;

export interface ApiResponse<T> {
  isSuccess: boolean;
  value: T;
  message: string;
  errorType: number;
  errors: Record<string, string[]>;
}

export interface CreateStaffPayload {
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  staffType: 1 | 2; // 1 = Admin, 2 = Reception
}

export interface UpdateStaffPayload extends Partial<Omit<CreateStaffPayload, 'password'>> {
  accountStatus?: string;
  isActive?: boolean;
}

