import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donorService } from '../services/donorService';
import { useDonorStore } from '../store/donorSlice';
import type { DonorFormData, DonorFiltersState, PaginationState, SortState, FinancialAnalysisDetailResponse, SponsorshipProgram, Sponsorship } from '../types/donor.types';

export const donorQueryKeys = {
  all: ['donors'] as const,
  list: (filters?: DonorFiltersState, pagination?: PaginationState, sort?: SortState) => [...donorQueryKeys.all, 'list', filters, pagination, sort] as const,
  details: (id: number) => [...donorQueryKeys.all, 'details', id] as const,
  activeSponsorships: (donorId: number) => [...donorQueryKeys.all, 'active-sponsorships', donorId] as const,
  sponsorshipPrograms: ['sponsorship-programs'] as const,
};

export const useDonors = () => {
  const filters = useDonorStore((s) => s.filters);
  const pagination = useDonorStore((s) => s.pagination);
  const sort = useDonorStore((s) => s.sort);

  return useQuery({
    queryKey: donorQueryKeys.list(filters, pagination, sort),
    queryFn: () => donorService.getDonors(filters, pagination, sort),
  });
};

export const useDonorDetails = (id: number) => {
  return useQuery({
    queryKey: donorQueryKeys.details(id),
    queryFn: () => donorService.getDonorById(id),
    enabled: !!id,
  });
};

// Backward-compatible alias used by detail pages after folder refactors.
export const useDonor = (id: string | number) => {
  const donorId = typeof id === 'string' ? Number(id) : id;
  return useDonorDetails(Number.isFinite(donorId) ? donorId : 0);
};

export const useRegisterDonor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DonorFormData) => donorService.createDonor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
    },
  });
};

export const useUpdateDonor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<DonorFormData> }) =>
      donorService.updateDonor(String(id), payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.details(variables.id) });
    },
  });
};

export const useDonorActiveSponsorships = (donorId: number) => {
  return useQuery({
    queryKey: donorQueryKeys.activeSponsorships(donorId),
    queryFn: () => donorService.getDonorActiveSponsorships(donorId),
    enabled: !!donorId,
  });
};

// Alias for backward compatibility in DirectOperationsModal
export const useDonorSubscriptions = useDonorActiveSponsorships;

export const useSponsorshipPrograms = () => {
  return useQuery({
    queryKey: donorQueryKeys.sponsorshipPrograms,
    queryFn: () => donorService.getSponsorshipPrograms(),
  });
};

// Alias for backward compatibility in DirectOperationsModal
export const useAllSponsorships = useSponsorshipPrograms;

export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      donorId: number;
      amount: number;
      subscriptionId?: number;
      generalDonationId?: number;
    }) => donorService.processPayment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.details(variables.donorId) });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.activeSponsorships(variables.donorId) });
    },
  });
};

export const useDirectSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      donorId: number;
      sponsorshipId: number;
      amount: number;
      cycle: number;
    }) => donorService.directSubscribe(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.details(variables.donorId) });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.activeSponsorships(variables.donorId) });
    },
  });
};
