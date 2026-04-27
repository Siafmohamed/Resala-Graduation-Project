export interface PendingPayment {
  id: number;
  subscriptionId: number;
  userName: string;
  phone: string;
  method: string;
  status: string;
  amount: number;
  receiptImageUrl: string;
  receiptImagePublicId: string;
  senderPhoneNumber: string;
  contactName: string;
  contactPhone: string;
  scheduledDate: string;
  rejectionReason: string;
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
