import { Upload } from 'lucide-react';

interface ImageDropzoneProps {
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  isDragging: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function ImageDropzone({
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging,
  disabled = false,
  onClick,
}: ImageDropzoneProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-44 group
        ${isDragging ? 'border-[#00549A] bg-[#f0f7ff]' : 'border-gray-300 hover:border-[#00549A] hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className="p-3 bg-gray-100 rounded-full text-gray-400 mb-2 group-hover:bg-[#00549A]/10 group-hover:text-[#00549A] transition-all transform group-hover:scale-110">
        <Upload size={24} />
      </div>
      <p className="font-bold text-sm text-[#101727] font-[Cairo]">اسحب صورة أو انقر هنا</p>
      <p className="text-[11px] text-gray-400 font-[Cairo] mt-1">JPG, PNG, WebP (حد أقصى 5 ميجا)</p>
    </div>
  );
}
