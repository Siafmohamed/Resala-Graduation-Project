import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserPlus, 
  Mail,
  Phone,
  Lock,
  Briefcase,
  PhoneCall,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { donorService } from '@/features/donors/services/donorService';
import type { DonorFormData } from '@/features/donors/types/donor.types';
import { isValidEgyptianPhone } from '@/shared/utils/validators/phoneValidator';

export function RegisterNewDonorPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DonorFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    job: '',
    landline: '',
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

    const phoneCheck = isValidEgyptianPhone(form.phoneNumber);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error ?? 'رقم الهاتف غير صحيح');
      toast.error(phoneCheck.error ?? 'رقم الهاتف غير صحيح');
      return;
    }

    setIsSubmitting(true);
    try {
      await donorService.createDonor(form);
      toast.success('تم تسجيل المتبرع بنجاح');
      
      // Smart Sponsorship Setup: Instead of just navigating, we could show a modal 
      // or redirect to a dedicated sponsorship setup page for this new donor.
      // For now, let's navigate to donors list as requested, but with a state to trigger the "smart way"
      navigate('/donors', { replace: true, state: { openSponsorship: true, donorName: form.name } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'فشل إضافة المتبرع';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { id: 'name', label: 'الاسم الكامل', type: 'text', icon: UserPlus, placeholder: 'أدخل اسم المتبرع', required: true },
    { id: 'email', label: 'البريد الإلكتروني', type: 'email', icon: Mail, placeholder: 'example@mail.com', required: true },
    { id: 'phoneNumber', label: 'رقم الهاتف', type: 'tel', icon: Phone, placeholder: '01XXXXXXXXX', required: true, dir: 'ltr' },
    { id: 'password', label: 'كلمة المرور', type: 'password', icon: Lock, placeholder: '********', required: true },
    { id: 'job', label: 'الوظيفة', type: 'text', icon: Briefcase, placeholder: 'أدخل الوظيفة', required: true },
    { id: 'landline', label: 'التليفون الأرضي', type: 'tel', icon: PhoneCall, placeholder: '02XXXXXXXX', required: true, dir: 'ltr' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Form Card */}
      <Card className="w-full max-w-4xl border-none shadow-[0px_10px_40px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-8 sm:p-12 md:p-16">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Form Title & Icon */}
            <div className="flex items-center gap-4 self-end">
              <span className="font-[Cairo] font-bold text-2xl text-[#00549A]">بيانات المتبرع الجديد</span>
              <div className="p-3.5 rounded-2xl bg-[#EEF3FB] text-[#00549A]">
                <UserPlus size={28} strokeWidth={2.5} />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-sm font-[Cairo] text-red-700 text-right border-none flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inputFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <label htmlFor={field.id} className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      id={field.id}
                      type={field.type}
                      value={(form as any)[field.id]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      dir={field.dir || 'rtl'}
                      className="w-full px-8 py-5 rounded-2xl border-none bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all"
                      required={field.required}
                    />
                  </div>
                </div>
              ))}

              {/* Notes Input - Full Width */}
              <div className="flex flex-col gap-3 md:col-span-2">
                <label htmlFor="notes" className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  id="notes"
                  value={form.notes ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="أضف أي ملاحظات إضافية"
                  rows={4}
                  className="w-full px-8 py-5 rounded-2xl border-none bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-5 rounded-2xl bg-[#00549A] text-white font-bold font-[Cairo] text-lg hover:bg-[#004077] transition-all shadow-xl shadow-[#00549A]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? 'جاري الإضافة...' : 'إضافة المتبرع'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-5 rounded-2xl border-none bg-[#F8FAFC] text-[#697282] font-bold font-[Cairo] text-lg hover:bg-gray-100 transition-all active:scale-[0.98]"
              >
                إلغاء
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
