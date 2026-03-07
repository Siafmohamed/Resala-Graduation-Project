import { useState, useCallback } from 'react';

/**
 * Tracks export progress state for report exports.
 * Stub implementation — wire to real export flow when report export is implemented.
 */
export function useExportProgress() {
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const startExport = useCallback(() => {
    setIsExporting(true);
    setProgress(0);
    // Stub: simulate progress (replace with real export logic)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return p + 10;
      });
    }, 200);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setIsExporting(false);
  }, []);

  return { progress, isExporting, startExport, reset };
}
