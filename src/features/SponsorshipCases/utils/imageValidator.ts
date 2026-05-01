import type { ImageValidationResult, ImageUploadOptions } from '../types/image-upload.types';

const DEFAULT_IMAGE_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Validates an image file against options
 */
export const validateImageFile = (
  file: File,
  options: Partial<ImageUploadOptions> = {}
): ImageValidationResult => {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };
  
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'عذراً، الامتداد غير مسموح به لصورة الكفالة (يسمح بـ JPG, PNG, WebP).',
    };
  }

  const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `حجم الملف يتجاوز الحد المسموح به (${opts.maxSizeMB} ميجا).`,
    };
  }

  return { valid: true };
};

/**
 * Checks if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Gets image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
