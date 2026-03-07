/**
 * Format number as Egyptian Pounds (ج.م).
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} ج.م`;
}
