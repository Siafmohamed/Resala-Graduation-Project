import React, { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Shown when a list or section has no data. RTL-friendly.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted bg-muted/30 p-8 text-center ${className}`}
      dir="rtl"
    >
      <div className="text-muted-foreground">
        {icon ?? <Inbox size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export { EmptyState };
