import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorshipService } from '../services/sponsorship.service';
import { sponsorshipQueryKeys } from './useSponsorships';
import type { Sponsorship } from '../types/sponsorship.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/errorUtils';

export function useDeleteSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sponsorshipService.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Sponsorship[]>(
        sponsorshipQueryKeys.lists(),
        (old = []) => old.filter((item) => item.id !== id),
      );
      queryClient.removeQueries({ queryKey: sponsorshipQueryKeys.detail(id), exact: true });
      toast.success('تم حذف برنامج الكفالة بنجاح');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'حدث خطأ أثناء حذف برنامج الكفالة');
      toast.error(message);
    },
  });
}

export default useDeleteSponsorship;
