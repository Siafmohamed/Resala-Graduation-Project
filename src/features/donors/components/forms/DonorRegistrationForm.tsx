import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/Button';
import { User, Phone, Mail, MapPin, Notebook, Save, X } from 'lucide-react';
import type { DonorRegistrationPayload } from '../../types/donors.types';

interface DonorRegistrationFormProps {
  onSubmit: (data: DonorRegistrationPayload) => void;
  onCancel: () => void;
  initialData?: Partial<DonorRegistrationPayload>;
  isSubmitting?: boolean;
}

export const DonorRegistrationForm: React.FC<DonorRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<DonorRegistrationPayload>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
            <User size={16} className="text-[#00549A]" />
            الاسم الكامل
          </label>
          <input
            {...register('fullName', { required: 'الاسم مطلوب' })}
            className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo]`}
            placeholder="أدخل الاسم الرباعي..."
          />
          {errors.fullName && <p className="text-xs text-red-500 font-[Cairo]">{errors.fullName.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
            <Phone size={16} className="text-[#00549A]" />
            رقم الهاتف
          </label>
          <input
            {...register('phone', { 
              required: 'رقم الهاتف مطلوب',
              pattern: { value: /^01[0125][0-9]{8}$/, message: 'رقم هاتف مصري غير صحيح' }
            })}
            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo]`}
            placeholder="01xxxxxxxxx"
          />
          {errors.phone && <p className="text-xs text-red-500 font-[Cairo]">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
            <Mail size={16} className="text-[#00549A]" />
            البريد الإلكتروني (اختياري)
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo]"
            placeholder="example@mail.com"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
            <MapPin size={16} className="text-[#00549A]" />
            العنوان
          </label>
          <input
            {...register('address')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo]"
            placeholder="المدينة، الحي، الشارع..."
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
          <Notebook size={16} className="text-[#00549A]" />
          ملاحظات إضافية
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo] resize-none"
          placeholder="أي معلومات إضافية عن المتبرع..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="font-[Cairo] font-bold rounded-xl px-6"
        >
          <X size={18} className="ml-2" />
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00549A] text-white hover:bg-[#004077] font-[Cairo] font-bold rounded-xl px-8 shadow-lg shadow-blue-200"
        >
          {isSubmitting ? 'جاري الحفظ...' : (
            <>
              <Save size={18} className="ml-2" />
              حفظ بيانات المتبرع
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
