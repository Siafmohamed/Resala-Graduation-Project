import api from '@/shared/api/axiosInstance';
import type {
  FinancialSummaryData,
  MonthlyDonationData,
  UsersStatusData,
  OverviewData,
  SponsorshipStatsData,
} from '../types/dashboard.types';

// Helper function to unwrap API response
const unwrapApiResponse = <T>(response: unknown): T => {
  // The axios instance already returns response.data, which is { isSuccess, value, ... }
  if (response && typeof response === 'object' && 'isSuccess' in response && 'value' in response) {
    return (response as { value: T }).value;
  }
  
  // Fallback for other response formats
  if (response && typeof response === 'object' && 'succeeded' in response && 'data' in response) {
    return (response as { data: T }).data;
  }
  
  return response as T;
};

export const dashboardService = {
  async getFinancialSummary(): Promise<FinancialSummaryData> {
    const response = await api.get('/v1/staff/dashboard/financial-summary');
    console.log('getFinancialSummary response:', response);
    return unwrapApiResponse<FinancialSummaryData>(response);
  },

  async getMonthlyDonations(params?: { period?: number }): Promise<MonthlyDonationData[]> {
    const response = await api.get('/v1/admin/dashboard/monthly-donations', { params });
    console.log('getMonthlyDonations response:', response);
    return unwrapApiResponse<MonthlyDonationData[]>(response);
  },

  async getUsersStatus(): Promise<UsersStatusData> {
    const response = await api.get('/v1/admin/dashboard/users');
    console.log('getUsersStatus response:', response);
    return unwrapApiResponse<UsersStatusData>(response);
  },

  async getOverview(params?: { period?: number }): Promise<OverviewData> {
    const response = await api.get('/v1/admin/dashboard/overview', { params });
    console.log('getOverview response:', response);
    return unwrapApiResponse<OverviewData>(response);
  },

  async getSponsorshipStats(params?: { period?: number }): Promise<SponsorshipStatsData> {
    const response = await api.get('/v1/admin/dashboard/sponsorships-stats', { params });
    console.log('getSponsorshipStats response:', response);
    return unwrapApiResponse<SponsorshipStatsData>(response);
  },
};
