import { useParams, useNavigate } from 'react-router-dom';
import { useDonor } from '../hooks/useDonors';
import {
  getSponsorshipTypeLabel,
  getPaymentMethodLabel,
  formatCurrency,
} from '../utils/donorHelpers';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import {
  User,
  Phone,
  Calendar,
  Smartphone,
  ArrowRight,
  MapPin,
  ExternalLink,
  History,
  Edit2,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';

export function DonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: donor,
    isLoading,
    isError,
  } = useDonor(id!);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
          <p className="font-[Cairo] font-bold text-[#00549A]">جاري تحميل بيانات المتبرع...</p>
        </div>
      </div>
    );
  }

  if (isError || !donor) {
    return (
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <ErrorMessage
          error="المتبرع غير موجود"
          retry={() => navigate('/donors')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/donors')}
            className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 text-[#697282] hover:text-[#00549A] transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">تفاصيل المتبرع</h1>
            <p className="font-[Cairo] font-medium text-[#697282] text-sm opacity-70">إدارة ومتابعة سجل المتبرع وكفالاته</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-[#697282] rounded-xl font-bold font-[Cairo] text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Edit2 size={18} />
            تعديل البيانات
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#F04930] text-white rounded-xl font-bold font-[Cairo] text-sm hover:opacity-90 transition-all shadow-lg shadow-red-100">
            <Trash2 size={18} />
            حذف الحساب
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Column: Donor Info & Sponsorship (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Main Info Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <div className="flex flex-col items-end gap-1">
                  <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">بيانات المتبرع الأساسية</h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#e6eff7] flex items-center justify-center text-[#00549A] font-bold text-xl">
                  {donor.name[0]}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">الاسم الكامل</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donor.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <User size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">رقم الهاتف</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donor.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">تاريخ التسجيل</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donor.createdAt?.split('T')[0] || '2026-01-05'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Calendar size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">العنوان</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">الزقازيق، الشرقية</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sponsorship Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <button className="flex items-center gap-1.5 text-[#00549A] hover:underline text-xs font-bold font-[Cairo]">
                  <ExternalLink size={14} />
                  إدارة الكفالات
                </button>
                <div className="flex flex-col items-end gap-1">
                  <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">تفاصيل الكفالة النشطة</h2>
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-[#f8fafc] border border-gray-50">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-bold text-[#94a3b8] font-[Cairo]">المبلغ الشهري</span>
                    <span className="font-bold text-lg text-[#00549A] font-[Cairo]">{formatCurrency(donor.amount)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-[#94a3b8] font-[Cairo]">نوع الكفالة</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{getSponsorshipTypeLabel(donor.sponsorshipType)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-50 text-center">
                    <span className="text-[10px] font-bold text-[#94a3b8] font-[Cairo]">المدة</span>
                    <span className="font-bold text-xs text-[#101727] font-[Cairo]">شهرية</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-50 text-center">
                    <span className="text-[10px] font-bold text-[#94a3b8] font-[Cairo]">تاريخ البدء</span>
                    <span className="font-bold text-xs text-[#101727] font-[Cairo]">{donor.formDate || '2026-01-05'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-50 text-center">
                    <span className="text-[10px] font-bold text-[#94a3b8] font-[Cairo]">الحالة</span>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold font-[Cairo]">نشط</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left Column: Payment & History (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Latest Payment Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col items-end gap-1 border-b border-gray-50 pb-6">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">آخر عملية دفع</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Smartphone size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">طريقة الدفع</span>
                    <span className="px-4 py-1.5 rounded-xl bg-blue-50 text-[#00549A] text-[11px] font-bold font-[Cairo]">
                      {getPaymentMethodLabel(donor.paymentMethod)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Calendar size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">تاريخ الطلب</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donor.orderDate || '2026-01-08 10:30'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <CheckCircle size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">حالة الدفع</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold font-[Cairo] ${
                      donor.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {donor.paymentStatus === 'paid' ? 'تم الدفع' : 'قيد المراجعة'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transfer Details Box */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] flex flex-col gap-4">
                <h3 className="font-[Cairo] font-bold text-sm text-[#00549A] text-right">تفاصيل التحويل</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101727]">{donor.transferNumber || '5678****'}</span>
                    <span className="text-[#697282] font-[Cairo]">رقم التحويل</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101727]">{donor.transferTime || '10:25'}</span>
                    <span className="text-[#697282] font-[Cairo]">وقت التحويل</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-green-600">متاح</span>
                    <span className="text-[#697282] font-[Cairo]">إثبات التحويل</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white flex-1">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">سجل العمليات</h2>
                <History size={18} className="text-[#94a3b8]" />
              </div>
              
              <div className="flex flex-col gap-8 relative pr-4">
                <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-gray-50" />
                
                <div className="flex items-start gap-4 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00549A] mt-1.5 z-10" />
                  <div className="flex flex-col gap-1 items-start flex-1 text-right">
                    <span className="font-[Cairo] font-bold text-sm text-[#101727]">تم تأكيد دفع كفالة يتيم</span>
                    <span className="font-[Cairo] text-[11px] text-[#94a3b8]">اليوم، 10:30 صباحاً</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 z-10" />
                  <div className="flex flex-col gap-1 items-start flex-1 text-right">
                    <span className="font-[Cairo] font-bold text-sm text-[#101727]">تعديل بيانات الكفالة</span>
                    <span className="font-[Cairo] text-[11px] text-[#94a3b8]">أمس، 02:15 مساءً</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 z-10" />
                  <div className="flex flex-col gap-1 items-start flex-1 text-right">
                    <span className="font-[Cairo] font-bold text-sm text-[#101727]">إنشاء حساب المتبرع</span>
                    <span className="font-[Cairo] text-[11px] text-[#94a3b8]">12 مارس 2024</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}