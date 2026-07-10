# 🔐 SECURITY QUICK REFERENCE CARD

## Critical Issues at a Glance

| Issue | Risk | Fix Time | Impact |
|-------|------|----------|--------|
| Tokens in localStorage | CRITICAL | 4h | XSS → Account Takeover |
| HTTP API (not HTTPS) | CRITICAL | 2h | MITM → Data Leak |
| No Backend Role Check | CRITICAL | 6h | Privilege Escalation |
| No Rate Limiting | HIGH | 2h | Brute Force Attacks |
| No File Validation | HIGH | 3h | Malware Upload |
| Weak Passwords | HIGH | 2h | Easy to Crack |

---

## 🚀 QUICK FIXES (Copy-Paste Ready)

### 1. Secure Token Storage (Memory Only)

```typescript
// Use this instead of localStorage
class SecureTokenManager {
    private accessToken: string | null = null;
    
    setAccessToken(token: string): void {
        this.accessToken = token;  // ✅ Memory only
    }
    
    getAccessToken(): string | null {
        return this.accessToken;
    }
    
    clearTokens(): void {
        this.accessToken = null;  // ✅ Cleared on reload
    }
}
```

### 2. HTTPS Everywhere

```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

```csharp
// Backend - Program.cs
app.UseHttpsRedirection();
app.UseHsts();
```

### 3. Backend Role Validation

```csharp
[Authorize]
[HttpGet("/api/admin/dashboard")]
public async Task<IActionResult> GetDashboard()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    var user = await _userService.GetUserAsync(userId);
    
    // ✅ CHECK ROLE ON BACKEND
    if (user.Role != "Admin")
        return Forbid("Admin role required");
    
    return Ok(await _adminService.GetDashboard());
}
```

### 4. Rate Limiting

```csharp
// Program.cs
services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("auth", configure: opt => {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(15);
    });
});

// Endpoint
[HttpPost("/auth/login")]
[EnableRateLimiting("auth")]  // ✅ 5 attempts per 15 min
public IActionResult Login(LoginRequest request) { }
```

### 5. Strong Passwords

```typescript
const passwordSchema = z.string()
    .min(12)
    .refine(p => /[A-Z]/.test(p), "Need uppercase")
    .refine(p => /[a-z]/.test(p), "Need lowercase")
    .refine(p => /[0-9]/.test(p), "Need number")
    .refine(p => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p), "Need special char");
```

### 6. Secure CORS

```csharp
services.AddCors(options => {
    options.AddPolicy("prod", builder => {
        builder
            .WithOrigins("https://yourdomain.com")  // ✅ Specific origin
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

app.UseCors("prod");
```

### 7. File Upload Validation

```csharp
[HttpPost("/files/upload")]
public async Task<IActionResult> Upload([FromForm] IFormFile file)
{
    if (file.Length > 5 * 1024 * 1024)  // ✅ Size check
        return BadRequest("Too large");
    
    if (!new[] { "image/jpeg", "image/png" }.Contains(file.ContentType))
        return BadRequest("Invalid type");  // ✅ MIME check
    
    var magicBytes = new byte[4];
    await file.OpenReadStream().ReadAsync(magicBytes, 0, 4);
    
    // ✅ Magic bytes check
    if (magicBytes[0] != 0xFF || magicBytes[1] != 0xD8)
        return BadRequest("Invalid file");
    
    // Save with random name
    var fileName = $"{Guid.NewGuid()}.jpg";
    // ...
}
```

### 8. Security Headers (Vercel)

```json
{
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
                { "key": "X-Content-Type-Options", "value": "nosniff" },
                { "key": "X-Frame-Options", "value": "DENY" },
                { "key": "X-XSS-Protection", "value": "1; mode=block" }
            ]
        }
    ]
}
```

---

## ⚠️ NEVER DO THIS

```typescript
// ❌ WRONG: Storing tokens in localStorage
localStorage.setItem('token', jwtToken);

// ❌ WRONG: Storing passwords in memory
const passwords = [];

// ❌ WRONG: Using dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ WRONG: HTTP API
VITE_API_BASE_URL=http://api.yourdomain.com

// ❌ WRONG: Trusting client-side role
if (localStorage.getItem('role') === 'Admin') { }

// ❌ WRONG: Allowing any file type
formData.append('file', fileInput.files[0]);

// ❌ WRONG: CORS allowing any origin
builder.AllowAnyOrigin().AllowCredentials()
```

---

## ✅ DO THIS INSTEAD

```typescript
// ✅ RIGHT: In-memory storage
this.accessToken = token;  // Cleared on reload

// ✅ RIGHT: Don't store passwords
// Hash on backend, never on client

// ✅ RIGHT: Escape HTML
<div>{userInput}</div>  // React escapes automatically

// ✅ RIGHT: HTTPS only
VITE_API_BASE_URL=https://api.yourdomain.com

// ✅ RIGHT: Validate on backend
if (user.Role != "Admin") return Forbid();

// ✅ RIGHT: Validate files
if (file.ContentType != "image/jpeg") return BadRequest();

// ✅ RIGHT: Specific origins only
builder.WithOrigins("https://yourdomain.com")
```

---

## 🧪 QUICK SECURITY TESTS

### Test 1: XSS Prevention
```javascript
// In browser console, try:
localStorage.getItem('resala_session')
// Should be empty/null in production ✅
```

### Test 2: HTTPS Enforcement
```bash
curl -v http://yourdomain.com
# Should redirect to https ✅
```

### Test 3: CORS Protection
```javascript
// From attacker.com, try:
fetch('https://yourdomain.com/api/admin')
// Should get CORS error ✅
```

### Test 4: Rate Limiting
```bash
# Try rapid login attempts:
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/auth/login
done
# Should get blocked after 5 ✅
```

### Test 5: File Upload
```bash
# Try uploading malicious file
curl -F "file=@malware.exe" https://yourdomain.com/api/files/upload
# Should get rejected ✅
```

### Test 6: JWT Tampering
```javascript
// Get token and modify it
const token = "eyJ..."; // Get real token
const parts = token.split('.');
const modified = parts[0] + "." + parts[1] + ".WRONG_SIGNATURE";

// Use modified token
fetch('https://yourdomain.com/api/admin', {
    headers: { Authorization: `Bearer ${modified}` }
});
// Should get 401 Unauthorized ✅
```

---

## 📊 SECURITY PRIORITIES

### Week 1 (Do This NOW)
1. Move tokens to in-memory storage
2. Enable HTTPS
3. Add backend role validation
4. Implement rate limiting

### Week 2
1. Add file upload validation
2. Enforce strong passwords
3. Add security headers
4. Strict CORS configuration

### Week 3
1. Add logging/monitoring
2. Regular security audits
3. Penetration testing
4. Security training

---

## 🔗 COMMON SECURITY LINKS

- **OWASP**: https://owasp.org/www-project-top-ten/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **CSP Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725
- **Password Rules**: https://cheatsheetseries.owasp.org/

---

## 📞 WHEN TO GET HELP

- 🚨 **Security Breach**: Contact security team immediately
- 💾 **Data Leak**: Notify affected users
- 🐛 **Vulnerability Found**: Document and fix
- ❓ **Unsure About Implementation**: Ask security engineer

---

## 🏁 FINAL CHECKLIST

Before production deployment:

- [ ] Tokens in memory, not localStorage
- [ ] All traffic is HTTPS
- [ ] Every endpoint validates authorization
- [ ] Rate limiting on auth endpoints
- [ ] File uploads validated
- [ ] Passwords follow policy
- [ ] CORS is strict
- [ ] Security headers set
- [ ] No debug logging
- [ ] Error messages don't leak info
- [ ] Dependencies updated
- [ ] No secrets in code
- [ ] Tests pass
- [ ] Security review passed

---

**Last Updated:** May 7, 2026  
**Security Score Before:** 4.2/10  
**Target Security Score:** 8.5/10  
**Status:** Ready for Implementation
