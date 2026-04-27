import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { inKindDonationService } from '../services/donationService';
import type {
  CreateInKindDonationDTO,
  UpdateInKindDonationDTO,
} from '../types/inKindDonation.types';
import { toast } from 'react-toastify';
import { useDebounce } from '@/shared/hooks/useDebounce';

export const inKindDonationQueryKeys = {
  all: ['inKindDonations'] as const,
  lists: () => [...inKindDonationQueryKeys.all, 'list'] as const,
  donors: () => [...inKindDonationQueryKeys.all, 'donors'] as const,
  donorsDropdown: (search: string) =>
    [...inKindDonationQueryKeys.donors(), 'dropdown', search] as const,
  donorsPaginated: (search: string, page: number, pageSize: number) =>
    [...inKindDonationQueryKeys.donors(), 'paginated', search, page, pageSize] as const,
  history: (donorId: number) =>
    [...inKindDonationQueryKeys.all, 'history', donorId] as const,
  details: () => [...inKindDonationQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...inKindDonationQueryKeys.details(), id] as const,
};

/** ── Donor dropdown (debounced live search) ────────────────────────── */
export function useDonorDropdown(rawSearch: string) {
  const isInitialized = useIsInitialized();
  const search = useDebounce(rawSearch.trim(), 300);

  return useQuery({
    queryKey: inKindDonationQueryKeys.donorsDropdown(search),
    queryFn: () => inKindDonationService.fetchDonorDropdown(search),
    enabled: search.length > 0 && isInitialized === true,
    staleTime: 1000 * 30, // 30s cache
    placeholderData: (prev) => prev,
  });
}

/** ── Paginated donor search (advanced modal) ───────────────────────── */
export function useDonorsPaginated(
  rawSearch: string,
  pageNumber: number,
  pageSize = 20
) {
  const isInitialized = useIsInitialized();
  const search = useDebounce(rawSearch.trim(), 400);

  return useQuery({
    queryKey: inKindDonationQueryKeys.donorsPaginated(search, pageNumber, pageSize),
    queryFn: () => inKindDonationService.fetchDonorsPaginated(search, pageNumber, pageSize),
    enabled: isInitialized === true,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

/** ── Donor history ─────────────────────────────────────────────────── */
export function useInKindDonationsByDonor(donorId: number | string | null) {
  const isInitialized = useIsInitialized();
  const idAsNumber = donorId ? Number(donorId) : null;
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.history(idAsNumber!),
    queryFn: () => inKindDonationService.getByDonorId(idAsNumber!),
    enabled: idAsNumber !== null && !isNaN(idAsNumber) && isInitialized === true,
    select: (data) => data.data,
  });
}

/** ── Create mutation ───────────────────────────────────────────────── */
export function useCreateInKindDonation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInKindDonationDTO) => inKindDonationService.create(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({
        queryKey: inKindDonationQueryKeys.history(res.data.donorId),
      });
      qc.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      toast.success('تم تسجيل التبرع العيني بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تسجيل التبرع');
    },
  });
}

/** ── Update mutation ───────────────────────────────────────────────── */
export function useUpdateInKindDonation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateInKindDonationDTO }) =>
      inKindDonationService.update(Number(id), payload),
    onSuccess: (res) => {
      qc.invalidateQueries({
        queryKey: inKindDonationQueryKeys.history(res.data.donorId),
      });
      qc.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      qc.invalidateQueries({ queryKey: inKindDonationQueryKeys.detail(res.data.id) });
      toast.success('تم تحديث بيانات التبرع بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث بيانات التبرع');
    },
  });
}

/** Hook to fetch all in-kind donations (legacy/general) */
export function useInKindDonations() {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.lists(),
    queryFn: () => inKindDonationService.getAll(),
    select: (data) => data.data,
    enabled: isInitialized === true,
  });
}

/** Hook to fetch a single in-kind donation by ID */
export function useInKindDonation(id: number | string) {
  const isInitialized = useIsInitialized();
  const idAsNumber = Number(id);
  
  return useQuery({
    queryKey: inKindDonationQueryKeys.detail(idAsNumber),
    queryFn: () => inKindDonationService.getById(idAsNumber),
    enabled: !!id && !isNaN(idAsNumber) && isInitialized === true,
    select: (data) => data.data,
  });
}

/** Hook to delete an in-kind donation (Admin only) */
export function useDeleteInKindDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => inKindDonationService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inKindDonationQueryKeys.lists() });
      toast.success('تم حذف التبرع العيني بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف التبرع');
    },
  });
}
