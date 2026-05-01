import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donorsService } from '../services/donors.service';
import type { DonorRegistrationPayload, DonorFilters } from '../types/donors.types';

export const donorQueryKeys = {
  all: ['donors'] as const,
  list: (filters?: DonorFilters) => [...donorQueryKeys.all, 'list', filters] as const,
  details: (id: number) => [...donorQueryKeys.all, 'details', id] as const,
};

export const useDonors = (filters?: DonorFilters) => {
  return useQuery({
    queryKey: donorQueryKeys.list(filters),
    queryFn: () => donorsService.getDonors(filters),
  });
};

export const useDonorDetails = (id: number) => {
  return useQuery({
    queryKey: donorQueryKeys.details(id),
    queryFn: () => donorsService.getDonorById(id),
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
    mutationFn: (payload: DonorRegistrationPayload) => donorsService.registerDonor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
    },
  });
};

export const useUpdateDonor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<DonorRegistrationPayload> }) => 
      donorsService.updateDonor(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: donorQueryKeys.details(variables.id) });
    },
  });
};
