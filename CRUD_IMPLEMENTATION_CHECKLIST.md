# CRUD Operation Security Implementation Checklist
**Quick Reference for Production Deployment**

---

## CRITICAL - Must Fix Before Production (🔴 CRITICAL Priority)

### CREATE Operations
- [ ] Staff Creation (`POST /v1/auth/create-staff`)
  - [ ] Add Zod validation schema for all fields
  - [ ] Strip unauthorized fields (isAdmin, roleId, status, createdBy)
  - [ ] Backend DTO with only whitelisted fields
  - [ ] Backend hardcodes role, status, createdAt, createdBy
  - [ ] Hash passwords with bcrypt (12+ rounds)
  - [ ] Check username/email uniqueness
  - [ ] Add audit log entry

- [ ] Donation Creation (`POST /v1/in-kind-donations`)
  - [ ] Remove donorId from request payload
  - [ ] Extract userId from JWT token (not request)
  - [ ] Validate all text fields (min/max length)
  - [ ] Check for injection patterns (HTML, JS, SQL)
  - [ ] Backend associates with current user

- [ ] Emergency Case Creation (`POST /v1/emergency-cases`)
  - [ ] Validate file size (max 5MB)
  - [ ] Validate file MIME type (whitelist: jpg, png, webp, gif)
  - [ ] Verify magic bytes (prevent PHP/executable uploads)
  - [ ] Generate secure filename (GUID + extension only)
  - [ ] Store outside web root
  - [ ] Serve files through controller (not direct access)
  - [ ] Validate text fields (title, description)
  - [ ] Check for injection patterns

### READ Operations
- [ ] Get Donation by ID (`GET /v1/in-kind-donations/{id}`)
  - [ ] Verify donor ownership (userId from token)
  - [ ] Return 403 if not owner (unless Admin)
  - [ ] Don't expose sensitive fields
  - [ ] Log access attempt

- [ ] Get Donations by Donor (`GET /v1/in-kind-donations/donor/{donorId}`)
  - [ ] Verify userId matches donorId (or is Admin)
  - [ ] Return 403 if unauthorized
  - [ ] Filter at database level: WHERE DonorId = @userId

- [ ] Get Emergency Case (`GET /v1/emergency-cases/{id}`)
  - [ ] Check if public/active before showing
  - [ ] Hide internal notes from non-admins
  - [ ] Don't expose beneficiary details

- [ ] Donor Dropdown Search (`GET /v1/in-kind-donations/donors/dropdown`)
  - [ ] Add [Authorize] attribute (specific roles only)
  - [ ] Validate search input (min 2 chars, max 100)
  - [ ] Rate limit: 5 requests/minute per user
  - [ ] Limit results: max 10 results
  - [ ] Return only name/id (not contact info)

### UPDATE Operations
- [ ] Update Donation (`PUT /v1/in-kind-donations/{id}`)
  - [ ] Check ownership (DonorId == userId or Admin)
  - [ ] Whitelist allowed fields (itemName, quantity, value, description)
  - [ ] Reject status, verifiedBy, collectedAmount updates
  - [ ] Backend sets UpdatedAt, UpdatedBy

- [ ] Update Staff (`PUT /v1/auth/staff/{id}`)
  - [ ] Only allow specific fields (phoneNumber, notes)
  - [ ] Require [Authorize(Roles = "Admin")]
  - [ ] NEVER allow role/status changes via this endpoint
  - [ ] Create separate endpoints for role/status changes

- [ ] Update Emergency Case (`PUT /v1/emergency-cases/{id}`)
  - [ ] Only Admin can update
  - [ ] Verify IsCompleted: collectedAmount >= targetAmount
  - [ ] Don't allow arbitrary status changes

### DELETE Operations
- [ ] Delete Donation (`DELETE /v1/in-kind-donations/{id}`)
  - [ ] Check ownership
  - [ ] Prevent deletion of verified donations
  - [ ] Use soft delete (set IsDeleted=true, DeletedAt, DeletedBy)
  - [ ] Log deletion with amount and timestamp

- [ ] Delete Staff (`DELETE /v1/auth/staff/{id}`)
  - [ ] Check for dependent records first
  - [ ] Return error if records exist
  - [ ] Don't cascade delete related records
  - [ ] Use soft delete

- [ ] Bulk Delete (`POST /v1/donors/bulk-delete`)
  - [ ] Require SuperAdmin role
  - [ ] Limit to 100 records per request
  - [ ] Check for dependent records
  - [ ] Use transaction (all-or-nothing)
  - [ ] Audit log with record count

---

## HIGH Priority (🟡 HIGH - Fix This Sprint)

### CORS & CSRF Protection
- [ ] Remove `AllowAnyOrigin()` if using credentials
- [ ] Add specific origin whitelist
- [ ] Require CSRF tokens for state-changing operations
- [ ] Validate Origin header on requests

### Rate Limiting
- [ ] Add [EnableRateLimiting] to auth endpoints
- [ ] Limit: 5 attempts per 15 minutes per IP
- [ ] Limit bulk operations: 5 requests per hour
- [ ] Limit search: 10 requests per minute

### Error Handling
- [ ] Don't leak database structure in error messages
- [ ] Don't expose system paths
- [ ] Log all 4xx errors for monitoring
- [ ] Return generic "Unauthorized" (not specific reason)

### API Response Fields
- [ ] Never return PasswordHash
- [ ] Never return RefreshToken (keep in httpOnly cookie)
- [ ] Never return internal IDs (unless necessary)
- [ ] Never return audit fields (CreatedBy, UpdatedBy) to non-admins

---

## MEDIUM Priority (🟢 MEDIUM - Next Quarter)

### Token Security
- [ ] Move accessToken to memory-only storage
- [ ] Move refreshToken to httpOnly, Secure, SameSite cookie
- [ ] Implement token rotation
- [ ] Add token blacklist on logout

### Database Security
- [ ] Use parameterized queries everywhere
- [ ] Add database-level audit triggers
- [ ] Implement row-level security (RLS)
- [ ] Add database encryption at rest

### Monitoring
- [ ] Alert on repeated 403 errors (IDOR attempt)
- [ ] Alert on bulk operations
- [ ] Alert on searches with empty query
- [ ] Monitor file uploads for suspicious patterns

---

## Implementation Order

**Week 1: Critical CREATE/READ**
1. Add validation to Create operations
2. Strip unauthorized fields
3. Add ownership checks to Read operations
4. Implement IDOR prevention

**Week 2: Critical UPDATE/DELETE**
1. Whitelist allowed fields in Update
2. Add ownership checks to Update
3. Add ownership checks to Delete
4. Implement soft deletes

**Week 3: Security Hardening**
1. Add file upload validation
2. Add CORS hardening
3. Add rate limiting
4. Implement audit logging

**Week 4: Monitoring & Testing**
1. Set up audit log monitoring
2. Penetration testing of CRUD endpoints
3. Automated security tests
4. Documentation

---

## Code Templates Ready to Copy

### Frontend Validation Template
```typescript
// Validate and sanitize input
const sanitized = {
  fieldName: payload.fieldName?.trim() || '',
  // Strip unauthorized fields
};

// Validate each field
if (!sanitized.fieldName?.trim()) throw new Error('Field required');

// Check for injection
if (/<[^>]*>|javascript:/gi.test(sanitized.fieldName)) {
  throw new Error('Invalid characters');
}

// Make request with token in header (Authorization: Bearer)
```

### Backend Authorization Template
```csharp
// Extract user ID from JWT token (NOT request body)
var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

// Verify ownership
if (resource.OwnerId != userId && userRole != "Admin") {
  return Forbid();
}

// Update only whitelisted fields
resource.FieldName = request.FieldName;

// Backend sets these
resource.UpdatedAt = DateTime.UtcNow;
resource.UpdatedBy = userId;
```

### Audit Log Template
```csharp
_auditLogger.LogAction("ACTION_NAME", userId, new {
    resourceId = id,
    details = "what changed",
    timestamp = DateTime.UtcNow
});
```

---

## Testing Checklist

### Manual Testing
- [ ] Try to access other user's data → should get 403
- [ ] Try to enumerate IDs (1, 2, 3...) → should get 403 or empty
- [ ] Try to upload .exe file → should be rejected
- [ ] Try to modify role field → should be rejected
- [ ] Try to delete verified record → should be rejected
- [ ] Try bulk delete with 1000 IDs → should be limited

### Automated Testing
```csharp
[TestMethod]
public async Task UpdateDonation_WithWrongOwner_ReturnsForbidden()
{
    // Arrange: User1 token
    var donation = await CreateDonationForUser1();
    
    // Act: Try update with User2 token
    var result = await UpdateDonationAsUser2(donation.Id);
    
    // Assert: Should be Forbidden
    Assert.AreEqual(403, result.StatusCode);
}

[TestMethod]
public async Task CreateStaff_WithAdminField_IsIgnored()
{
    // Arrange: Request with isAdmin=true
    var request = new { username = "test", isAdmin = true };
    
    // Act: Create staff
    var result = await CreateStaff(request);
    var staff = await GetStaff(result.Id);
    
    // Assert: isAdmin should be false (default)
    Assert.IsFalse(staff.IsAdmin);
}

[TestMethod]
public async Task UploadFile_WithExeFile_IsRejected()
{
    // Arrange: .exe file
    var file = new FormFile(..., "shell.exe");
    
    // Act: Upload
    var result = await UploadFile(file);
    
    // Assert: Should return 400
    Assert.AreEqual(400, result.StatusCode);
}
```

---

## Documentation Required

After implementation:
- [ ] Update API documentation with authorization requirements
- [ ] Document ownership models (who can modify what)
- [ ] Document soft delete behavior
- [ ] Document audit log fields
- [ ] Update security.md with CRUD protection details
- [ ] Create runbook for incident response (data breach)

---

## Verification

Before going to production, verify:
- [ ] All 14 vulnerabilities addressed
- [ ] All code changes reviewed by security team
- [ ] Automated security tests passing
- [ ] Manual penetration testing completed
- [ ] Audit logging implemented and tested
- [ ] Monitoring alerts configured
- [ ] Team trained on security requirements
- [ ] Incident response plan documented
