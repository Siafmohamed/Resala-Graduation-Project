import { Trash2 } from 'lucide-react';
import { useDeleteStaff } from '../hooks/useAccounts';
import type { Account } from '../types/accountManagement.types';

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Account;
}

export function DeleteStaffModal({ isOpen, onClose, staff }: DeleteStaffModalProps) {
  const deleteMutation = useDeleteStaff();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(staff.id);
      onClose();
    } catch (error) {
      console.error('Delete Staff Error:', error);
    }
  };

  if (!isOpen) return null;

  const isLoading = deleteMutation.isPending;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#fff5f3] text-[#F04930] rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">تأكيد حذف الحساب</h2>
          <p className="text-[#697282] font-[Cairo] mb-6">
            هل أنت متأكد من حذف حساب <span className="font-bold text-[#101727]">"{staff.fullName}"</span>؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={handleDelete} 
              disabled={isLoading}
              className="w-full py-3 bg-[#F04930] text-white rounded-xl font-bold shadow-lg shadow-[#F04930]/20 hover:bg-[#d93d26] transition-all font-[Cairo] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'حذف الحساب نهائياً'
              )}
            </button>
            <button 
              onClick={onClose} 
              className="w-full py-3 bg-gray-50 text-[#697282] rounded-xl font-bold hover:bg-gray-100 transition-all font-[Cairo]"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
