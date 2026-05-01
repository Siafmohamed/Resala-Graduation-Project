import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Smartphone, 
  Zap, 
  Building2, 
  User, 
  DollarSign 
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { UnifiedPayment, PaymentType } from '../../types/payments.types';

interface PaymentTableProps {
  payments: UnifiedPayment[];
  paymentType: PaymentType;
}

export function PaymentTable({ payments, paymentType }: PaymentTableProps) {
  const navigate = useNavigate();

  const getMethodIcon = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('vodafone')) return <Smartphone size={16} className="text-[#E60000]" />;
    if (m.includes('instapay')) return <Zap size={16} className="text-[#8e44ad]" />;
    if (m.includes('branch') || m.includes('فرع')) return <Building2 size={16} className="text-[#00549A]" />;
    if (m.includes('representative') || m.includes('مندوب')) return <User size={16} className="text-[#27ae60]" />;
    return <DollarSign size={16} className="text-gray-400" />;
  };

  const getMethodLabel = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('vodafone')) return 'فودافون كاش';
    if (m.includes('instapay')) return 'إنستا باي';
    if (m.includes('branch') || m.includes('فرع')) return 'فرع';
    if (m.includes('representative') || m.includes('مندوب')) return 'مندوب';
    return method;
  };

  const handleRowClick = (id: number) => {
    const route = paymentType === 'emergency' 
      ? `/emergency-payments/${id}` 
      : `/payments/${id}`;
    navigate(route);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565]">المتبرع</th>
            <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565]">طريقة الدفع</th>
            <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565]">المبلغ</th>
            <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565]">التاريخ</th>
            {paymentType === 'emergency' && (
              <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565]">الحالة الحرجة</th>
            )}
            <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-[#495565] text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {payments.map((payment) => (
            <tr 
              key={payment.id} 
              className="hover:bg-gray-50/50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(payment.id)}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-[#101727] font-[Cairo] text-sm">{payment.userName}</span>
                  <span className="text-xs text-[#697282] font-[Cairo]">{payment.phone}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gray-50">
                    {getMethodIcon(payment.method)}
                  </div>
                  <span className="text-sm font-[Cairo] text-[#495565]">{getMethodLabel(payment.method)}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-[#00549A] font-[Cairo]">{payment.amount.toLocaleString()} ج.م</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-[#697282] font-[Cairo]">
                  {payment.createdOn && isValid(new Date(payment.createdOn))
                    ? format(new Date(payment.createdOn), 'dd/MM/yyyy', { locale: ar })
                    : '—'}
                </span>
              </td>
              {paymentType === 'emergency' && (
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-[#F04930] font-[Cairo] line-clamp-1 max-w-[150px]">
                    {payment.emergencyCaseTitle || '—'}
                  </span>
                </td>
              )}
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <button 
                    className="p-2 text-[#00549A] hover:bg-blue-50 rounded-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(payment.id);
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
