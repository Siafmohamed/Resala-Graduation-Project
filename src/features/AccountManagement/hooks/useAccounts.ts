import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountManagementService } from '../services/accountManagementService';
import type { Account, CreateStaffPayload, UpdateStaffPayload } from '../types/accountManagement.types';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountManagementService.getAll(),
    staleTime: 30_000,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => accountManagementService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStaffPayload }) => 
      accountManagementService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountManagementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

