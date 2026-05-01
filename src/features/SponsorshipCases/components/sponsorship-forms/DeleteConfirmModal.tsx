import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps { 
  data: any; 
  urgent: boolean;
  onClose: () => void; 
  onConfirm: (id: number) => void; 
  isDeleting: boolean; 
}

export function DeleteConfirmModal({ 
  data, 
  urgent,
  onClose, 
  onConfirm, 
  isDeleting 
}: DeleteConfirmModalProps) {
  const safeId = typeof data?.id === "number" && Number.isFinite(data.id) && data.id > 0 ? data.id : null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#fff5f3] text-[#F04930] rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">تأكيد الحذف</h2>
          <p className="text-[#697282] font-[Cairo] mb-6">هل أنت متأكد من حذف "{urgent ? (data?.title || data?.name) : (data?.name || data?.title)}"؟</p>
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => { if (safeId) onConfirm(safeId); }} 
              disabled={isDeleting || !safeId}
              className="w-full py-3 bg-[#F04930] text-white rounded-xl font-bold shadow-lg shadow-[#F04930]/20 hover:bg-[#d93d26] transition-all font-[Cairo] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "حذف نهائياً"
              )}
            </button>
            <button onClick={onClose} className="w-full py-3 bg-gray-50 text-[#697282] rounded-xl font-bold hover:bg-gray-100 transition-all font-[Cairo]">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}
