import { useState, useCallback } from 'react';

/**
 * Handles report export (e.g. CSV/PDF).
 * Stub implementation — wire to exportService when backend is ready.
 */
export function useReportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportReport = useCallback(
    async (_options?: { format?: 'csv' | 'pdf'; reportType?: string }) => {
      setIsExporting(true);
      setError(null);
      try {
        // Stub: simulate export delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        // TODO: call exportService.exportReport(options)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('فشل التصدير'));
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportReport, isExporting, error };
}
