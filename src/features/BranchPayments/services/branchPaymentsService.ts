import type { BranchPayment } from '../types/branchPayments.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_BRANCH_PAYMENTS: BranchPayment[] = [
  {
    id: 'BP-001',
    branchName: 'فرع الزقازيق الرئيسي',
    cashierName: 'أمل محمد',
    amount: 12_500,
    paymentDate: '2026-03-01',
    reference: 'دفتر 12 / إيصال 34-56',
  },
  {
    id: 'BP-002',
    branchName: 'فرع القرى',
    cashierName: 'محمود علي',
    amount: 8_750,
    paymentDate: '2026-02-29',
    reference: 'دفتر 9 / إيصال 10-22',
  },
  {
    id: 'BP-003',
    branchName: 'فرع الجامعة',
    cashierName: 'سارة أحمد',
    amount: 6_200,
    paymentDate: '2026-02-28',
    reference: 'دفتر 4 / إيصال 01-08',
  },
];

export const branchPaymentsService = {
  async getAll(): Promise<BranchPayment[]> {
    await delay(250);
    return MOCK_BRANCH_PAYMENTS;
  },
};

