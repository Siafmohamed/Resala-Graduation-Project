import axiosInstance from '../utils/axiosInstance';
import { tokenManager } from '../utils/tokenManager';
import type {
  AuthResponse,
  LoginCredentials,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  RegisterCredentials,
  ResetPasswordPayload,
  ResendOTPPayload,
  ResendOTPResponse,
  RefreshTokenResponse,
  LogoutResponse,
  StaffCreatePayload,
  StaffCreateResponse,
  ApiError,
} from '../types/auth.types';
import type { AxiosError } from 'axios';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('[authService] login Request:', { ...credentials, password: '***' });
    try {
      const { data } = await axiosInstance.post<AuthResponse>(
        '/v1/auth/login',
        credentials,
      );
      console.log('[authService] login Success:', { ...data, data: { ...data.data, accessToken: '***', refreshToken: '***' } });
      return data;
    } catch (error) {
      console.error('[authService] login Error:', error);
      throw error;
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    console.log('[authService] forgotPassword Request:', payload);
    try {
      const { data } = await axiosInstance.post<ForgotPasswordResponse>(
        '/v1/auth/forgot-password',
        payload,
      );
      console.log('[authService] forgotPassword Success:', data);
      return data;
    } catch (error) {
      console.error('[authService] forgotPassword Error:', error);
      throw error;
    }
  },

  async resendOTP(payload: ResendOTPPayload): Promise<ResendOTPResponse> {
    console.log('[authService] resendOTP Request:', payload);
    try {
      const { data } = await axiosInstance.post<ResendOTPResponse>(
        '/v1/auth/resend-otp',
        payload,
      );
      console.log('[authService] resendOTP Success:', data);
      return data;
    } catch (error) {
      console.error('[authService] resendOTP Error:', error);
      throw error;
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const session = tokenManager.getSessionData<any>();
    const body = session?.refreshToken ? { refreshToken: session.refreshToken } : {};
    
    const { data } = await axiosInstance.post<RefreshTokenResponse>(
      '/v1/auth/refresh-token',
      body
    );
    return data;
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await axiosInstance.post<LogoutResponse>(
      '/v1/auth/logout',
    );
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ succeeded: boolean; message: string; data: null }> {
    console.log('[authService] resetPassword Request:', payload);
    try {
      const { data } = await axiosInstance.post<{
        succeeded: boolean;
        message: string;
        data: null;
      }>('/v1/auth/reset-password', payload);
      console.log('[authService] resetPassword Success:', data);
      return data;
    } catch (error) {
      console.error('[authService] resetPassword Error:', error);
      throw error;
    }
  },

  async verifyOTP(otp: string, email: string, otpType: 'EmailVerification' | 'PasswordReset'): Promise<{ succeeded: boolean; message: string; data: null }> {
    const payload = { otp, email, otpType };
    console.log('[authService] verifyOTP Request:', payload);
    try {
      const { data } = await axiosInstance.post<{
        succeeded: boolean;
        message: string;
        data: null;
      }>('/v1/auth/verify-email', payload);
      console.log('[authService] verifyOTP Success:', data);
      return data;
    } catch (error) {
      console.error('[authService] verifyOTP Error:', error);
      throw error;
    }
  },

  async register(payload: RegisterCredentials): Promise<{ succeeded: boolean; message: string; data: null }> {
    const { data } = await axiosInstance.post<{
      succeeded: boolean;
      message: string;
      data: null;
    }>('/v1/auth/register', payload);
    return data;
  },

  async createStaff(payload: StaffCreatePayload, token: string): Promise<StaffCreateResponse> {
    const { data } = await axiosInstance.post<StaffCreateResponse>(
      '/v1/auth/create-staff',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};

export function extractApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<ApiError>;
  console.error('[authService] Full Axios Error:', {
    status: axiosError.response?.status,
    data: axiosError.response?.data,
    config: {
      url: axiosError.config?.url,
      data: axiosError.config?.data,
    }
  });

  if (axiosError.response?.data) {
    const responseData = axiosError.response.data;
    // Check for field-level errors first (e.g., .NET ModelState errors)
    if (responseData.errors) {
      const fieldErrors = responseData.errors;
      const firstField = Object.keys(fieldErrors)[0];
      const firstMessage = Array.isArray(fieldErrors[firstField]) 
        ? fieldErrors[firstField][0] 
        : (fieldErrors[firstField] as unknown as string) || responseData.message;
      
      return {
        message: firstMessage,
        statusCode: axiosError.response.status,
        errors: fieldErrors,
      };
    }
    
    // Check for direct message in response
    if (responseData.message) {
      return {
        message: responseData.message,
        statusCode: axiosError.response.status,
        errors: responseData.errors,
      };
    }

    // Handle generic 400 Bad Request without specific message
    if (axiosError.response.status === 400) {
      return {
        message: 'بيانات غير صحيحة. يرجى التحقق من المدخلات.',
        statusCode: 400,
      };
    }
  }

  if (axiosError.code === 'ECONNABORTED') {
    return {
      message: 'Request timed out. Please try again.',
      statusCode: 408,
    };
  }

  if (axiosError.message === 'Network Error') {
    return {
      message: 'Connection failed. Please check your network.',
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
