import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'financial-summary'],
    queryFn: () => dashboardService.getFinancialSummary(),
  });
};

export const useMonthlyDonations = (params?: { period?: number }) => {
  return useQuery({
    queryKey: ['dashboard', 'monthly-donations', params],
    queryFn: () => dashboardService.getMonthlyDonations(params),
  });
};

export const useUsersStatus = () => {
  return useQuery({
    queryKey: ['dashboard', 'users-status'],
    queryFn: () => dashboardService.getUsersStatus(),
  });
};

export const useOverview = (params?: { period?: number }) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', params],
    queryFn: () => dashboardService.getOverview(params),
  });
};

export const useSponsorshipStats = (params?: { period?: number }) => {
  return useQuery({
    queryKey: ['dashboard', 'sponsorship-stats', params],
    queryFn: () => dashboardService.getSponsorshipStats(params),
  });
};
