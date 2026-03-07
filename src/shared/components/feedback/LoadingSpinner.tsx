import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

/**
 * Centered loading spinner with optional Arabic message.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={message ?? 'جاري التحميل'}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export { LoadingSpinner };
