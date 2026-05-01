import api from '@/api/axiosInstance';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import type {
  ApiError,
  AuthResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginCredentials,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterCredentials,
  ResendOTPPayload,
  ResendOTPResponse,
  ResetPasswordPayload,
  StaffCreatePayload,
  StaffCreateResponse,
} from '@/features/authentication/types/auth.types';
import type { UnifiedApiError } from '@/api/axiosInstance';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>('/v1/auth/login', credentials);
    if (data?.succeeded && data.data && !data.data.accessToken && data.data.token) {
      data.data.accessToken = data.data.token;
    }
    return data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>('/v1/auth/forgot-password', payload);
  },

  async resendOTP(payload: ResendOTPPayload): Promise<ResendOTPResponse> {
    return api.post<ResendOTPResponse>('/v1/auth/resend-otp', payload);
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = tokenManager.getRefreshToken();
    return api.post<RefreshTokenResponse>('/v1/auth/refresh-token', refreshToken ? { refreshToken } : {});
  },

  async validateSession(): Promise<AuthResponse> {
    const storedSession = tokenManager.getSessionData<any>();

    const data = await this.refreshToken();
    if (!data?.succeeded || !data.data) throw new Error('Token refresh failed');

    return {
      succeeded: true,
      message: 'Session validated',
      data: {
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken || storedSession?.refreshToken,
        role: storedSession?.role || 'Admin',
        userId: storedSession?.userId || 0,
        name: storedSession?.name || '',
        phoneNumber: storedSession?.phoneNumber || '',
      },
    };
  },

  async logout(): Promise<LogoutResponse> {
    return api.post<LogoutResponse>('/v1/auth/logout');
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<{ succeeded: boolean; message: string; data: null }> {
    return api.post<{ succeeded: boolean; message: string; data: null }>(
      '/v1/auth/reset-password',
      payload,
    );
  },

  async verifyOTP(
    otp: string,
    email: string,
    otpType: 'EmailVerification' | 'PasswordReset',
  ): Promise<{ succeeded: boolean; message: string; data: null }> {
    return api.post<{ succeeded: boolean; message: string; data: null }>(
      '/v1/auth/verify-email',
      { otp, email, otpType },
    );
  },

  async register(payload: RegisterCredentials): Promise<{ succeeded: boolean; message: string; data: null }> {
    return api.post<{ succeeded: boolean; message: string; data: null }>(
      '/v1/auth/register',
      payload,
    );
  },

  async createStaff(payload: StaffCreatePayload, token?: string): Promise<StaffCreateResponse> {
    return api.post<StaffCreateResponse>('/v1/auth/create-staff', payload, token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined);
  },
};

export function extractApiError(error: unknown): ApiError {
  const typedError = error as UnifiedApiError;
  return {
    message: typedError?.message || (error instanceof Error ? error.message : 'An unexpected error occurred'),
    statusCode: typedError?.status ?? 500,
  };
}
