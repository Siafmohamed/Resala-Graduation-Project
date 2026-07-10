import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type BroadcastNotificationPayload } from '../services/notificationService';
import { toast } from 'react-toastify';

export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BroadcastNotificationPayload) => {
      return await notificationService.broadcast(payload);
    },
    onSuccess: (response) => {
      if (response.succeeded) {
        toast.success(response.message || 'تم إرسال الإشعار بنجاح!');
      } else {
        const errorMessage = response.errors?.length > 0 
          ? response.errors.join(', ') 
          : response.message || 'حدث خطأ أثناء إرسال الإشعار';
        toast.error(errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'حدث خطأ أثناء إرسال الإشعار';
      toast.error(errorMessage);
    },
  });
};
