# Session Validation Fix - 404 Error Resolved

## Problem

The app was calling `/api/v1/auth/me` which **doesn't exist** on your backend, causing:

```
api/v1/auth/me:1 Failed to load resource: the server responded with a status of 404 (Not Found)
[AuthInit] Session validation error: AxiosError: Request failed with status code 404
[AuthInit] Transient error. Continuing with cached session.
[ProtectedRoute] Unauthenticated access to /reports. Redirecting to /login...
```

## Root Cause

The `validateSession()` function in `authService.ts` was trying to call a non-existent endpoint:

```typescript
// BEFORE - Line 85
const { data } = await axiosInstance.get<AuthResponse>('/v1/auth/me');
// ❌ This endpoint doesn't exist!
```

## Solution

Changed session validation to use the **existing** `/v1/auth/refresh-token` endpoint instead.

### What Changed

#### 1. Created Raw Axios Instance (No Interceptors)

**File:** `authService.ts`

```typescript
// Create a raw axios instance for validation (no interceptors)
const rawAxiosForValidation = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
```

**Why?** Using the regular `axiosInstance` would trigger the refresh interceptor, causing an infinite loop.

#### 2. Updated validateSession Function

**File:** `authService.ts`

```typescript
async validateSession(): Promise<AuthResponse> {
  const refreshToken = tokenManager.getRefreshToken();
  const storedSession = tokenManager.getSessionData();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Use raw axios (no interceptors) to avoid infinite refresh loops
  const { data } = await rawAxiosForValidation.post<RefreshTokenResponse>(
    '/v1/auth/refresh-token',
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    }
  );

  if (data.succeeded && data.data) {
    // Token refresh succeeded - session is valid
    return {
      succeeded: true,
      message: 'Session validated',
      data: {
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken || refreshToken,
        role: (storedSession?.role as 'Admin' | 'Reception' | 'Donor') || 'Admin',
        userId: Number(storedSession?.userId) || 0,
        name: storedSession?.name || '',
        phoneNumber: storedSession?.phoneNumber || '',
      }
    };
  }

  throw new Error('Token refresh failed');
}
```

**Benefits:**
- ✅ Uses existing endpoint that actually exists
- ✅ Validates session AND refreshes access token in one call
- ✅ No infinite refresh loops (raw axios instance)
- ✅ Returns proper AuthResponse format

#### 3. Simplified useAuthSession Hook

**File:** `useAuthSession.ts`

```typescript
if (validated.succeeded && validated.data) {
  logger.log('[AuthInit] Session validated successfully');
  
  // The validateSession already merged tokens, just set the auth state
  setAuth(validated.data);
}
```

**Why simpler?** The `validateSession()` now returns complete session data with fresh tokens, so no need to manually merge.

## How It Works Now

```
App Loads
    ↓
Check for stored refresh token in localStorage
    ↓
If exists → Call /v1/auth/refresh-token
    ↓
Server validates refresh token
    ↓
┌─────────────────────┬──────────────────────┐
│ Success (200)       │ Failed (401/403)     │
├─────────────────────┼──────────────────────┤
│ New access token    │ Refresh token        │
│ returned            │ expired/invalid      │
│                     │                      │
│ Set auth state ✓    │ Clear session        │
│ User stays logged ✓ │ Redirect to login    │
└─────────────────────┴──────────────────────┘
```

## Available Backend Endpoints

Based on your backend, these are the **actual** available endpoints:

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/v1/auth/login` | POST | Authenticate user | ✅ Used |
| `/v1/auth/refresh-token` | POST | Refresh access token | ✅ Used |
| `/v1/auth/logout` | POST | Invalidate session | ✅ Used |
| `/v1/auth/forgot-password` | POST | Request password reset | ✅ Used |
| `/v1/auth/reset-password` | POST | Reset password with OTP | ✅ Used |
| `/v1/auth/resend-otp` | POST | Resend OTP | ✅ Used |
| `/v1/auth/verify-email` | POST | Verify OTP | ✅ Used |
| `/v1/auth/register` | POST | Register new user | ✅ Used |
| `/v1/auth/create-staff` | POST | Create staff account | ✅ Used |
| `/v1/auth/me` | GET | Get current user | ❌ **NOT AVAILABLE** |

## Testing

### 1. Test Session Validation on App Load

```bash
# Clear browser cache, then:
1. Login to the app
2. Close browser tab
3. Reopen the app
4. Check console - should see:
   [AuthInit] Validating session with backend...
   [AuthInit] Session validated successfully
5. You should still be logged in ✓
```

### 2. Test Expired Refresh Token

```bash
# Manually expire refresh token:
1. Login to the app
2. Open DevTools → Application → Local Storage
3. Delete the 'resala_session' key
4. Refresh the page
5. Should redirect to login ✓
```

### 3. Test Normal API Calls

```bash
# After login, make any API call:
1. Navigate to any protected route (e.g., /reports)
2. Should load without redirecting to login ✓
3. If access token expires during use, it auto-refreshes ✓
```

## Error Handling

| Scenario | Behavior | User Experience |
|----------|----------|-----------------|
| Refresh token valid | Session validated, new access token | ✅ Stays logged in |
| Refresh token expired | 401 error, session cleared | 🔴 Redirected to login |
| Network error | Keeps cached session | ✅ Stays logged in (temporarily) |
| Server error (500+) | Keeps cached session | ✅ Stays logged in (temporarily) |

## Files Modified

| File | Changes |
|------|---------|
| `authService.ts` | Added raw axios instance, rewrote validateSession() |
| `useAuthSession.ts` | Simplified session handling |
| `tokenManager.ts` | Fixed token storage (from previous fix) |
| `axiosInstance.ts` | Fixed refresh flow (from previous fix) |

## Next Steps

If your backend team adds a `/v1/auth/me` endpoint in the future, you can switch back to using it for session validation. The current approach works perfectly with your existing endpoints.

### Optional: Add /v1/auth/me Endpoint (Backend)

If you want more robust session validation, ask your backend team to add:

```typescript
GET /v1/auth/me
Headers: Authorization: Bearer <access_token>

Response:
{
  "succeeded": true,
  "data": {
    "userId": 1,
    "username": "admin",
    "name": "Admin User",
    "email": "admin@resala.org",
    "role": "Admin",
    "phoneNumber": "01234567890"
  }
}
```

This would allow you to:
- Get fresh user data (not just token refresh)
- Detect if user was deleted/disabled
- Validate session without refreshing tokens

But for now, the refresh-token approach works perfectly! ✅
