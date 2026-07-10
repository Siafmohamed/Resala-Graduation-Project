/**
 * @file useImageUpload.ts
 * @description Shared hook for image file selection, validation, compression and preview.
 * Merged from:
 *  - src/features/SponsorshipCases/hooks/useImageUpload.ts
 *  - src/features/UrgentCases/hooks/useImageUpload.ts  (was a duplicate)
 *
 * Usage:
 *   const { file, preview, error, handleFileSelect, clearImage } = useImageUpload({ maxSizeMB: 3 });
 */

import { useState, useCallback } from 'react';
import { validateImageFile } from '../utils/imageValidator';
import { compressImage } from '../utils/imageCompressor';
import type { ImageUploadOptions } from '../utils/imageValidator';

export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

export const useImageUpload = (options: Partial<ImageUploadOptions> = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<ImageUploadState>({
    file: null,
    preview: null,
    isUploading: false,
    error: null,
    progress: 0,
  });

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file, opts);

      if (!validation.valid) {
        setState((prev) => ({ ...prev, error: validation.error ?? 'ملف غير صالح' }));
        return;
      }

      setState((prev) => ({ ...prev, error: null, isUploading: true }));

      try {
        const compressedFile = await compressImage(file, opts.maxSizeMB);
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
        setState((prev) => ({ ...prev, isUploading: false, error: 'فشل في معالجة الصورة' }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opts.maxSizeMB, opts.allowedTypes?.join()]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearImage = useCallback(() => {
    setState({ file: null, preview: null, isUploading: false, error: null, progress: 0 });
  }, []);

  return {
    ...state,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    clearImage,
    /** Alias for clearImage — kept for backward compat */
    resetUpload: clearImage,
  };
};

export default useImageUpload;
