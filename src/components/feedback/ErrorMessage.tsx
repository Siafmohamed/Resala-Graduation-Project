import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: Error | string;
  retry?: () => void;
  className?: string;
}

/**
 * Displays an error message with optional retry action. RTL-friendly.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  retry,
  className = '',
}) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center ${className}`}
      dir="rtl"
    >
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export { ErrorMessage };
