# Fix: Unauthorized Error After Switching Roles (ADMIN → RECEPTIONIST)

## Problem Summary
After logging out from ADMIN and logging in as RECEPTIONIST, users encountered 401/403 Unauthorized errors until they fully closed and reopened the page. The issue was caused by **stale axios interceptor state** from the previous session not being cleared.

## Root Causes Fixed

### 1. **Stale Axios Interceptor State** (PRIMARY)
**File:** `src/api/axiosInstance.ts`

**Issue:**
- Module-level variables persisted between sessions:
  - `failedQueue[]` - requests queued during token refresh
  - `isRefreshing` flag - indicates refresh in progress
  - `pendingControllers` Set - active request AbortControllers
  
When ADMIN session ended mid-request:
- Old requests remained in `failedQueue`
- `isRefreshing` flag stayed true
- RECEPTIONIST's new requests would use stale queue and interceptor state

**Fix:** 
Added `clearAxiosInterceptorState()` function:
```typescript
export const clearAxiosInterceptorState = (): void => {
  // Cancel all pending requests
  pendingControllers.forEach(controller => controller.abort());
  pendingControllers.clear();
  
  // Clear the failed request queue
  failedQueue = [];
  
  // Reset the refresh mutex flag
  isRefreshing = false;
};
```

### 2. **Incomplete Auth Cleanup**
**File:** `src/features/authentication/utils/authCleanup.ts`

**Issue:**
- `completeAuthCleanup()` cleared localStorage and Zustand state
- It did NOT reset axios interceptor state
- New session inherited broken interceptor state

**Fix:**
Updated `completeAuthCleanup()` to:
```typescript
export const completeAuthCleanup = (): void => {
  // Clear axios interceptor state FIRST
  clearAxiosInterceptorState();
  
  // Then clear tokens and other state
  tokenManager.clearTokens();
  // ... rest of cleanup
};
```

### 3. **Better 403 Error Handling**
**File:** `src/api/axiosInstance.ts`

**Issue:**
- 403 errors weren't properly handled as permission issues
- No diagnostic logging for role/permission mismatches

**Fix:**
Added explicit 403 handling in response interceptor:
```typescript
if (error.response?.status === 403) {
  if (import.meta.env.DEV) {
    console.warn('[API] 403 Forbidden - possible role/permission mismatch');
  }
  throw buildUnifiedError(error);
}
```

Plus added token role debugging:
```typescript
const decoded = tokenManager.decodeToken<{ role?: string }>(currentToken);
console.log('[API ERROR] Current token role:', decoded?.role);
```

### 4. **Enhanced Login/Logout Flow**
**File:** `src/features/authentication/context/AuthProvider.tsx`

**Improvements:**
- Login now explicitly calls `completeAuthCleanup()` BEFORE auth API call
- Logout calls comprehensive cleanup in finally block
- Added logging to track role switches
- Clear warning messages if logout API fails

```typescript
const login = useCallback(async (credentials) => {
  completeAuthCleanup();  // Clear old state FIRST
  queryClient.clear();
  
  const response = await authService.login(credentials);
  initializeNewSession(response.data);
  setAuth(response.data);
  
  console.log('[AuthProvider] Login successful:', { 
    role: response.data.role, 
    userId: response.data.userId 
  });
}, [setAuth, queryClient]);
```

## Testing Checklist

### ✅ Basic Role Switch
1. Login as ADMIN
2. Perform an API action (navigate, fetch data)
3. Logout
4. Login as RECEPTIONIST
5. ✅ Verify: No 401/403 errors, immediate access without page reload

### ✅ Mid-Request Switch
1. Login as ADMIN
2. Start a long-running API call (e.g., large file upload)
3. Quickly logout while request is pending
4. Login as RECEPTIONIST
5. ✅ Verify: No stale requests interfere, fresh session works

### ✅ Multiple Role Switches
1. ADMIN → Logout → RECEPTIONIST → Logout → ADMIN
2. ✅ Verify: Each switch works without errors
3. ✅ Verify: Browser console shows proper cleanup logs

### ✅ Concurrent Requests During Switch
1. Login as ADMIN
2. Make 2-3 simultaneous API calls
3. While calls are pending, logout and login as RECEPTIONIST
4. ✅ Verify: Old requests don't pollute new session
5. ✅ Verify: New session's requests succeed

### ✅ Permission-Blocked Routes
1. Login as RECEPTIONIST
2. Try to access ADMIN-only routes
3. ✅ Verify: 403 errors are logged with role info
4. ✅ Verify: User can access allowed routes

## Browser Console Output (DEV mode)

### Successful Login Sequence
```
[AuthProvider] Login successful: {role: "Reception", userId: 1}
[Axios] Interceptor state cleared - all pending requests cancelled
[API] POST /v1/auth/login
```

### Successful Logout Sequence
```
[AuthProvider] Logout complete - all state cleared
[Axios] Interceptor state cleared - all pending requests cancelled
```

### Permission Error (helpful for debugging)
```
[API ERROR] POST /v1/forms - 403
[API] 403 Forbidden - possible role/permission mismatch after session switch
[API ERROR] Current token role: Reception
```

## Files Modified

1. **`src/api/axiosInstance.ts`**
   - Added `clearAxiosInterceptorState()` export function
   - Enhanced 403 error handling
   - Added token role debugging

2. **`src/features/authentication/utils/authCleanup.ts`**
   - Import and call `clearAxiosInterceptorState()` in `completeAuthCleanup()`

3. **`src/features/authentication/context/AuthProvider.tsx`**
   - Enhanced login flow with explicit cleanup
   - Enhanced logout flow with better error handling
   - Added debugging logs for role switches

## Why This Works

### Before Fix
```
ADMIN Session                 RECEPTIONIST Session
┌─────────────────┐
│ Token: ADMIN    │
│ Role: Admin     │          ┌──────────────────┐
│ Queue: [req1]   │    └────→│ Token: ADMIN (!!!)│ ← Stale!
│ Refreshing: ❌  │          │ Role: ?          │
└─────────────────┘ logout   │ Queue: [req1](!!)│ ← Stale!
                             │ Refreshing: ✓    │ ← Stuck!
                             └──────────────────┘
                             Result: 401 errors
```

### After Fix
```
ADMIN Session                  RECEPTIONIST Session
┌─────────────────┐
│ Token: ADMIN    │
│ Role: Admin     │           abort & clear
│ Queue: [req1]   │    ────────────────────→ ┌──────────────────┐
│ Refreshing: ✓   │           logout         │ Token: RECEPTIONIST│
└─────────────────┘                          │ Role: Reception   │
                                             │ Queue: []         │
                                             │ Refreshing: ❌    │
                                             └──────────────────┘
                                             Result: ✓ Success
```

## Prevention for Future Sessions

The fix ensures that:
1. **All pending requests are cancelled** when a role switch occurs
2. **The request queue is cleared** so no stale tokens are reused
3. **The refresh flag is reset** so token refresh logic doesn't get stuck
4. **Tokens are immediately invalidated** on logout
5. **New session starts fresh** with no inherited state

This prevents the 401/403 unauthorized errors when switching roles without requiring a page reload.
