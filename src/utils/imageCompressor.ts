/**
 * @file imageCompressor.ts
 * @description Shared image compression and resizing utilities.
 * Moved from: src/features/SponsorshipCases/utils/imageCompressor.ts
 */

/**
 * Compresses an image file using canvas, scaling it down to reduce file size.
 * If the file is already under the size limit it is returned as-is.
 *
 * @param file - The source image File.
 * @param maxSizeMB - Maximum allowed file size in megabytes.
 */
export const compressImage = async (file: File, maxSizeMB: number): Promise<File> => {
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Scale down while maintaining aspect ratio
      const maxDimension = 1920;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        },
        'image/jpeg',
        0.7
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Resizes an image file to fit within specified maximum dimensions,
 * preserving the original aspect ratio.
 *
 * @param file - The source image File.
 * @param maxWidth - Maximum allowed width in pixels.
 * @param maxHeight - Maximum allowed height in pixels.
 */
export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height / width) * maxWidth;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width / height) * maxHeight;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Resize failed'));
            return;
          }
          resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
        },
        file.type
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
