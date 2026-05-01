/**
 * @file index.ts
 * @description Public barrel export for the unified Payments feature.
 */

// --- Pages ---
export { default as PaymentsDashboardPage } from './pages/PaymentsDashboardPage';
export { default as PaymentDetailsPage } from './pages/PaymentDetailsPage';

// --- Hooks ---
export {
  usePendingPayments,
  usePaymentDetails,
  useVerifyPayment,
  useRejectPayment,
  useDeliveryAreas,
  paymentQueryKeys
} from './hooks/usePayments';

// --- Components ---
export { PaymentTable } from './components/list/PaymentTable';
export { UnifiedPaymentDetails } from './components/details/UnifiedPaymentDetails';

// --- Service ---
export { paymentsService } from './services/payments.service';

// --- Types ---
export type {
  PaymentType,
  PaymentMethod,
  BasePayment,
  SubscriptionPayment,
  EmergencyPayment,
  UnifiedPayment,
  DeliveryArea
} from './types/payments.types';
