import { useRef } from 'react';
import { useImageUpload } from '../../hooks/useImageUpload';
import type { ImageUploadOptions } from '../../types/image-upload.types';
import ImageDropzone from './ImageDropzone';
import ImagePreview from './ImagePreview';
import ImageValidation from './ImageValidation';
import UploadProgress from './UploadProgress';

interface ImageUploadWidgetProps {
  onImageChange: (file: File | null) => void;
  initialImageUrl?: string;
  options?: Partial<ImageUploadOptions>;
}

export default function ImageUploadWidget({
  onImageChange,
  options,
}: ImageUploadWidgetProps) {
  const {
    preview,
    isUploading,
    error,
    progress,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    clearImage,
  } = useImageUpload(options);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    clearImage();
    onImageChange(null);
  };

  const handleFileSelectWrapper = (file: File) => {
    handleFileSelect(file);
    onImageChange(file);
  };

  const handleDropWrapper = (e: React.DragEvent) => {
    handleDrop(e);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onImageChange(droppedFile);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative border-2 border-dashed rounded-2xl transition-all overflow-hidden h-44 group">
        {preview ? (
          <ImagePreview previewUrl={preview} onClear={handleClear} />
        ) : (
          <ImageDropzone
            onDrop={handleDropWrapper}
            onDragOver={handleDragOver}
            onDragLeave={() => {}}
            isDragging={false}
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelectWrapper(file);
        }}
      />

      <UploadProgress progress={progress} isUploading={isUploading} />
      <ImageValidation error={error} />
    </div>
  );
}
