import type { Role } from './role.types';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  // NO refreshToken here — backend owns it via HttpOnly cookie
}

export interface AuthResponse {
  user: User;
  accessToken: string; // ONLY access token returned in body
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
  type: 'email-verification' | 'password-reset';
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  // token injected from sessionStorage internally in service
}

export interface AuthState {
  user: User | null;
  accessToken: string | null; // MEMORY ONLY — never persisted
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}