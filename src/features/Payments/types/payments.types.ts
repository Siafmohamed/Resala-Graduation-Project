export type PaymentType = 'subscription' | 'emergency';

export type PaymentMethod = 'All' | 'Representatives' | 'Branch' | 'Vodafone Cash' | 'InstaPay';

export interface BasePayment {
  id: number;
  userName: string;
  phone: string;
  method: string;
  status: string;
  amount: number;
  createdOn: string;
  receiptImageUrl: string | null;
  senderPhoneNumber: string | null;
  contactName: string | null;
  contactPhone: string | null;
  address: string | null;
  deliveryAreaName: string | null;
  scheduledDate: string | null;
  rejectionReason: string | null;
}

export interface SubscriptionPayment extends BasePayment {
  subscriptionId: number | null;
}

export interface EmergencyPayment extends BasePayment {
  emergencyCaseId: number;
  emergencyCaseTitle: string;
  slotId: number | null;
}

export type UnifiedPayment = SubscriptionPayment & Partial<EmergencyPayment> & {
  paymentType: PaymentType;
};

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

export interface DeliveryArea {
  id: number;
  name: string;
}
