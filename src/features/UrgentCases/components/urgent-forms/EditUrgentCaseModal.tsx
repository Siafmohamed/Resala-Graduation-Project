import React, { useState } from 'react';
import { AlertCircle, X, Loader2, Edit, Upload, Image as ImageIcon, CheckCircle2, DollarSign } from 'lucide-react';
import { UrgencyLevel } from '../../types/urgency-level.types';
import type { UrgentCase } from '../../types/urgent-case.types';
import { UrgencyLevelSelector } from './UrgencyLevelSelector';
import { useUpdateUrgentCase, useUrgentCase } from '../../hooks/useUrgentCases';
import { normalizeUrgencyLevel } from '@/api/services/sponsorshipService';

interface EditUrgentCaseModalProps {
  /**
   * If provided, the modal will be open/closed based on this prop.
   * Used for backward compatibility with the old API.
   */
  isOpen?: boolean;
  
  /**
   * Old API: provide full case object with isOpen.
   * Will be deprecated in favor of caseId.
   */
  case?: UrgentCase | null;
  
  /**
   * New API: provide just the case ID and the component fetches the data.
   * Used with onClose and onSuccess callbacks.
   */
  caseId?: number;
  
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditUrgentCaseModal: React.FC<EditUrgentCaseModalProps> = ({
  isOpen = false,
  onClose,
  case: caseData,
  caseId,
  onSuccess,
}) => {
  // If caseId is provided, fetch the data
  const fetchedCase = useUrgentCase(caseId ?? 0);
  const isDataLoading = caseId ? fetchedCase.isLoading : false;
  
  // ✅ Fix — memoize activeCase so its reference is stable
  // Otherwise it's recomputed on every render, causing the effect below
  // to re-run and reset urgencyLevel back to the original value
  const activeCase = React.useMemo(
    () => caseData || (caseId ? fetchedCase.data : null),
    [caseData, caseId, fetchedCase.data]
  );
  
  // Determine if modal should be open
  const shouldBeOpen = caseId ? !!caseId : isOpen;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [draggingImg, setDraggingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement>(null);

  // API mutation
  const updateMutation = useUpdateUrgentCase();
  const isSubmitting = updateMutation.isPending;

  // ✅ Initialize form when modal opens or activeCase changes
  // This works correctly even when editing multiple cases in sequence
  React.useEffect(() => {
    if (!shouldBeOpen || !activeCase) {
      // Reset form when modal closes
      setTitle('');
      setDescription('');
      setTargetAmount(0);
      setCollectedAmount(0);
      setUrgencyLevel(UrgencyLevel.Normal);
      setIsActive(true);
      setImageFile(null);
      setImagePreview(null);
      setError(null);
      return;
    }



// ... (in the useEffect)
    // Load case data when modal opens or case changes
    setTitle(activeCase.title);
    setDescription(activeCase.description);
    setTargetAmount(activeCase.targetAmount);
    setCollectedAmount(activeCase.collectedAmount);
    
    // ✅ Ensure urgencyLevel is always a valid number (1, 2, or 3)
    setUrgencyLevel(normalizeUrgencyLevel(activeCase.urgencyLevel));
    
    setIsActive(activeCase.isActive);
    if (activeCase.imageUrl) {
      setImagePreview(activeCase.imageUrl);
    } else {
      setImagePreview(null);
    }
    setError(null);
  }, [shouldBeOpen, activeCase]);

  // Validation
  const validateForm = (): boolean => {
    setError(null);

    if (!title.trim()) {
      setError('عنوان الحالة العاجلة مطلوب.');
      return false;
    }
    if (title.length > 200) {
      setError('عنوان الحالة العاجلة لا يتجاوز 200 حرف.');
      return false;
    }
    if (!description.trim()) {
      setError('الوصف مطلوب.');
      return false;
    }
    if (targetAmount <= 0) {
      setError('المبلغ المستهدف يجب أن يكون أكبر من صفر.');
      return false;
    }
    if (collectedAmount > targetAmount) {
      setError('المبلغ المحصل لا يمكن أن يكون أكبر من المبلغ المستهدف.');
      return false;
    }
    if (![1, 2, 3].includes(urgencyLevel)) {
      setError('يجب تحديد مستوى الأولوية.');
      return false;
    }

    return true;
  };

  // Image handling
  const validateImageFile = (file: File) => {
    setError(null);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('عذراً، الامتداد غير مسموح به (يسمح بـ JPG, PNG, WebP).');
      return false;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('حجم الملف يتجاوز الحد المسموح به (5 ميجا).');
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

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingImg(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm() || !activeCase) return;

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        targetAmount,
        collectedAmount,
        urgencyLevel,
        isActive,
      };

      // Only include image if a new file was selected
      if (imageFile) {
        payload.image = imageFile;
      }
      await updateMutation.mutateAsync({
        id: activeCase.id,
        payload,
      });

      setError(null);
      onSuccess?.();
      onClose();
    } catch (_err) {
      // Error is handled by the mutation hook toast
    }
  };

  // Show loading state if fetching by ID
  if (isDataLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col items-center justify-center p-8">
          <Loader2 className="w-12 h-12 text-[#00549A] animate-spin mb-4" />
          <p className="text-[#697282] font-[Cairo]">جاري تحميل بيانات الحالة...</p>
        </div>
      </div>
    );
  }

  if (!shouldBeOpen || !activeCase) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#00549A] to-[#003d6b] text-white">
              <Edit size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#101727] font-[Cairo]">
                تعديل الحالة العاجلة
              </h2>
              <p className="text-xs text-[#697282] font-[Cairo] mt-1">
                حدّث معلومات الحالة العاجلة والمبالغ المحصلة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200/50 rounded-full transition-colors group"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
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
                    <span className="text-lg text-[#00549A]">*</span>
                    عنوان الحالة العاجلة
                  </span>
                  <span className={`text-xs font-bold ${
                    title.length > 180 ? 'text-[#F04930]' : 'text-[#697282]'
                  }`}>{title.length}/200</span>
                </label>
                <input
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#00549A] focus:ring-2 focus:ring-[#00549A]/20 transition-all font-[Cairo] placeholder-gray-400 bg-white hover:border-gray-300"
                  placeholder="مثال: عملية قلب مفتوح طارئة"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value.slice(0, 200));
                    if (error) setError(null);
                  }}
                  maxLength={200}
                />
                <p className="text-[11px] text-[#697282] font-[Cairo]">أقصى 200 حرف - اسم واضح وموجز</p>
              </div>

              {/* Target Amount */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                  <span className="text-lg text-[#00549A]">*</span>
                  <DollarSign size={16} className="text-[#00549A]" />
                  <span>المبلغ المستهدف (جنيه)</span>
                </label>
                <div className="relative">
                  <input
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all font-[Cairo] focus:outline-none focus:ring-2 focus:ring-[#00549A]/20 hover:border-gray-300 ${
                      targetAmount <= 0 && targetAmount !== 0
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#00549A]'
                    }`}
                    type="number"
                    value={targetAmount}
                    onChange={(e) => {
                      setTargetAmount(Number(e.target.value));
                      if (error) setError(null);
                    }}
                    min="1"
                    step="1"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">ج.م</span>
                </div>
                {targetAmount <= 0 && targetAmount !== 0 && (
                  <p className="text-[11px] text-red-600 font-[Cairo]">❌ يجب أن يكون أكبر من صفر</p>
                )}
                {targetAmount > 0 && (
                  <p className="text-[11px] text-green-600 font-[Cairo]">✓ المبلغ صحيح</p>
                )}
              </div>

              {/* Collected Amount */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>المبلغ المحصل (جنيه)</span>
                </label>
                <div className="relative">
                  <input
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all font-[Cairo] focus:outline-none focus:ring-2 focus:ring-green-500/20 hover:border-gray-300 ${
                      collectedAmount > targetAmount && targetAmount > 0
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    type="number"
                    value={collectedAmount}
                    onChange={(e) => {
                      setCollectedAmount(Number(e.target.value));
                      if (error) setError(null);
                    }}
                    min="0"
                    step="1"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">ج.م</span>
                </div>
                {collectedAmount > targetAmount && targetAmount > 0 ? (
                  <p className="text-[11px] text-red-600 font-[Cairo]">❌ لا يمكن أن يكون أكبر من المبلغ المستهدف</p>
                ) : collectedAmount > 0 ? (
                  <p className="text-[11px] text-green-600 font-[Cairo]">✓ {Math.round((collectedAmount / targetAmount) * 100) || 0}% من الهدف</p>
                ) : (
                  <p className="text-[11px] text-[#697282] font-[Cairo]">اختياري - اترك 0 إذا لم يتم جمع أي مبلغ بعد</p>
                )}
              </div>

              {/* Urgency Level Selector */}
              <UrgencyLevelSelector value={urgencyLevel} onChange={setUrgencyLevel} />
            </div>

            {/* Right Column - Description and Image */}
            <div className="space-y-5">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-[#00549A]">*</span>
                    الوصف التفصيلي
                  </span>
                  <span className={`text-xs font-bold ${
                    description.length > 400 ? 'text-[#F04930]' : 'text-[#697282]'
                  }`}>{description.length}/500</span>
                </label>
                <textarea
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#00549A] focus:ring-2 focus:ring-[#00549A]/20 transition-all font-[Cairo] resize-none hover:border-gray-300 bg-white"
                  placeholder="اشرح حالة المريض والعملية الطبية المطلوبة بالتفصيل..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value.slice(0, 500));
                    if (error) setError(null);
                  }}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-[11px] text-[#697282] font-[Cairo]">أقصى 500 حرف - وصف شامل يساعد المتبرعين على فهم الحالة</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#00549A]" />
                  صورة الحالة العاجلة
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-3 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-44 group overflow-hidden
                    ${draggingImg ? `border-[#00549A] bg-blue-50` : `border-gray-300 hover:border-[#00549A] hover:bg-gray-50`}
                    ${imagePreview ? `border-solid border-[#00549A] bg-gradient-to-br from-blue-50 to-white` : ``}
                  `}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggingImg(true);
                  }}
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
                      <div className="p-3 bg-gray-100 rounded-full text-gray-400 mb-2 group-hover:bg-blue-100 group-hover:text-[#00549A] transition-all transform group-hover:scale-110">
                        <Upload size={24} />
                      </div>
                      <p className="font-bold text-sm text-[#101727] font-[Cairo]">اسحب صورة أو انقر هنا</p>
                      <p className="text-[11px] text-gray-400 font-[Cairo] mt-1">JPG, PNG, WebP (حد أقصى 5 ميجا)</p>
                    </>
                  )}
                </div>
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageSelect(f);
                  }}
                />
              </div>

              {/* Active Status Toggle */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#495565] font-[Cairo] block">الحالة نشطة</span>
                      <p className="text-[11px] text-[#697282] font-[Cairo]">الحالات النشطة فقط تظهر للمتبرعين</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all flex-shrink-0 ${
                      isActive ? 'bg-[#00549A]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-1' : '-translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-[#697282] hover:bg-gray-200/50 active:bg-gray-300/50 transition-all transform hover:scale-105 active:scale-95 font-[Cairo]"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 font-[Cairo] disabled:opacity-50 disabled:scale-100 bg-gradient-to-r from-[#00549A] to-[#003d6b] shadow-[#00549A]/30 hover:shadow-[#00549A]/50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Edit size={20} strokeWidth={2.5} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
