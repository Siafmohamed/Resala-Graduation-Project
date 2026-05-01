import { useState, useCallback } from 'react';
import { validateSvgContent, sanitizeSvg } from '../utils/svgValidator';

interface UseSvgValidationReturn {
  svgContent: string;
  isValid: boolean;
  error: string | null;
  isValidating: boolean;
  handleSvgInput: (content: string) => void;
  clearSvg: () => void;
  validateSvg: () => boolean;
}

export function useSvgValidation(): UseSvgValidationReturn {
  const [svgContent, setSvgContent] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSvgInput = useCallback((content: string) => {
    setSvgContent(content);
    setError(null);
    setIsValid(false);
  }, []);

  const validateSvg = useCallback((): boolean => {
    setIsValidating(true);
    const result = validateSvgContent(svgContent);
    
    if (result.valid) {
      const sanitized = sanitizeSvg(svgContent);
      setSvgContent(sanitized);
      setIsValid(true);
      setError(null);
    } else {
      setIsValid(false);
      setError(result.error || 'SVG غير صالح');
    }
    
    setIsValidating(false);
    return result.valid;
  }, [svgContent]);

  const clearSvg = useCallback(() => {
    setSvgContent('');
    setIsValid(false);
    setError(null);
    setIsValidating(false);
  }, []);

  return {
    svgContent,
    isValid,
    error,
    isValidating,
    handleSvgInput,
    clearSvg,
    validateSvg,
  };
}

export default useSvgValidation;
