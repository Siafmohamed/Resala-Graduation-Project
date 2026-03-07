import type { AdminReportsOverview } from '../types/adminReports.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_REPORTS_OVERVIEW: AdminReportsOverview = {
  generatedReports: 14,
  pendingExports: 3,
  lastGeneratedAt: '2026-03-01 09:45',
  rows: [
    {
      id: 'AR-2026-01',
      title: 'تقرير تبرعات شهر يناير 2026',
      period: '01/01/2026 - 31/01/2026',
      totalAmount: 420_500,
      donationsCount: 386,
    },
    {
      id: 'AR-2026-02',
      title: 'تقرير تبرعات شهر فبراير 2026',
      period: '01/02/2026 - 29/02/2026',
      totalAmount: 398_200,
      donationsCount: 361,
    },
    {
      id: 'AR-URGENT',
      title: 'تقرير الحالات العاجلة',
      period: 'آخر 30 يوم',
      totalAmount: 86_750,
      donationsCount: 42,
    },
  ],
};

export const adminReportsService = {
  async getOverview(): Promise<AdminReportsOverview> {
    await delay(350);
    return MOCK_REPORTS_OVERVIEW;
  },
};

