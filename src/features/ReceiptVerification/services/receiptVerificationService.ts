import type { Receipt } from '../types/receiptVerification.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'RV-1001',
    donorName: 'أحمد محمود',
    amount: 500,
    method: 'vodafone_cash',
    transferNumber: '5678****',
    receivedAt: '2026-03-01 10:24',
    status: 'pending',
  },
  {
    id: 'RV-1002',
    donorName: 'فاطمة حسن',
    amount: 750,
    method: 'instapay',
    transferNumber: '9812****',
    receivedAt: '2026-03-01 10:40',
    status: 'pending',
  },
  {
    id: 'RV-1003',
    donorName: 'محمد إبراهيم',
    amount: 400,
    method: 'branch',
    transferNumber: 'فرع الزقازيق',
    receivedAt: '2026-03-01 09:55',
    status: 'verified',
  },
  {
    id: 'RV-1004',
    donorName: 'هدى علي',
    amount: 1200,
    method: 'bank',
    transferNumber: '123456',
    receivedAt: '2026-02-29 16:10',
    status: 'rejected',
  },
];

export const receiptVerificationService = {
  async getAll(): Promise<Receipt[]> {
    await delay(250);
    return MOCK_RECEIPTS;
  },
};

