import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorshipService } from '../services/sponsorship.service';
import { sponsorshipQueryKeys } from './useSponsorships';
import type { Sponsorship } from '../types/sponsorship.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

export function useCreateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => sponsorshipService.create(data),
    onSuccess: (created) => {
      queryClient.setQueryData<Sponsorship[]>(
        sponsorshipQueryKeys.lists(),
        (old = []) => [created, ...old],
      );
      queryClient.setQueryData(sponsorshipQueryKeys.detail(created.id), created);
      toast.success('تم إنشاء برنامج الكفالة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء إنشاء برنامج الكفالة');
      toast.error(message);
    },
  });
}

export default useCreateSponsorship;
