import { useAuthStore } from "../store/authSlice";
import { tokenManager } from "../utils/tokenManager";
import type { SessionData } from "../types/auth.types";

export async function initializeAuth() {
  const setAuth = useAuthStore.getState().setAuth;
  const clearAuth = useAuthStore.getState().clearAuth;
  const setInitialized = useAuthStore.getState().setInitialized;

  try {
    const session = tokenManager.getSessionData<SessionData>();

    if (session) {
      // هنا ممكن تتحقق من صلاحية الـ token أو تعمل refresh
      setAuth(session);
    } else {
      clearAuth();
    }
  } catch (err) {
    clearAuth();
  } finally {
    // مهما حصل، انتهينا من التحقق
    setInitialized(true);
  }
}