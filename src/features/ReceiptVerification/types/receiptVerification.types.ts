export type ReceiptStatus = 'pending' | 'verified' | 'rejected';

export interface Receipt {
  id: string;
  donorName: string;
  amount: number;
  method: 'vodafone_cash' | 'instapay' | 'bank' | 'branch';
  transferNumber: string;
  receivedAt: string;
  status: ReceiptStatus;
}

