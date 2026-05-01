export interface SvgValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates SVG content for safety and correctness
 */
export const validateSvgContent = (content: string): SvgValidationResult => {
  // Check if content is empty
  if (!content.trim()) {
    return { valid: false, error: 'محتوى SVG فارغ' };
  }

  // Check if it starts with <svg
  if (!content.trim().toLowerCase().startsWith('<svg')) {
    return { valid: false, error: 'الملف يجب أن يكون بصيغة SVG صالحة' };
  }

  // Check for potentially dangerous elements
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onload=, etc.
    /<iframe/i,
    /<embed/i,
    /<object/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return { valid: false, error: 'يحتوي SVG على عناصر غير آمنة' };
    }
  }

  return { valid: true };
};

/**
 * Sanitizes SVG content by removing potentially dangerous attributes
 */
export const sanitizeSvg = (content: string): string => {
  // Remove script tags
  let sanitized = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');

  return sanitized;
};
