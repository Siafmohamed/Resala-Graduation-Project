import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsService } from '../services/adminAnalyticsService';

export const useAdminOverview = (period?: number) => {
  return useQuery({
    queryKey: ['admin-overview', period],
    queryFn: () => adminAnalyticsService.getOverview(period),
  });
};

export const useUsersStats = (period?: number) => {
  return useQuery({
    queryKey: ['users-stats', period],
    queryFn: () => adminAnalyticsService.getUsersStats(period),
  });
};

export const useSponsorshipStats = (period?: number) => {
  return useQuery({
    queryKey: ['sponsorship-stats', period],
    queryFn: () => adminAnalyticsService.getSponsorshipStats(period),
  });
};

export const useEmergencyCasesStats = (period?: number) => {
  return useQuery({
    queryKey: ['emergency-cases-stats', period],
    queryFn: () => adminAnalyticsService.getEmergencyCasesStats(period),
  });
};

export const useMonthlyDonations = (period?: number) => {
  return useQuery({
    queryKey: ['monthly-donations', period],
    queryFn: () => adminAnalyticsService.getMonthlyDonations(period),
  });
};

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => adminAnalyticsService.getFinancialSummary(),
  });
};
