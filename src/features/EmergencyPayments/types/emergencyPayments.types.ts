export interface EmergencyPayment {
  id: number;
  subscriptionId: number | null;
  emergencyCaseId: number;
  emergencyCaseTitle: string;
  userName: string;
  phone: string;
  method: string;
  status: string;
  amount: number;
  receiptImageUrl: string | null;
  receiptImagePublicId: string | null;
  senderPhoneNumber: string | null;
  contactName: string;
  contactPhone: string;
  address: string;
  representativeNotes: string | null;
  deliveryAreaId: number;
  deliveryAreaName: string;
  scheduledDate: string | null;
  rejectionReason: string | null;
  createdOn: string;
  slotId: number | null;
}

export type EmergencyPaymentMethod = 'All' | 'Representative' | 'Branch' | 'Vodafone Cash' | 'InstaPay';

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

export interface DeliveryArea {
  id: number;
  name: string;
}
