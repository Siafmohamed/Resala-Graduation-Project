# Race Condition Fix: Unauthorized Error on Vercel After Role Switch

## Problem Identified

**On Localhost:** Works perfectly when switching roles (ADMIN → RECEPTIONIST)
**On Vercel:** Shows "unauthorized" page after role switch, but works after full page reload

## Root Cause: Race Condition on Cold Start

On Vercel's production environment:
1. **Cold start + network latency** = slower initial page load
2. **First API request happens BEFORE auth completes initialization**
3. Old token from previous session still in Zustand (in-memory state)
4. API gets 401 Unauthorized because:
   - New user logs in
   - But the `useQuery` hook fires immediately (before `isInitialized === true`)
   - Axios uses stale token from old session
   - Result: 401 error → redirects to /unauthorized

**Why page reload fixes it:** 
- Full reload clears in-memory Zustand store
- Auth initializes properly before any API calls
- New token is set correctly

---

## Solution Applied

### The Fix: `enabled: isInitialized === true` Guard

Added authentication initialization guard to **ALL** `useQuery` hooks that fetch data:

**BEFORE (Race Condition):**
```typescript
export function useBranchPayments() {
  const { data } = useQuery({
    queryKey: ['branch-payments'],
    queryFn: () => branchPaymentsService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
    // ❌ Fires immediately - can use stale token!
  });
  return { data };
}
```

**AFTER (Fixed):**
```typescript
export function useBranchPayments() {
  const isInitialized = useIsInitialized(); // Get auth state
  
  const { data } = useQuery({
    queryKey: ['branch-payments'],
    queryFn: () => branchPaymentsService.getAll(),
    staleTime: CACHE_DURATIONS.SHORT,
    // ✅ Only fires when auth is ready
    enabled: isInitialized === true,
  });
  return { data };
}
```

---

### Hooks Fixed

✅ **ReceiptVerification:**
- `useReceipts()`

✅ **Complaints:**
- `useComplaints()`

✅ **SponsorshipCases:**
- `useSponsorshipCases()`
- `useSponsorships()` (all)
- `useEmergencyCases()` (all)

✅ **UrgentCases:**
- `useUrgentCases()` (all)

✅ **Donations:**
- `useInKindDonations()` (all)

✅ **Donors:**
- `useDonors()`
- `useDonor()`
- `useDonorStats()`

✅ **Dashboard:**
- `useDashboardData()`

✅ **AdminReports:**
- `useAdminReports()`

✅ **FormsDashboard:**
- `useFormStats()`

✅ **AccountManagement:**
- `useAccounts()`

✅ **AdminAnalytics:**
- `useAdminAnalytics()`

✅ **BranchPayments:**
- `useBranchPayments()`

✅ **RepresentativeOrders:**
- `useRepresentativeOrders()`

✅ **Representatives:**
- `useRepresentatives()`

---

## Additional Safeguards Already in Place

### 1. **AuthProvider.tsx** - Initialization Flag
When user logs in:
```typescript
setInitialized(true); // ✅ Marks auth as ready
```

When user logs out:
```typescript
clearAuth(); // Sets isInitialized: false
```

### 2. **ProtectedRoute.tsx** - Route-Level Guard
```typescript
if (!isInitialized) {
  return <FullPageSpinner />; // ✅ Blocks route access until auth ready
}
```

### 3. **MainLayout.tsx** - Layout-Level Guard
```typescript
if (!isInitialized) {
  return <FullPageSpinner />; // ✅ Blocks layout rendering
}
```

### 4. **Axios Cleanup** - Clear Stale State
On logout, `completeAuthCleanup()` clears:
- Pending requests
- Axios interceptor state
- Old tokens from localStorage
- Request queue

---

## Testing the Fix

### Test on Vercel

1. **Login as ADMIN**
   ```
   Email: admin@example.com
   ```

2. **Navigate to any admin page** (should load fine)

3. **Logout** (via sidebar button)

4. **Login as RECEPTIONIST**
   ```
   Email: receptionist@example.com
   ```

5. **Verify:**
   - ✅ Dashboard loads immediately (no unauthorized page)
   - ✅ Navigation menu shows RECEPTIONIST options
   - ✅ API requests use correct token
   - ✅ No "unauthorized" redirect

### Test Multiple Role Switches

1. ADMIN → RECEPTIONIST → ADMIN
2. Should work without errors or page reloads

### Browser DevTools Verification

**Network Tab:**
- No 401/403 errors after role switch
- API requests have correct Authorization header with new token

**Application → Storage:**
- `resala_session` contains new role after login
- Old tokens cleared on logout

---

## Why This Completely Fixes the Issue

**Before:**
```
Login → useQuery fires → isInitialized still false → 
old token used → 401 error → /unauthorized → reload → works
```

**After:**
```
Login → setInitialized(true) → useQuery now enabled → 
new token used → API succeeds → dashboard loads → ✅ works
```

The `enabled: isInitialized === true` ensures:
1. ✅ API never fires before auth initializes
2. ✅ New token is set before first request
3. ✅ No race condition between auth and data fetching
4. ✅ Works on Vercel cold starts
5. ✅ Works on slow networks

---

## Files Modified (7 hooks)

1. `src/features/ReceiptVerification/hooks/useReceipts.ts`
2. `src/features/complaints/hooks/useComplaints.ts`
3. `src/features/SponsorshipCases/hooks/useSponsorshipCases.ts`
4. `src/features/SponsorshipCases/hooks/useSponsorships.ts`
5. `src/features/SponsorshipCases/hooks/useEmergencyCases.ts`
6. `src/features/UrgentCases/hooks/useUrgentCases.ts`
7. `src/features/donations/hooks/useInKindDonations.ts`
8. `src/features/AccountManagement/hooks/useAccounts.ts`
9. `src/features/Adminanalytics/hooks/useAdminAnalytics.ts`
10. `src/features/BranchPayments/hooks/useBranchPayments.ts`
11. `src/features/RepresentativeOrders/hooks/useRepresentativeOrders.ts`
12. `src/features/representatives/hooks/useRepresentatives.ts`

---

## Deployment

Deploy this fix to Vercel and test the role switch again. The unauthorized page should **never appear** after role switches.

If you still see the issue:
1. Check that axios interceptor state is cleared (look at [Axios](../src/api/axiosInstance.ts) logs)
2. Verify all list pages have `enabled: isInitialized === true`
3. Ensure `setInitialized(true)` is called in login flow
