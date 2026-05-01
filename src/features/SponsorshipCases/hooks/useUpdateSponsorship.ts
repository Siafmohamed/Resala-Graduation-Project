import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorshipService } from '../services/sponsorship.service';
import { sponsorshipQueryKeys } from './useSponsorships';
import type { Sponsorship } from '../types/sponsorship.types';
import { toast } from 'react-toastify';
import { getApiErrorMessage, getApiErrorStatus } from '@/api/errorUtils';

export function useUpdateSponsorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      sponsorshipService.update(id, payload),
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<Sponsorship[]>(
        sponsorshipQueryKeys.lists(),
        (old = []) => old.map((item) => (item.id === id ? updated : item)),
      );
      queryClient.setQueryData(sponsorshipQueryKeys.detail(id), updated);
      toast.success('تم تحديث برنامج الكفالة بنجاح');
    },
    onError: (error: unknown) => {
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
  });
}

export default useUpdateSponsorship;
