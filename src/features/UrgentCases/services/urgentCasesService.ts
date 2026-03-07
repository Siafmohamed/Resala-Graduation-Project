import type { UrgentCase } from '../types/urgentCases.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_URGENT_CASES: UrgentCase[] = [
  {
    id: 'U-001',
    title: 'عملية جراحية عاجلة لطفل',
    category: 'medical',
    priority: 'high',
    requestedAmount: 50_000,
    collectedAmount: 18_500,
    createdAt: '2026-02-28',
  },
  {
    id: 'U-002',
    title: 'إيجار مسكن لأسرة مستحقة',
    category: 'housing',
    priority: 'medium',
    requestedAmount: 24_000,
    collectedAmount: 12_300,
    createdAt: '2026-02-25',
  },
  {
    id: 'U-003',
    title: 'سلات غذائية لعدد 30 أسرة',
    category: 'food',
    priority: 'medium',
    requestedAmount: 15_000,
    collectedAmount: 7_200,
    createdAt: '2026-02-20',
  },
];

export const urgentCasesService = {
  async getAll(): Promise<UrgentCase[]> {
    await delay(250);
    return MOCK_URGENT_CASES;
  },
};

