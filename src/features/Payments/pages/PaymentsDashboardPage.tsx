import React, { useState } from 'react';
import { usePendingPayments } from '../hooks/usePayments';
import { PaymentTable } from '../components/list/PaymentTable';
import { 
  Search, 
  LayoutGrid, 
  CreditCard, 
  AlertCircle,
  Loader2,
  FileDown
} from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import type { PaymentMethod, PaymentType } from '../types/payments.types';

export default function PaymentsDashboardPage() {
  const [paymentType, setPaymentType] = useState<PaymentType>('subscription');
  const [method, setMethod] = useState<PaymentMethod>('All');
  const [search, setSearch] = useState('');

  const { data: payments = [], isLoading, isError } = usePendingPayments(paymentType, method);

  const filteredPayments = payments.filter(p => 
    p.userName.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search) ||
    (p.paymentType === 'emergency' && p.emergencyCaseTitle?.toLowerCase().includes(search.toLowerCase()))
  );

  const methods: PaymentMethod[] = ['All', 'Representatives', 'Branch', 'Vodafone Cash', 'InstaPay'];

  const getMethodLabel = (m: PaymentMethod) => {
    switch(m) {
      case 'All': return 'الكل';
      case 'Representatives': return 'مناديب';
      case 'Branch': return 'الفرع';
      case 'Vodafone Cash': return 'فودافون كاش';
      case 'InstaPay': return 'إنستا باي';
      default: return m;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة المدفوعات المعلقة</h1>
          <p className="font-[Cairo] text-[#697282] text-sm">مراجعة وتأكيد عمليات التبرع الواردة</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm self-start">
          <button 
            onClick={() => setPaymentType('subscription')}
            className={`px-4 py-2 rounded-lg font-[Cairo] font-bold text-sm transition-all ${paymentType === 'subscription' ? 'bg-[#00549A] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            كفالات مستمرة
          </button>
          <button 
            onClick={() => setPaymentType('emergency')}
            className={`px-4 py-2 rounded-lg font-[Cairo] font-bold text-sm transition-all ${paymentType === 'emergency' ? 'bg-[#F04930] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            حالات عاجلة
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border-none shadow-sm rounded-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {methods.map(m => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-4 py-2 rounded-xl font-[Cairo] text-sm font-bold transition-all border ${
                method === m 
                ? (paymentType === 'subscription' ? 'bg-blue-50 border-blue-200 text-[#00549A]' : 'bg-red-50 border-red-200 text-[#F04930]') 
                : 'bg-white border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              {getMethodLabel(m)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pr-12 pl-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 font-[Cairo] text-sm"
            placeholder="ابحث بالاسم أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Content */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className={`w-12 h-12 animate-spin ${paymentType === 'subscription' ? 'text-[#00549A]' : 'text-[#F04930]'}`} />
            <p className="font-[Cairo] text-gray-400">جاري تحميل المدفوعات...</p>
          </div>
        ) : isError ? (
          <div className="py-24 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4 opacity-20" />
            <p className="font-[Cairo] text-gray-500 font-bold">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-24 text-center">
            <CreditCard size={48} className="text-gray-300 mx-auto mb-4 opacity-20" />
            <p className="font-[Cairo] text-gray-500">لا توجد مدفوعات معلقة حالياً</p>
          </div>
        ) : (
          <PaymentTable payments={filteredPayments} paymentType={paymentType} />
        )}
      </Card>
    </div>
  );
}
