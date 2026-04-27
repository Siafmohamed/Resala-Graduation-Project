import { useQuery } from '@tanstack/react-query';
import { pendingPaymentsService } from '../services/pendingPaymentsService';

export const useDeliveryAreas = () => {
  return useQuery({
    queryKey: ['deliveryAreas'],
    queryFn: () => pendingPaymentsService.getDeliveryAreas(),
    retry: 1,
  });
};
