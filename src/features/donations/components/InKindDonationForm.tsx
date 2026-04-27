import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useDonorDropdown,
  useCreateInKindDonation,
  useUpdateInKindDonation,
} from '../hooks/useInKindDonations';
import { DonorSearchModal } from './DonorSearchModal';
import type { DonorOption, InKindDonation } from '../types/inKindDonation.types';
import { Loader2, Search, User, Info, Package, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

// ── Validation schema ───────────────────────────────────────────────
const schema = z.object({
  donorId: z.number({ required_error: 'يرجى اختيار متبرع' }),
  donorName: z.string(), // display only
  donationTypeName: z.string().min(1, 'يرجى إدخال نوع التبرع'),
  quantity: z.coerce.number().int().positive('يجب أن تكون الكمية أكبر من صفر'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  donationId?: number; // required for edit
  defaultValues?: Partial<FormValues>;
  onSuccess?: (data: InKindDonation) => void;
  onCancel?: () => void;
}

export function InKindDonationForm({
  mode,
  donationId,
  defaultValues,
  onSuccess,
  onCancel,
}: Props) {
  const [searchInput, setSearchInput] = useState(defaultValues?.donorName ?? '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: donors = [], isFetching: searchLoading } = useDonorDropdown(searchInput);

  const createMutation = useCreateInKindDonation();
  const updateMutation = useUpdateInKindDonation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      donorId: defaultValues?.donorId,
      donorName: defaultValues?.donorName ?? '',
      donationTypeName: defaultValues?.donationTypeName ?? '',
      quantity: defaultValues?.quantity ?? 1,
      description: defaultValues?.description ?? '',
    },
  });

  const selectedDonorId = watch('donorId');

  // ── Handle clicks outside dropdown ─────────────────────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Donor selection ─────────────────────────────────────────────
  const handleSelectDonor = (donor: DonorOption) => {
    setValue('donorId', donor.id, { shouldValidate: true });
    setValue('donorName', donor.name);
    setSearchInput(donor.name);
    setIsDropdownOpen(false);
  };

  // ── Submit ──────────────────────────────────────────────────────
  const onSubmit = handleSubmit(async (values) => {
    const dto = {
      donorId: values.donorId,
      donationTypeName: values.donationTypeName,
      quantity: values.quantity,
      description: values.description,
    };

    try {
      if (mode === 'edit' && donationId) {
        const result = await updateMutation.mutateAsync({ id: donationId, payload: dto });
        if (result.succeeded) onSuccess?.(result.data);
      } else {
        const result = await createMutation.mutateAsync(dto);
        if (result.succeeded) onSuccess?.(result.data);
      }
    } catch (err) {
      // Errors handled by mutation hooks
    }
  });

  return (
    <form onSubmit={onSubmit} dir="rtl" className="space-y-6">
      {/* ── Donor ComboBox ────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 font-[Cairo] flex items-center gap-2">
          <User size={16} className="text-primary" />
          <span>المتبرع *</span>
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className={`w-full pr-10 pl-10 py-3 rounded-xl border-2 transition-all font-[Cairo] focus:outline-none ${
                errors.donorId ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-primary'
              }`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsDropdownOpen(true);
                if (selectedDonorId) {
                  setValue('donorId', undefined as any);
                  setValue('donorName', '');
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="ابحث باسم المتبرع..."
              autoComplete="off"
            />
            {searchLoading && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            )}
          </div>

          {isDropdownOpen && (searchInput.trim().length > 0 || donors.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="max-h-60 overflow-y-auto">
                {donors.map((d) => (
                  <li
                    key={d.id}
                    onClick={() => handleSelectDonor(d)}
                    className="flex items-center justify-between p-3 hover:bg-primary/5 cursor-pointer transition-colors group"
                  >
                    <span className="font-[Cairo] text-gray-700 group-hover:text-primary transition-colors">{d.name}</span>
                    <span className="text-xs font-mono text-gray-400">#{d.id}</span>
                  </li>
                ))}
                {donors.length === 0 && !searchLoading && (
                  <li className="p-4 text-center text-sm text-gray-500 font-[Cairo]">لا توجد نتائج</li>
                )}
              </ul>
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdvancedModalOpen(true)}
                  className="w-full py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-all font-[Cairo]"
                >
                  بحث متقدم عن متبرع
                </button>
              </div>
            </div>
          )}
        </div>
        {errors.donorId && (
          <p className="text-xs text-red-600 font-[Cairo] flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.donorId.message}
          </p>
        )}
        {!selectedDonorId && !isDropdownOpen && !searchInput && (
          <button
            type="button"
            onClick={() => setIsAdvancedModalOpen(true)}
            className="text-xs font-bold text-primary hover:underline font-[Cairo]"
          >
            لم تجد المتبرع؟ استخدم البحث المتقدم
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Donation type ─────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 font-[Cairo] flex items-center gap-2">
            <Package size={16} className="text-primary" />
            <span>نوع التبرع *</span>
          </label>
          <Controller
            name="donationTypeName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all font-[Cairo] focus:outline-none ${
                  errors.donationTypeName ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-primary'
                }`}
                placeholder="مثال: ملابس، أغذية، أدوية"
              />
            )}
          />
          {errors.donationTypeName && (
            <p className="text-xs text-red-600 font-[Cairo] flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.donationTypeName.message}
            </p>
          )}
        </div>

        {/* ── Quantity ──────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 font-[Cairo] flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            <span>الكمية *</span>
          </label>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={1}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all font-[Cairo] focus:outline-none ${
                  errors.quantity ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-primary'
                }`}
              />
            )}
          />
          {errors.quantity && (
            <p className="text-xs text-red-600 font-[Cairo] flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Description ───────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 font-[Cairo] flex items-center gap-2">
          <Info size={16} className="text-primary" />
          <span>ملاحظات (اختياري)</span>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary transition-all font-[Cairo] focus:outline-none resize-none"
              placeholder="أي تفاصيل إضافية حول التبرع..."
            />
          )}
        />
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="font-[Cairo] font-bold"
          >
            إلغاء
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="px-8 font-[Cairo] font-bold gap-2"
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : mode === 'edit' ? (
            <CheckCircle2 size={20} />
          ) : (
            <Package size={20} />
          )}
          <span>
            {isPending
              ? 'جاري الحفظ...'
              : mode === 'edit'
              ? 'تحديث التبرع'
              : 'تسجيل التبرع'}
          </span>
        </Button>
      </div>

      {/* ── Advanced Search Modal ──────────────────────────────── */}
      <DonorSearchModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onSelect={handleSelectDonor}
      />
    </form>
  );
}
