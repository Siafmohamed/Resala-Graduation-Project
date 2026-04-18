import type { Role } from './role.types';

export interface User {
  id: string;
  email?: string;
  username: string;
  fullName: string;
  role: Role;
  phoneNumber?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  token?: string; // Some API responses might use 'token' instead of 'accessToken'
  refreshToken?: string;
  role: 'Admin' | 'Reception' | 'Donor';
  userId: number;
  name: string;
  phoneNumber: string;
}

export interface AuthResponse {
  succeeded: boolean;
  message: string;
  data: AuthTokens;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  succeeded: boolean;
  message: string;
  data: null;
}

export interface ResendOTPPayload {
  email: string;
  otpType: 'EmailVerification' | 'PasswordReset';
}

export interface ResendOTPResponse {
  succeeded: boolean;
  message: string;
  data: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
  otpType: 'EmailVerification' | 'PasswordReset';
}

export interface RegisterCredentials {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface StaffCreatePayload {
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  staffType: 1 | 2; // 1 = Admin, 2 = Reception
}

export interface StaffCreateResponse {
  succeeded: boolean;
  message: string;
  data: {
    staffId: number;
    username: string;
  };
  errors?: Record<string, string[]>;
}

export interface AuthState {
  session: SessionData | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface SessionData {
  accessToken: string;
  refreshToken?: string;
  role: 'Admin' | 'Reception' | 'Donor';
  userId: number;
  name: string;
  phoneNumber?: string;
}

export interface RefreshTokenResponse {
  succeeded: boolean;
  data: {
    token: string;
    refreshToken?: string;
  };
}

// For backwards compatibility in code that expects accessToken
export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}