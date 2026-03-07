import type { AdminAnalyticsData, AnalyticsTimeSeriesPoint, AnalyticsKpi } from '../types/adminAnalytics.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DAILY_DONATIONS: AnalyticsTimeSeriesPoint[] = [
  { label: 'الأحد', value: 24_000 },
  { label: 'الاثنين', value: 19_500 },
  { label: 'الثلاثاء', value: 21_300 },
  { label: 'الأربعاء', value: 23_800 },
  { label: 'الخميس', value: 26_200 },
  { label: 'الجمعة', value: 32_400 },
  { label: 'السبت', value: 18_900 },
];

const KPIS: AnalyticsKpi[] = [
  {
    id: 'avg-donation',
    label: 'متوسط قيمة التبرع',
    value: '420 جنيه',
    changePercent: 4.5,
  },
  {
    id: 'conversion-rate',
    label: 'معدل تحويل النماذج',
    value: '38%',
    changePercent: 2.1,
  },
  {
    id: 'retention',
    label: 'احتفاظ المتبرعين',
    value: '72%',
    changePercent: 1.3,
  },
];

const ANALYTICS_DATA: AdminAnalyticsData = {
  kpis: KPIS,
  dailyDonations: DAILY_DONATIONS,
};

export const adminAnalyticsService = {
  async getAnalytics(): Promise<AdminAnalyticsData> {
    await delay(350);
    return ANALYTICS_DATA;
  },
};

