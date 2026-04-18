import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, Lock, Shield, ShieldCheck, UserCog, AlertCircle } from 'lucide-react';
import { useCreateStaff, useUpdateStaff } from '../hooks/useAccounts';
import { extractApiError } from '@/features/authentication/services/authService';
import type { Account, CreateStaffPayload } from '../types/accountManagement.types';
import { Role } from '@/features/authentication';
import { containsPotentialXss } from '@/shared/utils/security/sanitization';
import logger from '@/shared/utils/logger';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Account | null;
}

export function StaffFormModal({ isOpen, onClose, staff }: StaffFormModalProps) {
  const isEdit = !!staff;
  const [serverError, setServerError] = useState<string | null>(null);
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStaffPayload>({
    defaultValues: {
      staffType: 2
    }
  });

  const selectedType = watch('staffType');

  useEffect(() => {
    setServerError(null);
    if (staff) {
      reset({
        name: staff.fullName,
        username: staff.username,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        staffType: staff.role === Role.ADMIN ? 1 : 2,
      });
    } else {
      reset({
        name: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        staffType: 2,
      });
    }
  }, [staff, reset, isOpen]);

  const onSubmit = async (formData: CreateStaffPayload) => {
    setServerError(null);

    // XSS Protection
    if (
      containsPotentialXss(formData.name) || 
      containsPotentialXss(formData.username) || 
      containsPotentialXss(formData.email || '') || 
      containsPotentialXss(formData.phoneNumber || '')
    ) {
      setServerError('إدخال غير صالح يحتوي على رموز ممنوعة');
      return;
    }

    // Ensure staffType is a number
    const payload = {
      ...formData,
      staffType: Number(formData.staffType) as 1 | 2
    };

    try {
      logger.log('[StaffFormModal] Submitting:', { ...payload, password: '***' });
      if (isEdit) {
        await updateMutation.mutateAsync({ 
          id: staff!.id, 
          payload: {
            name: payload.name,
            username: payload.username,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            staffType: payload.staffType
          } 
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      const apiErr = extractApiError(error);
      setServerError(apiErr.message);
    }
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo]">
            {isEdit ? 'تعديل بيانات الحساب' : 'إضافة حساب موظف جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-[Cairo]">
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
                <input
                  {...register('name', { required: 'الاسم الكامل مطلوب' })}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]"
                  placeholder="أدخل الاسم الرباعي"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-[Cairo]">{errors.name.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">اسم المستخدم</label>
              <div className="relative">
                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
                <input
                  {...register('username', { required: 'اسم المستخدم مطلوب' })}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]"
                  placeholder="اسم المستخدم (بالإنجليزي)"
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 font-[Cairo]">{errors.username.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
              <input
                {...register('email', { 
                  pattern: { value: /^\S+@\S+$/i, message: 'بريد إلكتروني غير صالح' }
                })}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]"
                placeholder="example@resala.org"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-[Cairo]">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
              <input
                {...register('phoneNumber')}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          {!isEdit && (
            /* Password */
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
                <input
                  {...register('password', { required: 'كلمة المرور مطلوبة', minLength: { value: 6, message: 'كلمة المرور قصيرة جداً' } })}
                  type="password"
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]"
                  placeholder="********"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 font-[Cairo]">{errors.password.message}</p>}
            </div>
          )}

          {/* Role / Staff Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">نوع الحساب (الدور)</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`
                flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                ${Number(selectedType) === 1 ? 'border-[#00549A] bg-[#f0f7ff] text-[#00549A]' : 'border-gray-100 text-[#697282] hover:bg-gray-50'}
              `}>
                <input {...register('staffType')} type="radio" value={1} className="hidden" />
                <ShieldCheck size={18} />
                <span className="font-bold text-sm font-[Cairo]">مدير نظام</span>
              </label>
              <label className={`
                flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                ${Number(selectedType) === 2 ? 'border-[#00549A] bg-[#f0f7ff] text-[#00549A]' : 'border-gray-100 text-[#697282] hover:bg-gray-50'}
              `}>
                <input {...register('staffType')} type="radio" value={2} className="hidden" />
                <UserCog size={18} />
                <span className="font-bold text-sm font-[Cairo]">موظف استقبال</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-100 transition-colors font-[Cairo]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 font-[Cairo] disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isEdit ? 'حفظ التعديلات' : 'إنشاء الحساب'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
