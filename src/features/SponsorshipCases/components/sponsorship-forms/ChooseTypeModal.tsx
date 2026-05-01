import { X, Heart, AlertCircle } from "lucide-react";

interface ChooseTypeModalProps {
  onClose: () => void;
  onChoose: (t: "regular" | "urgent") => void;
}

export function ChooseTypeModal({ onClose, onChoose }: ChooseTypeModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#101727] font-[Cairo]">اختر نوع الكفالة</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div 
            className="group p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-[#00549A] hover:bg-[#f0f7ff] transition-all"
            onClick={() => onChoose("regular")}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#e6f0f9] text-[#00549A] rounded-lg group-hover:bg-[#00549A] group-hover:text-white transition-colors">
                <Heart size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#101727] font-[Cairo]">كفالة عادية</h3>
                <p className="text-sm text-gray-500 font-[Cairo] mt-1">كفالة مستمرة لفترة زمنية (مثل كفالة يتيم أو أسرة)</p>
              </div>
            </div>
          </div>
          <div 
            className="group p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-[#F04930] hover:bg-[#fff5f3] transition-all"
            onClick={() => onChoose("urgent")}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#fdeceb] text-[#F04930] rounded-lg group-hover:bg-[#F04930] group-hover:text-white transition-colors">
                <AlertCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#F04930] font-[Cairo]">كفالة حرجة</h3>
                <p className="text-sm text-gray-500 font-[Cairo] mt-1">حالة طارئة بدون مدة ثابتة (عمليات – إغاثات – حالات عاجلة)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
