import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Gift, 
  ChevronDown, 
  AlertCircle, 
  Package,
  FileText,
  Plus,
  Save,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { DonorSearchSelect } from './DonorSearchSelect';
import { useCreateInKindDonation, useInKindDonation, useUpdateInKindDonation } from '../hooks/useInKindDonations';

export function RegisterDonationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateInKindDonation();
  const updateMutation = useUpdateInKindDonation();
  const { data: existingDonation, isLoading: isLoadingExisting } = useInKindDonation(id || '');
  
  const [form, setForm] = useState({
    donorId: '',
    donationTypeName: '',
    quantity: 1,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingDonation) {
      setForm({
        donorId: existingDonation.donorId,
        donationTypeName: existingDonation.donationTypeName,
        quantity: existingDonation.quantity,
        description: existingDonation.description,
      });
    }
  }, [existingDonation]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.donorId) newErrors.donorId = 'يرجى اختيار المتبرع';
    if (!form.donationTypeName) newErrors.donationTypeName = 'يرجى اختيار نوع التبرع';
    if (form.quantity <= 0) newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    if (!form.description.trim()) newErrors.description = 'الوصف مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (id) {
      updateMutation.mutate({ id, payload: form }, {
        onSuccess: () => navigate('/in-kind-donations')
      });
    } else {
      createMutation.mutate(form, {
        onSuccess: () => navigate('/in-kind-donations')
      });
    }
  };

  if (id && isLoadingExisting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
        <span className="font-[Cairo] text-[#697282]">جاري تحميل بيانات التبرع...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/in-kind-donations')}
            className="flex items-center gap-2 px-4 py-2 border-gray-200 text-[#697282] hover:text-[#00549A] hover:border-[#00549A] rounded-xl font-[Cairo] font-bold transition-all"
          >
            <ArrowLeft size={18} />
            رجوع
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">
              {id ? 'تعديل التبرع العيني' : 'تسجيل تبرع عيني'}
            </h1>
            <p className="font-[Cairo] font-medium text-[#697282] text-sm">
              {id ? 'تعديل بيانات التبرع العيني المسجل' : 'إضافة تبرع عيني جديد إلى النظام'}
            </p>
          </div>
        </div>
      </div>
      {/* Form Card */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Form Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#e6eff7] to-[#f0f7ff] text-[#00549A]">
                <Gift size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-[Cairo] font-bold text-lg text-[#101727]">
                  {id ? 'بيانات التبرع' : 'بيانات التبرع الجديد'}
                </h2>
                <p className="font-[Cairo] text-sm text-[#697282]">
                  {id ? 'قم بتعديل البيانات المطلوبة' : 'قم بملء جميع الحقول المطلوبة'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Donor Search */}
              <div className="flex flex-col gap-3">
                <label className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                  اسم المتبرع <span className="text-red-500">*</span>
                </label>
                <DonorSearchSelect 
                  selectedDonorId={form.donorId}
                  onSelect={(id) => {
                    setForm(f => ({ ...f, donorId: id }));
                    setErrors(e => ({ ...e, donorId: '' }));
                  }}
                  error={!!errors.donorId}
                />
                {errors.donorId && <span className="text-red-500 text-xs font-[Cairo] text-right">{errors.donorId}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Donation Type */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="donationTypeName" className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                    نوع التبرع <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="donationTypeName"
                      value={form.donationTypeName}
                      onChange={(e) => {
                        setForm(f => ({ ...f, donationTypeName: e.target.value }));
                        setErrors(e => ({ ...e, donationTypeName: '' }));
                      }}
                      className={`w-full px-8 py-5 rounded-2xl border-none bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all appearance-none cursor-pointer ${
                        errors.donationTypeName ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      <option value="" disabled>أختر نوع التبرع</option>
                      <option value="ملابس">ملابس</option>
                      <option value="طعام">طعام</option>
                      <option value="أثاث">أثاث</option>
                      <option value="أجهزة كهربائية">أجهزة كهربائية</option>
                      <option value="بطاطين">بطاطين</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                    <ChevronDown className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={20} />
                  </div>
                  {errors.donationTypeName && <span className="text-red-500 text-xs font-[Cairo] text-right">{errors.donationTypeName}</span>}
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="quantity" className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                    الكمية <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => {
                        setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 0 }));
                        setErrors(e => ({ ...e, quantity: '' }));
                      }}
                      className={`w-full px-8 py-5 rounded-2xl border-none bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all ${
                        errors.quantity ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    <Package className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={20} />
                  </div>
                  {errors.quantity && <span className="text-red-500 text-xs font-[Cairo] text-right">{errors.quantity}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-3">
                <label htmlFor="description" className="font-[Cairo] font-bold text-base text-[#101727] text-right flex items-center gap-2 self-end">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => {
                      setForm(f => ({ ...f, description: e.target.value }));
                      setErrors(e => ({ ...e, description: '' }));
                    }}
                    placeholder="اكتب وصفاً تفصيلياً للتبرع (الحالة، التفاصيل، إلخ)"
                    rows={5}
                    className={`w-full px-8 py-5 rounded-2xl border-none bg-[#F8FAFC] font-[Cairo] text-base text-right focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:bg-white transition-all resize-none ${
                      errors.description ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  <FileText className="absolute left-8 top-8 text-[#94a3b8] pointer-events-none" size={20} />
                </div>
                {errors.description && <span className="text-red-500 text-xs font-[Cairo] text-right">{errors.description}</span>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6 border-t border-gray-100">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-[2] py-6 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-base hover:bg-[#004077] transition-all shadow-lg shadow-[#00549A]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    جاري {id ? 'التحديث' : 'التسجيل'}...
                  </>
                ) : (
                  <>
                    {id ? <Save size={20} /> : <Plus size={20} />}
                    {id ? 'حفظ التغييرات' : 'تسجيل التبرع'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/in-kind-donations')}
                variant="outline"
                className="flex-1 py-6 rounded-xl border-gray-200 text-[#697282] font-bold font-[Cairo] text-base hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Important Notes Section */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#e6eff7] text-[#00549A] flex-shrink-0 mt-1">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-[Cairo] font-bold text-base text-[#101727] mb-3">ملاحظات هامة</h3>
              <ul className="space-y-2 font-[Cairo] text-[#697282] text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#00549A] mt-1">•</span>
                  <span>تأكد من فحص التبرع جيداً قبل تسجيله في النظام</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00549A] mt-1">•</span>
                  <span>يرجى كتابة وصف دقيق للكمية وحالة العناصر المستلمة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00549A] mt-1">•</span>
                  <span>سيتم إرسال إشعار آلي لإدارة المخازن فور إتمام التسجيل</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
