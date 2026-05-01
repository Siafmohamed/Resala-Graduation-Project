import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export type DateFormat = 'short' | 'long' | 'relative' | 'datetime';

/**
 * Format date for display in Arabic locale.
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatType: DateFormat = 'short'
): string {
  if (!date) return '—';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';

  switch (formatType) {
    case 'short':
      return format(d, 'dd/MM/yyyy', { locale: ar });
    case 'long':
      return format(d, 'd MMMM yyyy', { locale: ar });
    case 'relative':
      return formatDistanceToNow(d, { addSuffix: true, locale: ar });
    case 'datetime':
      return format(d, 'dd/MM/yyyy HH:mm', { locale: ar });
    default:
      return format(d, 'dd/MM/yyyy', { locale: ar });
  }
}
