import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { donorService } from '../services/donorService';
import {
  getSponsorshipTypeLabel,
  getPaymentMethodLabel,
  formatCurrency,
} from '../utils/donorHelpers';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import {
  User,
  Phone,
  Calendar,
  FileText,
  Smartphone,
} from 'lucide-react';

export function DonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: donor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['donor', id],
    queryFn: () => donorService.getDonorById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner message="جاري التحميل..." />
      </div>
    );
  }

  if (isError || !donor) {
    return (
      <div className="p-6">
        <ErrorMessage
          error="المتبرع غير موجود"
          retry={() => navigate('/donors')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Page Header */}
      <div className="mb-6 text-right">
        <h1 className="text-xl font-bold text-gray-800">تفاصيل المتبرع</h1>
        <p className="text-sm text-gray-500">معلومات كاملة عن المتبرع وحالة الدفع</p>
      </div>

      {/* Two-column layout: Right = donor/sponsorship info | Left = payment details */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* ─── RIGHT COLUMN ─── */}
        <div className="flex flex-col gap-4">

          {/* بيانات المتبرع */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 border-b pb-2 text-right text-sm font-semibold text-gray-700">
              بيانات المتبرع
            </h2>
            <div className="space-y-3">
              {/* Name row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800">{donor.name}</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>الاسم</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <User size={14} />
                  </span>
                </div>
              </div>
              {/* Phone row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800">{donor.phone}</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>رقم الهاتف</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <Phone size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* تفاصيل الكفالة */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 border-b pb-2 text-right text-sm font-semibold text-gray-700">
              تفاصيل الكفالة
            </h2>
            <div className="space-y-3">
              {/* Sponsorship type */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800">
                  {getSponsorshipTypeLabel(donor.sponsorshipType)}
                </span>
                <span className="text-xs text-gray-400">نوع الكفالة</span>
              </div>
              {/* Amount */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(donor.amount)}
                </span>
                <span className="text-xs text-gray-400">المبلغ</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── LEFT COLUMN ─── */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          {/* Card header */}
          <div className="mb-4 flex items-center justify-between border-b pb-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
              <span>#</span>
              <span>Container</span>
            </span>
            <h2 className="text-sm font-semibold text-gray-700">تفاصيل عملية الدفع</h2>
          </div>

          <div className="space-y-4">
            {/* طريقة الدفع */}
            <div className="flex items-center justify-between">
              <div className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-gray-700">
                {getPaymentMethodLabel(donor.paymentMethod)}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>طريقة الدفع</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Smartphone size={14} />
                </span>
              </div>
            </div>

            {/* تاريخ الطلب */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">
                {donor.orderDate ?? '2026-01-08 10:30'}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>تاريخ الطلب</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Calendar size={14} />
                </span>
              </div>
            </div>

            {/* المبلغ */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency(donor.amount)}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>المبلغ</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FileText size={14} />
                </span>
              </div>
            </div>

            {/* حالة الدفع */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {donor.paymentStatus === 'paid' ? 'دفع' : donor.paymentStatus}
              </span>
              <span className="text-xs text-gray-400">حالة الدفع</span>
            </div>
          </div>

          {/* ── تفاصيل التحويل (مشتقة من بيانات المتبرع أو قيم افتراضية) ── */}
          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-right text-sm font-semibold text-gray-700">
              تفاصيل التحويل
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-800">
                  {donor.transferNumber ?? '5678****'}
                </span>
                <span className="text-xs text-gray-400">رقم التحويل</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-800">
                  {donor.transferTime ?? '10:25'}
                </span>
                <span className="text-xs text-gray-400">وقت التحويل</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={
                    donor.transferProof === 'متاح'
                      ? 'font-medium text-green-600'
                      : 'font-medium text-gray-700'
                  }
                >
                  {donor.transferProof ?? 'متاح'}
                </span>
                <span className="text-xs text-gray-400">ثبات التحويل</span>
              </div>
            </div>
          </div>
        </div>
        {/* end left column */}
      </div>
    </div>
  );
}