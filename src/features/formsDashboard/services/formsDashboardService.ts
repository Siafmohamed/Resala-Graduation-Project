import type { FormStats } from '../types/formsDashboard.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_FORM_STATS: FormStats[] = [
  {
    id: 'F-001',
    name: 'نموذج كفالة يتيم',
    todaySubmissions: 8,
    monthSubmissions: 120,
    completionRate: 92,
  },
  {
    id: 'F-002',
    name: 'نموذج كفالة أسرة',
    todaySubmissions: 5,
    monthSubmissions: 86,
    completionRate: 88,
  },
  {
    id: 'F-003',
    name: 'نموذج تبرع عام',
    todaySubmissions: 12,
    monthSubmissions: 214,
    completionRate: 95,
  },
];

export const formsDashboardService = {
  async getStats(): Promise<FormStats[]> {
    await delay(250);
    return MOCK_FORM_STATS;
  },
};

