import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, extractApiError } from '../services/authService';
import { useAuthStore } from '../store/authSlice';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    ForgotPasswordPayload,
    OTPPayload,
    ResetPasswordPayload,
    ApiError,
} from '../types/auth.types';

// ── Login ────────────────────────────────────────────────
export function useLoginMutation() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation<AuthResponse, ApiError, LoginCredentials>({
        mutationFn: authService.login,
        onSuccess: ({ user, accessToken }) => {
            setAuth(user, accessToken);
        },
        onError: (error) => {
            // error is already typed as ApiError via throwOnError: false (default)
            return extractApiError(error);
        },
    });
}

// ── Register ─────────────────────────────────────────────
export function useRegisterMutation() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation<AuthResponse, ApiError, RegisterCredentials>({
        mutationFn: authService.register,
        onSuccess: ({ user, accessToken }) => {
            setAuth(user, accessToken);
        },
        onError: (error) => {
            return extractApiError(error);
        },
    });
}

// ── Logout ───────────────────────────────────────────────
export function useLogoutMutation() {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, void>({
        mutationFn: authService.logout,
        onSettled: () => {
            // Always clear auth state regardless of success/fail
            clearAuth();
            queryClient.clear();
        },
    });
}

// ── Forgot Password ─────────────────────────────────────
export function useForgotPasswordMutation() {
    return useMutation<{ message: string }, ApiError, ForgotPasswordPayload>({
        mutationFn: authService.forgotPassword,
    });
}

// ── Verify OTP ───────────────────────────────────────────
export function useVerifyOTPMutation() {
    return useMutation<
        { message: string; resetToken?: string },
        ApiError,
        OTPPayload
    >({
        mutationFn: authService.verifyOTP,
        onSuccess: (data) => {
            if (data.resetToken) {
                sessionStorage.setItem('reset_token', data.resetToken);
            }
        },
    });
}

// ── Reset Password ───────────────────────────────────────
export function useResetPasswordMutation() {
    return useMutation<{ message: string }, ApiError, ResetPasswordPayload>({
        mutationFn: async (data) => {
            const resetToken = sessionStorage.getItem('reset_token');
            if (!resetToken) {
                throw new Error('Reset token missing');
            }
            return authService.resetPassword({ ...data, resetToken });
        },
        onSuccess: () => {
            sessionStorage.removeItem('reset_token');
        },
    });
}