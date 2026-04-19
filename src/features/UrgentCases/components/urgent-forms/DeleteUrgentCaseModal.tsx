import React from 'react';
import { AlertTriangle, Loader2, X, Trash2 } from 'lucide-react';
import { UrgentCase } from '../../types/urgent-case.types';
import { useDeleteUrgentCase } from '../../hooks/useUrgentCases';

interface DeleteUrgentCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  case: UrgentCase | null;
  onSuccess?: () => void;
}

export const DeleteUrgentCaseModal: React.FC<DeleteUrgentCaseModalProps> = ({
  isOpen,
  onClose,
  case: caseData,
  onSuccess,
}) => {
  const deleteMutation = useDeleteUrgentCase();
  const isDeleting = deleteMutation.isPending;

  const handleDelete = async () => {
    if (!caseData) return;
    try {
      await deleteMutation.mutateAsync(caseData.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      // Error is handled by mutation hook
    }
  };

  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#101727] font-[Cairo]">
                حذف الحالة العاجلة
              </h2>
              <p className="text-xs text-[#697282] font-[Cairo] mt-1">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 hover:bg-gray-200/50 rounded-full transition-colors group"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-[#101727] font-[Cairo] mb-3">
              هل أنت متأكد من حذف هذه الحالة العاجلة؟
            </p>
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-[11px] text-[#697282] font-[Cairo] w-20">العنوان:</span>
                <span className="text-xs font-bold text-[#101727] font-[Cairo]">{caseData.title}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[11px] text-[#697282] font-[Cairo] w-20">المبلغ:</span>
                <span className="text-xs font-bold text-[#101727] font-[Cairo]">
                  {caseData.targetAmount.toLocaleString('ar-EG')} جنيه
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-lg p-3 border-l-4 border-red-500">
            <p className="text-[11px] text-red-700 font-[Cairo]">
              ⚠️ سيتم حذف جميع البيانات المرتبطة بهذه الحالة، بما في ذلك سجل التبرعات إن وجد.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-200/50 active:bg-gray-300/50 transition-all transform hover:scale-105 active:scale-95 font-[Cairo]"
          >
            إلغاء
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 font-[Cairo] disabled:opacity-50 disabled:scale-100 bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/30 hover:shadow-red-500/50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>جاري الحذف...</span>
              </>
            ) : (
              <>
                <Trash2 size={20} strokeWidth={2.5} />
                <span>تأكيد الحذف</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
