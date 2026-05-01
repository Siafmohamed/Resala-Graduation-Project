import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
import type { PaymentMethod, PendingPayment } from '../types/pendingPayments.types';
import { Card, CardContent } from '@/shared/components/ui/Card';

const PendingPaymentsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate(); // Initialize useNavigate

  const { data: payments = [], isLoading, isError, refetch } = usePendingPayments(activeTab);
  const { mutateAsync: verifyPayment } = useVerifyPendingPayment();

  const [approvingPaymentId, setApprovingPaymentId] = useState<number | null>(null);

  const handleApprovePayment = async (paymentId: number) => {
    setApprovingPaymentId(paymentId);
    try {
      await verifyPayment(paymentId);
    } finally {
      setApprovingPaymentId(null);
    }
  };

  const handleViewDetails = (payment: PendingPayment) => {
    navigate(`/payment-details/${payment.id}`); // Navigate to details page
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const uniqueDonors = new Set(payments.map(p => p.phone)).size;
    const avgAmount = payments.length > 0 ? totalAmount / payments.length : 0;

    return [
      { label: 'إجمالي المبالغ المعلقة', value: `${totalAmount.toLocaleString()} ج.م`, icon: DollarSign, color: '#00549A', bg: '#e6eff7' },
      { label: 'عدد المتبرعين', value: uniqueDonors.toString(), icon: Users, color: '#22c55e', bg: '#e9f9ef' },
      { label: 'متوسط قيمة الدفعة', value: `${Math.round(avgAmount).toLocaleString()} ج.م`, icon: TrendingUp, color: '#7e22ce', bg: '#f3e8ff' },
      { label: 'دفعات تنتظر المراجعة', value: payments.length.toString(), icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    ];
  }, [payments]);

  // Filtering
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = searchQuery.toLowerCase();
      return (
        payment.userName?.toLowerCase().includes(query) ||
        payment.phone?.toLowerCase().includes(query) ||
        payment.contactName?.toLowerCase().includes(query) ||
        payment.method?.toLowerCase().includes(query)
      );
    });
  }, [payments, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const handleTabChange = (tab: PaymentMethod) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة الدفعات المعلقة</h2>
          <p className="font-[Cairo] text-[#697282] text-sm">مراجعة وتأكيد عمليات الدفع الواردة من مختلف القنوات</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'Representatives' && (
            <PdfExportButton payments={filteredPayments} />
          )}
          <SearchBar onSearch={handleSearch} />
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
            'All': payments.length,
            'Representatives': payments.filter(p => p.method.includes('مندوب') || p.method.includes('Rep')).length,
            'Branch': payments.filter(p => p.method.includes('فرع') || p.method.includes('Branch')).length,
            'Vodafone Cash': payments.filter(p => p.method.toLowerCase().includes('vodafone')).length,
            'InstaPay': payments.filter(p => p.method.toLowerCase().includes('instapay')).length,
          }}
        />
        
        <PaymentTable
          payments={paginatedPayments}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onApprovePayment={handleApprovePayment}
          approvingPaymentId={approvingPaymentId}
        />

        <div className="bg-gray-50/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Simple Detail Modal Overlay (Placeholder for future expansion) */}
      {/* Removed selectedPayment modal */}
    </div>
  );
};

export default PendingPaymentsDashboard;
