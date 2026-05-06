import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  RefreshCw,
  AlertCircle,
  DollarSign,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import SearchBar from './SearchBar';
import PaymentTabs from './PaymentTabs';
import PaymentTable from './PaymentTable';
import Pagination from './Pagination';
import PdfExportButton from './PdfExportButton';
import { usePendingPayments } from '../hooks/usePendingPayments';
import { useVerifyPendingPayment } from '../hooks/useVerifyPendingPayment';
import { useRejectPendingPayment } from '../hooks/useRejectPendingPayment';
import type { PaymentMethod, PendingPayment } from '../types/pendingPayments.types';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import { Label } from '@/shared/components/ui/Label';
import { Button } from '@/shared/components/ui/Button';

const PendingPaymentsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const { data: allPayments = [], isLoading, isError, refetch } = usePendingPayments('All');
  const { mutateAsync: verifyPayment } = useVerifyPendingPayment();
  const { mutateAsync: rejectPayment } = useRejectPendingPayment();

  const [approvingPaymentId, setApprovingPaymentId] = useState<number | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<number | null>(null);
  const [selectedPaymentForReject, setSelectedPaymentForReject] = useState<PendingPayment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprovePayment = async (paymentId: number) => {
    setApprovingPaymentId(paymentId);
    try {
      await verifyPayment(paymentId);
    } finally {
      setApprovingPaymentId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedPaymentForReject || !rejectionReason.trim()) return;

    setRejectingPaymentId(selectedPaymentForReject.id);
    try {
      await rejectPayment({
        paymentId: selectedPaymentForReject.id,
        reason: rejectionReason,
      });
      setSelectedPaymentForReject(null);
      setRejectionReason('');
    } finally {
      setRejectingPaymentId(null);
    }
  };

  const handleViewDetails = (payment: PendingPayment) => {
    navigate(`/payment-details/${payment.id}`);
  };

  // 1. Tab Filtering
  const tabFilteredPayments = useMemo(() => {
    if (activeTab === 'All') return allPayments;

    return allPayments.filter((p) => {
      const method = (p.method ?? '').toLowerCase();
      switch (activeTab) {
        case 'Representatives':
          return method.includes('مندوب') || method.includes('rep');
        case 'Branch':
          return method.includes('فرع') || method.includes('branch');
        case 'Vodafone Cash':
          return method.includes('vodafone');
        case 'InstaPay':
          return method.includes('instapay');
        default:
          return true;
      }
    });
  }, [allPayments, activeTab]);

  // 2. Search Filtering
  const filteredPayments = useMemo(() => {
    const filtered = tabFilteredPayments.filter((payment) => {
      const query = searchQuery.toLowerCase();
      return (
        payment.userName?.toLowerCase().includes(query) ||
        payment.phone?.toLowerCase().includes(query) ||
        payment.contactName?.toLowerCase().includes(query) ||
        payment.method?.toLowerCase().includes(query)
      );
    });

    // Order by createdOn (Newest first)
    return [...filtered].sort((a, b) =>
      new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
    );
  }, [tabFilteredPayments, searchQuery]);

  // ✅ Single useEffect handles page reset for both tab and search changes.
  // This avoids the fragile totalPages/isLoading pattern that caused
  // currentPage to reset during React Query refetches.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Stats calculation - Based on filtered results for better feedback
  const stats = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const uniqueDonors = new Set(filteredPayments.map(p => p.phone)).size;
    const avgAmount = filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0;

    const oldestPayment = filteredPayments.length > 0
      ? [...filteredPayments].sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())[0]
      : null;

    const oldestDuration = oldestPayment
      ? formatDistanceToNow(new Date(oldestPayment.createdOn), { locale: ar }).replace('تقريباً', '').trim()
      : 'لا يوجد';

    return [
      { label: 'إجمالي المبالغ المعلقة', value: `${totalAmount.toLocaleString()} ج.م`, icon: DollarSign, color: '#00549A', bg: '#e6eff7' },
      { label: 'عدد المتبرعين', value: uniqueDonors.toString(), icon: Users, color: '#22c55e', bg: '#e9f9ef' },
      { label: 'متوسط قيمة الدفعة', value: `${Math.round(avgAmount).toLocaleString()} ج.م`, icon: TrendingUp, color: '#7e22ce', bg: '#f3e8ff' },
      { label: 'أقدم طلب معلق', value: oldestDuration, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    ];
  }, [filteredPayments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  // ✅ Handlers no longer manually call setCurrentPage(1) — useEffect above handles it
  const handleTabChange = (tab: PaymentMethod) => {
    setActiveTab(tab);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCloseRejectModal = () => {
    setSelectedPaymentForReject(null);
    setRejectionReason('');
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-red-100 p-8 text-center shadow-sm mx-6">
        <div className="p-4 rounded-full bg-red-50 mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-[Cairo] mb-2">حدث خطأ أثناء تحميل البيانات</h3>
        <p className="text-gray-500 font-[Cairo] mb-8 max-w-md">نعتذر عن هذا الخطأ، يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني إذا استمرت المشكلة.</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-8 py-3 bg-[#00549A] text-white rounded-2xl hover:bg-[#004077] transition-all font-[Cairo] font-bold shadow-lg shadow-[#00549A]/20"
        >
          <RefreshCw size={20} />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10" dir="rtl">
      {/* Actions Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 px-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {activeTab === 'Representatives' && (
            <PdfExportButton payments={filteredPayments} />
          )}
          <div className="w-full sm:w-80">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-3xl bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="p-3.5 rounded-2xl transition-transform group-hover:scale-110" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo] uppercase tracking-wider">{stat.label}</span>
                <span className="text-xl font-bold text-[#101727] font-[Cairo]">{isLoading ? '...' : stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mx-6 bg-white rounded-[32px] shadow-[0px_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <PaymentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={{
            'All': allPayments.length,
            'Representatives': allPayments.filter(p => p.method.includes('مندوب') || p.method.includes('Rep')).length,
            'Branch': allPayments.filter(p => p.method.includes('فرع') || p.method.includes('Branch')).length,
            'Vodafone Cash': allPayments.filter(p => p.method.toLowerCase().includes('vodafone')).length,
            'InstaPay': allPayments.filter(p => p.method.toLowerCase().includes('instapay')).length,
          }}
        />

        <PaymentTable
          payments={paginatedPayments}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onApprovePayment={handleApprovePayment}
          onRejectPayment={(payment) => setSelectedPaymentForReject(payment)}
          approvingPaymentId={approvingPaymentId}
          rejectingPaymentId={rejectingPaymentId}
        />

        <div className="bg-gray-50/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Reject Payment Modal */}
      <Modal
        isOpen={!!selectedPaymentForReject}
        onClose={handleCloseRejectModal}
        title="رفض عملية الدفع"
        maxWidth="max-w-[425px]"
      >
        <div className="space-y-4 py-4" dir="rtl">
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-[Cairo] flex items-center gap-3">
            <AlertCircle size={20} />
            يرجى توضيح سبب الرفض ليتم إرساله للمتبرع
          </div>

          <div className="space-y-3">
            <Label htmlFor="reason" className="font-bold text-[#101727] font-[Cairo] pr-1">سبب الرفض</Label>
            <textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full font-[Cairo] min-h-[120px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none text-sm"
              placeholder="اكتب سبب الرفض هنا بالتفصيل..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleCloseRejectModal}
              className="font-bold font-[Cairo] text-gray-500 hover:bg-gray-100 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-bold font-[Cairo] px-8 rounded-xl shadow-lg shadow-red-600/20 transition-all"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || rejectingPaymentId !== null}
            >
              {rejectingPaymentId !== null ? 'جاري الرفض...' : 'تأكيد الرفض'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingPaymentsDashboard;