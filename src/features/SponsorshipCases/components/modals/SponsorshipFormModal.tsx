import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  X, 
  Heart, 
  DollarSign,
  Upload,
  Image as ImageIcon,
  Loader2,
  Shield
} from "lucide-react";
import type { Sponsorship } from "../../types/sponsorship.types";

interface SponsorshipFormModalProps {
  mode: "add" | "edit";
  initialData?: Sponsorship;
  onClose: () => void;
  onSave: (payload: FormData) => void;
  isSubmitting: boolean;
  isLoadingData?: boolean;
}

export function SponsorshipFormModal({
  mode,
  initialData,
  onClose,
  onSave,
  isSubmitting,
  isLoadingData = false
}: SponsorshipFormModalProps) {
  const toNumber = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount || 0);
  const [collectedAmount, setCollectedAmount] = useState(initialData?.collectedAmount || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.icon || null);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setTargetAmount(initialData.targetAmount || 0);
      setCollectedAmount(initialData.collectedAmount || 0);
      setIsActive(initialData.isActive ?? true);
      setImagePreview(initialData.imageUrl || null);
      setIconPreview(initialData.icon || null);
      setImageFile(null);
      setIconFile(null);
      setError(null);
      return;
    }
    // Reset stale values when switching from edit to add mode.
    setName("");
    setDescription("");
    setTargetAmount(0);
    setCollectedAmount(0);
    setIsActive(true);
    setImagePreview(null);
    setIconPreview(null);
    setImageFile(null);
    setIconFile(null);
    setError(null);
  }, [initialData]);

  const validateForm = (): boolean => {
    setError(null);
    if (!name.trim()) { setError("الاسم مطلوب."); return false; }
    if (!description.trim()) { setError("الوصف مطلوب."); return false; }
    if (targetAmount <= 0) { setError("المبلغ المستهدف يجب أن يكون أكبر من صفر."); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('Name', name.trim());
    formData.append('Description', description.trim());
    formData.append('TargetAmount', String(targetAmount));
    formData.append('IsActive', String(isActive));
    formData.append('CollectedAmount', String(collectedAmount));

    if (imageFile) formData.append('ImageFile', imageFile);
    if (iconFile) formData.append('IconFile', iconFile);
    
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

  const handleIconSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target?.result as string);
      setIconFile(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00549A] to-[#004077] text-white flex items-center justify-center shadow-lg shadow-[#00549A]/20">
              {mode === "add" ? <Heart size={28} /> : <Edit2 size={28} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#101727] font-[Cairo]">
                {mode === "add" ? "إضافة برنامج كفالة جديد" : "تعديل برنامج الكفالة"}
              </h2>
              <p className="text-sm text-[#697282] font-[Cairo] mt-0.5">أدخل تفاصيل برنامج الكفالة لخدمة المتبرعين</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200/50 text-gray-400 hover:text-gray-900 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {isLoadingData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
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
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">اسم البرنامج</label>
                  <input 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm outline-none" 
                    placeholder="مثال: كفالة طالب علم"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">المبلغ المستهدف</label>
                  <div className="relative group">
                    <input 
                      className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm outline-none" 
                      type="number" 
                      placeholder="0.00"
                      value={targetAmount || ""} 
                      onChange={(e) => setTargetAmount(toNumber(e.target.value))} 
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs group-focus-within:text-[#00549A] transition-colors">ج.م</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl border border-blue-100 flex items-center gap-4 group hover:shadow-md transition-all">
                  <div className={`p-3 rounded-xl transition-all ${isActive ? 'bg-[#00549A] text-white shadow-lg shadow-[#00549A]/20' : 'bg-gray-200 text-gray-400'}`}>
                    <Shield size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-[#101727] font-[Cairo] block">حالة البرنامج</span>
                    <span className="text-[11px] text-[#697282] font-[Cairo]">{isActive ? "نشط ويظهر للمتبرعين" : "غير نشط حالياً"}</span>
                  </div>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-[#00549A]' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#101727] font-[Cairo] pr-1">وصف البرنامج</label>
                  <textarea 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm outline-none h-[116px] resize-none" 
                    placeholder="اكتب وصفاً مفصلاً لبرنامج الكفالة..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#101727] font-[Cairo] pr-1 uppercase tracking-wider">الصورة الرئيسية</label>
                    <div 
                      className="group relative border-2 border-dashed border-gray-200 rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[#00549A] hover:bg-blue-50/30 transition-all overflow-hidden" 
                      onClick={() => imgRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-[#00549A] transition-colors">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-bold font-[Cairo]">اختر صورة</span>
                        </div>
                      )}
                    </div>
                    <input ref={imgRef} type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) handleImageSelect(e.target.files[0]); }} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#101727] font-[Cairo] pr-1 uppercase tracking-wider">الأيقونة (SVG)</label>
                    <div 
                      className="group relative border-2 border-dashed border-gray-200 rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[#00549A] hover:bg-blue-50/30 transition-all overflow-hidden" 
                      onClick={() => iconRef.current?.click()}
                    >
                      {iconPreview ? (
                        <>
                          <img src={iconPreview} className="h-12 w-12 object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-[#00549A] transition-colors">
                          <Plus size={24} />
                          <span className="text-[10px] font-bold font-[Cairo]">أيقونة SVG</span>
                        </div>
                      )}
                    </div>
                    <input ref={iconRef} type="file" className="hidden" accept=".svg" onChange={(e) => { if(e.target.files?.[0]) handleIconSelect(e.target.files[0]); }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-[#f8fafc]/50">
          <button 
            onClick={onClose} 
            className="px-8 py-3.5 font-bold text-[#697282] hover:text-[#101727] hover:bg-gray-100 rounded-2xl transition-all font-[Cairo] text-sm"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#00549A] to-[#0070c0] text-white font-bold font-[Cairo] text-sm shadow-xl shadow-[#00549A]/20 hover:shadow-2xl hover:shadow-[#00549A]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                {mode === "add" ? <Plus size={18} strokeWidth={3} /> : <CheckCircle2 size={18} />}
                <span>{mode === "add" ? "إنشاء البرنامج" : "حفظ التعديلات"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
