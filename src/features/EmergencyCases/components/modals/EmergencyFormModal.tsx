import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  X, 
  AlertCircle, 
  DollarSign,
  Upload,
  CheckCircle2,
  Image,
  Loader2,
  Flame,
  Clock
} from "lucide-react";
import {
  normalizeUrgencyLevel,
  URGENCY_LEVELS,
  type UrgencyLevel,
} from "@/api/services/sponsorshipService";
import type { EmergencyCase } from "../../types/emergencyCase.types";

interface EmergencyFormModalProps {
  mode: "add" | "edit";
  initialData?: EmergencyCase;
  onClose: () => void;
  onSave: (payload: FormData) => void;
  isSubmitting: boolean;
  isLoadingData?: boolean;
}

export function EmergencyFormModal({
  mode,
  initialData,
  onClose,
  onSave,
  isSubmitting,
  isLoadingData = false
}: EmergencyFormModalProps) {
  const toNumber = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount || initialData?.requiredAmount || 0);
  const [collectedAmount, setCollectedAmount] = useState(initialData?.collectedAmount || 0);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(normalizeUrgencyLevel(initialData?.urgencyLevel) || URGENCY_LEVELS.URGENT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [draggingImg, setDraggingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTargetAmount(initialData.targetAmount || initialData.requiredAmount || 0);
      setCollectedAmount(initialData.collectedAmount || 0);
      setUrgencyLevel(normalizeUrgencyLevel(initialData.urgencyLevel));
      setImagePreview(initialData.imageUrl || null);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    setError(null);
    if (!title.trim()) { setError("العنوان مطلوب."); return false; }
    if (title.length > 200) { setError("العنوان لا يتجاوز 200 حرف."); return false; }
    if (!description.trim()) { setError("الوصف مطلوب."); return false; }
    if (targetAmount <= 0) { setError("المبلغ المطلوب يجب أن يكون أكبر من صفر."); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('Title', title.trim());
    formData.append('Description', description.trim());
    formData.append('UrgencyLevel', String(urgencyLevel));
    formData.append('RequiredAmount', String(targetAmount));
    if (imageFile) formData.append('Attachment', imageFile);
    onSave(formData);
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-br from-[#fff1f0] to-[#fef2f2]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F04930] to-[#d93d26] text-white flex items-center justify-center shadow-lg shadow-[#F04930]/20">
              {mode === "add" ? <AlertCircle size={28} /> : <Edit2 size={28} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#101727] font-[Cairo]">
                {mode === "add" ? "إضافة حالة عاجلة جديدة" : "تعديل الحالة العاجلة"}
              </h2>
              <p className="text-sm text-[#697282] font-[Cairo] mt-0.5">أدخل تفاصيل الحالة الحرجة التي تتطلب تدخل سريع</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-red-100/50 text-gray-400 hover:text-red-600 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {isLoadingData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#F04930] rounded-full animate-spin" />
            <p className="font-[Cairo] text-[#697282] font-medium">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-[Cairo] flex items-center gap-3 animate-in shake duration-500">
                <AlertCircle size={20} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">عنوان الحالة</label>
                  <input 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#F04930]/10 focus:border-[#F04930] transition-all font-[Cairo] text-sm outline-none" 
                    placeholder="مثال: عملية جراحية عاجلة"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">المبلغ المطلوب</label>
                  <div className="relative group">
                    <input 
                      className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#F04930]/10 focus:border-[#F04930] transition-all font-[Cairo] text-sm outline-none" 
                      type="number" 
                      placeholder="0.00"
                      value={targetAmount || ""} 
                      onChange={(e) => setTargetAmount(toNumber(e.target.value))} 
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs group-focus-within:text-[#F04930] transition-colors">ج.م</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">مستوى الأولوية</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { level: URGENCY_LEVELS.NORMAL, label: "عادي", icon: AlertCircle, color: "blue", activeClass: "border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/10" },
                      { level: URGENCY_LEVELS.URGENT, label: "حرجة", icon: Clock, color: "orange", activeClass: "border-orange-500 bg-orange-50 text-orange-600 shadow-lg shadow-orange-500/10" },
                      { level: URGENCY_LEVELS.CRITICAL, label: "حرجة جداً", icon: Flame, color: "red", activeClass: "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-500/10" }
                    ].map((cfg) => (
                      <button
                        key={cfg.level}
                        onClick={() => setUrgencyLevel(cfg.level)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 font-[Cairo] text-[11px] font-bold flex flex-col items-center gap-2 group ${urgencyLevel === cfg.level ? cfg.activeClass : 'border-gray-100 bg-gray-50/50 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                      >
                        <cfg.icon size={20} className={`transition-transform duration-300 ${urgencyLevel === cfg.level ? 'scale-110' : 'group-hover:scale-110'}`} />
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">وصف الحالة</label>
                  <textarea 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#F04930]/10 focus:border-[#F04930] transition-all font-[Cairo] text-sm outline-none h-[148px] resize-none" 
                    placeholder="اكتب وصفاً مفصلاً للحالة واحتياجاتها..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1 uppercase tracking-wider">صورة الحالة</label>
                  <div 
                    className="group relative border-2 border-dashed border-gray-200 rounded-[24px] h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#F04930] hover:bg-red-50/30 transition-all overflow-hidden"
                    onClick={() => imgRef.current?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#F04930] transition-colors">
                        <Upload size={32} />
                        <span className="text-[11px] font-bold font-[Cairo]">ارفع صورة توضيحية</span>
                      </div>
                    )}
                  </div>
                  <input ref={imgRef} type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) handleImageSelect(e.target.files[0]); }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-[#fef2f2]/30">
          <button 
            onClick={onClose} 
            className="px-8 py-3.5 font-bold text-[#697282] hover:text-[#101727] hover:bg-gray-100 rounded-2xl transition-all font-[Cairo] text-sm"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#F04930] to-[#e63d1f] text-white font-bold font-[Cairo] text-sm shadow-xl shadow-[#F04930]/20 hover:shadow-2xl hover:shadow-[#F04930]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                {mode === "add" ? <Plus size={18} strokeWidth={3} /> : <CheckCircle2 size={18} />}
                <span>{mode === "add" ? "إنشاء الحالة" : "حفظ التعديلات"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
