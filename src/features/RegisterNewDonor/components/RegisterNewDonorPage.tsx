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
  X as CloseIcon
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
      await donorService.registerDonor(form);
      toast.success('تم تسجيل المتبرع وتفعيل حسابه بنجاح');
      
      // Smart Sponsorship Setup: Instead of just navigating, we could show a modal 
      // or redirect to a dedicated sponsorship setup page for this new donor.
      navigate('/donors', { replace: true, state: { openSponsorship: true, donorName: form.name } });
    } catch (err: any) {
      const msg = err.message || 'فشل إضافة المتبرع';
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
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3 self-end">
          <h1 className="font-[Cairo] font-black text-3xl text-[#101727]">تسجيل متبرع جديد</h1>
          <div className="w-12 h-12 rounded-2xl bg-[#00549A] text-white flex items-center justify-center shadow-lg shadow-[#00549A]/20">
            <UserPlus size={24} />
          </div>
        </div>
        <p className="font-[Cairo] text-[#697282] text-lg text-right">قم بإدخال بيانات المتبرع لإنشاء حساب مفعل فوراً</p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-4xl border-none shadow-[0px_20px_60px_rgba(0,0,0,0.03)] rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="p-8 sm:p-12 md:p-16 flex flex-col gap-12">
              
              {error && (
                <div className="rounded-[24px] bg-red-50 p-6 text-sm font-[Cairo] text-red-700 text-right border-2 border-red-100/50 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <CloseIcon size={20} strokeWidth={3} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-base">عذراً، حدث خطأ</span>
                    <span className="opacity-80">{error}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {inputFields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-3 group">
                    <label htmlFor={field.id} className="font-[Cairo] font-bold text-base text-[#495565] text-right flex items-center gap-2 self-end transition-colors group-focus-within:text-[#00549A]">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#00549A] transition-colors">
                        <field.icon size={20} />
                      </div>
                      <input
                        id={field.id}
                        type={field.type}
                        value={(form as any)[field.id]}
                        onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        dir={field.dir || 'rtl'}
                        className="w-full pr-14 pl-8 py-5 rounded-2xl border-2 border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:border-[#00549A]/20 focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all placeholder:text-[#94A3B8]"
                        required={field.required}
                      />
                    </div>
                  </div>
                ))}

                {/* Notes Input - Full Width */}
                <div className="flex flex-col gap-3 md:col-span-2 group">
                  <label htmlFor="notes" className="font-[Cairo] font-bold text-base text-[#495565] text-right flex items-center gap-2 self-end transition-colors group-focus-within:text-[#00549A]">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    id="notes"
                    value={form.notes ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="أضف أي ملاحظات إضافية عن المتبرع..."
                    rows={4}
                    className="w-full px-8 py-5 rounded-2xl border-2 border-[#F1F5F9] bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:border-[#00549A]/20 focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all resize-none placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="p-8 bg-[#F8FAFC] border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-5 rounded-2xl bg-[#00549A] text-white font-bold font-[Cairo] text-xl hover:bg-[#004077] transition-all shadow-xl shadow-[#00549A]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري تسجيل البيانات...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={24} />
                    <span>تأكيد وتسجيل المتبرع</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-5 rounded-2xl border-2 border-gray-200 bg-white text-[#697282] font-bold font-[Cairo] text-lg hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
              >
                إلغاء
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Trust Info */}
      <div className="mt-12 flex items-center gap-6 text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1E7E34]" />
          <span className="font-[Cairo] text-sm">تفعيل فوري للحساب</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00549A]" />
          <span className="font-[Cairo] text-sm">تسجيل آمن (Dashboard)</span>
        </div>
      </div>
    </div>
  );
}
