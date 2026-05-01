import type { ImageUploadState, ImageUploadOptions } from '../types/image-upload.types';
import { useState, useCallback } from 'react';
import { validateImageFile } from '../utils/imageValidator';
import { compressImage } from '../utils/imageCompressor';

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

export const useImageUpload = (options: Partial<ImageUploadOptions> = {}) => {
  const [state, setState] = useState<ImageUploadState>({
    file: null,
    preview: null,
    isUploading: false,
    error: null,
    progress: 0,
  });

  const opts = { ...DEFAULT_OPTIONS, ...options };

  const handleFileSelect = useCallback(async (file: File) => {
    const validation = validateImageFile(file, opts);
    
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.error || 'ملف غير صالح' }));
      return;
    }

    setState(prev => ({ ...prev, error: null, isUploading: true }));

    try {
      // Compress if needed
      const compressedFile = await compressImage(file, opts.maxSizeMB);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setState({
          file: compressedFile,
          preview: e.target?.result as string,
          isUploading: false,
          error: null,
          progress: 100,
        });
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: 'فشل في معالجة الصورة',
      }));
    }
  }, [opts]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearImage = useCallback(() => {
    setState({
      file: null,
      preview: null,
      isUploading: false,
      error: null,
      progress: 0,
    });
  }, []);

  const resetUpload = useCallback(() => {
    clearImage();
  }, [clearImage]);

  return {
    ...state,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    clearImage,
    resetUpload,
  };
};

export default useImageUpload;
