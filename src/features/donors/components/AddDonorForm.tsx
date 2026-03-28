import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { donorService } from '../services/donorService';
import type { DonorFormData, SponsorshipType } from '../types/donor.types';
import { SPONSORSHIP_TYPE_LABELS } from '../types/donor.types';
import { isValidEgyptianPhone } from '@/shared/utils/validators/phoneValidator';
import { 
  UserPlus, 
  ChevronDown, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  FileText 
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';

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
      toast.error('الاسم مطلوب');
      return;
    }

    const phoneCheck = isValidEgyptianPhone(form.phone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error ?? 'رقم الهاتف غير صحيح');
      toast.error(phoneCheck.error ?? 'رقم الهاتف غير صحيح');
      return;
    }

    setIsSubmitting(true);
    try {
      await donorService.createDonor(form);
      toast.success('تم إضافة المتبرع بنجاح');
      navigate('/donors', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'فشل إضافة المتبرع';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl border-none shadow-[0px_4px_30px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-8 md:p-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10" dir="rtl">
          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#EEF3FB] text-[#00549A]">
                <UserPlus size={28} strokeWidth={2} />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="font-[Cairo] font-bold text-2xl text-[#101727]">بيانات المتبرع</h2>
                <p className="font-[Cairo] text-sm text-[#697282]">يرجى تعبئة كافة الحقول المطلوبة</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-5 text-sm font-[Cairo] text-red-700 text-right border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* Name Input */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="name" className="font-[Cairo] font-bold text-sm text-[#495565] flex items-center gap-2">
                <User size={16} className="text-[#94a3b8]" />
                الاسم بالكامل *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="أدخل اسم المتبرع كاملاً"
                className="w-full px-6 py-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-sm text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white transition-all"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="phone" className="font-[Cairo] font-bold text-sm text-[#495565] flex items-center gap-2">
                <Phone size={16} className="text-[#94a3b8]" />
                رقم الهاتف *
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="01XXXXXXXXX"
                dir="ltr"
                className="w-full px-6 py-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-sm text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white transition-all"
                required
              />
            </div>

            {/* Sponsorship Select */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="sponsorshipType" className="font-[Cairo] font-bold text-sm text-[#495565] flex items-center gap-2">
                <Heart size={16} className="text-[#94a3b8]" />
                نوع الكفالة *
              </label>
              <div className="relative">
                <select
                  id="sponsorshipType"
                  value={form.sponsorshipType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sponsorshipType: e.target.value as SponsorshipType,
                    }))
                  }
                  className="w-full px-6 py-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-sm text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>أختر نوع الكفالة</option>
                  {SPONSORSHIP_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={18} />
              </div>
            </div>

            {/* Optional Email */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="font-[Cairo] font-bold text-sm text-[#495565] flex items-center gap-2">
                <Mail size={16} className="text-[#94a3b8]" />
                البريد الإلكتروني (اختياري)
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@mail.com"
                dir="ltr"
                className="w-full px-6 py-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-sm text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white transition-all"
              />
            </div>

            {/* Notes Input - Full Width */}
            <div className="flex flex-col gap-2.5 md:col-span-2">
              <label htmlFor="notes" className="font-[Cairo] font-bold text-sm text-[#495565] flex items-center gap-2">
                <FileText size={16} className="text-[#94a3b8]" />
                ملاحظات إضافية
              </label>
              <textarea
                id="notes"
                value={form.notes ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="أضف أي ملاحظات إضافية عن المتبرع..."
                rows={4}
                className="w-full px-6 py-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-sm text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4.5 rounded-2xl border border-gray-200 bg-white text-[#697282] font-bold font-[Cairo] text-base hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-4.5 rounded-2xl bg-[#00549A] text-white font-bold font-[Cairo] text-lg hover:bg-[#004077] transition-all shadow-xl shadow-[#00549A]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ بيانات المتبرع'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
