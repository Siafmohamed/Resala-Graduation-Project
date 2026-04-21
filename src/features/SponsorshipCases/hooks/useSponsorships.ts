import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsInitialized } from '@/features/authentication';
import { 
  sponsorshipApi, 
  emergencyApi,
  type CreateSponsorshipPayload, 
  type UpdateSponsorshipPayload, 
  type SponsorshipProgram,
  type CreateEmergencyCasePayload,
  type UpdateEmergencyCasePayload,
  type EmergencyCase
} from '../services/sponsorship.service';
import { UrgencyLevel } from '@/features/UrgentCases/types/urgency-level.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage, getApiErrorStatus } from '@/api/errorUtils';

const hasUpdatedSponsorshipValues = (
  serverData: SponsorshipProgram | undefined,
  payload: UpdateSponsorshipPayload,
): boolean => {
  if (!serverData) return false;
  // Based on specified update fields: name, description, targetAmount
  if (payload.name !== undefined && serverData.name !== payload.name) return false;
  if (payload.description !== undefined && serverData.description !== payload.description) return false;
  if (payload.targetAmount !== undefined && serverData.targetAmount !== payload.targetAmount) return false;
  return true;
};

const hasUpdatedEmergencyValues = (
  serverData: EmergencyCase | undefined,
  payload: UpdateEmergencyCasePayload,
): boolean => {
  if (!serverData) return false;
  // Based on specified update fields: title, description, urgencyLevel, requiredAmount, imageUrl, isActive
  if (payload.title !== undefined && serverData.title !== payload.title) return false;
  if (payload.description !== undefined && serverData.description !== payload.description) return false;
  const requiredAmount = payload.requiredAmount ?? payload.targetAmount;
  if (requiredAmount !== undefined && serverData.requiredAmount !== requiredAmount) return false;
  if (payload.urgencyLevel !== undefined && serverData.urgencyLevel !== payload.urgencyLevel) return false;
  if (payload.imageUrl !== undefined && serverData.imageUrl !== payload.imageUrl) return false;
  if (payload.isActive !== undefined && serverData.isActive !== payload.isActive) return false;
  return true;
};

export const sponsorshipQueryKeys = {
  all: ['sponsorships'] as const,
  lists: () => [...sponsorshipQueryKeys.all, 'list'] as const,
  details: () => [...sponsorshipQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...sponsorshipQueryKeys.details(), id] as const,
};

export const emergencyQueryKeys = {
  all: ['emergency-cases'] as const,
  lists: () => [...emergencyQueryKeys.all, 'list'] as const,
  details: () => [...emergencyQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...emergencyQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all sponsorship programs
 */
export const useSponsorships = () => {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: sponsorshipQueryKeys.lists(),
    queryFn: async () => {
      const data = await sponsorshipApi.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });
};

/**
 * Hook to fetch all emergency cases
 */
export const useEmergencyCases = () => {
  const isInitialized = useIsInitialized();
  
  return useQuery({
    queryKey: emergencyQueryKeys.lists(),
    queryFn: async () => {
      const data = await emergencyApi.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Critical: Prevent API request before auth initialization completes
    // On production (Vercel cold start), race condition causes 401 without this guard
    enabled: isInitialized === true,
  });
}
/**
 * Hook to fetch a single sponsorship program by ID
 */
export function useSponsorship(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: sponsorshipQueryKeys.detail(id),
    queryFn: () => sponsorshipApi.getById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      return queryClient
        .getQueryData<SponsorshipProgram[]>(sponsorshipQueryKeys.lists())
        ?.find((s) => s.id === id);
    },
  });
}

/**
 * Hook to fetch a single emergency case by ID
 */
export function useEmergencyCase(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: emergencyQueryKeys.detail(id),
    queryFn: () => emergencyApi.getById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      return queryClient
        .getQueryData<EmergencyCase[]>(emergencyQueryKeys.lists())
        ?.find((s) => s.id === id);
    },
  });
}

/**
 * Hook to create a new sponsorship program
 */
export function useCreateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSponsorshipPayload) => sponsorshipApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.lists(), exact: false });
      toast.success('تم إنشاء برنامج الكفالة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء برنامج الكفالة');
      toast.error(message);
    },
  });
}

/**
 * Hook to create a new emergency case
 */
export function useCreateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmergencyCasePayload) => emergencyApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emergencyQueryKeys.lists(), exact: false });
      toast.success('تم إنشاء الحالة الحرجة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء الحالة الحرجة');
      toast.error(message);
    },
  });
}

/**
 * Hook to update a sponsorship program
 */
export function useUpdateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSponsorshipPayload }) =>
      sponsorshipApi.update(id, payload),

    // OPTIMISTIC UPDATE - Update both list and detail caches
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: sponsorshipQueryKeys.lists(), exact: false });
      await queryClient.cancelQueries({ queryKey: sponsorshipQueryKeys.detail(id) });

      // Snapshot the previous list value
      const previousList = queryClient.getQueryData<SponsorshipProgram[]>(sponsorshipQueryKeys.lists());

      // Snapshot the previous detail value
      const previousSponsorship = queryClient.getQueryData(sponsorshipQueryKeys.detail(id));

      // Optimistically update the list cache - ONLY with fields being sent
      if (previousList) {
        queryClient.setQueryData(sponsorshipQueryKeys.lists(), (old: SponsorshipProgram[] | undefined) => {
          if (!old) return old;
          return old.map(item => {
            if (item.id === id) {
              const updated = { ...item };
              // Only update fields specified in the user's prompt
              if (payload.name !== undefined) updated.name = payload.name;
              if (payload.description !== undefined) updated.description = payload.description;
              if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
              // collectedAmount and isActive are excluded as they are not sent in this update
              return updated;
            }
            return item;
          });
        });
      }

      // Optimistically update the detail cache
      queryClient.setQueryData(sponsorshipQueryKeys.detail(id), (old: SponsorshipProgram | undefined) => {
        if (!old) return old;
        const updated = { ...old };
        if (payload.name !== undefined) updated.name = payload.name;
        if (payload.description !== undefined) updated.description = payload.description;
        if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
        return updated;
      });

      return { previousList, previousSponsorship };
    },

    onError: (error: unknown, { id }, context) => {
      // Rollback both caches on error
      if (context?.previousList) {
        queryClient.setQueryData(sponsorshipQueryKeys.lists(), context.previousList);
      }
      if (context?.previousSponsorship) {
        queryClient.setQueryData(sponsorshipQueryKeys.detail(id), context.previousSponsorship);
      }
      const status = getApiErrorStatus(error);
      if (status === 400) {
        toast.error('بيانات التحديث غير صحيحة (400). يرجى مراجعة الحقول المطلوبة.');
        return;
      }
      if (status === 404) {
        toast.error('برنامج الكفالة غير موجود (404).');
        return;
      }
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث برنامج الكفالة');
      toast.error(message);
    },

    onSuccess: async (data, variables) => {
      const isFreshServerData = hasUpdatedSponsorshipValues(data, variables.payload);

      if (isFreshServerData) {
        queryClient.setQueryData(
          sponsorshipQueryKeys.detail(variables.id),
          data,
        );
        queryClient.setQueryData(
          sponsorshipQueryKeys.lists(),
          (old: SponsorshipProgram[] | undefined) => {
            if (!old) return old;
            return old.map((item) => (item.id === variables.id ? data : item));
          },
        );
      }

      // Return the invalidation promise so mutation lifecycle awaits stale marking.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: sponsorshipQueryKeys.lists(),
          exact: false,
          refetchType: isFreshServerData ? 'active' : 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: sponsorshipQueryKeys.detail(variables.id),
          refetchType: isFreshServerData ? 'active' : 'all',
        }),
      ]);

      // If response looks stale, force an immediate hard refetch.
      if (!isFreshServerData) {
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: sponsorshipQueryKeys.lists(),
            exact: false,
            type: 'active',
          }),
          queryClient.refetchQueries({
            queryKey: sponsorshipQueryKeys.detail(variables.id),
            type: 'active',
          }),
        ]);
      }

      toast.success('تم تحديث برنامج الكفالة بنجاح');
    },
  });
}

/**
 * Hook to update an emergency case
 */
export function useUpdateEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEmergencyCasePayload }) =>
      emergencyApi.update(id, payload),

    // OPTIMISTIC UPDATE - Update both list and detail caches
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: emergencyQueryKeys.lists(), exact: false });
      await queryClient.cancelQueries({ queryKey: emergencyQueryKeys.detail(id) });

      // Snapshot the previous list value
      const previousList = queryClient.getQueryData<EmergencyCase[]>(emergencyQueryKeys.lists());

      // Snapshot the previous detail value
      const previousCase = queryClient.getQueryData(emergencyQueryKeys.detail(id));

      // Optimistically update the list cache - ONLY with fields being sent
      if (previousList) {
        queryClient.setQueryData(emergencyQueryKeys.lists(), (old: EmergencyCase[] | undefined) => {
          if (!old) return old;
          return old.map(item => {
            if (item.id === id) {
              const updated = { ...item };
              // Only update fields specified in the payload
              if (payload.title !== undefined) updated.title = payload.title;
              if (payload.description !== undefined) updated.description = payload.description;
              if (payload.requiredAmount !== undefined) {
                updated.requiredAmount = payload.requiredAmount;
                updated.targetAmount = payload.requiredAmount;
              }
              // ✅ Keep urgencyLevel as numeric (no string conversion)
              if (payload.urgencyLevel !== undefined) {
                updated.urgencyLevel = Number(payload.urgencyLevel) as UrgencyLevel;
                // ⚠️ NOTE: isCritical is a DERIVED field - computed on-the-fly based on urgencyLevel
                // Do NOT set it here; let the consuming component calculate it
              }
              if (payload.imageUrl !== undefined) updated.imageUrl = payload.imageUrl;
              if (payload.isActive !== undefined) updated.isActive = payload.isActive;
              return updated;
            }
            return item;
          });
        });
      }

      // Optimistically update the detail cache
      queryClient.setQueryData(emergencyQueryKeys.detail(id), (old: EmergencyCase | undefined) => {
        if (!old) return old;
        const updated = { ...old };
        if (payload.title !== undefined) updated.title = payload.title;
        if (payload.description !== undefined) updated.description = payload.description;
        if (payload.requiredAmount !== undefined) {
          updated.requiredAmount = payload.requiredAmount;
          updated.targetAmount = payload.requiredAmount;
        }
        // ✅ Keep urgencyLevel as numeric (no string conversion)
        if (payload.urgencyLevel !== undefined) {
          updated.urgencyLevel = Number(payload.urgencyLevel) as UrgencyLevel;
          // ⚠️ NOTE: isCritical is a DERIVED field - computed on-the-fly based on urgencyLevel
          // Do NOT set it here; let the consuming component calculate it
        }
        if (payload.imageUrl !== undefined) updated.imageUrl = payload.imageUrl;
        if (payload.isActive !== undefined) updated.isActive = payload.isActive;
        return updated;
      });

      return { previousList, previousCase };
    },

    onError: (error: unknown, { id }, context) => {
      // Rollback both caches on error
      if (context?.previousList) {
        queryClient.setQueryData(emergencyQueryKeys.lists(), context.previousList);
      }
      if (context?.previousCase) {
        queryClient.setQueryData(emergencyQueryKeys.detail(id), context.previousCase);
      }
      const status = getApiErrorStatus(error);
      if (status === 400) {
        toast.error('بيانات التحديث غير صحيحة (400). يرجى مراجعة الحقول المطلوبة.');
        return;
      }
      if (status === 404) {
        toast.error('الحالة الحرجة غير موجودة (404).');
        return;
      }
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء تحديث الحالة الحرجة');
      toast.error(message);
    },

    onSuccess: async (data, variables) => {
      const isFreshServerData = hasUpdatedEmergencyValues(data, variables.payload);

      if (isFreshServerData) {
        queryClient.setQueryData(
          emergencyQueryKeys.detail(variables.id),
          data,
        );
        queryClient.setQueryData(
          emergencyQueryKeys.lists(),
          (old: EmergencyCase[] | undefined) => {
            if (!old) return old;
            return old.map((item) => (item.id === variables.id ? data : item));
          },
        );
      }

      // Return the invalidation promise so mutation lifecycle awaits stale marking.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: emergencyQueryKeys.lists(),
          exact: false,
          refetchType: isFreshServerData ? 'active' : 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: emergencyQueryKeys.detail(variables.id),
          refetchType: isFreshServerData ? 'active' : 'all',
        }),
      ]);

      // If response looks stale, force an immediate hard refetch.
      if (!isFreshServerData) {
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: emergencyQueryKeys.lists(),
            exact: false,
            type: 'active',
          }),
          queryClient.refetchQueries({
            queryKey: emergencyQueryKeys.detail(variables.id),
            type: 'active',
          }),
        ]);
      }

      toast.success('تم تحديث الحالة الحرجة بنجاح');
    },
  });
}

/**
 * Hook to delete a sponsorship program
 */
export function useDeleteSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sponsorshipApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sponsorshipQueryKeys.lists(), exact: false });
      toast.success('تم حذف برنامج الكفالة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف برنامج الكفالة');
      toast.error(message);
    },
  });
}

/**
 * Hook to delete an emergency case
 */
export function useDeleteEmergencyCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emergencyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emergencyQueryKeys.lists(), exact: false });
      toast.success('تم حذف الحالة الحرجة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف الحالة الحرجة');
      toast.error(message);
    },
  });
}
