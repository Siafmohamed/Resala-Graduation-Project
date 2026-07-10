/**
 * @file imageValidator.ts
 * @description Shared image validation utilities.
 * Merged from:
 *  - src/features/SponsorshipCases/utils/imageValidator.ts
 *  - src/features/UrgentCases/utils/imageValidator.ts
 */

export interface ImageUploadOptions {
  maxSizeMB: number;
  allowedTypes: string[];
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const DEFAULT_IMAGE_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Validates an image file against configurable options.
 * @param file - The File object to validate.
 * @param options - Partial override of default validation options.
 */
export const validateImageFile = (
  file: File,
  options: Partial<ImageUploadOptions> = {}
): ImageValidationResult => {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };

  if (!opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'عذراً، الامتداد غير مسموح به (يسمح بـ JPG, PNG, WebP).',
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
 * Checks if a file is an image based on its MIME type.
 */
export const isImageFile = (file: File): boolean => file.type.startsWith('image/');

/**
 * Gets image dimensions (width × height) from a File object.
 */
export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
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
