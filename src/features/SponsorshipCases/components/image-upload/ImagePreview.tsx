import { X } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string | null;
  onClear: () => void;
  altText?: string;
}

export default function ImagePreview({ previewUrl, onClear, altText = 'preview' }: ImagePreviewProps) {
  if (!previewUrl) return null;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <img
        src={previewUrl}
        alt={altText}
        className="w-full h-full object-cover group-hover:brightness-75 transition-all"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={20} />
          </button>
          <p className="text-sm font-bold font-[Cairo] mt-2">إزالة الصورة</p>
        </div>
      </div>
    </div>
  );
}
