# Bug Fix: Unauthorized Error When Switching From ADMIN to RECEPTIONIST

## Issue Summary
When switching from one role (ADMIN) to another (RECEPTIONIST) without a page reload, a **401/403 Unauthorized error** occurred immediately after login. The error disappeared only after fully closing and reopening the page.

## Root Cause Analysis

The bug was caused by **incomplete state synchronization** during logout/login cycles:

### Problem 1: Missing `isInitialized` Flag Reset on Login
- **Location**: `AuthProvider.tsx` - `login()` function
- **Issue**: After logout, `clearAuth()` set `isInitialized: false` in the Zustand store
- **Problem**: When a new user logged in, the `login()` function never set `isInitialized: true`
- **Result**: Route guards and components checking `isInitialized` would think the app was still initializing
- **Why page reload fixed it**: A full reload runs `AuthProvider`'s initialization `useEffect`, which sets `isInitialized: true`

### Problem 2: Incomplete Logout in Sidebar
- **Location**: `SidebarNav.tsx` - `handleLogout()` function
- **Issue**: Sidebar logout was calling `authService.logout()` and `clearAuth()` directly, bypassing the `AuthProvider.logout()` method
- **Problem**: This skipped critical cleanup steps like `completeAuthCleanup()`, which cancels pending requests and clears the axios interceptor state
- **Result**: Stale axios state (failed request queue, pending controllers) could interfere with the new session's requests

## Solution Implemented

### Fix 1: Add `setInitialized(true)` in Login Flow
**File**: `src/features/authentication/context/AuthProvider.tsx`

```typescript
const login = useCallback(
  async (credentials: LoginCredentials) => {
    // 1. Perform complete cleanup to remove any stale state from previous session
    completeAuthCleanup();
    queryClient.clear();

    // 2. Perform login
    const response = await authService.login(credentials);
    if (!response.succeeded) {
      throw new Error(response.message || 'Login failed');
    }

    // 3. Initialize fresh session with new data
    initializeNewSession(response.data);
    
    // 4. Update auth store with new session
    setAuth(response.data);
    
    // 5. Mark initialization as complete so route guards and components 
    // that depend on isInitialized flag know auth state is ready
    // This is critical for logout/login cycles without page reload (role switches)
    setInitialized(true);  // ← FIX: This was missing!
    
    console.log('[AuthProvider] Login successful:', { role: response.data.role, userId: response.data.userId });
  },
  [setAuth, setInitialized, queryClient],
);
```

**Why this fixes it**: Ensures that after a new user logs in, the `isInitialized` flag is properly set to `true`, allowing route guards to function correctly.

### Fix 2: Use AuthProvider's Logout in Sidebar
**File**: `src/shared/components/layout/sidebar/SidebarNav.tsx`

**Before**:
```typescript
import { authService } from "@/features/authentication/services/authService";
import { useAuthStore } from "@/features/authentication";

const handleLogout = async () => {
  try {
    await authService.logout();  // ← Incomplete logout
  } catch (error) {
    console.error('[SidebarNav] Logout API failed:', error);
  } finally {
    clearAuth();  // ← Bypasses important cleanup
    queryClient.clear();
    navigate("/login", { replace: true });
  }
};
```

**After**:
```typescript
import { useAuth, useAuthStore } from "@/features/authentication";

const { logout } = useAuth();  // ← Use AuthProvider's logout

const handleLogout = async () => {
  try {
    // Use the logout from AuthProvider which handles:
    // - completeAuthCleanup() to clear axios interceptor state
    // - clearAuth() to clear Zustand store
    // - clearRefreshTimer() to stop token refresh
    // - queryClient.clear() to clear React Query cache
    await logout();  // ← Complete logout with all cleanup
  } catch (error) {
    console.error('[SidebarNav] Logout failed:', error);
  } finally {
    navigate("/login", { replace: true });
  }
};
```

**Why this fixes it**: Ensures all critical cleanup steps are performed:
- `completeAuthCleanup()` cancels pending requests and clears axios interceptor state
- `clearAuth()` clears Zustand store completely
- `clearRefreshTimer()` stops any pending token refresh
- `queryClient.clear()` clears React Query cache

## Testing Checklist

To verify the fix works correctly:

### Test 1: Role Switch Without Page Reload
```
1. Sign in as ADMIN
2. Navigate to dashboard and verify access
3. Click logout in sidebar
4. Sign in as RECEPTIONIST with different credentials
5. ✅ Expected: Dashboard loads immediately with RECEPTIONIST role
6. ✅ Expected: No 401/403 errors appear
7. ✅ Expected: Navigation menu updates for RECEPTIONIST role
```

### Test 2: Multiple Role Switches
```
1. Sign in as ADMIN
2. Logout
3. Sign in as RECEPTIONIST
4. Logout
5. Sign in as ADMIN again
6. ✅ Expected: Each switch works without errors
7. ✅ Expected: No console errors about stale state
```

### Test 3: API Requests in New Role
```
1. Sign in as ADMIN
2. Logout
3. Sign in as RECEPTIONIST
4. Make API calls (e.g., fetch receptionist-specific data)
5. ✅ Expected: Requests succeed with RECEPTIONIST token
6. ✅ Expected: No token errors in network tab
7. ✅ Expected: Correct data returned for RECEPTIONIST role
```

### Test 4: Browser DevTools Verification
```
1. Open DevTools → Application → Storage
2. Sign in as ADMIN
3. Note the token and role in localStorage (resala_session)
4. Logout
5. ✅ Expected: Session cleared from localStorage
6. Sign in as RECEPTIONIST
7. ✅ Expected: New session with RECEPTIONIST token in localStorage
8. ✅ Expected: No ADMIN token remains
```

## Files Modified

1. **src/features/authentication/context/AuthProvider.tsx**
   - Added `setInitialized(true)` call after successful login
   - Updated dependency array to include `setInitialized`

2. **src/shared/components/layout/sidebar/SidebarNav.tsx**
   - Changed import to use `useAuth` from authentication module
   - Updated `handleLogout()` to use `logout()` from `useAuth()` hook
   - Removed direct `authService.logout()` call

## Impact Analysis

### What This Fixes
- ✅ Eliminates 401/403 errors during role switches
- ✅ Removes need for page reloads after logout/login cycles
- ✅ Ensures consistent auth state between `AuthContext` and Zustand
- ✅ Properly clears axios interceptor state during role switches

### Backward Compatibility
- ✅ No breaking changes to API
- ✅ No changes to component interfaces
- ✅ All existing functionality preserved
- ✅ Code is more robust and maintainable

## Related Documentation

- See `SESSION_MANAGEMENT.md` for detailed auth flow documentation
- See `SESSION_LOGOUT_FIX.md` for previous logout improvements
- See `src/features/authentication/utils/authCleanup.ts` for cleanup implementation

## Deployment Notes

This fix should be deployed as a priority patch because:
1. It resolves a critical user-facing bug
2. It improves session security by ensuring complete cleanup
3. It's a low-risk change with clear isolated changes
4. No database migrations or backend changes required
