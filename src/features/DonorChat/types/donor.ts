export interface DonorListItem {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  lastMessageAt?: Date;
  unreadCount?: number;
}

export interface DonorListResponse {
  totalRows: number;
  pageSize: number;
  pageIndex: number;
  items: DonorListItem[];
}
