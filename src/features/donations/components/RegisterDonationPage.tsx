import { useNavigate, useParams } from 'react-router-dom';
import { Gift, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { InKindDonationForm } from './InKindDonationForm';
import { useInKindDonation } from '../hooks/useInKindDonations';
import type { InKindDonation } from '../types/inKindDonation.types';

/**
 * Page wrapper for creating / editing an in-kind donation.
 * All form logic lives in <InKindDonationForm>; this component
 * only handles routing, data fetching for edit-mode, and page chrome.
 */
export function RegisterDonationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;

  // Fetch existing donation only when in edit mode
  const {
    data: existingDonation,
    isLoading: isLoadingExisting,
    isError,
  } = useInKindDonation(id ?? '');

  const handleSuccess = (_donation: InKindDonation) => {
    navigate('/in-kind-donations');
  };

  const handleCancel = () => navigate('/in-kind-donations');

  // ── Loading state (edit mode only) ────────────────────────────────
  if (isEditMode && isLoadingExisting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00549A]" />
        <span className="font-[Cairo] text-[#697282]">جاري تحميل بيانات التبرع...</span>
      </div>
    );
  }

  // ── Error state (edit mode only) ──────────────────────────────────
  if (isEditMode && isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <span className="font-[Cairo] text-red-500">تعذّر تحميل بيانات التبرع</span>
        <Button variant="outline" onClick={handleCancel} className="font-[Cairo]">
          رجوع
        </Button>
      </div>
    );
  }

  // Build default values from the fetched donation (edit) or undefined (create)
  const defaultValues = existingDonation
    ? {
        donorId: existingDonation.donorId,
        donorName: existingDonation.donorName,
        donationTypeName: existingDonation.donationTypeName,
        quantity: existingDonation.quantity,
        description: existingDonation.description ?? '',
      }
    : undefined;

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 border-gray-200 text-[#697282] hover:text-[#00549A] hover:border-[#00549A] rounded-xl font-[Cairo] font-bold transition-all"
        >
          <ArrowLeft size={18} />
          رجوع
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">
            {isEditMode ? 'تعديل التبرع العيني' : 'تسجيل تبرع عيني'}
          </h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">
            {isEditMode
              ? 'تعديل بيانات التبرع العيني المسجل'
              : 'إضافة تبرع عيني جديد إلى النظام'}
          </p>
        </div>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────── */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-8">
          {/* Form card header */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#e6eff7] to-[#f0f7ff] text-[#00549A]">
              <Gift size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-[Cairo] font-bold text-lg text-[#101727]">
                {isEditMode ? 'بيانات التبرع' : 'بيانات التبرع الجديد'}
              </h2>
              <p className="font-[Cairo] text-sm text-[#697282]">
                {isEditMode ? 'قم بتعديل البيانات المطلوبة' : 'قم بملء جميع الحقول المطلوبة'}
              </p>
            </div>
          </div>

          {/* Shared form (React Hook Form + Zod) */}
          <InKindDonationForm
            mode={isEditMode ? 'edit' : 'create'}
            donationId={isEditMode ? Number(id) : undefined}
            defaultValues={defaultValues}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {/* ── Notes Card ────────────────────────────────────────────── */}
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
