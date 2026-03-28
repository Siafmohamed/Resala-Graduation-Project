import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { authService, extractApiError } from '../services/authService';
import type {
    AuthResponse,
    LoginCredentials,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    RegisterCredentials,
    ResetPasswordPayload,
    ResendOTPPayload,
    ResendOTPResponse,
    StaffCreatePayload,
    StaffCreateResponse,
    ApiError,
} from '../types/auth.types';

// ── Login ────────────────────────────────────────────────
export function useLoginMutation() {
    return useMutation<AuthResponse, ApiError, LoginCredentials>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.succeeded) {
                toast.success('تم تسجيل الدخول بنجاح');
            }
        },
        onError: (error) => {
            const apiError = extractApiError(error);
            toast.error(apiError.message || 'فشل تسجيل الدخول');
            return apiError;
        },
    });
}

// ── Forgot Password ──────────────────────────────────────
export function useForgotPasswordMutation() {
    return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordPayload>({
        mutationFn: authService.forgotPassword,
        onSuccess: (data) => {
            if (data.succeeded) {
                toast.info('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
            }
        },
        onError: (error) => {
            const apiError = extractApiError(error);
            toast.error(apiError.message || 'حدث خطأ أثناء طلب استعادة كلمة المرور');
            return apiError;
        },
    });
}

// ── Resend OTP ───────────────────────────────────────────
export function useResendOTPMutation() {
    return useMutation<ResendOTPResponse, ApiError, ResendOTPPayload>({
        mutationFn: authService.resendOTP,
        onError: (error) => {
            return extractApiError(error);
        },
    });
}

// ── Reset Password ───────────────────────────────────────
export function useResetPasswordMutation() {
    return useMutation<{
        succeeded: boolean;
        message: string;
        data: null;
    }, ApiError, ResetPasswordPayload>({
        mutationFn: authService.resetPassword,
        onError: (error) => {
            return extractApiError(error);
        },
    });
}

// ── Verify OTP ───────────────────────────────────────────
export function useVerifyOTPMutation() {
    return useMutation<{
        succeeded: boolean;
        message: string;
        data: null;
    }, ApiError, { otp: string; email: string; otpType: 'EmailVerification' | 'PasswordReset' }>({
        mutationFn: ({ otp, email, otpType }) => authService.verifyOTP(otp, email, otpType),
        onError: (error) => {
            return extractApiError(error);
        },
    });
}

// ── Register ─────────────────────────────────────────────
export function useRegisterMutation() {
    return useMutation<{
        succeeded: boolean;
        message: string;
        data: null;
    }, ApiError, RegisterCredentials>({
        mutationFn: authService.register,
        onError: (error) => {
            return extractApiError(error);
        },
    });
}

// ── Create Staff ─────────────────────────────────────────
export function useCreateStaffMutation() {
    return useMutation<StaffCreateResponse, ApiError, StaffCreatePayload & { token: string }>({
        mutationFn: ({ token, ...payload }) => authService.createStaff(payload, token),
        onError: (error) => {
            return extractApiError(error);
        },
    });
}
