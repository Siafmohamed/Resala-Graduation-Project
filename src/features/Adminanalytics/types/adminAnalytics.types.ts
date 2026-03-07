export interface AnalyticsKpi {
  id: string;
  label: string;
  value: string;
  changePercent: number;
}

export interface AnalyticsTimeSeriesPoint {
  label: string;
  value: number;
}

export interface AdminAnalyticsData {
  kpis: AnalyticsKpi[];
  dailyDonations: AnalyticsTimeSeriesPoint[];
}

