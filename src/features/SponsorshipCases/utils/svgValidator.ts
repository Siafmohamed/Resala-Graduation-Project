/**
 * Validates if a file is a proper SVG
 */
export const validateSvgFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (file.type !== 'image/svg+xml') {
    return { isValid: false, error: 'يجب أن يكون الملف بصيغة SVG فقط.' };
  }

  // Check file size (e.g., max 500KB for an icon)
  const MAX_SIZE = 500 * 1024;
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'حجم ملف الأيقونة يجب أن لا يتجاوز 500 كيلوبايت.' };
  }

  return { isValid: true };
};

/**
 * Validates SVG content string
 */
export const validateSvgContent = (content: string): boolean => {
  const trimmed = content.trim().toLowerCase();
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>');
};

/**
 * Helper to read file as text (useful for SVG)
 */
export const readSvgAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (validateSvgContent(result)) {
        resolve(result);
      } else {
        reject(new Error('محتوى SVG غير صالح.'));
      }
    };
    reader.onerror = () => reject(new Error('فشل قراءة الملف.'));
    reader.readAsText(file);
  });
};
