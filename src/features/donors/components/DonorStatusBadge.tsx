import type { PaymentStatus } from '../types/donor.types';
import { getPaymentStatusLabel, getPaymentStatusColor } from '../utils/donorHelpers';

const STATUS_CLASSES: Record<string, string> = {
  statusPaid: 'bg-green-100 text-green-800',
  statusPartial: 'bg-amber-100 text-amber-800',
  statusOverdue: 'bg-red-100 text-red-800',
  statusCancelled: 'bg-gray-100 text-gray-700',
};

interface DonorStatusBadgeProps {
  status: PaymentStatus;
}

export function DonorStatusBadge({ status }: DonorStatusBadgeProps) {
  const label = getPaymentStatusLabel(status);
  const colorKey = getPaymentStatusColor(status);
  const classes = STATUS_CLASSES[colorKey] ?? 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
