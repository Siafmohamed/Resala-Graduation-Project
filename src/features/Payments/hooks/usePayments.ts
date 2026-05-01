import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../services/payments.service';
import type { PaymentMethod, PaymentType } from '../types/payments.types';

export const paymentQueryKeys = {
  all: ['payments'] as const,
  list: (type: PaymentType, method: PaymentMethod) => [...paymentQueryKeys.all, 'list', type, method] as const,
  details: (type: PaymentType, id: number) => [...paymentQueryKeys.all, 'details', type, id] as const,
  deliveryAreas: () => [...paymentQueryKeys.all, 'deliveryAreas'] as const,
};

export const usePendingPayments = (type: PaymentType, method: PaymentMethod) => {
  return useQuery({
    queryKey: paymentQueryKeys.list(type, method),
    queryFn: () => paymentsService.getPendingPayments(type, method),
  });
};

export const usePaymentDetails = (type: PaymentType, id: number) => {
  return useQuery({
    queryKey: paymentQueryKeys.details(type, id),
    queryFn: () => paymentsService.getPaymentDetails(type, id),
    enabled: !!id,
  });
};

export const useVerifyPayment = (type: PaymentType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentsService.verifyPayment(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
    },
  });
};

export const useRejectPayment = (type: PaymentType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      paymentsService.rejectPayment(type, id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
    },
  });
};

export const useDeliveryAreas = () => {
  return useQuery({
    queryKey: paymentQueryKeys.deliveryAreas(),
    queryFn: () => paymentsService.getDeliveryAreas(),
  });
};
