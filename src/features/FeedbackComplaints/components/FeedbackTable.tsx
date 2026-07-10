import { Feedback, FeedbackStatus, FeedbackType } from '../services/feedbackService';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

interface FeedbackTableProps {
  items: Feedback[];
  onView: (feedback: Feedback) => void;
}

export default function FeedbackTable({ items, onView }: FeedbackTableProps) {
  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.PENDING:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-xs font-bold font-[Cairo]">
            <Clock size={12} />
            قيد الانتظار
          </span>
        );
      case FeedbackStatus.RESOLVED:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-bold font-[Cairo]">
            <CheckCircle size={12} />
            تم الحل
          </span>
        );
      case FeedbackStatus.REJECTED:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-bold font-[Cairo]">
            <XCircle size={12} />
            مرفوض
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.FEEDBACK:
        return (
          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold font-[Cairo]">
            رأي
          </span>
        );
      case FeedbackType.COMPLAINT:
        return (
          <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold font-[Cairo]">
            شكوى
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-[#697282] font-[Cairo] text-xs font-bold uppercase tracking-wider">
            <th className="px-8 py-5 text-right border-b border-gray-100">#</th>
            <th className="px-6 py-5 text-right border-b border-gray-100">اسم المتبرع</th>
            <th className="px-6 py-5 text-right border-b border-gray-100">الموضوع</th>
            <th className="px-6 py-5 text-center border-b border-gray-100">النوع</th>
            <th className="px-6 py-5 text-center border-b border-gray-100">الحالة</th>
            <th className="px-6 py-5 text-center border-b border-gray-100">التاريخ</th>
            <th className="px-8 py-5 text-left border-b border-gray-100">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item, index) => (
            <tr
              key={item.id}
              className="group hover:bg-blue-50/30 transition-all duration-300"
            >
              <td className="px-8 py-5 text-xs font-bold text-gray-400 font-[Cairo]">
                {index + 1}
              </td>
              <td className="px-6 py-5">
                <span className="font-bold text-[#101727] font-[Cairo] text-sm">
                  {item.donorName}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-xs font-medium text-[#697282] font-[Cairo] line-clamp-1">
                  {item.subject}
                </span>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex justify-center">{getTypeBadge(item.type)}</div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex justify-center">{getStatusBadge(item.status)}</div>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="text-xs font-bold text-[#495565] font-[Cairo]">
                  {formatDate(item.createdOn, 'DD/MM/YYYY HH:mm')}
                </span>
              </td>
              <td className="px-8 py-5 text-left">
                <button
                  onClick={() => onView(item)}
                  className="px-4 py-2 rounded-lg border border-blue-100 text-[#00549A] font-bold font-[Cairo] text-xs hover:bg-[#00549A] hover:text-white hover:border-[#00549A] transition-all duration-300 flex items-center gap-2"
                >
                  <Eye size={14} />
                  عرض التفاصيل
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
