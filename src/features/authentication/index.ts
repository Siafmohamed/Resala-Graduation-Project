// ── Types ────────────────────────────────────────────────
export type {
  User,
  AuthState,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  OTPPayload,
  ResetPasswordPayload,
  ResendOTPPayload,
  ResendOTPResponse,
  RefreshTokenResponse,
  LogoutResponse,
  SessionData,
  ApiError,
} from './types/auth.types';

// ── Role ─────────────────────────────────────────────────
export { Role, hasPermission, canAccess, ROLE_LABELS_AR } from './types/role.types';
export type { Permission } from './types/role.types';

// ── Store + Selectors ────────────────────────────────────
export {
  useAuthStore,
  useCurrentUser,
  useIsAuthenticated,
  useIsInitialized,
  useAccessToken,
  useUserRole,
  useHasPermission,
  useCanAccess,
} from './store/authSlice';

// ── Hooks ────────────────────────────────────────────────
export {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useResendOTPMutation,
  useCreateStaffMutation,
} from './hooks/useAuthMutations';
export {
  useAuthGuard,
} from './hooks/useAuthGuard';
export { useAuthLogoutListener } from './hooks/useAuthLogoutListener';
export { useTokenRefreshScheduler } from './hooks/useTokenRefreshScheduler';
export { useVisibilityTokenRefresh } from './hooks/useVisibilityTokenRefresh';
export { useSessionExpiryListener } from './hooks/useSessionExpiryListener';
export { AuthProvider, useAuth } from './context/AuthProvider';

// ── Route Guards ─────────────────────────────────────────
export { ProtectedRoute } from './components/ProtectedRoute';
export { PublicRoute } from './components/PublicRoute';

// ── Role UI Helpers ──────────────────────────────────────
export { ShowIfRole } from './components/ShowIfRole';
export { ShowIfPermission } from './components/ShowIfPermission';

// ── Utils ────────────────────────────────────────────────
export {
  completeAuthCleanup,
  initializeNewSession,
  validateCurrentSession,
} from './utils/authCleanup';
