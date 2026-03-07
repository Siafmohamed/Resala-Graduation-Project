import type { SponsorshipCase } from '../types/sponsorshipCases.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_SPONSORSHIP_CASES: SponsorshipCase[] = [
  {
    id: 'SC-001',
    donorName: 'أحمد محمود',
    caseName: 'كفالة يتيم (علي)',
    category: 'orphan',
    monthlyAmount: 400,
    startDate: '2026-01-01',
    nextDueDate: '2026-03-01',
    status: 'active',
  },
  {
    id: 'SC-002',
    donorName: 'فاطمة حسن',
    caseName: 'كفالة أسرة (أسرة علي)',
    category: 'family',
    monthlyAmount: 900,
    startDate: '2025-12-15',
    nextDueDate: '2026-03-15',
    status: 'active',
  },
  {
    id: 'SC-003',
    donorName: 'محمد إبراهيم',
    caseName: 'كفالة طالب علم',
    category: 'student',
    monthlyAmount: 300,
    startDate: '2026-02-01',
    nextDueDate: '2026-03-01',
    status: 'pending',
  },
  {
    id: 'SC-004',
    donorName: 'هدى علي',
    caseName: 'حالة طبية عاجلة',
    category: 'medical',
    monthlyAmount: 1200,
    startDate: '2025-10-01',
    nextDueDate: '2026-03-01',
    status: 'active',
  },
  {
    id: 'SC-005',
    donorName: 'عمرو يوسف',
    caseName: 'كفالة يتيم (محمود)',
    category: 'orphan',
    monthlyAmount: 400,
    startDate: '2025-06-01',
    nextDueDate: '2026-03-01',
    status: 'completed',
  },
];

export const sponsorshipCasesService = {
  async getAll(): Promise<SponsorshipCase[]> {
    await delay(300);
    return MOCK_SPONSORSHIP_CASES;
  },
};

