/**
 * Format Egyptian phone for display: 01012345678 → +20 101 234 5678
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11 || !digits.startsWith('01')) return phone;
  return `+20 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}
