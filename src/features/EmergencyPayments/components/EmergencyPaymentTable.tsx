import React from 'react';
import type { EmergencyPayment } from '../types/emergencyPayments.types';
import { 
  Eye, 
  Smartphone, 
  Building2, 
  User, 
  Zap, 
  Calendar, 
  Phone,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Check,
  XCircle
} from 'lucide-react';

interface EmergencyPaymentTableProps {
  payments: EmergencyPayment[];
  isLoading: boolean;
  onViewDetails: (payment: EmergencyPayment) => void;
  onApprovePayment: (paymentId: number) => void;
  isApproving: boolean;
}

const getMethodIcon = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes('vodafone')) return <Smartphone size={16} className="text-[#E60000]" />;
  if (m.includes('instapay')) return <Zap size={16} className="text-[#8e44ad]" />;
  if (m.includes('branch') || m.includes('فرع')) return <Building2 size={16} className="text-[#00549A]" />;
  if (m.includes('representative') || m.includes('مندوب')) return <User size={16} className="text-[#27ae60]" />;
  return <ArrowUpRight size={16} className="text-gray-400" />;
};

const getStatusStyles = (status: string) => {
  // Assuming all here are pending based on the endpoint, but adding logic for flexibility
  return "bg-amber-50 text-amber-700 border-amber-100";
};

const getMethodLabel = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes('vodafone')) return 'فودافون كاش';
  if (m.includes('instapay')) return 'إنستا باي';
  if (m.includes('branch') || m.includes('فرع')) return 'فرع';
  if (m.includes('representative') || m.includes('مندوب')) return 'مندوب';
  return method;
};

const EmergencyPaymentTable: React.FC<EmergencyPaymentTableProps> = ({ 
  payments, 
  isLoading, 
  onViewDetails,
  onApprovePayment,
  isApproving
}) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-3 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center h-16 bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-2 bg-gray-50 rounded w-1/3" />
            </div>
            <div className="w-20 h-8 bg-gray-100 rounded-lg" />
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 mx-6 my-6">
        <div className="p-4 rounded-full bg-gray-50 mb-4">
          <CheckCircle2 size={48} className="text-gray-200" />
        </div>
        <h3 className="text-gray-900 font-[Cairo] font-bold text-lg mb-1">لا توجد دفعات طوارئ معلقة</h3>
        <p className="text-gray-500 font-[Cairo] text-sm">تمت معالجة جميع دفعات الطوارئ بنجاح</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-6">
      <table className="w-full text-right border-separate border-spacing-y-3" dir="rtl">
        <thead>
          <tr className="text-gray-400 font-[Cairo] text-[13px] font-bold uppercase tracking-wider">
            <th className="px-6 py-2">حالة الطوارئ</th>
            <th className="px-6 py-2">طريقة الدفع</th>
            <th className="px-6 py-2">المبلغ</th>
            <th className="px-6 py-2">التاريخ</th>
            <th className="px-6 py-2">حالة الدفع</th>
            <th className="px-6 py-2 text-center">الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr 
              key={payment.id} 
              className="bg-white border border-gray-100 hover:shadow-md hover:border-[#00549A]/20 transition-all group rounded-2xl"
            >
              {/* Emergency Case Info */}
              <td className="px-6 py-4 first:rounded-r-2xl border-y border-r border-gray-100 group-hover:border-[#00549A]/20">
                <div className="flex flex-col">
                  <span className="font-bold text-[#101727] font-[Cairo] text-sm">{payment.emergencyCaseTitle}</span>
                  <div className="flex items-center gap-1 text-[11px] text-[#697282]">
                    <User size={10} />
                    <span>{payment.userName}</span>
                  </div>
                </div>
              </td>

              {/* Payment Method */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-[#00549A]/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getMethodIcon(payment.method)}
                  </div>
                  <span className="text-sm font-medium text-[#495565] font-[Cairo]">{getMethodLabel(payment.method)}</span>
                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-[#00549A]/20">
                <span className="font-bold text-[#00549A] font-[Cairo] text-base">{payment.amount.toLocaleString()} ج.م</span>
              </td>

              {/* Date */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-[#00549A]/20">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-sm text-[#495565] font-[Cairo]">
                    <Calendar size={12} className="text-[#697282]" />
                    <span>{new Date(payment.createdOn).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-[Cairo]">
                    <Clock size={10} />
                    <span>{new Date(payment.createdOn).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-[#00549A]/20">
                <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold font-[Cairo] border ${getStatusStyles(payment.status)}`}>
                  {payment.status}
                </span>
              </td>

              {/* Action */}
              <td className="px-6 py-4 last:rounded-l-2xl border-y border-l border-gray-100 group-hover:border-[#00549A]/20">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => onViewDetails(payment)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8fafc] text-[#00549A] hover:bg-[#00549A] hover:text-white transition-all font-[Cairo] font-bold text-xs"
                  >
                    <Eye size={16} />
                    <span>عرض التفاصيل</span>
                  </button>
                  <button 
                    onClick={() => onApprovePayment(payment.id)}
                    disabled={isApproving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00549A] text-white hover:bg-[#004077] transition-all font-[Cairo] font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#00549A]/20"
                  >
                    {isApproving ? 'جاري التأكيد...' : 'تأكيد الدفع'}
                    <Check size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmergencyPaymentTable;
