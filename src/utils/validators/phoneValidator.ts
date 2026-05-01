/** Egyptian mobile: 01[0125]xxxxxxxx (11 digits) */
const EGYPTIAN_PHONE_REGEX = /^01[0125]\d{8}$/;

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

export function isValidEgyptianPhone(phone: string): PhoneValidationResult {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) {
    return { isValid: false, error: 'رقم الهاتف يجب أن يكون 11 رقم' };
  }
  if (!EGYPTIAN_PHONE_REGEX.test(digits)) {
    return { isValid: false, error: 'رقم الهاتف غير صحيح. يبدأ بـ 010 أو 011 أو 012 أو 015' };
  }
  return { isValid: true };
}
