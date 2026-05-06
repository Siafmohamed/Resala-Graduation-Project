import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { inKindDonationService } from '../services/donationService';
import type {
  CreateInKindDonationDTO,
  InKindDonation,
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

const upsertDonationInArray = (items: InKindDonation[] | undefined, donation: InKindDonation) => {
  if (!Array.isArray(items)) return [donation];
  const exists = items.some((item) => item.id === donation.id);
  if (exists) return items.map((item) => (item.id === donation.id ? donation : item));
  return [donation, ...items];
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
    select: (res: any) => res.data || [],
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

/** Hook to fetch donations by donor ID */
export function useInKindDonationsByDonor(donorId: number | string) {
  const isInitialized = useIsInitialized();
  const idAsNumber = Number(donorId);

  return useQuery({
    queryKey: inKindDonationQueryKeys.history(idAsNumber),
    queryFn: () => inKindDonationService.getByDonorId(idAsNumber),
    enabled: !!donorId && !isNaN(idAsNumber) && isInitialized === true,
  });
}

/** ── Create mutation ───────────────────────────────────────────────── */
export function useCreateInKindDonation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInKindDonationDTO) => inKindDonationService.create(payload),
    onSuccess: (res) => {
      const created = res.data;
      qc.setQueryData<InKindDonation[]>(
        inKindDonationQueryKeys.lists(),
        (old) => upsertDonationInArray(old, created),
      );
      qc.setQueryData<InKindDonation[]>(
        inKindDonationQueryKeys.history(created.donorId),
        (old) => upsertDonationInArray(old, created),
      );
      qc.setQueryData(inKindDonationQueryKeys.detail(created.id), created);
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
      const updated = res.data;
      qc.setQueryData<InKindDonation[]>(
        inKindDonationQueryKeys.lists(),
        (old = []) => old.map((item) => (item.id === updated.id ? updated : item)),
      );
      // Keep all donor history caches coherent (handles donorId changes on edit).
      qc.setQueriesData<InKindDonation[]>(
        { queryKey: [...inKindDonationQueryKeys.all, 'history'] },
        (old = []) => {
          const withoutDonation = old.filter((item) => item.id !== updated.id);
          return old.some((item) => item.donorId === updated.donorId) ? [...withoutDonation, updated] : withoutDonation;
        },
      );
      qc.setQueryData<InKindDonation[]>(
        inKindDonationQueryKeys.history(updated.donorId),
        (old) => upsertDonationInArray(old, updated),
      );
      qc.setQueryData(inKindDonationQueryKeys.detail(updated.id), updated);
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
  });
}

/** Hook to delete an in-kind donation (Admin only) */
export function useDeleteInKindDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => inKindDonationService.delete(Number(id)),
    onSuccess: (_, id) => {
      const numericId = Number(id);
      queryClient.setQueryData<InKindDonation[]>(
        inKindDonationQueryKeys.lists(),
        (old = []) => old.filter((item) => item.id !== numericId),
      );
      queryClient.setQueriesData<InKindDonation[]>(
        { queryKey: [...inKindDonationQueryKeys.all, 'history'] },
        (old = []) => old.filter((item) => item.id !== numericId),
      );
      queryClient.removeQueries({ queryKey: inKindDonationQueryKeys.detail(numericId), exact: true });
      toast.success('تم حذف التبرع العيني بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف التبرع');
    },
  });
}
