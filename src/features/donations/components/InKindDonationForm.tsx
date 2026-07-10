import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  CheckCircle2,
  Loader2,
  X,
  Package,
  Layers,
  ClipboardList,
  Plus,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { DonorSearchSelect } from './DonorSearchSelect';
import {
  useCreateInKindDonation,
  useUpdateInKindDonation,
} from '../hooks/useInKindDonations';
import type { InKindDonation } from '../types/inKindDonation.types';

const createDonationSchema = z.object({
  donorId: z.number({ required_error: 'يجب اختيار المتبرع' }),
  donationTypeName: z.string().min(2, 'نوع التبرع مطلوب'),
  quantity: z.number().min(1, 'الكمية يجب أن تكون 1 على الأقل'),
  description: z.string().optional(),
});

const editDonationSchema = z.object({
  donationTypeName: z.string().min(2, 'نوع التبرع مطلوب'),
  quantity: z.number().min(1, 'الكمية يجب أن تكون 1 على الأقل'),
  description: z.string().optional(),
});

type CreateDonationFormValues = z.infer<typeof createDonationSchema>;
type EditDonationFormValues = z.infer<typeof editDonationSchema>;

interface InKindDonationFormProps {
  existingDonation?: InKindDonation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InKindDonationForm({
  existingDonation,
  onSuccess,
  onCancel,
}: InKindDonationFormProps) {
  const isEditMode = !!existingDonation;
  const createMutation = useCreateInKindDonation();
  const updateMutation = useUpdateInKindDonation();

  const createForm = useForm<CreateDonationFormValues>({
    resolver: zodResolver(createDonationSchema),
    defaultValues: {
      donationTypeName: '',
      quantity: 1,
      description: '',
    },
  });

  const editForm = useForm<EditDonationFormValues>({
    resolver: zodResolver(editDonationSchema),
    defaultValues: {
      donationTypeName: existingDonation?.donationTypeName || '',
      quantity: existingDonation?.quantity || 1,
      description: existingDonation?.description || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = isEditMode ? editForm : createForm;

  const selectedDonorId = isEditMode ? undefined : createForm.watch('donorId');

  useEffect(() => {
    if (existingDonation) {
      editForm.reset({
        donationTypeName: existingDonation.donationTypeName,
        quantity: existingDonation.quantity,
        description: existingDonation.description || '',
      });
    }
  }, [existingDonation, editForm]);

  const onSubmit = async (data: CreateDonationFormValues | EditDonationFormValues) => {
    try {
      if (isEditMode && existingDonation) {
        await updateMutation.mutateAsync({
          id: existingDonation.id,
          payload: {
            donationTypeName: data.donationTypeName,
            quantity: data.quantity,
            description: data.description,
          },
        });
      } else {
        const createData = data as CreateDonationFormValues;
        await createMutation.mutateAsync(createData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save donation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 space-y-3">
          <label className="text-sm font-bold text-[#101727] font-[Cairo] flex items-center gap-2 pr-1">
            <User size={16} className="text-[#00549A]" />
            {isEditMode ? 'المتبرع' : 'اختيار المتبرع'} {!isEditMode && <span className="text-red-500">*</span>}
          </label>

          {isEditMode ? (
            <div className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 font-[Cairo] text-sm text-[#101727] flex items-center gap-3">
              <User size={18} className="text-[#00549A]" />
              <span className="font-bold">{existingDonation?.donorName || '—'}</span>
              {existingDonation?.donorId ? (
                <span className="text-[#697282] text-xs">#{existingDonation.donorId}</span>
              ) : null}
            </div>
          ) : (
            <div className="relative group">
              <DonorSearchSelect
                onSelect={(id) => createForm.setValue('donorId', id, { shouldValidate: true })}
                selectedDonorId={selectedDonorId}
              />
              {'donorId' in errors && errors.donorId && (
                <p className="text-xs text-red-500 font-[Cairo] mt-1.5 pr-1 flex items-center gap-1">
                  <X size={12} /> {errors.donorId.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-[#101727] font-[Cairo] flex items-center gap-2 pr-1">
            <Layers size={16} className="text-[#00549A]" />
            نوع التبرع <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              {...register('donationTypeName')}
              className={`w-full px-5 py-4 rounded-2xl border transition-all font-[Cairo] text-sm outline-none bg-gray-50/30 focus:bg-white
                ${errors.donationTypeName ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-[#00549A]/10 focus:border-[#00549A]'}
              `}
              placeholder="مثال: ملابس، مواد غذائية، أثاث..."
            />
            {errors.donationTypeName && (
              <p className="text-xs text-red-500 font-[Cairo] mt-1.5 pr-1 flex items-center gap-1">
                <X size={12} /> {errors.donationTypeName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-[#101727] font-[Cairo] flex items-center gap-2 pr-1">
            <Package size={16} className="text-[#00549A]" />
            الكمية / العدد <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              className={`w-full px-5 py-4 rounded-2xl border transition-all font-[Cairo] text-sm outline-none bg-gray-50/30 focus:bg-white
                ${errors.quantity ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-[#00549A]/10 focus:border-[#00549A]'}
              `}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-xs text-red-500 font-[Cairo] mt-1.5 pr-1 flex items-center gap-1">
                <X size={12} /> {errors.quantity.message}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="text-sm font-bold text-[#101727] font-[Cairo] flex items-center gap-2 pr-1">
            <ClipboardList size={16} className="text-[#00549A]" />
            وصف إضافي (اختياري)
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm outline-none resize-none"
            placeholder="أضف أي تفاصيل أخرى عن حالة التبرع أو ملاحظات خاصة..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="px-8 py-3.5 font-bold text-[#697282] hover:text-[#101727] hover:bg-gray-100 rounded-2xl transition-all font-[Cairo] text-sm"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#00549A] to-[#0070c0] text-white font-bold font-[Cairo] text-sm shadow-xl shadow-[#00549A]/20 hover:shadow-2xl hover:shadow-[#00549A]/30 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              {isEditMode ? <CheckCircle2 size={18} /> : <Plus size={18} strokeWidth={3} />}
              <span>{isEditMode ? 'حفظ التعديلات' : 'تسجيل التبرع'}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
