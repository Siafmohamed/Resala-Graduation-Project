# Session Management System

## Overview

This application implements a robust JWT-based session management system with automatic token refresh. The system ensures users stay authenticated as long as their refresh token is valid, with seamless access token rotation.

## How It Works

### Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     Session Lifecycle                       │
└─────────────────────────────────────────────────────────────┘

Login
  │
  ├─► Server returns: Access Token (short-lived) + Refresh Token (long-lived)
  │
  ├─► Both tokens stored in localStorage (encrypted session data)
  │
  ├─► User makes API requests with Access Token in Authorization header
  │
  ├─► Access Token expires (e.g., 15 minutes)
  │     │
  │     ├─► Next API call returns 401 Unauthorized
  │     │
  │     ├─► Axios interceptor catches 401
  │     │
  │     ├─► Automatically calls /v1/auth/refresh-token with Refresh Token
  │     │
  │     ├─► Server validates Refresh Token and returns new Access Token
  │     │
  │     ├─► New Access Token saved to localStorage
  │     │
  │     └─► Original API call retried with new Access Token ✓
  │
  ├─► Refresh Token expires (e.g., 7 days)
  │     │
  │     ├─► Refresh attempt fails with 401
  │     │
  │     └─► User logged out and redirected to login page
  │
  └─► User closes browser/tab
        │
        └─► Tokens remain in localStorage
              │
              └─► User returns within Refresh Token expiry
                    │
                    └─► Session validated on app load ✓
                          (User stays logged in)
```

### Key Features

#### 1. **Automatic Token Refresh**
- When access token expires, the system automatically requests a new one
- User experience is uninterrupted - no need to re-login
- Failed requests are queued and retried after token refresh

#### 2. **Session Persistence**
- Tokens persist in localStorage across browser sessions
- User stays logged in until refresh token expires
- Closing browser/tab does NOT log out the user

#### 3. **Session Validation on App Load**
- When app starts, validates session with backend
- If access token is expired, automatically refreshes it
- If refresh token is expired, clears session and shows login

#### 4. **Concurrent Request Handling**
- Multiple simultaneous 401 errors trigger only ONE refresh request
- Other requests wait in queue and retry with new token
- Prevents race conditions and duplicate refresh calls

## Implementation Details

### File Structure

```
src/features/authentication/
├── utils/
│   ├── tokenManager.ts          # Token storage and validation
│   └── axiosInstance.ts         # HTTP client with refresh interceptor
├── hooks/
│   └── useAuthSession.ts        # Session initialization hook
├── store/
│   └── authSlice.ts             # Zustand auth state management
└── services/
    └── authService.ts           # Auth API calls
```

### Token Storage

**Location:** `localStorage` under key `resala_session`

**Stored Data:**
```typescript
{
  accessToken: string;      // JWT access token (short-lived)
  refreshToken: string;     // JWT refresh token (long-lived)
  role: string;            // User role (Admin, Reception, etc.)
  userId: number;          // User ID
  name: string;            // User's full name
  phoneNumber: string;     // User's phone number
}
```

### Token Refresh Flow

**File:** `axiosInstance.ts`

```typescript
// 1. API call fails with 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // 2. Check if already refreshing
      if (isRefreshing) {
        // Add to queue and wait
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      // 3. Start refresh process
      isRefreshing = true;
      const newToken = await doRefresh();

      // 4. If refresh succeeded
      if (newToken) {
        // Process queued requests
        processQueue(null, newToken);
        // Retry original request
        return axiosInstance(originalRequest);
      }

      // 5. If refresh failed, logout user
      tokenManager.clearTokens();
      window.dispatchEvent(new Event('auth:session-expired'));
    }
  }
);
```

### Session Initialization

**File:** `useAuthSession.ts`

```typescript
export function useInitializeAuth() {
  useEffect(() => {
    const initialize = async () => {
      // 1. Check for stored session
      const storedSession = tokenManager.getSessionData();
      
      if (!storedSession || !tokenManager.getRefreshToken()) {
        clearAuth();
        setInitialized(true);
        return;
      }

      // 2. Validate session with backend
      try {
        const validated = await authService.validateSession();
        
        if (validated.succeeded) {
          // Session valid - set auth state
          setAuth(validated.data);
        } else {
          // Session invalid - clear auth
          clearAuth();
        }
      } catch (err) {
        // 3. Handle validation errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Refresh token expired - logout
          clearAuth();
        } else if (err.response?.status === 0 || err.response?.status >= 500) {
          // Network/server error - keep cached session
          setAuth(storedSession);
        }
      } finally {
        setInitialized(true);
      }
    };

    initialize();
  }, []);
}
```

## Configuration

### Token Expiry Times

These are set on the **backend** and should match your API configuration:

- **Access Token:** 15-30 minutes (short-lived)
- **Refresh Token:** 7-30 days (long-lived)

### Session Timeout Behavior

| Scenario | Behavior |
|----------|----------|
| Access token expires | ✅ Auto-refresh with refresh token |
| Refresh token expires | ❌ Logout user, redirect to login |
| User closes browser | ✅ Session persists (tokens in localStorage) |
| User clears browser data | ❌ Session lost, must login again |
| Server revokes token | ❌ Next API call fails, logout user |

## Security Considerations

### Current Implementation

✅ **Strengths:**
- Automatic token refresh prevents session interruption
- Refresh token only sent to refresh endpoint
- 401 errors on auth endpoints immediately clear tokens
- Concurrent refresh handling prevents race conditions
- Session validated on app load

⚠️ **Recommendations for Production:**
1. **HTTP-only Cookies:** Move tokens to HTTP-only secure cookies (requires backend changes)
2. **Token Encryption:** Encrypt tokens before storing in localStorage
3. **CSRF Protection:** Implement CSRF tokens if using cookies
4. **Short Access Token Lifetime:** Keep access tokens short-lived (15 min max)
5. **Refresh Token Rotation:** Backend should issue new refresh token on each refresh

## Troubleshooting

### User Logged Out Unexpectedly

**Possible Causes:**
1. Refresh token expired on backend
2. Server revoked the token (password change, admin action)
3. User cleared browser data
4. Backend API returned 401/403 on validation

**Debug Steps:**
```typescript
// Check stored session
console.log(tokenManager.getSessionData());
console.log('Access Token:', tokenManager.getAccessToken());
console.log('Refresh Token:', tokenManager.getRefreshToken());

// Check token expiry
console.log('Access Token Expired:', tokenManager.isAccessTokenExpired());
```

### Token Not Refreshing

**Possible Causes:**
1. Refresh token missing from localStorage
2. Backend refresh endpoint returning error
3. Network issue preventing refresh call

**Debug Steps:**
```typescript
// Check browser console for:
// [Auth] Attempting to refresh access token...
// [Auth] Token refreshed successfully
// OR
// [Auth] Refresh error: ...
```

### Session Not Persisting After Browser Close

**Possible Causes:**
1. Browser clearing localStorage on exit (privacy settings)
2. Using incognito/private mode
3. Tokens being cleared by bug in code

**Debug Steps:**
1. Check browser settings - ensure "Clear cookies and site data when you close all windows" is OFF
2. Test in normal browsing mode
3. Verify `tokenManager.clearTokens()` is not being called unexpectedly

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/auth/login` | POST | Authenticate user, get tokens |
| `/v1/auth/refresh-token` | POST | Refresh access token |
| `/v1/auth/logout` | POST | Invalidate session |
| `/v1/auth/me` | GET | Validate session, get user data |

### Request/Response Examples

**Login:**
```typescript
// Request
POST /v1/auth/login
{
  "username": "admin",
  "password": "password123"
}

// Response
{
  "succeeded": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "role": "Admin",
    "userId": 1,
    "name": "Admin User",
    "phoneNumber": "01234567890"
  }
}
```

**Refresh Token:**
```typescript
// Request
POST /v1/auth/refresh-token
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "succeeded": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",  // New access token
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."  // New refresh token (optional)
  }
}
```

## Best Practices

### For Developers

1. **Always use `axiosInstance`** for API calls (has refresh interceptor)
2. **Don't manually manage tokens** - let the system handle it
3. **Use auth hooks** (`useIsAuthenticated`, `useCurrentUser`, etc.)
4. **Handle loading states** - auth initialization is async
5. **Test token expiry** - simulate expired tokens to verify refresh flow

### For Users

1. **Don't clear browser data** if you want to stay logged in
2. **Use trusted devices** for longer sessions
3. **Logout explicitly** when using shared computers
4. **Report unexpected logouts** to administrators

## Future Improvements

- [ ] Implement HTTP-only cookie storage
- [ ] Add biometric authentication (WebAuthn)
- [ ] Implement session management UI (view active sessions, revoke)
- [ ] Add "Remember Me" option with extended refresh token lifetime
- [ ] Implement token encryption before localStorage storage
- [ ] Add session activity logging
