import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../services/donorService';
import type { DonorFormData, SponsorshipType } from '../types/donor.types';
import { SPONSORSHIP_TYPE_LABELS } from '../types/donor.types';
import { isValidEgyptianPhone } from '@/shared/utils/validators/phoneValidator';

const SPONSORSHIP_OPTIONS = Object.entries(
  SPONSORSHIP_TYPE_LABELS
) as [SponsorshipType, string][];

export function AddDonorForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DonorFormData>({
    name: '',
    phone: '',
    sponsorshipType: 'orphan',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('الاسم مطلوب');
      return;
    }

    const phoneCheck = isValidEgyptianPhone(form.phone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error ?? 'رقم الهاتف غير صحيح');
      return;
    }

    setIsSubmitting(true);
    try {
      await donorService.createDonor(form);
      navigate('/donors', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إضافة المتبرع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4" dir="rtl">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          الاسم *
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="أدخل اسم المتبرع"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          رقم الهاتف *
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="01XXXXXXXXX"
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="sponsorshipType" className="block text-sm font-medium mb-1">
          نوع الكفالة *
        </label>
        <select
          id="sponsorshipType"
          value={form.sponsorshipType}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              sponsorshipType: e.target.value as SponsorshipType,
            }))
          }
          className="w-full rounded-md border px-3 py-2"
        >
          {SPONSORSHIP_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          ملاحظات (اختياري)
        </label>
        <textarea
          id="notes"
          value={form.notes ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="أضف أي ملاحظات إضافية"
          rows={3}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border px-4 py-2"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة المتبرع'}
        </button>
      </div>
    </form>
  );
}
