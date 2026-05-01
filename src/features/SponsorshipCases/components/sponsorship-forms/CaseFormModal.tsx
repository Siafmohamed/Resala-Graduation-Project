import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  X, 
  Heart, 
  AlertCircle, 
  DollarSign,
  Upload,
  CheckCircle2,
  Image,
  Loader2,
  Flame,
  Clock,
  Shield
} from "lucide-react";
import {
  normalizeUrgencyLevel,
  URGENCY_LEVELS,
  type UrgencyLevel,
} from "@/api/services/sponsorshipService";

interface CaseFormModalProps {
  urgent: boolean;
  mode: "add" | "edit";
  initialData?: any;
  onClose: () => void;
  onSave: (payload: any) => void;
  isSubmitting: boolean;
  isLoadingData?: boolean;
}

export function CaseFormModal({
  urgent,
  mode,
  initialData,
  onClose,
  onSave,
  isSubmitting,
  isLoadingData = false
}: CaseFormModalProps) {
  // Extract title/name correctly: sponsorships have 'name', emergency cases have 'title'
  const initialTitle = initialData?.title || initialData?.name || "";
  const initialDesc = initialData?.description || "";
  const initialTarget = initialData?.targetAmount || initialData?.requiredAmount || 0;
  const initialCollected = initialData?.collectedAmount || 0;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);
  const [targetAmount, setTargetAmount] = useState(initialTarget);
  const [collectedAmount, setCollectedAmount] = useState(initialCollected);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(urgent ? URGENCY_LEVELS.URGENT : URGENCY_LEVELS.NORMAL);
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

  // Initialize form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || initialData.name || "");
      setDescription(initialData.description || "");
      setTargetAmount(initialData.targetAmount || initialData.requiredAmount || 0);
      setCollectedAmount(initialData.collectedAmount || 0);
      
      // Normalize urgency level from various data formats
      setUrgencyLevel(normalizeUrgencyLevel(initialData.urgencyLevel));
      
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

    if (urgent) {
      // Emergency case - build FormData
      const formData = new FormData();
      formData.append('Title', title.trim());
      formData.append('Description', description.trim());
      formData.append('UrgencyLevel', String(urgencyLevel));
      formData.append('RequiredAmount', String(targetAmount));

      // Add attachment FILE (actual binary file)
      if (imageFile) {
        formData.append('Attachment', imageFile);
      }

      onSave(formData as any);
    } else {
      // Sponsorship - build FormData
      const formData = new FormData();
      formData.append('Name', title.trim());
      formData.append('Description', description.trim());
      formData.append('TargetAmount', String(targetAmount));
      formData.append('IsActive', String(isActive));
      formData.append('CollectedAmount', String(collectedAmount));

      // Add icon FILE (actual binary file)
      if (iconFile) {
        formData.append('IconFile', iconFile);
      }

      // Add icon name if provided
      if (iconPreview && !iconPreview.startsWith('data:')) {
        formData.append('IconName', iconPreview);
      }

      // Add image FILE (actual binary file)
      if (imageFile) {
        formData.append('ImageFile', imageFile);
      }

      onSave(formData as any);
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

                {/* Urgent Case Urgency Level - 3-State Selector */}
                {urgent && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                      <span className="text-lg text-[#F04930]">*</span>
                      <Flame size={16} className="text-[#F04930]" />
                      <span>مستوى الأولوية / الحرجة</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Normal Priority */}
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel(URGENCY_LEVELS.NORMAL)}
                        className={`p-4 rounded-xl border-2 transition-all font-[Cairo] font-bold text-sm ${
                          urgencyLevel === URGENCY_LEVELS.NORMAL
                            ? 'border-[#00549A] bg-[#e6eff7] text-[#00549A]'
                            : 'border-gray-200 bg-white text-[#697282] hover:border-[#00549A]'
                        }`}
                      >
                        <AlertCircle size={18} className="mx-auto mb-1" />
                        <span className="block">عادي</span>
                        <span className="text-xs text-gray-500">الأولوية 1</span>
                      </button>

                      {/* Urgent Priority */}
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel(URGENCY_LEVELS.URGENT)}
                        className={`p-4 rounded-xl border-2 transition-all font-[Cairo] font-bold text-sm ${
                          urgencyLevel === URGENCY_LEVELS.URGENT
                            ? 'border-[#FF9800] bg-[#fff3e0] text-[#FF9800]'
                            : 'border-gray-200 bg-white text-[#697282] hover:border-[#FF9800]'
                        }`}
                      >
                        <Clock size={18} className="mx-auto mb-1" />
                        <span className="block">حرجة</span>
                        <span className="text-xs text-gray-500">الأولوية 2</span>
                      </button>

                      {/* Critical Priority */}
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel(URGENCY_LEVELS.CRITICAL)}
                        className={`p-4 rounded-xl border-2 transition-all font-[Cairo] font-bold text-sm ${
                          urgencyLevel === URGENCY_LEVELS.CRITICAL
                            ? 'border-[#F04930] bg-[#fff5f3] text-[#F04930]'
                            : 'border-gray-200 bg-white text-[#697282] hover:border-[#F04930]'
                        }`}
                      >
                        <Flame size={18} className="mx-auto mb-1" />
                        <span className="block">حرجة جدا</span>
                        <span className="text-xs text-gray-500">الأولوية 3</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Status Toggle - Only for non-urgent cases OR after urgency selector */}
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
