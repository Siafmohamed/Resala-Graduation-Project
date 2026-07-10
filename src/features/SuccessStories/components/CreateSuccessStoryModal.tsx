import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useCreateSuccessStory } from '../hooks/useSuccessStories';

interface CreateSuccessStoryModalProps {
  onClose: () => void;
}

export default function CreateSuccessStoryModal({ onClose }: CreateSuccessStoryModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const createStory = useCreateSuccessStory();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors((prev) => ({
          ...prev,
          image: 'يجب أن تكون الملف صورة',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          image: 'يجب أن تكون الصورة أقل من 5 ميجابايت',
        }));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = 'العنوان مطلوب';
    }
    if (!description.trim()) {
      errors.description = 'الوصف مطلوب';
    }
    if (!image) {
      errors.image = 'الصورة مطلوبة';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    createStory.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
          <h2 className="text-lg font-black text-[#101727] font-[Cairo]">
            إضافة قصة نجاح جديدة
          </h2>
          <button
            onClick={onClose}
            disabled={createStory.isPending}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
              العنوان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.title;
                    return newErrors;
                  });
                }
              }}
              placeholder="أدخل عنوان قصة النجاح"
              className={`w-full px-4 py-3 rounded-xl border ${
                validationErrors.title
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              } focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] outline-none font-[Cairo] text-sm transition-all`}
            />
            {validationErrors.title && (
              <p className="text-xs text-red-600 font-[Cairo] mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
              الوصف *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (validationErrors.description) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              placeholder="أدخل وصف قصة النجاح"
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${
                validationErrors.description
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              } focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] outline-none font-[Cairo] text-sm transition-all resize-none`}
            />
            {validationErrors.description && (
              <p className="text-xs text-red-600 font-[Cairo] mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
              الصورة *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={createStory.isPending}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                validationErrors.image
                  ? 'border-red-300 bg-red-50'
                  : previewUrl
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-[#00549A]'
              }`}
            >
              {previewUrl ? (
                <div className="text-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg mx-auto mb-3"
                  />
                  <p className="text-sm font-bold text-[#00549A] font-[Cairo]">
                    تم تحميل الصورة
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm font-bold text-gray-600 font-[Cairo]">
                    اسحب الصورة هنا أو اضغط للاختيار
                  </p>
                  <p className="text-xs text-gray-400 font-[Cairo] mt-1">
                    PNG, JPG, GIF - أقصى حجم 5 ميجابايت
                  </p>
                </div>
              )}
            </label>
            {validationErrors.image && (
              <p className="text-xs text-red-600 font-[Cairo] mt-1">
                {validationErrors.image}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={createStory.isPending}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[#495565] font-bold font-[Cairo] text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createStory.isPending}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00549A] to-[#0081ED] text-white font-bold font-[Cairo] text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createStory.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                'إضافة القصة'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
