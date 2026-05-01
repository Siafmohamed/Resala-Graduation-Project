export interface PendingPayment {
  id: number;
  subscriptionId: number | null;
  emergencyCaseId: number | null;
  emergencyCaseTitle: string | null;
  userName: string;
  phone: string;
  method: string;
  status: string;
  amount: number;
  receiptImageUrl: string | null;
  receiptImagePublicId: string | null;
  senderPhoneNumber: string | null;
  contactName: string | null;
  contactPhone: string | null;
  address: string | null;
  representativeNotes: string | null;
  deliveryAreaId: number | null;
  deliveryAreaName: string | null;
  scheduledDate: string | null;
  rejectionReason: string | null;
  createdOn: string;
}

export interface DeliveryArea {
  id: number;
  name: string;
  // Add other fields if necessary based on API response
}

export type PaymentMethod = 'All' | 'Representatives' | 'Branch' | 'Vodafone Cash' | 'InstaPay';

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}
