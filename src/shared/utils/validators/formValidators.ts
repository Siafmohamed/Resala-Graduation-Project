export function validateFullName(value: string | null | undefined): string | null {
  if (value == null || value.trim().length === 0) {
    return 'هذا الحقل مطلوب';
  }
  const words = value.trim().split(/\s+/);
  if (words.length >= 2) {
    return null;
  } else {
    return 'الرجاء إدخال الاسم الأول والأخير';
  }
}

export function validatePassword(value: string | null | undefined): string | null {
  if (value == null || value.length === 0) {
    return 'الرجاء إدخال كلمة المرور';
  }

  if (value.length < 6) {
    return 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل';
  }

  if (!/[a-zA-Z]/.test(value)) {
    return 'يجب أن تحتوي كلمة المرور على حرف إنجليزي واحد على الأقل';
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return 'يجب أن تحتوي على رمز خاص واحد على الأقل';
  }

  return null;
}

export function validateEmail(value: string | null | undefined): string | null {
  if (value == null || value.trim().isEmpty) {
    return 'هذا الحقل مطلوب';
  }
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (emailPattern.test(value.trim())) {
    return null;
  } else {
    return 'الرجاء إدخال بريد إلكتروني صحيح';
  }
}

export function validatePhoneNumber(value: string | null | undefined): string | null {
  if (value == null || value.trim().isEmpty) {
    return 'هذا الحقل مطلوب';
  }
  const mobilePattern = /^01[0125][0-9]{8}$/;
  const landlinePattern = /^0[2-9][0-9]{7,8}$/;

  if (mobilePattern.test(value.trim()) || landlinePattern.test(value.trim())) {
    return null;
  } else {
    return ' الرجاء إدخال رقم هاتف محمول صحيح';
  }
}

export function validateLandLineNumber(value: string | null | undefined): string | null {
  if (value == null || value.isEmpty) {
    return 'هذا الحقل مطلوب';
  }
  const landlinePattern = /^0[2-9][0-9]{7,8}$/;

  if (landlinePattern.test(value)) {
    return null;
  } else {
    return 'الرجاء إدخال رقم أرضي صحيح';
  }
}

export function validateOTP(value: string | null | undefined): string | null {
  if (value == null || value.trim().isEmpty) {
    return 'الرجاء إدخال رمز التحقق';
  }

  if (!/^\d{6}$/.test(value.trim())) {
    return 'رمز التحقق يجب أن يتكون من 6 أرقام فقط';
  }

  return null;
}
