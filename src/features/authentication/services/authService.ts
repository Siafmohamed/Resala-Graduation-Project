import axiosInstance from '../utils/axiosInstance';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    ForgotPasswordPayload,
    OTPPayload,
    ResetPasswordPayload,
    ApiError,
} from '../types/auth.types';
import type { AxiosError } from 'axios';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await axiosInstance.post<AuthResponse>(
            '/auth/login',
            credentials,
        );
        return data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { data } = await axiosInstance.post<AuthResponse>(
            '/auth/register',
            credentials,
        );
        return data;
    },

    async logout(): Promise<void> {
        await axiosInstance.post('/auth/logout');
    },

    async refreshAccessToken(): Promise<{ accessToken: string }> {
        const { data } = await axiosInstance.post<{ accessToken: string }>(
            '/auth/refresh',
        );
        return data;
    },

    async getMe(): Promise<AuthResponse> {
        const { data } = await axiosInstance.get<AuthResponse>('/auth/me');
        return data;
    },

    async forgotPassword(
        payload: ForgotPasswordPayload,
    ): Promise<{ message: string }> {
        const { data } = await axiosInstance.post<{ message: string }>(
            '/auth/forgot-password',
            payload,
        );
        return data;
    },

    async verifyOTP(
        payload: OTPPayload,
    ): Promise<{ message: string; resetToken?: string }> {
        const { data } = await axiosInstance.post<{
            message: string;
            resetToken?: string;
        }>('/auth/verify-otp', payload);
        return data;
    },

    async resetPassword(
        payload: ResetPasswordPayload & { resetToken: string },
    ): Promise<{ message: string }> {
        const { data } = await axiosInstance.post<{ message: string }>(
            '/auth/reset-password',
            payload,
        );
        return data;
    },
};

export function extractApiError(error: unknown): ApiError {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response?.data) {
        const responseData = axiosError.response.data;
        return {
            message: responseData.message || 'An unexpected error occurred',
            statusCode: axiosError.response.status,
            errors: responseData.errors,
        };
    }

    if (axiosError.code === 'ECONNABORTED') {
        return {
            message: 'Request timed out. Please try again.',
            statusCode: 408,
        };
    }

    if (axiosError.message === 'Network Error') {
        return {
            message: 'Network error. Please check your connection.',
            statusCode: 0,
        };
    }

    return {
        message:
            error instanceof Error
                ? error.message
                : 'An unexpected error occurred',
        statusCode: 500,
    };
}