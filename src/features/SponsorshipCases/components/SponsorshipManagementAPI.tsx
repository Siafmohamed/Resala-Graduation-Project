import { useState, useRef, useCallback, useMemo } from "react";
import {
  useSponsorships,
  useSponsorship,
  useCreateSponsorship,
  useUpdateSponsorship,
  useDeleteSponsorship,
  useEmergencyCases,
  useEmergencyCase,
  useCreateEmergencyCase,
  useUpdateEmergencyCase,
  useDeleteEmergencyCase,
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
  DollarSign,
  Upload,
  CheckCircle2,
  Image,
  Loader2,
  Flame,
  Clock
} from "lucide-react";
import type { 
  SponsorshipProgram, 
  EmergencyCase, 
  CreateSponsorshipPayload, 
  CreateEmergencyCasePayload,
  UpdateSponsorshipPayload,
  UpdateEmergencyCasePayload
} from "../services/sponsorship.service";

type ModalStep = null | "choose-type" | "add-regular" | "add-urgent" | "edit-regular" | "edit-urgent" | "delete-regular" | "delete-urgent";

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

/* ─── CASE FORM MODAL (ADD & EDIT) ─── */
function CaseFormModal({
  urgent,
  mode,
  initialData,
  onClose,
  onSave,
  isSubmitting,
  isLoadingData = false
}: {
  urgent: boolean;
  mode: "add" | "edit";
  initialData?: any;
  onClose: () => void;
  onSave: (payload: any) => void;
  isSubmitting: boolean;
  isLoadingData?: boolean;
}) {
  // Extract title/name correctly: sponsorships have 'name', emergency cases have 'title'
  const initialTitle = initialData?.title || initialData?.name || "";
  const initialDesc = initialData?.description || "";
  const initialTarget = initialData?.targetAmount || initialData?.requiredAmount || 0;
  const initialCollected = initialData?.collectedAmount || 0;
  const initialUrgencyLevel = initialData?.urgencyLevel === 1 || initialData?.urgencyLevel === 'High' || initialData?.isCritical ? 1 : 2;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);
  const [targetAmount, setTargetAmount] = useState(initialTarget);
  const [collectedAmount, setCollectedAmount] = useState(initialCollected);
  const [urgencyLevel, setUrgencyLevel] = useState<1 | 2>(initialUrgencyLevel);
  const [isCritical, setIsCritical] = useState(initialData?.isCritical || urgencyLevel === 1);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(!urgent ? initialData?.icon : null);
  const [draggingImg, setDraggingImg] = useState(false);
  const [draggingIcon, setDraggingIcon] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  // Update state when initialData changes (useful if fetching data by ID)
  useMemo(() => {
    if (initialData) {
      setTitle(initialData.title || initialData.name || "");
      setDescription(initialData.description || "");
      setTargetAmount(initialData.targetAmount || initialData.requiredAmount || 0);
      setCollectedAmount(initialData.collectedAmount || 0);
      const level = initialData?.urgencyLevel === 1 || initialData?.urgencyLevel === 'High' || initialData?.isCritical ? 1 : 2;
      setUrgencyLevel(level);
      setIsCritical(level === 1);
      setIsActive(initialData.isActive ?? true);
      setImagePreview(initialData.imageUrl || null);
      if (!urgent) setIconPreview(initialData.icon || null);
    }
  }, [initialData, urgent]);

  const handleTitleChange = (value: string) => {
    const trimmed = value.slice(0, 200);
    setTitle(trimmed);
    if (error) setError(null);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (error) setError(null);
  };

  const handleTargetAmountChange = (value: number) => {
    setTargetAmount(value);
    if (error) setError(null);
  };

  const handleCollectedAmountChange = (value: number) => {
    setCollectedAmount(value);
    if (error) setError(null);
  };

  const validateImageFile = (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    setError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("عذراً، الامتداد غير مسموح به لصورة الكفالة (يسمح بـ JPG, PNG, WebP).");
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError("حجم الملف يتجاوز الحد المسموح به (5 ميجا).");
      return false;
    }
    return true;
  };

  const validateIconFile = (file: File) => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    setError(null);
    const isSVG = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    if (!isSVG) {
      setError("عذراً، يجب اختيار ملف بصيغة SVG فقط لأيقونة البرنامج.");
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError("حجم الملف يتجاوز الحد المسموح به (2 ميجا).");
      return false;
    }
    return true;
  };

  const handleImageSelect = (file: File) => {
    if (!validateImageFile(file)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleIconSelect = (file: File) => {
    if (!validateIconFile(file)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target?.result as string);
      setIconFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingImg(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleIconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingIcon(false);
    const file = e.dataTransfer.files[0];
    if (file) handleIconSelect(file);
  };

  // Validation function matching backend validators
  const validateForm = (): boolean => {
    setError(null);

    if (!urgent) {
      if (!title.trim()) {
        setError("اسم برنامج الكفالة مطلوب.");
        return false;
      }
      if (title.length > 200) {
        setError("اسم برنامج الكفالة لا يتجاوز 200 حرف.");
        return false;
      }
      if (!description.trim()) {
        setError("الوصف مطلوب.");
        return false;
      }
      if (targetAmount <= 0) {
        setError("المبلغ المستهدف يجب أن يكون أكبر من صفر.");
        return false;
      }
      if (mode === "add" && collectedAmount > targetAmount) {
        setError("المبلغ المحصل لا يمكن أن يكون أكبر من المبلغ المستهدف.");
        return false;
      }
    } else {
      if (!title.trim()) {
        setError("العنوان مطلوب.");
        return false;
      }
      if (title.length > 200) {
        setError("العنوان لا يتجاوز 200 حرف.");
        return false;
      }
      if (!description.trim()) {
        setError("الوصف مطلوب.");
        return false;
      }
      if (targetAmount <= 0) {
        setError("المبلغ المطلوب يجب أن يكون أكبر من صفر.");
        return false;
      }
      if (mode === "add" && collectedAmount > targetAmount) {
        setError("المبلغ المحصل لا يمكن أن يكون أكبر من المبلغ المستهدف.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    setError(null);
    if (!validateForm()) return;

    // Helper to filter out data URLs (base64) and keep only real URLs
    const getValidImageUrl = (url: string | null): string | undefined => {
      if (!url) return undefined;
      if (url.startsWith('data:')) return undefined; // Don't send data URLs
      return url;
    };

    if (urgent) {
      const validImageUrl = getValidImageUrl(imagePreview);
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        targetAmount,
        requiredAmount: targetAmount,
        urgencyLevel: urgencyLevel,
        isCritical: urgencyLevel === 1,
        isActive,
      };

      // Only include collectedAmount in add mode
      if (mode === "add") {
        payload.collectedAmount = collectedAmount;
      }
      // Only include imageUrl if it's a valid HTTP URL
      if (validImageUrl) {
        payload.imageUrl = validImageUrl;
      }
      onSave(payload);
    } else {
      const validImageUrl = getValidImageUrl(imagePreview);
      const payload: any = {
        name: title.trim(),
        description: description.trim(),
        targetAmount,
        isActive,
        // Note: collectedAmount is NOT sent for sponsorships as it's managed separately
      };
      // Only include imageUrl if it's a valid HTTP URL
      if (validImageUrl) {
        payload.imageUrl = validImageUrl;
      }
      // Only include icon if it's a valid URL (not a data URL and not null)
      if (iconPreview !== null && !iconPreview.startsWith('data:')) {
        payload.icon = iconPreview;
      }
      onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header with Gradient Background */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r ${urgent ? 'from-red-50 to-orange-50' : 'from-blue-50 to-cyan-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg transform transition-transform ${urgent ? 'bg-gradient-to-br from-[#F04930] to-[#d93d26] text-white' : 'bg-gradient-to-br from-[#00549A] to-[#004077] text-white'}`}>
              {mode === "add" ? (urgent ? <AlertCircle size={24} /> : <Heart size={24} />) : <Edit2 size={24} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#101727] font-[Cairo]">
                {mode === "add" 
                  ? (urgent ? "إضافة حالة عاجلة جديدة" : "إضافة برنامج كفالة جديد")
                  : "تعديل البيانات"}
              </h2>
              <p className="text-xs text-[#697282] font-[Cairo] mt-1">
                {mode === "add" 
                  ? (urgent ? "أنشئ حالة عاجلة جديدة تحتاج إلى مساعدة فورية" : "أنشئ برنامج كفالة جديد للمتبرعين")
                  : "حدّث معلومات الكفالة أو الحالة"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors group">
            <X size={20} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {isLoadingData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
            <p className="font-[Cairo] text-[#697282] text-center">
              جاري تحميل البيانات الأصلية...
              <span className="block text-xs text-gray-400 mt-2">قد يستغرق بضع ثوان</span>
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 text-red-700 text-sm font-[Cairo] animate-pulse">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">خطأ</p>
                  <p className="text-red-600 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Text Fields */}
              <div className="space-y-5">
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                      <span className={`text-lg ${urgent ? 'text-[#F04930]' : 'text-[#00549A]'}`}>*</span>
                      {urgent ? "عنوان الحالة العاجلة" : "اسم برنامج الكفالة"}
                    </span>
                    <span className="text-xs text-[#697282]">{title.length}/200</span>
                  </label>
                  <input 
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all font-[Cairo] placeholder-gray-400" 
                    placeholder={urgent ? "مثال: عملية قلب مفتوح طارئة" : "مثال: كفالة يتيم - محمود علي"} 
                    value={title} 
                    onChange={(e) => handleTitleChange(e.target.value)}
                    maxLength={200}
                    style={{ focusRing: `2px solid ${urgent ? '#F04930' : '#00549A'}` }}
                  />
                  <p className="text-[11px] text-[#697282] font-[Cairo]">أقصى 200 حرف - اسم واضح وموجز</p>
                </div>

                {/* Target Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                    <span className={`text-lg ${urgent ? 'text-[#F04930]' : 'text-[#00549A]'}`}>*</span>
                    <DollarSign size={16} className="text-[#00549A]" />
                    <span>المبلغ المستهدف (جنيه)</span>
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all font-[Cairo]" 
                      type="number" 
                      value={targetAmount} 
                      onChange={(e) => handleTargetAmountChange(Number(e.target.value))}
                      min="1"
                      step="1"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">ج.م</span>
                  </div>
                  <p className="text-[11px] text-[#697282] font-[Cairo]">يجب أن يكون أكبر من صفر</p>
                </div>

                {/* Collected Amount - Only for urgent cases (Add mode only) */}
                {urgent && mode === "add" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span>المبلغ المحصل (جنيه)</span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all font-[Cairo]" 
                        type="number" 
                        value={collectedAmount} 
                        onChange={(e) => handleCollectedAmountChange(Number(e.target.value))}
                        min="0"
                        step="1"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">ج.م</span>
                    </div>
                    <p className="text-[11px] text-[#697282] font-[Cairo]">لا يمكن أن يكون أكبر من المبلغ المستهدف</p>
                  </div>
                )}

                {/* Urgent Case Urgency Level */}
                {urgent && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                      <span className="text-lg text-[#F04930]">*</span>
                      <Flame size={16} className="text-[#F04930]" />
                      <span>مستوى الأولوية / الحرجة</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setUrgencyLevel(1);
                          setIsCritical(true);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all font-[Cairo] font-bold text-sm ${
                          urgencyLevel === 1
                            ? 'border-[#F04930] bg-[#fff5f3] text-[#F04930]'
                            : 'border-gray-200 bg-white text-[#697282] hover:border-[#F04930]'
                        }`}
                      >
                        <Flame size={18} className="mx-auto mb-1" />
                        <span className="block">حرجة جداً (عالية)</span>
                        <span className="text-xs text-gray-500">الأولوية 1</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUrgencyLevel(2);
                          setIsCritical(false);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all font-[Cairo] font-bold text-sm ${
                          urgencyLevel === 2
                            ? 'border-[#F04930] bg-[#fff5f3] text-[#F04930]'
                            : 'border-gray-200 bg-white text-[#697282] hover:border-[#F04930]'
                        }`}
                      >
                        <AlertCircle size={18} className="mx-auto mb-1" />
                        <span className="block">عاجلة (متوسطة)</span>
                        <span className="text-xs text-gray-500">الأولوية 2</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Urgent Case Toggle */}
                {urgent && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                          <Flame size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#495565] font-[Cairo] block">حالة حرجة جداً</span>
                          <p className="text-[11px] text-[#697282] font-[Cairo]">ستظهر في قسم الحالات الحرجة ذات الأولوية العالية</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCritical(!isCritical);
                          setUrgencyLevel(isCritical ? 2 : 1);
                        }}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all flex-shrink-0 ${isCritical ? 'bg-red-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isCritical ? 'translate-x-1' : '-translate-x-1'}`} />
                      </button>
                    </label>
                  </div>
                )}

                {/* Active Status Toggle */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Heart size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#495565] font-[Cairo] block">الحالة نشطة</span>
                        <p className="text-[11px] text-[#697282] font-[Cairo]">الحالات النشطة فقط تظهر للمتبرعين</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all flex-shrink-0 ${isActive ? 'bg-[#00549A]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-1' : '-translate-x-1'}`} />
                    </button>
                  </label>
                </div>
              </div>

              {/* Right Column - Media and Description */}
              <div className="space-y-5">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                    <span className={`text-lg ${urgent ? 'text-[#F04930]' : 'text-[#00549A]'}`}>*</span>
                    الوصف التفصيلي
                  </label>
                  <textarea 
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all font-[Cairo] resize-none" 
                    placeholder={urgent ? "اشرح حالة المريض والعملية الطبية المطلوبة بالتفصيل..." : "اشرح تفاصيل برنامج الكفالة والفئة المستهدفة بوضوح..."} 
                    value={description} 
                    onChange={(e) => handleDescriptionChange(e.target.value)} 
                    rows={4}
                  />
                  <p className="text-[11px] text-[#697282] font-[Cairo]">وصف شامل يساعد المتبرعين على فهم الحالة</p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                    <Image size={16} className="text-[#00549A]" />
                    صورة الكفالة / الحالة
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-3 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-44 group overflow-hidden
                      ${draggingImg ? `border-[#00549A] bg-[#f0f7ff]` : `border-gray-300 hover:border-[#00549A] hover:bg-gray-50`}
                      ${imagePreview ? `border-solid border-[#00549A] bg-gradient-to-br from-[#f0f7ff] to-white` : ``}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setDraggingImg(true); }}
                    onDragLeave={() => setDraggingImg(false)}
                    onDrop={handleImageDrop}
                    onClick={() => imgRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
                            <Upload size={28} className="mx-auto mb-2" />
                            <span className="text-sm font-bold font-[Cairo]">غيّر الصورة</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-gray-100 rounded-full text-gray-400 mb-2 group-hover:bg-[#00549A]/10 group-hover:text-[#00549A] transition-all transform group-hover:scale-110">
                          <Upload size={24} />
                        </div>
                        <p className="font-bold text-sm text-[#101727] font-[Cairo]">اسحب صورة أو انقر هنا</p>
                        <p className="text-[11px] text-gray-400 font-[Cairo] mt-1">JPG, PNG, WebP (حد أقصى 5 ميجا)</p>
                      </>
                    )}
                  </div>
                  <input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }} />
                </div>

                {/* Icon Upload (for regular sponsorships only) */}
                {!urgent && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                      <Shield size={16} className="text-[#00549A]" />
                      أيقونة البرنامج (SVG)
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-3 transition-all cursor-pointer flex flex-col items-center justify-center h-44 group overflow-hidden
                        ${draggingIcon ? `border-[#00549A] bg-[#f0f7ff]` : `border-gray-300 hover:border-[#00549A] hover:bg-gray-50`}
                        ${iconPreview ? `border-solid border-[#00549A] bg-gradient-to-br from-[#f0f7ff] to-white` : ``}
                      `}
                      onDragOver={(e) => { e.preventDefault(); setDraggingIcon(true); }}
                      onDragLeave={() => setDraggingIcon(false)}
                      onDrop={handleIconDrop}
                      onClick={() => iconRef.current?.click()}
                    >
                      {iconPreview ? (
                        <div className="relative w-full h-full flex items-center justify-center group">
                          <img src={iconPreview} alt="icon preview" className="w-24 h-24 object-contain group-hover:opacity-50 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-center">
                              <Upload size={28} className="text-[#00549A] mx-auto mb-1" />
                              <span className="text-xs font-bold text-[#00549A] font-[Cairo]">غيّر الأيقونة</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="p-3 bg-gray-100 rounded-full text-gray-400 mx-auto mb-2 group-hover:bg-[#00549A]/10 group-hover:text-[#00549A] transition-all transform group-hover:scale-110">
                            <Shield size={20} />
                          </div>
                          <p className="text-xs font-bold text-gray-600 font-[Cairo]">اسحب ملف SVG هنا</p>
                          <p className="text-[10px] text-gray-400 font-[Cairo] mt-1">SVG فقط (حد أقصى 2 ميجا)</p>
                        </div>
                      )}
                    </div>
                    <input ref={iconRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconSelect(f); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className={`p-6 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 bg-gradient-to-r ${urgent ? 'from-red-50/30 to-orange-50/30' : 'from-blue-50/30 to-cyan-50/30'}`}>
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-200/50 active:bg-gray-300/50 transition-all transform hover:scale-105 active:scale-95 font-[Cairo]"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoadingData}
            className={`flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 font-[Cairo] disabled:opacity-50 disabled:scale-100
              ${urgent 
                ? "bg-gradient-to-r from-[#F04930] to-[#d93d26] shadow-[#F04930]/30 hover:shadow-[#F04930]/50" 
                : "bg-gradient-to-r from-[#00549A] to-[#003d6d] shadow-[#00549A]/30 hover:shadow-[#00549A]/50"}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                {mode === "add" ? <Plus size={20} strokeWidth={2.5} /> : <Edit2 size={20} strokeWidth={2.5} />}
                <span>{mode === "add" ? (urgent ? "إنشاء الحالة" : "إنشاء الكفالة") : "حفظ التعديلات"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT MODAL WRAPPER (FETCHES DATA BY ID) ─── */
function EditModalWrapper({ 
  id, 
  urgent, 
  onClose, 
  onSave, 
  isSubmitting 
}: { 
  id: number; 
  urgent: boolean; 
  onClose: () => void; 
  onSave: (id: number, payload: any) => void;
  isSubmitting: boolean;
}) {
  const { data: sponsorship, isLoading: loadingSponsorship } = useSponsorship(urgent ? 0 : id);
  const { data: emergency, isLoading: loadingEmergency } = useEmergencyCase(urgent ? id : 0);

  const initialData = urgent ? emergency : sponsorship;
  const isLoadingData = urgent ? loadingEmergency : loadingSponsorship;

  return (
    <CaseFormModal 
      urgent={urgent}
      mode="edit"
      initialData={initialData}
      isLoadingData={isLoadingData}
      onClose={onClose}
      onSave={(payload) => onSave(id, payload)}
      isSubmitting={isSubmitting}
    />
  );
}

/* ─── DELETE MODAL ─── */
function DeleteConfirmModal({ 
  data, 
  urgent,
  onClose, 
  onConfirm, 
  isDeleting 
}: { 
  data: any; 
  urgent: boolean;
  onClose: () => void; 
  onConfirm: (id: number) => void; 
  isDeleting: boolean; 
}) {
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
              onClick={() => onConfirm(data.id)} 
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
export default function SponsorshipsAPIManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("جميع الحالات");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<ModalStep>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  // --- Sponsorships Queries & Mutations ---
  const { data: sponsorships = [], isLoading: loadingSponsorships, isError: errorSponsorships } = useSponsorships();
  const createSponsorshipMutation = useCreateSponsorship();
  const updateSponsorshipMutation = useUpdateSponsorship();
  const deleteSponsorshipMutation = useDeleteSponsorship();

  // --- Emergency Cases Queries & Mutations ---
  const { data: emergencyCases = [], isLoading: loadingEmergency, isError: errorEmergency } = useEmergencyCases();
  const createEmergencyMutation = useCreateEmergencyCase();
  const updateEmergencyMutation = useUpdateEmergencyCase();
  const deleteEmergencyMutation = useDeleteEmergencyCase();

  const isLoading = loadingSponsorships || loadingEmergency;
  const isError = errorSponsorships || errorEmergency;

  const handleCreateSponsorship = (payload: CreateSponsorshipPayload) => createSponsorshipMutation.mutate(payload, { onSuccess: () => setModal(null) });
  const handleUpdateSponsorship = (id: number, payload: UpdateSponsorshipPayload) => updateSponsorshipMutation.mutate({ id, payload }, { onSuccess: () => { setModal(null); setSelectedProgram(null); } });
  const handleDeleteSponsorship = (id: number) => deleteSponsorshipMutation.mutate(id, { onSuccess: () => { setModal(null); setSelectedProgram(null); } });

  const handleCreateEmergency = (payload: CreateEmergencyCasePayload) => createEmergencyMutation.mutate(payload, { onSuccess: () => setModal(null) });
  const handleUpdateEmergency = (id: number, payload: UpdateEmergencyCasePayload) => updateEmergencyMutation.mutate({ id, payload }, { onSuccess: () => { setModal(null); setSelectedProgram(null); } });
  const handleDeleteEmergency = (id: number) => deleteEmergencyMutation.mutate(id, { onSuccess: () => { setModal(null); setSelectedProgram(null); } });

  // Merge and normalize data
  const combinedData = useMemo(() => {
    const normSponsorships = sponsorships.map(s => ({ 
      ...s, 
      caseType: 'regular' as const, 
      title: s.name,
      targetAmount: Number(s.targetAmount) || 0,
      collectedAmount: Number(s.collectedAmount) || 0,
      createdAt: s.createdAt || new Date().toISOString()
    }));
    const normEmergency = emergencyCases.map(e => ({ 
      ...e, 
      caseType: 'urgent' as const,
      title: e.title,
      targetAmount: Number(e.targetAmount) || 0,
      collectedAmount: Number(e.collectedAmount) || 0,
      createdAt: e.createdOn || new Date().toISOString()
    }));
    return [...normSponsorships, ...normEmergency].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sponsorships, emergencyCases]);

  const filtered = combinedData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    
    // Type and Status filter
    const matchFilter = filter === "جميع الحالات" || 
                       (filter === "نشطة" && item.isActive) || 
                       (filter === "غير نشطة" && !item.isActive) ||
                       (filter === "الكفالات العادية" && item.caseType === 'regular') ||
                       (filter === "الحالات الحرجة" && item.caseType === 'urgent');

    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'إجمالي الحالات', value: combinedData.length, icon: LayoutGrid, color: '#00549A', bg: '#e6eff7' },
    { label: 'كفالات عادية', value: sponsorships.length, icon: Heart, color: '#22c55e', bg: '#e9f9ef' },
    { label: 'حالات حرجة', value: emergencyCases.length, icon: AlertCircle, color: '#F04930', bg: '#fdeceb' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة الكفالات والحالات</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">متابعة وتعديل برامج الكفالات العادية والحالات الحرجة</p>
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
            placeholder="ابحث باسم الكفالة أو الحالة..."
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
              <option>جميع الحالات</option>
              <option>الكفالات العادية</option>
              <option>الحالات الحرجة</option>
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
          <p className="font-[Cairo] text-[#697282]">جاري تحميل البيانات...</p>
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
          {filtered.map((item) => (
            <Card key={`${item.caseType}-${item.id}`} className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#00549A]/30 transition-all duration-300">
              {/* Image Section with Overlay */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-[Cairo]">لا توجد صورة</span>
                  </div>
                )}
                
                {/* Top Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {/* Type Badge */}
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold font-[Cairo] backdrop-blur-md shadow-lg text-white transition-all transform group-hover:scale-105 ${item.caseType === 'urgent' ? 'bg-gradient-to-r from-[#F04930] to-[#e63d1f] border border-red-300/50' : 'bg-gradient-to-r from-[#00549A] to-[#003d6d] border border-blue-300/50'}`}>
                    {item.caseType === 'urgent' ? '🚨 حالة عاجلة' : '❤️ كفالة عادية'}
                  </span>
                  
                  {/* Active Status Badge */}
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold font-[Cairo] backdrop-blur-md shadow-lg ${item.isActive ? "bg-white/95 text-green-600 border border-green-200" : "bg-white/95 text-gray-400 border border-gray-200"}`}>
                    {item.isActive ? "✓ نشط" : "× غير نشط"}
                  </span>
                  
                  {/* Critical/Urgent Indicator */}
                  {item.caseType === 'urgent' && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white backdrop-blur-md shadow-lg border animate-pulse
                      ${item.isCritical 
                        ? 'bg-gradient-to-r from-red-600 to-red-500 border-red-400/50' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-400 border-orange-300/50'}`}>
                      {item.isCritical ? <Flame size={14} className="fill-current" /> : <Clock size={14} />}
                      <span className="text-[10px] font-bold font-[Cairo]">
                        {item.urgencyLevel === 'High' ? 'حرجة جداً' : item.urgencyLevel === 'Medium' ? 'عاجلة متوسطة' : item.urgencyLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-6">
                {/* Title and Quick Actions */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {/* Icon */}
                    {item.caseType === 'urgent' ? (
                      <div className={`p-2 rounded-lg flex-shrink-0 ${item.isCritical ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-500"}`}>
                        <AlertCircle size={18} />
                      </div>
                    ) : (
                      item.icon ? (
                        <div className="w-8 h-8 flex items-center justify-center p-1.5 bg-blue-50 rounded-lg flex-shrink-0 border border-blue-100">
                          <img src={item.icon} alt="icon" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-blue-50 text-[#00549A] flex-shrink-0">
                          <Heart size={18} />
                        </div>
                      )
                    )}
                    
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-2 text-sm leading-snug">{item.title || 'بدون عنوان'}</h3>
                      {item.caseType === 'regular' && item.icon && (
                        <p className="text-[10px] text-[#00549A] font-[Cairo] mt-0.5">أيقونة مخصصة</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button 
                      onClick={() => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "edit-regular" : "edit-urgent"); }}
                      title="تعديل"
                      className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all transform hover:scale-110 active:scale-95"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "delete-regular" : "delete-urgent"); }}
                      title="حذف"
                      className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all transform hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#697282] font-[Cairo] line-clamp-2 mb-6 min-h-[2.5rem]">{item.description || "لا يوجد وصف متوفر"}</p>

                {/* Financial Info with Progress Bar */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {/* Amount Details */}
                  <div className="flex justify-between items-end text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#697282] font-[Cairo] text-[11px]">المحصل</span>
                      <span className="font-bold text-[#101727] font-[Cairo]">{(item.collectedAmount ?? 0).toLocaleString('ar-EG')} ج.م</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[#697282] font-[Cairo] text-[11px]">الهدف</span>
                      <span className={`font-bold font-[Cairo] ${item.caseType === 'urgent' ? 'text-[#F04930]' : 'text-[#00549A]'}`}>{(item.targetAmount ?? 0).toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg
                          ${item.caseType === 'urgent' 
                            ? (item.isCritical ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-orange-500 to-orange-400') 
                            : 'bg-gradient-to-r from-[#00549A] to-[#0070c0]'}`} 
                        style={{ width: `${Math.min(((item.collectedAmount ?? 0) / (item.targetAmount || 1)) * 100, 100)}%` }} 
                      />
                    </div>
                    
                    {/* Percentage Text */}
                    <div className="flex justify-between items-center text-xs text-[#697282] font-[Cairo]">
                      <span>{Math.min(((item.collectedAmount ?? 0) / (item.targetAmount || 1)) * 100, 100).toFixed(1)}% مكتمل</span>
                      {(item.targetAmount ?? 0) > (item.collectedAmount ?? 0) && (
                        <span>المتبقي: {((item.targetAmount ?? 0) - (item.collectedAmount ?? 0)).toLocaleString('ar-EG')} ج.م</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Completion Status */}
                {((item.collectedAmount ?? 0) >= (item.targetAmount ?? 0)) && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 border border-green-100 animate-pulse">
                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-green-700 font-[Cairo]">تم تحقيق الهدف المالي</span>
                  </div>
                )}
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
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة / البرنامج</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">النوع</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المستهدف</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المحصل</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">تاريخ البدء</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filtered.map((item) => (
                  <tr key={`${item.caseType}-${item.id}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-100">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-semibold">
                              IMG
                            </div>
                          )}
                          {item.caseType === 'regular' && item.icon && (
                            <div className="absolute bottom-0 right-0 bg-white/90 p-0.5 rounded-tl-md shadow-sm border-t border-l border-gray-100">
                              <img src={item.icon} alt="icon" className="w-4 h-4 object-contain" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#101727] font-[Cairo] text-sm">{item.title}</span>
                          {item.caseType === 'regular' && item.icon && (
                            <span className="text-[10px] text-[#00549A] font-[Cairo] font-medium flex items-center gap-1">
                              أيقونة البرنامج نشطة
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${item.caseType === 'urgent' ? 'bg-red-50 text-[#F04930]' : 'bg-blue-50 text-[#00549A]'}`}>
                          {item.caseType === 'urgent' ? 'حالة حرجة' : 'كفالة عادية'}
                        </span>
                        {item.caseType === 'urgent' && (
                          <span className={`text-[9px] font-bold font-[Cairo] ${item.isCritical ? 'text-red-600' : 'text-orange-500'}`}>
                            ({item.urgencyLevel === 'High' ? 'حرجة جداً' : 'عاجلة متوسطة'})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${item.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {item.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#101727] font-[Cairo] text-sm">{(item.targetAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="px-6 py-4 font-bold text-[#00549A] font-[Cairo] text-sm">{(item.collectedAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="px-6 py-4 text-[#697282] font-[Cairo] text-sm">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "edit-regular" : "edit-urgent"); }} className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "delete-regular" : "delete-urgent"); }} className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all"><Trash2 size={18} /></button>
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
      
      {(modal === "add-regular" || modal === "add-urgent") && (
        <CaseFormModal 
          urgent={modal === "add-urgent"} 
          mode="add"
          onClose={() => setModal(null)} 
          onSave={modal === "add-urgent" ? handleCreateEmergency : handleCreateSponsorship} 
          isSubmitting={modal === "add-urgent" ? createEmergencyMutation.isPending : createSponsorshipMutation.isPending} 
        />
      )}

      {(modal === "edit-regular" || modal === "edit-urgent") && selectedProgram && (
        <EditModalWrapper 
          id={selectedProgram.id}
          urgent={modal === "edit-urgent"} 
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onSave={modal === "edit-urgent" ? handleUpdateEmergency : handleUpdateSponsorship} 
          isSubmitting={modal === "edit-urgent" ? updateEmergencyMutation.isPending : updateSponsorshipMutation.isPending} 
        />
      )}

      {modal === "delete-regular" && selectedProgram && (
        <DeleteConfirmModal 
          data={selectedProgram} 
          urgent={false}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onConfirm={() => handleDeleteSponsorship(selectedProgram.id)} 
          isDeleting={deleteSponsorshipMutation.isPending} 
        />
      )}

      {modal === "delete-urgent" && selectedProgram && (
        <DeleteConfirmModal 
          data={selectedProgram} 
          urgent={true}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onConfirm={() => handleDeleteEmergency(selectedProgram.id)} 
          isDeleting={deleteEmergencyMutation.isPending} 
        />
      )}
    </div>
  );
}