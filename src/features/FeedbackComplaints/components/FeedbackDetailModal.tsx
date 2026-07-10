import { useState } from 'react';
import { X, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Feedback, FeedbackStatus, FeedbackType } from '../services/feedbackService';
import { useUpdateFeedbackStatus } from '../hooks/useFeedback';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';

interface FeedbackDetailModalProps {
  feedback: Feedback;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackDetailModal({
  feedback,
  onClose,
  onSuccess,
}: FeedbackDetailModalProps) {
  const [newStatus, setNewStatus] = useState<FeedbackStatus>(feedback.status);
  const [showConfirm, setShowConfirm] = useState(false);
  const updateStatus = useUpdateFeedbackStatus();

  const handleUpdate = () => {
    if (newStatus === feedback.status) return;
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    updateStatus.mutate(
      { id: feedback.id, status: newStatus },
      {
        onSuccess: () => {
          setShowConfirm(false);
          onSuccess();
          onClose();
        },
      }
    );
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-[#00549A]">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#101727] font-[Cairo]">تفاصيل الطلب</h2>
              <p className="text-xs text-gray-400 font-bold font-[Cairo]">رقم الطلب: #{feedback.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 font-[Cairo]">اسم المتبرع</label>
              <p className="text-sm font-black text-[#101727] font-[Cairo]">{feedback.donorName}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 font-[Cairo]">التاريخ</label>
              <p className="text-sm font-black text-[#101727] font-[Cairo]">
                {formatDate(feedback.createdOn, 'DD/MM/YYYY HH:mm')}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 font-[Cairo]">النوع</label>
              <div className="flex">{getTypeBadge(feedback.type)}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 font-[Cairo]">الحالة الحالية</label>
              <div className="flex">{getStatusBadge(feedback.status)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 font-[Cairo]">الموضوع</label>
            <p className="text-sm font-black text-[#101727] font-[Cairo] bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {feedback.subject}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 font-[Cairo]">الرسالة</label>
            <div className="text-sm font-medium text-[#495565] font-[Cairo] leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {feedback.message}
            </div>
          </div>

          {/* Status Update Section */}
          <div className="pt-8 border-t border-gray-50">
            <h3 className="text-sm font-black text-[#101727] font-[Cairo] mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[#00549A]" />
              تحديث حالة الطلب
            </h3>
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-bold text-gray-400 font-[Cairo]">اختر الحالة الجديدة</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value) as FeedbackStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] outline-none font-[Cairo] text-sm font-bold transition-all cursor-pointer"
                >
                  <option value={FeedbackStatus.PENDING}>قيد الانتظار</option>
                  <option value={FeedbackStatus.RESOLVED}>تم الحل</option>
                  <option value={FeedbackStatus.REJECTED}>مرفوض</option>
                </select>
              </div>
              <button
                onClick={handleUpdate}
                disabled={newStatus === feedback.status || updateStatus.isPending}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {updateStatus.isPending ? <Loader2 size={18} className="animate-spin" /> : 'تحديث الحالة'}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Overlay */}
        {showConfirm && (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
            <div className="max-w-xs w-full text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#00549A]">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-[#101727] font-[Cairo]">هل أنت متأكد؟</h4>
                <p className="text-sm text-gray-400 font-bold font-[Cairo]">
                  أنت على وشك تغيير حالة الطلب من {feedback.statusName || 'الحالية'} إلى {
                    newStatus === FeedbackStatus.PENDING ? 'قيد الانتظار' :
                    newStatus === FeedbackStatus.RESOLVED ? 'تم الحل' : 'مرفوض'
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-[#495565] font-bold font-[Cairo] text-sm hover:bg-gray-50 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmUpdate}
                  disabled={updateStatus.isPending}
                  className="flex-1 py-3 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-sm hover:bg-[#00549A]/90 transition-all flex items-center justify-center gap-2"
                >
                  {updateStatus.isPending && <Loader2 size={16} className="animate-spin" />}
                  تأكيد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
