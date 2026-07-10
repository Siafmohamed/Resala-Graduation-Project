# 🚨 SECURITY FIXES - ACTIONABLE IMPLEMENTATION GUIDE

## Quick Reference: Severity Levels & Timeline

| Severity | Count | Timeline | Impact |
|----------|-------|----------|--------|
| 🔴 CRITICAL | 4 | 0-48 hours | Complete compromise possible |
| 🟠 HIGH | 8 | 1-2 weeks | Significant exploitation risk |
| 🟡 MEDIUM | 6 | 2-4 weeks | Moderate risk |
| 🟢 LOW | 3 | Ongoing | Minor improvements |

---

## 🔴 CRITICAL FIXES (Do NOW)

### Fix #1: Secure Token Storage (Priority: IMMEDIATE)

**Affected Files:**
- `src/features/authentication/utils/tokenManager.ts` → DELETE/REFACTOR
- `src/features/authentication/utils/secureTokenManager.ts` → CREATE
- `src/api/axiosInstance.ts` → UPDATE
- `src/features/authentication/store/authSlice.ts` → UPDATE
- `src/features/authentication/context/AuthProvider.tsx` → UPDATE

**Step 1: Create Secure Token Manager**

Create: `src/features/authentication/utils/secureTokenManager.ts`

```typescript
import { jwtDecode } from 'jwt-decode';
import type { SessionData } from '../types/auth.types';

interface JwtPayload {
    exp?: number;
    [key: string]: unknown;
}

/**
 * Secure in-memory token storage
 * Tokens cleared on page reload (volatile by design)
 * Refresh token stored in httpOnly cookie (server-set only)
 */
class SecureTokenManager {
    private accessToken: string | null = null;
    private sessionData: SessionData | null = null;

    /**
     * Set access token (in-memory only)
     */
    setAccessToken(token: string): void {
        if (!token) {
            this.accessToken = null;
            return;
        }
        
        // Validate token before storing
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            if (!decoded?.exp) {
                throw new Error('Invalid token: missing expiration');
            }
            this.accessToken = token;
        } catch (err) {
            console.error('[SecureTokenManager] Invalid token:', err);
            this.accessToken = null;
        }
    }

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        if (!this.accessToken) return null;
        
        // Check if token expired
        if (this.isAccessTokenExpired()) {
            this.accessToken = null;
            return null;
        }
        
        return this.accessToken;
    }

    /**
     * Set session data (user info, but NOT tokens)
     */
    setSessionData(data: SessionData): void {
        if (!data) {
            this.sessionData = null;
            return;
        }
        
        // Don't store tokens in sessionData
        const { accessToken, refreshToken, ...safeData } = data;
        this.sessionData = safeData as SessionData;
    }

    /**
     * Get session data
     */
    getSessionData(): SessionData | null {
        return this.sessionData;
    }

    /**
     * Check if token expired
     */
    isAccessTokenExpired(): boolean {
        if (!this.accessToken) return true;
        
        try {
            const decoded = jwtDecode<JwtPayload>(this.accessToken);
            
            if (!decoded?.exp) {
                // No expiration = invalid token
                return true;
            }
            
            // Use 30-second buffer for safety
            const bufferMs = 30_000;
            return (decoded.exp * 1000) - bufferMs < Date.now();
        } catch {
            return true;
        }
    }

    /**
     * Decode JWT (no validation - only structure)
     */
    decodeToken<T = JwtPayload>(token: string): T | null {
        try {
            return jwtDecode<T>(token);
        } catch {
            return null;
        }
    }

    /**
     * Get role from token
     */
    getRoleFromToken(): string | null {
        if (!this.accessToken) return null;
        
        const decoded = this.decodeToken<any>(this.accessToken);
        return decoded?.role || null;
    }

    /**
     * Check if valid session exists
     */
    hasValidSession(): boolean {
        return !!this.accessToken && !this.isAccessTokenExpired();
    }

    /**
     * Clear all tokens and session data
     */
    clearTokens(): void {
        this.accessToken = null;
        this.sessionData = null;
        
        // Refresh token cleared via httpOnly cookie by backend
        // Mark for logout via API call
    }

    /**
     * Emergency clear (on unauthorized)
     */
    emergencyClear(): void {
        this.clearTokens();
        window.localStorage.clear();
        window.sessionStorage.clear();
    }
}

export const secureTokenManager = new SecureTokenManager();
```

**Step 2: Update axiosInstance.ts**

Find and update the token retrieval logic:

```typescript
// BEFORE (INSECURE):
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken()  // ❌ From localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AFTER (SECURE):
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = secureTokenManager.getAccessToken();  // ✅ From memory
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // No token = redirect to login
        window.dispatchEvent(new Event('auth:session-expired'));
    }
    return config;
});
```

**Step 3: Update AuthProvider.tsx**

```typescript
import { secureTokenManager } from '@/features/authentication/utils/secureTokenManager';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const refresh = useCallback(async (): Promise<string | null> => {
        try {
            // Refresh endpoint returns new token (no refresh token in request)
            const refreshed = await authService.refreshToken();
            
            if (!refreshed?.succeeded || !refreshed?.data?.token) {
                return null;
            }

            // Get stored session data (doesn't contain tokens)
            const sessionData = secureTokenManager.getSessionData();
            
            if (!sessionData) {
                // No session = just store new token
                secureTokenManager.setAccessToken(refreshed.data.token);
                return refreshed.data.token;
            }

            // Update session with new token
            const updatedSession: SessionData = {
                ...sessionData,
                accessToken: refreshed.data.token,
            };
            
            secureTokenManager.setSessionData(updatedSession);
            secureTokenManager.setAccessToken(refreshed.data.token);
            
            return refreshed.data.token;
        } catch (err) {
            console.error('[AuthProvider] Token refresh failed:', err);
            return null;
        }
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            const response = await authService.login(credentials);
            
            if (!response.succeeded) {
                throw new Error(response.message || 'Login failed');
            }

            // Clear old data
            secureTokenManager.clearTokens();
            queryClient.clear();

            // Store new session (from API response)
            const sessionData = response.data as SessionData;
            
            // Store session data (without tokens)
            const { accessToken, refreshToken, ...safeSession } = sessionData;
            secureTokenManager.setSessionData({ ...safeSession } as SessionData);
            
            // Store access token (memory only)
            secureTokenManager.setAccessToken(accessToken);
            
            // Update Zustand store
            setAuth(sessionData);
            setInitialized(true);
            
            console.log('[AuthProvider] Login successful');
        },
        [setAuth, setInitialized, queryClient],
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            secureTokenManager.clearTokens();
            clearAuth();
        }
    }, [clearAuth]);

    // ... rest of implementation
};
```

**Step 4: Update authSlice.ts**

```typescript
export const useAuthStore = create<AuthStore>((set) => ({
    // ... existing code ...
    
    setAuth: (session: SessionData) => {
        // ❌ DON'T store full session with tokens
        // ✅ Store only session metadata
        
        const { accessToken, refreshToken, ...safeSession } = session;
        
        // Store in secure manager
        secureTokenManager.setSessionData(safeSession as SessionData);
        secureTokenManager.setAccessToken(accessToken);
        
        set({
            session: safeSession as SessionData,
            isAuthenticated: true,
            userRole: mapApiRole(safeSession.role),
        });
    },
    
    clearAuth: () => {
        secureTokenManager.clearTokens();
        set({
            session: null,
            isAuthenticated: false,
            userRole: undefined,
            isInitialized: true,
        });
    },
}));
```

**Step 5: Update imports**

Replace all imports of old tokenManager:

```bash
# Search and replace in all files:
# Find: "import { tokenManager }"
# Replace with: "import { secureTokenManager as tokenManager }"

# Or refactor to use secureTokenManager everywhere
grep -r "tokenManager" src/ | grep -v node_modules | grep import
```

**Step 6: Backend - Set httpOnly Cookie**

```csharp
// Backend - Login Endpoint
[HttpPost("/v1/auth/login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // Authenticate user...
    var user = await _userService.AuthenticateAsync(request.Email, request.Password);
    
    if (user == null)
        return Unauthorized("Invalid credentials");
    
    // Generate tokens
    var accessToken = GenerateAccessToken(user, expiresIn: TimeSpan.FromMinutes(15));
    var refreshToken = GenerateRefreshToken(user, expiresIn: TimeSpan.FromDays(7));
    
    // ✅ Set refresh token in httpOnly cookie
    Response.Cookies.Append(
        "refreshToken",  // Cookie name
        refreshToken,    // Token value
        new CookieOptions
        {
            HttpOnly = true,      // JavaScript cannot access
            Secure = true,        // HTTPS only
            SameSite = SameSiteMode.Strict,  // CSRF protection
            Path = "/api",        // Only sent to API routes
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        }
    );
    
    // Return access token only (not refresh token)
    return Ok(new
    {
        succeeded = true,
        data = new
        {
            token = accessToken,  // Access token only
            userId = user.Id,
            role = user.Role,
            email = user.Email
        }
    });
}

// Refresh Endpoint
[HttpPost("/v1/auth/refresh-token")]
public async Task<IActionResult> RefreshToken()
{
    // Get refresh token from cookie
    var refreshToken = Request.Cookies["refreshToken"];
    
    if (string.IsNullOrEmpty(refreshToken))
        return Unauthorized("No refresh token");
    
    try
    {
        // Verify refresh token
        var principal = ValidateRefreshToken(refreshToken);
        var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var user = await _userService.GetUserAsync(userId);
        
        // ✅ Generate NEW refresh token (rotation)
        var newAccessToken = GenerateAccessToken(user, TimeSpan.FromMinutes(15));
        var newRefreshToken = GenerateRefreshToken(user, TimeSpan.FromDays(7));
        
        // ✅ Update cookie with new refresh token
        Response.Cookies.Append(
            "refreshToken",
            newRefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api",
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            }
        );
        
        return Ok(new
        {
            succeeded = true,
            data = new { token = newAccessToken }
        });
    }
    catch
    {
        // Clear invalid cookie
        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api"
        });
        
        return Unauthorized("Invalid refresh token");
    }
}

// Logout Endpoint
[HttpPost("/v1/auth/logout")]
[Authorize]
public IActionResult Logout()
{
    // ✅ Clear refresh token cookie
    Response.Cookies.Delete("refreshToken", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/api"
    });
    
    return Ok(new { succeeded = true, message = "Logged out" });
}
```

**Migration Checklist:**
- [ ] Create secureTokenManager.ts
- [ ] Update axiosInstance.ts
- [ ] Update AuthProvider.tsx
- [ ] Update authSlice.ts
- [ ] Update backend login/refresh/logout
- [ ] Remove localStorage storage code
- [ ] Test login/logout/refresh
- [ ] Clear browser localStorage manually
- [ ] Test with XSS payload (check if accessible)

---

### Fix #2: Enable HTTPS (Priority: IMMEDIATE)

**Step 1: Update Frontend Configuration**

Edit: `src/api/axiosInstance.ts`

```typescript
// Enforce HTTPS in production
const getBaseURL = () => {
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (import.meta.env.PROD) {
        // ✅ Production: must be HTTPS
        if (!envBaseUrl?.startsWith('https://')) {
            console.error('[API] Production API must use HTTPS');
            return 'https://api.yourdomain.com/api';
        }
    }
    
    return envBaseUrl || '/api';
};
```

**Step 2: Update Environment Files**

Edit: `.env.production`

```env
# Production - MUST be HTTPS
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Edit: `vite.config.ts`

```typescript
export default defineConfig({
    server: {
        https: true,  // ✅ Enable HTTPS in dev
        proxy: {
            '/api': {
                target: process.env.VITE_PROXY_TARGET || 'https://localhost:3000',
                changeOrigin: true,
                secure: process.env.NODE_ENV === 'production',  // Verify certs in prod
            }
        }
    }
});
```

**Step 3: Update Vercel Configuration**

Edit: `vercel.json`

```json
{
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "https://api.yourdomain.com/api/:path*"  // ✅ HTTPS
        },
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ],
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "Strict-Transport-Security",
                    "value": "max-age=31536000; includeSubDomains; preload"
                },
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                },
                {
                    "key": "Referrer-Policy",
                    "value": "strict-origin-when-cross-origin"
                }
            ]
        }
    ]
}
```

**Step 4: Update Backend (ASP.NET)**

Add to `Program.cs`:

```csharp
// Force HTTPS redirect
app.UseHttpsRedirection();

// Add HSTS
app.UseHsts();

// Add security headers middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Strict-Transport-Security", 
        "max-age=31536000; includeSubDomains; preload");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    await next();
});
```

**Step 5: Test HTTPS**

```bash
# Test with curl
curl -v https://yourdomain.com/api/v1/health

# Check HSTS header
curl -I https://yourdomain.com

# Should see:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

### Fix #3: Backend Role Validation (Priority: IMMEDIATE)

This is CRITICAL - add to EVERY protected endpoint.

**Create Authorization Middleware:**

```csharp
// Services/AuthorizationService.cs
public interface IAuthorizationService
{
    Task<bool> ValidateUserAccessAsync(int userId, required string requiredRole);
}

public class AuthorizationService : IAuthorizationService
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthorizationService> _logger;
    
    public async Task<bool> ValidateUserAccessAsync(int userId, string requiredRole)
    {
        try
        {
            var user = await _userService.GetUserAsync(userId);
            
            if (user == null)
            {
                _logger.LogWarning($"User not found: {userId}");
                return false;
            }
            
            if (!user.IsActive)
            {
                _logger.LogWarning($"User account inactive: {userId}");
                return false;
            }
            
            // Check if user has required role
            if (user.Role != requiredRole && user.Role != "Admin")
            {
                _logger.LogWarning($"Insufficient privileges for user {userId}. Required: {requiredRole}, Has: {user.Role}");
                return false;
            }
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Authorization check failed");
            return false;
        }
    }
}
```

**Register in DI:**

```csharp
services.AddScoped<IAuthorizationService, AuthorizationService>();
```

**Apply to Endpoints:**

```csharp
[Authorize]
[HttpGet("/v1/admin/users")]
public async Task<IActionResult> GetAllUsers()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    
    // ✅ VERIFY user is still Admin
    var isAuthorized = await _authService.ValidateUserAccessAsync(userId, "Admin");
    if (!isAuthorized)
    {
        _logger.LogWarning($"Unauthorized access attempt by user {userId}");
        return Forbid("Insufficient permissions");
    }
    
    // Proceed...
    return Ok(await _userService.GetAllUsersAsync());
}

[Authorize]
[HttpPost("/v1/receipts/verify")]
public async Task<IActionResult> VerifyReceipt([FromBody] VerifyRequest request)
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    
    // ✅ VERIFY user is Receptionist or Admin
    var isAuthorized = await _authService.ValidateUserAccessAsync(userId, "Receptionist");
    if (!isAuthorized)
    {
        return Forbid("Only receptionists can verify receipts");
    }
    
    // Proceed...
    return Ok(await _receiptService.VerifyAsync(request));
}
```

**Apply to ALL endpoints systematically:**

Create a checklist of all endpoints and add authorization check to each.

---

### Fix #4: Implement Rate Limiting (Priority: HIGH - 48 hours)

**Step 1: Add Rate Limiting to ASP.NET**

```csharp
// Program.cs
services.AddRateLimiter(options =>
{
    // Policy 1: Login attempts (strict)
    options.AddFixedWindowLimiter(policyName: "auth-login", configure: options =>
    {
        options.PermitLimit = 5;                    // 5 attempts
        options.Window = TimeSpan.FromMinutes(15);  // Per 15 minutes
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 2;
    });
    
    // Policy 2: Password reset (moderate)
    options.AddFixedWindowLimiter(policyName: "auth-password", configure: options =>
    {
        options.PermitLimit = 3;
        options.Window = TimeSpan.FromHours(1);
    });
    
    // Policy 3: General API (permissive)
    options.AddSlidingWindowLimiter(policyName: "api-general", configure: options =>
    {
        options.PermitLimit = 100;
        options.Window = TimeSpan.FromMinutes(1);
        options.SegmentsPerWindow = 2;
    });
});

app.UseRateLimiter();
```

**Step 2: Apply to Endpoints**

```csharp
[HttpPost("/v1/auth/login")]
[EnableRateLimiting("auth-login")]  // ✅ Rate limited: 5 per 15 min
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // Implementation...
}

[HttpPost("/v1/auth/forgot-password")]
[EnableRateLimiting("auth-password")]  // ✅ Rate limited: 3 per hour
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
{
    // Implementation...
}

[HttpPost("/v1/auth/verify-email")]
[EnableRateLimiting("auth-password")]
public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
{
    // Implementation...
}

[HttpPost("/v1/auth/resend-otp")]
[EnableRateLimiting("auth-password")]
public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
{
    // Implementation...
}

// General endpoints
[HttpGet("/v1/donations")]
[EnableRateLimiting("api-general")]  // ✅ Rate limited: 100 per min
public async Task<IActionResult> GetDonations()
{
    // Implementation...
}
```

---

## 🟠 HIGH PRIORITY FIXES (1-2 weeks)

### Fix #5: File Upload Validation

**Frontend Validation:**

Create: `src/shared/utils/fileValidator.ts`

```typescript
export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export const FILE_CONFIG = {
    IMAGE: {
        mimes: ['image/jpeg', 'image/png', 'image/webp'],
        extensions: ['jpg', 'jpeg', 'png', 'webp'],
        maxSize: 5 * 1024 * 1024,  // 5MB
    },
    DOCUMENT: {
        mimes: ['application/pdf'],
        extensions: ['pdf'],
        maxSize: 10 * 1024 * 1024,  // 10MB
    }
};

export const validateFile = async (
    file: File,
    type: 'IMAGE' | 'DOCUMENT' = 'IMAGE'
): Promise<FileValidationResult> => {
    const config = FILE_CONFIG[type];
    
    // 1. Check file exists
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }
    
    // 2. Check size
    if (file.size > config.maxSize) {
        return { 
            valid: false, 
            error: `File too large (max ${config.maxSize / 1024 / 1024}MB)` 
        };
    }
    
    // 3. Check MIME type
    if (!config.mimes.includes(file.type)) {
        return { valid: false, error: `Invalid file type: ${file.type}` };
    }
    
    // 4. Check extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !config.extensions.includes(extension)) {
        return { 
            valid: false, 
            error: `Invalid file extension: .${extension}` 
        };
    }
    
    // 5. Check magic bytes (for images)
    if (type === 'IMAGE') {
        const isValidImage = await checkImageMagicBytes(file);
        if (!isValidImage) {
            return { 
                valid: false, 
                error: 'File content does not match type' 
            };
        }
    }
    
    return { valid: true };
};

const checkImageMagicBytes = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const arr = new Uint8Array((e.target?.result as ArrayBuffer).slice(0, 8));
            
            // Check magic bytes
            const isJpeg = arr[0] === 0xFF && arr[1] === 0xD8;
            const isPng = arr[0] === 0x89 && arr[1] === 0x50 && 
                         arr[2] === 0x4E && arr[3] === 0x47;
            const isWebp = arr[0] === 0x52 && arr[1] === 0x49 && 
                          arr[2] === 0x46 && arr[3] === 0x46;
            
            resolve(isJpeg || isPng || isWebp);
        };
        
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file.slice(0, 8));
    });
};
```

**Usage in Component:**

```typescript
const handleFileUpload = async (file: File) => {
    const validation = await validateFile(file, 'IMAGE');
    
    if (!validation.valid) {
        toast.error(validation.error || 'Invalid file');
        return;
    }
    
    // File is valid, upload it
    await uploadFile(file);
};
```

**Backend Validation:**

```csharp
[HttpPost("/v1/files/upload")]
public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
{
    // 1. Check file exists
    if (file == null || file.Length == 0)
        return BadRequest("No file provided");
    
    // 2. Validate size
    const long MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB
    if (file.Length > MAX_FILE_SIZE)
        return BadRequest("File too large");
    
    // 3. Validate MIME type
    var allowedMimes = new[] { "image/jpeg", "image/png", "image/webp" };
    if (!allowedMimes.Contains(file.ContentType))
        return BadRequest($"Invalid MIME type: {file.ContentType}");
    
    // 4. Validate extension
    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
    var fileExtension = Path.GetExtension(file.FileName).ToLower();
    if (!allowedExtensions.Contains(fileExtension))
        return BadRequest("Invalid file extension");
    
    // 5. Check file content (magic bytes)
    var magicBytes = new byte[8];
    await file.OpenReadStream().ReadAsync(magicBytes, 0, 8);
    
    bool isValidImage = (magicBytes[0] == 0xFF && magicBytes[1] == 0xD8) ||  // JPEG
                       (magicBytes[0] == 0x89 && magicBytes[1] == 0x50 &&
                        magicBytes[2] == 0x4E && magicBytes[3] == 0x47) ||  // PNG
                       (magicBytes[0] == 0x52 && magicBytes[1] == 0x49 &&
                        magicBytes[2] == 0x46 && magicBytes[3] == 0x46);  // WebP
    
    if (!isValidImage)
        return BadRequest("File content does not match MIME type");
    
    // 6. Scan for viruses (optional - requires ClamAV)
    if (_virusScanner != null)
    {
        var isSafe = await _virusScanner.ScanFileAsync(file.OpenReadStream());
        if (!isSafe)
            return BadRequest("File failed security scan");
    }
    
    // 7. Save with random name
    var uniqueName = $"{Guid.NewGuid()}{fileExtension}";
    var uploadPath = Path.Combine(_hostEnvironment.WebRootPath, "uploads", uniqueName);
    
    using (var stream = new FileStream(uploadPath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    // 8. Return file URL (not path)
    var fileUrl = $"/files/{uniqueName}";
    
    return Ok(new { succeeded = true, data = new { url = fileUrl } });
}
```

---

### Fix #6: Strong Password Policy

**Frontend:**

```typescript
// src/shared/utils/passwordValidator.ts
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 12) {
        errors.push('At least 12 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('At least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('At least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('At least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('At least one special character');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

// Usage in form validation
const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(12, 'At least 12 characters')
        .refine((pwd) => /[A-Z]/.test(pwd), 'At least one uppercase letter')
        .refine((pwd) => /[a-z]/.test(pwd), 'At least one lowercase letter')
        .refine((pwd) => /[0-9]/.test(pwd), 'At least one number')
        .refine((pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd), 'At least one special character'),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
});
```

**Backend:**

```csharp
public class PasswordValidator : AbstractValidator<string>
{
    public PasswordValidator()
    {
        RuleFor(x => x)
            .NotEmpty()
            .MinimumLength(12).WithMessage("At least 12 characters")
            .Matches(@"[A-Z]").WithMessage("At least one uppercase letter")
            .Matches(@"[a-z]").WithMessage("At least one lowercase letter")
            .Matches(@"[0-9]").WithMessage("At least one digit")
            .Matches(@"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]").WithMessage("At least one special character");
    }
}

[HttpPost("/v1/auth/reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
{
    // Validate password
    var validator = new PasswordValidator();
    var result = await validator.ValidateAsync(request.NewPassword);
    
    if (!result.IsValid)
    {
        return BadRequest(new { 
            message = "Password does not meet requirements",
            errors = result.Errors.Select(e => e.ErrorMessage)
        });
    }
    
    // Check password not same as previous
    var user = await _userService.GetUserAsync(userId);
    var isSameAsCurrent = await _passwordHasher.VerifyAsync(request.NewPassword, user.PasswordHash);
    
    if (isSameAsCurrent)
        return BadRequest("New password must differ from current password");
    
    // Update password
    user.PasswordHash = await _passwordHasher.HashAsync(request.NewPassword);
    await _userService.UpdateUserAsync(user);
    
    return Ok(new { succeeded = true, message = "Password reset successfully" });
}
```

---

## ✅ TESTING CHECKLIST

After implementing fixes, test:

### Security Testing

- [ ] **XSS**: Try to inject `<img src=x onerror='alert("xss")'>`
- [ ] **localStorage**: Verify tokens NOT in localStorage
- [ ] **HTTPS**: All requests use HTTPS
- [ ] **CORS**: Test cross-origin requests (should fail)
- [ ] **Auth**: Modify JWT locally (should not give access)
- [ ] **Rate Limiting**: Try rapid login attempts (should block)
- [ ] **File Upload**: Try uploading .exe file (should fail)
- [ ] **SQL Injection**: Try `admin' OR '1'='1` (should fail)

### Functional Testing

- [ ] Login works
- [ ] Token refresh works
- [ ] Logout clears session
- [ ] Admin routes protected
- [ ] File uploads work
- [ ] Password reset works
- [ ] Role-based access works

---

## 📋 IMPLEMENTATION ORDER

1. **Day 1**: Secure Token Storage
2. **Day 2**: Enable HTTPS
3. **Day 3**: Backend Role Validation
4. **Day 4**: Rate Limiting + Testing
5. **Week 2**: File Uploads + Password Policy
6. **Week 3**: Security Headers + Monitoring
7. **Week 4**: Penetration Testing
8. **Week 5**: Deploy to Production

---

## 🆘 ROLLBACK PLAN

If something breaks during implementation:

1. **Revert to last working commit**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Keep old code in branch**
   ```bash
   git checkout -b security-fixes
   # Make changes
   git push origin security-fixes
   ```

3. **Test in staging first**
   - Deploy to staging
   - Run security tests
   - Get approval
   - Deploy to production

---

**Implementation started:** [Date]  
**Target completion:** [Date]  
**Status:** [ ] In Progress [ ] Complete
