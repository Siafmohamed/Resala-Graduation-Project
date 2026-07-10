import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Gift, ArrowLeft, AlertCircle, Loader2, Edit2, Trash2, Calendar, User, Package, FileText } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { useInKindDonation, useDeleteInKindDonation } from '../hooks/useInKindDonations';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useUserRole, Role } from '@/features/authentication';
import { Badge } from '@/shared/components/ui/Badge';
import { LayoutContext } from '@/shared/components/layout/MainLayout';

/**
 * Detail page for viewing a single in-kind donation.
 * Shows all donation information with options to edit or delete (admin only).
 */
export function InKindDonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setHeader } = useContext(LayoutContext);
  const userRole = useUserRole();
  const deleteMutation = useDeleteInKindDonation();

  const {
    data: donation,
    isLoading,
    isError,
    error,
  } = useInKindDonation(id ?? '');

  useEffect(() => {
    if (!donation) return;
    setHeader(
      'تفاصيل التبرع العيني',
      `${donation.donationTypeName} — ${donation.donorName}`
    );
  }, [donation, setHeader]);

  const handleDelete = () => {
    if (!donation) return;
    
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف تبرع "${donation.donationTypeName}"؟`)) {
      deleteMutation.mutate(donation.id, {
        onSuccess: () => {
          navigate('/in-kind-donations');
        },
      });
    }
  };

  const handleEdit = () => {
    if (!donation) return;
    navigate(`/in-kind-donations/edit/${donation.id}`);
  };

  const handleBack = () => {
    navigate('/in-kind-donations');
  };

  // ── Loading state ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00549A]" />
        <span className="font-[Cairo] text-[#697282]">جاري تحميل التبرع...</span>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────
  if (isError || !donation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <span className="font-[Cairo] text-red-500">
          {error instanceof Error ? error.message : 'تعذّر تحميل بيانات التبرع'}
        </span>
        <Button 
          variant="outline" 
          onClick={handleBack} 
          className="font-[Cairo] border-gray-300 text-[#101727] hover:border-[#00549A] hover:text-[#00549A]"
        >
          رجوع
        </Button>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 border-gray-200 text-[#697282] hover:text-[#00549A] hover:border-[#00549A] rounded-xl font-[Cairo] font-bold transition-all"
          >
            <ArrowLeft size={18} />
            رجوع
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">تفاصيل التبرع العيني</h1>
            <p className="font-[Cairo] font-medium text-[#697282] text-sm">معلومات كاملة عن التبرع</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all font-[Cairo]"
          >
            <Edit2 size={18} />
            تعديل
          </Button>

          {userRole === Role.ADMIN && (
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl font-bold transition-all font-[Cairo] disabled:opacity-50"
            >
              <Trash2 size={18} />
              حذف
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Content Card ─────────────────────────────────────── */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-8">
          {/* Header with donation type */}
          <div className="flex items-start gap-6 pb-8 mb-8 border-b border-gray-100">
            <div className="p-4 rounded-2xl bg-linear-to-br from-[#e6eff7] to-[#f0f7ff] text-[#00549A]">
              <Gift size={32} />
            </div>
            <div className="flex-1">
              <h2 className="font-[Cairo] font-bold text-2xl text-[#101727] mb-2">
                {donation.donationTypeName}
              </h2>
              {donation.description && (
                <p className="font-[Cairo] text-[#697282] text-base leading-relaxed">
                  {donation.description}
                </p>
              )}
            </div>
            <Badge variant="success" className="font-[Cairo] font-bold text-base px-4 py-2">
              الكمية: {donation.quantity}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donor Information */}
            <div className="space-y-6">
              <h3 className="font-[Cairo] font-bold text-lg text-[#101727] mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#f8fafc]">
                  <User size={18} className="text-[#00549A]" />
                </div>
                معلومات المتبرع
              </h3>

              <div className="bg-[#f8fafc] rounded-xl p-6 space-y-4">
                <div>
                  <span className="font-[Cairo] text-sm font-semibold text-[#697282]">اسم المتبرع</span>
                  <p className="font-[Cairo] text-base font-bold text-[#101727] mt-1">
                    {donation.donorName || 'غير محدد'}
                  </p>
                </div>
                <div>
                  <span className="font-[Cairo] text-sm font-semibold text-[#697282]">رقم المتبرع</span>
                  <p className="font-[Cairo] text-base font-bold text-[#101727] mt-1">
                    #{donation.donorId}
                  </p>
                </div>
              </div>
            </div>

            {/* Recording Information */}
            <div className="space-y-6">
              <h3 className="font-[Cairo] font-bold text-lg text-[#101727] mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#f8fafc]">
                  <FileText size={18} className="text-[#00549A]" />
                </div>
                معلومات التسجيل
              </h3>

              <div className="bg-[#f8fafc] rounded-xl p-6 space-y-4">
                <div>
                  <span className="font-[Cairo] text-sm font-semibold text-[#697282]">المسجل بواسطة</span>
                  <p className="font-[Cairo] text-base font-bold text-[#101727] mt-1">
                    {donation.recordedByStaffName || 'غير محدد'}
                  </p>
                </div>
                <div>
                  <span className="font-[Cairo] text-sm font-semibold text-[#697282]">رقم الموظف</span>
                  <p className="font-[Cairo] text-base font-bold text-[#101727] mt-1">
                    #{donation.recordedByStaffId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h4 className="font-[Cairo] font-bold text-sm text-[#697282] flex items-center gap-2">
                <Calendar size={16} className="text-[#00549A]" />
                تاريخ التسجيل
              </h4>
              <div className="bg-linear-to-br from-[#e6f4ea] to-[#f0f9f4] border border-[#1E7E34]/10 rounded-xl p-6">
                <p className="font-[Cairo] text-lg font-bold text-[#1E7E34]">
                  {donation.recordedAt
                    ? format(new Date(donation.recordedAt), 'dd MMMM yyyy HH:mm', { locale: ar })
                    : donation.createdOn
                    ? format(new Date(donation.createdOn), 'dd MMMM yyyy', { locale: ar })
                    : 'غير محدد'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-[Cairo] font-bold text-sm text-[#697282] flex items-center gap-2">
                <Package size={16} className="text-[#00549A]" />
                الكمية
              </h4>
              <div className="bg-linear-to-br from-[#ede9fe] to-[#f5f3ff] border border-[#7c3aed]/10 rounded-xl p-6">
                <p className="font-[Cairo] text-3xl font-bold text-[#7c3aed]">
                  {donation.quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {donation.description && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-[Cairo] font-bold text-lg text-[#101727] mb-4">الوصف التفصيلي</h4>
              <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-6">
                <p className="font-[Cairo] text-base text-[#697282] leading-relaxed whitespace-pre-wrap">
                  {donation.description}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
