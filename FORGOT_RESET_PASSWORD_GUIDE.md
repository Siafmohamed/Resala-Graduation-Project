# Forgot Password & Reset Password - Usage Guide

## ✅ API Endpoints Implemented

### 1. Forgot Password(Request OTP)
**Endpoint:** `POST /api/v1/auth/forgot-password`

**Purpose:** Sends a 6-digit OTP to the user's email (valid for 10 minutes)

**Request:**
```json
{
 "email": "ahmed@example.com"
}
```

**Success Response (200):**
```json
{
 "succeeded": true,
 "message": "An OTP has been sent to your email address.",
 "data": null
}
```

---

### 2. Reset Password(Verify OTP + Set New Password)
**Endpoint:** `POST /api/v1/auth/reset-password`

**Purpose:** Verifies OTP and sets new password

**Request:**
```json
{
 "email": "ahmed@example.com",
 "otp": "847291",
 "newPassword": "NewSecurePass456"
}
```

**Success Response (200):**
```json
{
 "succeeded": true,
 "message": "Password has been reset successfully. You can now log in.",
 "data": null
}
```

---

## 🎯 How to Use in React Components

### Example 1: Forgot Password Form Component

```typescript
import React from'react';
import { useForm } from'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from'zod';
import { useForgotPasswordMutation } from '@/features/authentication';

const forgotPasswordSchema = z.object({
 email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
 const forgotPasswordMutation = useForgotPasswordMutation();
 
 const {
 register,
  handleSubmit,
  formState: { errors },
 } = useForm<ForgotPasswordFormData>({
 resolver: zodResolver(forgotPasswordSchema),
 });

const onSubmit = async (data: ForgotPasswordFormData) => {
  try {
  const response = await forgotPasswordMutation.mutateAsync(data);
   
  if (response.succeeded) {
   alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
   }
  } catch(error) {
  console.error('Error:', error);
  }
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)}>
   <div>
    <label htmlFor="email">البريد الإلكتروني</label>
    <input
    id="email"
     type="email"
     {...register('email')}
    placeholder="example@resala.org"
    />
    {errors.email && <p>{errors.email.message}</p>}
   </div>

   <button 
    type="submit" 
    disabled={forgotPasswordMutation.isPending}
   >
    {forgotPasswordMutation.isPending ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
   </button>
  </form>
 );
};

export default ForgotPasswordForm;
```

---

### Example 2: Reset Password Form Component

```typescript
import React from'react';
import { useForm } from'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from'zod';
import { useResetPasswordMutation } from '@/features/authentication';

const resetPasswordSchema = z.object({
 email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
 otp: z.string().length(6, { message: 'رمز التحقق يجب أن يكون 6 أرقام' }),
 newPassword: z.string().min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
 const resetPasswordMutation = useResetPasswordMutation();
 
 const {
 register,
  handleSubmit,
  formState: { errors },
 } = useForm<ResetPasswordFormData>({
 resolver: zodResolver(resetPasswordSchema),
 });

const onSubmit = async (data: ResetPasswordFormData) => {
  try {
  const response = await resetPasswordMutation.mutateAsync(data);
   
  if (response.succeeded) {
   alert('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
    // Redirect to login page
   }
  } catch (error) {
  console.error('Error:', error);
  }
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)}>
   <div>
    <label htmlFor="email">البريد الإلكتروني</label>
    <input
    id="email"
     type="email"
     {...register('email')}
    placeholder="example@resala.org"
    />
    {errors.email && <p>{errors.email.message}</p>}
   </div>

   <div>
    <label htmlFor="otp">رمز التحقق (OTP)</label>
    <input
    id="otp"
     type="text"
     maxLength={6}
     {...register('otp')}
    placeholder="847291"
    />
    {errors.otp && <p>{errors.otp.message}</p>}
   </div>

   <div>
    <label htmlFor="newPassword">كلمة المرور الجديدة</label>
    <input
    id="newPassword"
     type="password"
     {...register('newPassword')}
    placeholder="••••••••"
    />
    {errors.newPassword && <p>{errors.newPassword.message}</p>}
   </div>

   <button 
    type="submit" 
    disabled={resetPasswordMutation.isPending}
   >
    {resetPasswordMutation.isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
   </button>
  </form>
 );
};

export default ResetPasswordForm;
```

---

## 🔒 Security Notes

### Enumeration Attack Prevention
According to the API documentation:
- Even if the email doesn't exist, the response looks the same to prevent enumeration attacks
- However, in the current project implementation, it returns 404 for non-existent emails

### Best Practices
1. **Rate Limiting**: Implement client-side rate limiting to prevent abuse
2. **OTP Expiry**: OTP is valid for 10 minutes only
3. **Secure Storage**: Never store OTPs in localStorage/sessionStorage
4. **HTTPS**: Always use HTTPS in production

---

## 📊 Complete Flow

```
User Journey:
┌─────────────────────┐
│ 1. User clicks      │
│    "Forgot Password"│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 2. Enter email      │
│    → Call           │
│    /forgot-password │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 3. Check email      │
│    Get 6-digit OTP  │
│    (Valid 10 min)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 4. Enter OTP +      │
│    new password     │
│    → Call           │
│    /reset-password  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 5. Success!         │
│   Redirect to     │
│    login page       │
└─────────────────────┘
```

---

## 🎨 UI/UX Recommendations

### Arabic Error Messages
```typescript
const ERROR_MESSAGES_AR = {
 INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
 INVALID_OTP: 'رمز التحقق غير صحيح',
 WEAK_PASSWORD: 'كلمة المرور ضعيفة جداً',
 EMAIL_NOT_FOUND: 'هذا البريد الإلكتروني غير مسجل',
 EXPIRED_OTP: 'انتهت صلاحية رمز التحقق',
 NETWORK_ERROR: 'خطأ في الاتصال، حاول مرة أخرى',
};
```

### Loading States
Always show loading states during API calls:
- "جاري الإرسال..." (Sending...)
- "جاري التغيير..." (Changing...)

### Success Feedback
Use toast notifications or success messages in Arabic:
- ✅ "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
- ✅ "تم تغيير كلمة المرور بنجاح!"

---

## 🚀 Quick Test

Test the endpoints directly:

```bash
# 1. Forgot Password
curl -X POST http://resala.runasp.net/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Reset Password(use OTP from email)
curl -X POST http://resala.runasp.net/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "newPassword": "NewPass123"
  }'
```

---

## 📝 Summary

✅ **Types defined** in`auth.types.ts`
✅ **Service methods** added to `authService.ts`
✅ **React Query mutations** created in `useAuthMutations.ts`
✅ **Exports** updated in`index.ts`
✅ **Ready to use** in your components!

Next step: Create UI forms for the forgot/reset password flow! 🎉
