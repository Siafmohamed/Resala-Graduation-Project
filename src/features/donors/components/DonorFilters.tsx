import { useDonorStore } from '../store/donorSlice';
import type { PaymentStatus, SponsorshipType } from '../types/donor.types';
import { SPONSORSHIP_TYPE_LABELS } from '../types/donor.types';

const PAYMENT_OPTIONS: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'paid', label: 'دفع' },
  { value: 'partial', label: 'تم تسديد جزء' },
  { value: 'overdue', label: 'متأخر' },
  { value: 'cancelled', label: 'لاغي' },
];

const SPONSORSHIP_OPTIONS: { value: SponsorshipType | 'all'; label: string }[] = [
  { value: 'all', label: 'الكل' },
  ...(Object.entries(SPONSORSHIP_TYPE_LABELS) as [SponsorshipType, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

export function DonorFilters() {
  const paymentStatus = useDonorStore((s) => s.filters.paymentStatus);
  const sponsorshipType = useDonorStore((s) => s.filters.sponsorshipType);
  const setPaymentStatus = useDonorStore((s) => s.setPaymentStatus);
  const setSponsorshipType = useDonorStore((s) => s.setSponsorshipType);

  return (
    <div className="flex flex-wrap gap-3" dir="rtl">
      <div>
        <label htmlFor="payment-status" className="sr-only">حالة الدفع</label>
        <select
          id="payment-status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus | 'all')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sponsorship-type" className="sr-only">نوع الكفالة</label>
        <select
          id="sponsorship-type"
          value={sponsorshipType}
          onChange={(e) => setSponsorshipType(e.target.value as SponsorshipType | 'all')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {SPONSORSHIP_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
          <option value="all">الكل</option>
        </select>
      </div>
    </div>
  );
}
