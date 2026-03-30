import { useState, useRef, useCallback } from "react";
import {
  useSponsorships,
  useCreateSponsorship,
  useUpdateSponsorship,
  useDeleteSponsorship,
} from "../hooks/useSponsorships";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  X, 
  Heart, 
  AlertCircle, 
  ChevronDown,
  Shield,
  LayoutGrid,
  List,
  DollarSign
} from "lucide-react";

type ModalStep = null | "choose-type" | "add-regular" | "add-urgent" | "edit" | "delete";

/* ─── CHOOSE TYPE MODAL ─── */
function ChooseTypeModal({ onClose, onChoose }: { onClose: () => void; onChoose: (t: "regular" | "urgent") => void }) {
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

/* ─── ADD MODAL ─── */
function AddModal({ 
  urgent, 
  onClose, 
  onSave,
  isSubmitting 
}: { 
  urgent: boolean; 
  onClose: () => void; 
  onSave: (payload: CreateSponsorshipPayload) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const validateImage = (f: File) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) { alert("الامتداد غير مسموح به."); return false; }
    if (f.size > MAX_SIZE) { alert("الحجم يتجاوز 5 ميجا."); return false; }
    return true;
  };

  const readFile = (file: File, setter: (s: string) => void) => {
    if (!validateImage(file)) return;
    const r = new FileReader();
    r.onload = (e) => setter(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent, type: 'image' | 'icon') => {
    e.preventDefault(); 
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      readFile(f, type === 'image' ? setImagePreview : setIconPreview);
    }
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ 
      name, 
      description, 
      targetAmount, 
      imageUrl: imagePreview || undefined,
      icon: iconPreview || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo]">
            {urgent ? "إضافة كفالة حرجة جديدة" : "إضافة كفالة جديدة"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">اسم الكفالة</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]" 
              placeholder="مثال: كفالة يتيم" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">الوصف</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo] resize-none" 
              placeholder="وصف مختصر للكفالة..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">المبلغ المستهدف (جنيه)</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]" 
              type="number" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(Number(e.target.value))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">صورة الكفالة</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40
                  ${dragging ? "border-[#00549A] bg-[#f0f7ff]" : "border-gray-200 hover:border-[#00549A] hover:bg-gray-50"}
                  ${imagePreview ? "p-0 overflow-hidden border-solid" : ""}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => handleDrop(e, 'image')}
                onClick={() => imgRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-xs font-[Cairo]">تغيير الصورة</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Plus size={24} className="text-[#697282] mb-1" />
                    <p className="font-bold text-xs text-[#101727] font-[Cairo]">اسحب الصورة</p>
                  </>
                )}
              </div>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setImagePreview); }} />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">أيقونة البرنامج</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40
                  ${dragging ? "border-[#00549A] bg-[#f0f7ff]" : "border-gray-200 hover:border-[#00549A] hover:bg-gray-50"}
                  ${iconPreview ? "p-0 overflow-hidden border-solid" : ""}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => handleDrop(e, 'icon')}
                onClick={() => iconRef.current?.click()}
              >
                {iconPreview ? (
                  <div className="relative w-full h-full group flex items-center justify-center bg-gray-50">
                    <img src={iconPreview} alt="icon preview" className="w-16 h-16 object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-xs font-[Cairo]">تغيير الأيقونة</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Shield size={24} className="text-[#697282] mb-1" />
                    <p className="font-bold text-xs text-[#101727] font-[Cairo]">اسحب الأيقونة</p>
                  </>
                )}
              </div>
              <input ref={iconRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setIconPreview); }} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-100 transition-colors font-[Cairo]">إلغاء</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 font-[Cairo] disabled:opacity-50 disabled:transform-none
              ${urgent ? "bg-[#F04930] shadow-[#F04930]/20" : "bg-[#00549A] shadow-[#00549A]/20"}
            `}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              urgent ? "إضافة كفالة حرجة" : "إضافة الكفالة"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT MODAL ─── */
function EditModal({ 
  sponsorship, 
  onClose, 
  onSave,
  isSubmitting
}: { 
  sponsorship: SponsorshipProgram; 
  onClose: () => void; 
  onSave: (id: number, payload: UpdateSponsorshipPayload) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(sponsorship.name);
  const [description, setDescription] = useState(sponsorship.description);
  const [targetAmount, setTargetAmount] = useState(sponsorship.targetAmount);
  const [isActive, setIsActive] = useState(sponsorship.isActive);
  const [imagePreview, setImagePreview] = useState<string | null>(sponsorship.imageUrl || null);
  const [iconPreview, setIconPreview] = useState<string | null>(sponsorship.icon || null);
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const validateImage = (f: File) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) { alert("الامتداد غير مسموح به."); return false; }
    if (f.size > MAX_SIZE) { alert("الحجم يتجاوز 5 ميجا."); return false; }
    return true;
  };

  const readFile = (file: File, setter: (s: string) => void) => {
    if (!validateImage(file)) return;
    const r = new FileReader();
    r.onload = (e) => setter(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent, type: 'image' | 'icon') => {
    e.preventDefault(); 
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      readFile(f, type === 'image' ? setImagePreview : setIconPreview);
    }
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(sponsorship.id, { 
      name, 
      description, 
      targetAmount, 
      isActive,
      imageUrl: imagePreview || undefined,
      icon: iconPreview || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo]">تعديل الكفالة</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">اسم الكفالة</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">الوصف</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo] resize-none" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#495565] font-[Cairo]">المبلغ المستهدف (جنيه)</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 focus:border-[#00549A] transition-all font-[Cairo]" 
              type="number" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(Number(e.target.value))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">صورة الكفالة</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40
                  ${dragging ? "border-[#00549A] bg-[#f0f7ff]" : "border-gray-200 hover:border-[#00549A] hover:bg-gray-50"}
                  ${imagePreview ? "p-0 overflow-hidden border-solid" : ""}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => handleDrop(e, 'image')}
                onClick={() => imgRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-xs font-[Cairo]">تغيير الصورة</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Plus size={24} className="text-[#697282] mb-1" />
                    <p className="font-bold text-xs text-[#101727] font-[Cairo]">اسحب الصورة</p>
                  </>
                )}
              </div>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setImagePreview); }} />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#495565] font-[Cairo]">أيقونة البرنامج</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40
                  ${dragging ? "border-[#00549A] bg-[#f0f7ff]" : "border-gray-200 hover:border-[#00549A] hover:bg-gray-50"}
                  ${iconPreview ? "p-0 overflow-hidden border-solid" : ""}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => handleDrop(e, 'icon')}
                onClick={() => iconRef.current?.click()}
              >
                {iconPreview ? (
                  <div className="relative w-full h-full group flex items-center justify-center bg-gray-50">
                    <img src={iconPreview} alt="icon preview" className="w-16 h-16 object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-xs font-[Cairo]">تغيير الأيقونة</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Shield size={24} className="text-[#697282] mb-1" />
                    <p className="font-bold text-xs text-[#101727] font-[Cairo]">اسحب الأيقونة</p>
                  </>
                )}
              </div>
              <input ref={iconRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setIconPreview); }} />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-bold text-[#495565] font-[Cairo] flex-1">حالة البرنامج (نشط / غير نشط)</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-[#00549A]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? '-translate-x-6' : '-translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-100 transition-colors font-[Cairo]">إلغاء</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-[#00549A] shadow-lg shadow-[#00549A]/20 transition-all transform hover:-translate-y-0.5 font-[Cairo] disabled:opacity-50 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "حفظ التعديلات"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE MODAL ─── */
function DeleteConfirmModal({ sponsorship, onClose, onConfirm, isDeleting }: { sponsorship: SponsorshipProgram; onClose: () => void; onConfirm: (id: number) => void; isDeleting: boolean; }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#fff5f3] text-[#F04930] rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">تأكيد الحذف</h2>
          <p className="text-[#697282] font-[Cairo] mb-6">هل أنت متأكد من حذف "{sponsorship.name}"؟</p>
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => onConfirm(sponsorship.id)} 
              disabled={isDeleting}
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

/* ─── MAIN COMPONENT ─── */
export default function SponsorshipManagementAPI() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("جميع البرامج");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<ModalStep>(null);
  const [selectedProgram, setSelectedProgram] = useState<SponsorshipProgram | null>(null);

  const { data: sponsorships = [], isLoading, isError } = useSponsorships();
  const createMutation = useCreateSponsorship();
  const updateMutation = useUpdateSponsorship();
  const deleteMutation = useDeleteSponsorship();

  const handleCreate = (payload: CreateSponsorshipPayload) => {
    // Validation before submitting
    if (!payload.name.trim()) {
      toast.error("يرجى إدخال اسم الكفالة");
      return;
    }
    if (payload.targetAmount <= 0) {
      toast.error("يرجى إدخال مبلغ مستهدف صحيح");
      return;
    }

    createMutation.mutate(payload, { 
      onSuccess: () => {
        setModal(null);
        // Feedback is handled in the hook's toast.success
      }
    });
  };

  const handleUpdate = (id: number, payload: UpdateSponsorshipPayload) => {
    // Validation before submitting
    if (payload.name && !payload.name.trim()) {
      toast.error("اسم الكفالة لا يمكن أن يكون فارغاً");
      return;
    }

    updateMutation.mutate({ id, payload }, { 
      onSuccess: () => { 
        setModal(null); 
        setSelectedProgram(null); 
        // Feedback is handled in the hook's toast.success
      } 
    });
  };
  const handleDelete = (id: number) => deleteMutation.mutate(id, { onSuccess: () => { setModal(null); setSelectedProgram(null); } });

  const filtered = sponsorships.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "جميع البرامج" || (filter === "نشطة" && s.isActive) || (filter === "غير نشطة" && !s.isActive);
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'إجمالي البرامج', value: sponsorships.length, icon: LayoutGrid, color: '#00549A', bg: '#e6eff7' },
    { label: 'برامج نشطة', value: sponsorships.filter(s => s.isActive).length, icon: Heart, color: '#22c55e', bg: '#e9f9ef' },
    { label: 'إجمالي التبرعات', value: `${sponsorships.reduce((acc, s) => acc + (s.collectedAmount ?? 0), 0).toLocaleString()} ج.م`, icon: DollarSign, color: '#F04930', bg: '#fdeceb' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة الكفالات</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">متابعة وتعديل برامج الكفالات النشطة والحرجة</p>
        </div>
        <button 
          onClick={() => setModal("choose-type")}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 font-[Cairo]"
        >
          <Plus size={20} strokeWidth={3} />
          إضافة كفالة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#697282] font-[Cairo]">{stat.label}</span>
                <span className="text-xl font-bold text-[#101727] font-[Cairo]">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
          <input
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm"
            placeholder="ابحث باسم الكفالة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
            <select 
              className="w-full pr-12 pl-10 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] appearance-none cursor-pointer font-[Cairo] text-sm"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>جميع البرامج</option>
              <option>نشطة</option>
              <option>غير نشطة</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697282] pointer-events-none" size={16} />
          </div>
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#e6eff7] text-[#00549A]" : "text-[#697282] hover:bg-gray-50"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-[#e6eff7] text-[#00549A]" : "text-[#697282] hover:bg-gray-50"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
          <p className="font-[Cairo] text-[#697282]">جاري تحميل برامج الكفالات...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm">
          <AlertCircle size={48} className="text-[#F04930] mb-4" />
          <h3 className="font-bold text-[#101727] font-[Cairo]">حدث خطأ أثناء التحميل</h3>
          <p className="text-[#697282] font-[Cairo]">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm">
          <Search size={48} className="text-[#697282] mb-4 opacity-20" />
          <h3 className="font-bold text-[#101727] font-[Cairo]">لا توجد نتائج</h3>
          <p className="text-[#697282] font-[Cairo]">جرب تغيير كلمات البحث أو الفلاتر</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((program) => (
            <Card key={program.id} className="group border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={program.imageUrl || 'https://placehold.co/600x400?text=No+Image'} alt={program.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] bg-white shadow-sm ${program.isActive ? "text-green-600" : "text-gray-400"}`}>
                    {program.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-1">{program.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => { setSelectedProgram(program); setModal("edit"); }} className="p-1.5 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => { setSelectedProgram(program); setModal("delete"); }} className="p-1.5 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-sm text-[#697282] font-[Cairo] line-clamp-2 mb-6 h-10">{program.description}</p>
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center text-xs font-[Cairo]">
                    <span className="text-[#697282]">المبلغ المحصل</span>
                    <span className="font-bold text-[#101727]">{(program.collectedAmount ?? 0).toLocaleString()} / {(program.targetAmount ?? 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00549A] rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(((program.collectedAmount ?? 0) / (program.targetAmount || 1)) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">اسم الكفالة</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المستهدف</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المحصل</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">تاريخ البدء</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filtered.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={program.imageUrl || 'https://placehold.co/100'} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-[#101727] font-[Cairo] text-sm">{program.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${program.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {program.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#101727] font-[Cairo] text-sm">{(program.targetAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="px-6 py-4 font-bold text-[#00549A] font-[Cairo] text-sm">{(program.collectedAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="px-6 py-4 text-[#697282] font-[Cairo] text-sm">{program.createdAt ? new Date(program.createdAt).toLocaleDateString('ar-EG') : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelectedProgram(program); setModal("edit"); }} className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => { setSelectedProgram(program); setModal("delete"); }} className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      {modal === "choose-type" && <ChooseTypeModal onClose={() => setModal(null)} onChoose={(type) => setModal(type === "regular" ? "add-regular" : "add-urgent")} />}
      {(modal === "add-regular" || modal === "add-urgent") && <AddModal urgent={modal === "add-urgent"} onClose={() => setModal(null)} onSave={handleCreate} isSubmitting={createMutation.isPending} />}
      {modal === "edit" && selectedProgram && <EditModal sponsorship={selectedProgram} onClose={() => { setModal(null); setSelectedProgram(null); }} onSave={handleUpdate} isSubmitting={updateMutation.isPending} />}
      {modal === "delete" && selectedProgram && <DeleteConfirmModal sponsorship={selectedProgram} onClose={() => { setModal(null); setSelectedProgram(null); }} onConfirm={handleDelete} isDeleting={deleteMutation.isPending} />}
    </div>
  );
}
