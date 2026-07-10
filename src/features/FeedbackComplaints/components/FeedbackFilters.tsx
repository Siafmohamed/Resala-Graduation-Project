import { FeedbackType, FeedbackStatus } from '../services/feedbackService';
import { Filter, X } from 'lucide-react';

interface FeedbackFiltersProps {
  type: FeedbackType | 'all';
  status: FeedbackStatus | 'all';
  onTypeChange: (type: FeedbackType | 'all') => void;
  onStatusChange: (status: FeedbackStatus | 'all') => void;
  onClear: () => void;
}

export default function FeedbackFilters({
  type,
  status,
  onTypeChange,
  onStatusChange,
  onClear,
}: FeedbackFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 mr-2">
        <Filter size={18} />
        <span className="font-[Cairo] text-sm font-bold">التصفية:</span>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as FeedbackType | 'all')}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] outline-none font-[Cairo] text-xs font-bold transition-all cursor-pointer"
        >
          <option value="all">كل الأنواع</option>
          <option value={FeedbackType.FEEDBACK}>رأي (Feedback)</option>
          <option value={FeedbackType.COMPLAINT}>شكوى (Complaint)</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as FeedbackStatus | 'all')}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] outline-none font-[Cairo] text-xs font-bold transition-all cursor-pointer"
        >
          <option value="all">كل الحالات</option>
          <option value={FeedbackStatus.PENDING}>قيد الانتظار</option>
          <option value={FeedbackStatus.RESOLVED}>تم الحل</option>
          <option value={FeedbackStatus.REJECTED}>مرفوض</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(type !== 'all' || status !== 'all') && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-[Cairo] text-xs font-bold"
        >
          <X size={14} />
          مسح التصفية
        </button>
      )}
    </div>
  );
}
