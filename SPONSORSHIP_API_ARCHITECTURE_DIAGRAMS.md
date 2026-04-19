# Sponsorship API Management System - Architecture & Diagrams

## 🏗️ System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│           Sponsorship Management UI Components               │
│        (SponsorshipManagementAPI.tsx, Forms, Lists)          │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
    ┌───▼────────┐         ┌────────▼──────┐
    │ Sponsorship│         │ Emergency     │
    │ Operations │         │ Cases Ops     │
    └───┬────────┘         └────────┬──────┘
        │                           │
    ┌───▼────────────────────────────▼──┐
    │  React Query Hooks Layer           │
    │  (useSponsorships, useEmergency)   │
    │                                    │
    │  • useQuery (Read)                 │
    │  • useMutation (Write)             │
    │  • Cache Management                │
    └───┬─────────────────────────────────┘
        │
    ┌───▼────────────────────────────────┐
    │  API Service Layer                 │
    │  (sponsorshipApi, emergencyApi)    │
    │                                    │
    │  • getAll()  ─────→ GET            │
    │  • getById() ─────→ GET/{id}       │
    │  • create() ──────→ POST           │
    │  • update() ──────→ PUT/{id}       │
    │  • delete() ──────→ DELETE/{id}    │
    │                                    │
    │  + Data Transformation             │
    │    (URL normalization,             │
    │     Type conversion)               │
    └───┬────────────────────────────────┘
        │
    ┌───▼─────────────────┐
    │  Axios Instance     │
    │  (HTTP Client)      │
    │                     │
    │  • Bearer Token     │
    │  • Interceptors     │
    │  • Error Handling   │
    └───┬─────────────────┘
        │
    ┌───▼─────────────────────────┐
    │   Backend API Server        │
    │                             │
    │  /v1/sponsorships           │
    │  /v1/emergency-cases        │
    └─────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
App
└── SponsorshipManagementAPI
    ├── useSponsorships()           [Query - List all]
    ├── useSponsorship(id)          [Query - Single]
    ├── useCreateSponsorship()      [Mutation]
    ├── useUpdateSponsorship()      [Mutation + Optimistic]
    ├── useDeleteSponsorship()      [Mutation]
    │
    ├── useEmergencyCases()         [Query - List all]
    ├── useEmergencyCase(id)        [Query - Single]
    ├── useCreateEmergencyCase()    [Mutation]
    ├── useUpdateEmergencyCase()    [Mutation + Optimistic]
    └── useDeleteEmergencyCase()    [Mutation]
        │
        ├── ChooseTypeModal
        │   ├── Regular Sponsorship Option
        │   └── Urgent Case Option
        │
        ├── CaseFormModal (Add/Edit)
        │   ├── Title input
        │   ├── Description textarea
        │   ├── Target Amount input
        │   ├── Collected Amount input
        │   ├── Image upload
        │   ├── Icon upload
        │   ├── Status toggle
        │   └── Form actions
        │
        ├── DeleteConfirmModal
        │   ├── Confirmation message
        │   ├── Case details
        │   └── Cancel/Delete buttons
        │
        ├── RegularSponsorshipList
        │   └── SponsorshipCard × n
        │
        └── UrgentCasesList
            └── CaseCard × n
```

---

## 🔄 Data Flow: Creating a Sponsorship

```
┌────────────────────────┐
│  User Interaction      │
│  (Fill form + Submit)  │
└────────────┬───────────┘
             │
    ┌────────▼─────────────┐
    │  Form Validation     │
    │  validateForm()      │
    │                      │
    │  ✓ name required     │
    │  ✓ desc required     │
    │  ✓ amount > 0        │
    │  ✓ image < 5MB       │
    │  ✓ icon SVG < 2MB    │
    └────────┬─────────────┘
             │
      ┌──────▼─────────┐
      │ Valid?         │
      └──┬─────────────┘
         │
    ┌────┴──────┐
    │            │
    NO         YES
    │            │
    │        ┌──▼──────────────────┐
    │        │ mutation.mutate()   │
    │        │ (Send payload)      │
    │        └────┬────────────────┘
    │             │
    │         ┌───▼──────────────────────┐
    │         │ useCreateSponsorship()   │
    │         │ React Query Mutation     │
    │         └────┬────────────────────┘
    │              │
    │          ┌───▼──────────────────┐
    │          │ sponsorshipApi       │
    │          │ .create(payload)     │
    │          └────┬─────────────────┘
    │               │
    │         ┌─────▼──────────────┐
    │         │ Format Payload:    │
    │         │ • Name            │
    │         │ • Description     │
    │         │ • TargetAmount    │
    │         │ • ImageUrl        │
    │         │ • Icon            │
    │         └─────┬──────────────┘
    │               │
    │         ┌─────▼──────────────┐
    │         │ API POST Request:  │
    │         │ /v1/sponsorships   │
    │         └─────┬──────────────┘
    │               │
    │         ┌─────▼───────────────────┐
    │         │ Backend Processing:     │
    │         │ • Validate data         │
    │         │ • Save to database      │
    │         │ • Return created record │
    │         └─────┬───────────────────┘
    │               │
    │         ┌─────▼───────────────────┐
    │         │ Transform Response:     │
    │         │ toUiSponsorshipProgram()│
    │         │ (URLs, types, etc.)     │
    │         └─────┬───────────────────┘
    │               │
    │         ┌─────▼──────────────────┐
    │         │ onSuccess Handler:     │
    │         │ • Invalidate cache     │
    │         │ • Refetch list         │
    │         │ • Show success toast   │
    │         │ • Close modal          │
    │         └──────────────────────┘
    │
    └────────────────────→ [Show Error Toast]
```

---

## 🔄 Data Flow: Updating a Sponsorship (Optimistic Update)

```
┌────────────────────────┐
│  User Clicks Edit      │
│  Changes Fields        │
│  Clicks Save           │
└────────────┬───────────┘
             │
    ┌────────▼─────────────┐
    │  Form Validation     │
    └────────┬─────────────┘
             │
         ┌───▼──────────────────────────┐
         │ mutation.mutate({id, data})  │
         └────┬────────────────────────┘
              │
         ┌────▼──────────────────────┐
         │ useUpdateSponsorship()    │
         │ onMutate() executes:      │
         │                           │
         │ 1. Cancel pending queries │
         │ 2. Snapshot old data      │
         │ 3. Update cache           │
         │    IMMEDIATELY!           │
         │ 4. Return snapshot        │
         └────┬────────────────────────┘
              │
         ┌────▼──────────────────────┐
         │ UI Updates Right Away!    │
         │ • List shows new data     │
         │ • Details update          │
         │ • No spinner shown        │
         └────┬────────────────────────┘
              │
              │ (API call happens in background)
              │
         ┌────▼─────────────────────┐
         │ API PUT Request Sent:     │
         │ /v1/sponsorships/{id}     │
         │ Payload: changed fields   │
         └────┬────────────────────────┘
              │
         ┌────▼─────────────────────┐
         │ Backend Response Arrives  │
         └────┬────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
    Success          Error
      │                │
  ┌───▼──────┐   ┌────▼──────────────┐
  │ onSuccess:│   │ onError:         │
  │           │   │                  │
  │ • Toast   │   │ • Rollback cache │
  │ • Confirm │   │ • Show error msg │
  │   update  │   │ • Retry option   │
  └───────────┘   └──────────────────┘
```

---

## 📋 API Call Sequence Diagram

```
Component                Hook                Service              API
   │                      │                      │                 │
   ├─ mutation.mutate() ──>                      │                 │
   │                      ├─ onMutate() ──>      │                 │
   │                      │  (snapshot data)     │                 │
   │                      ├─ mutationFn() ──────>│                 │
   │                      │                      ├─ POST/PUT/DEL ─>│
   │                      │                      │                 │
   │                      │                      │              [Process]
   │                      │                      │<──── Response ───┤
   │                      │<──── transform ──────┤                 │
   │                      │                      │                 │
   │<──── onSuccess ─────┤                      │                 │
   │  (invalidate cache) │                      │                 │
   │  (show toast)       │                      │                 │
   │                      │                      │                 │

[ERROR Path]
   │                      │                      │                 │
   │                      │<──── onError ────────┤<──── Error ─────┤
   │                      │  (rollback cache)    │                 │
   │<──── Show Error ────┤  (show toast)        │                 │
   │                      │                      │                 │
```

---

## 💾 Cache Management Strategy

```
┌─────────────────────────────────────────┐
│  React Query Cache Structure            │
├─────────────────────────────────────────┤
│                                         │
│  ['sponsorships']                       │ ← Root key
│         │                               │
│         ├─ ['sponsorships', 'list']     │ ← List cache
│         │   └─ SponsorshipProgram[]    │
│         │       ├─ Program 1           │
│         │       ├─ Program 2           │
│         │       └─ Program N           │
│         │                               │
│         ├─ ['sponsorships', 'detail']   │
│         │   │                           │
│         │   ├─ [..., detail, 1]         │ ← Detail cache
│         │   │   └─ SponsorshipProgram  │
│         │   │                           │
│         │   └─ [..., detail, N]         │
│         │       └─ SponsorshipProgram  │
│         │                               │
│  ['emergency-cases']                    │ ← Root key
│         │                               │
│         ├─ ['emergency-cases', 'list']  │ ← Emergency list
│         │   └─ EmergencyCase[]         │
│         │       ├─ Case 1              │
│         │       └─ Case N              │
│         │                               │
│         └─ ['emergency-cases','detail'] │ ← Emergency detail
│             └─ [..., detail, id]       │
│                 └─ EmergencyCase      │
│                                         │
└─────────────────────────────────────────┘

Cache Stale Time: 5 minutes
After 5 min → Marked as stale
On window focus → Auto-refetch if stale
On reconnect → Auto-refetch if stale
```

---

## 🔐 Authentication Flow

```
Component / Service
       │
       ├─ Check: tokenManager.getAccessToken()
       │
       ├─ If exists:
       │  └─ Add header: Authorization: Bearer {token}
       │
       ├─ Make API Request (with header)
       │
       └─ Response:
          ├─ 200 OK: Process data
          ├─ 401 Unauthorized: Refresh token / Redirect login
          └─ Other errors: Show error toast
```

---

## 📊 Data Transformation Pipeline

```
Backend API Response
       │
       ├─ Raw JSON (PascalCase fields)
       │  {
       │    "id": 1,
       │    "Name": "Program Name",
       │    "Description": "...",
       │    "TargetAmount": "50000",
       │    "CollectedAmount": "12000",
       │    "ImageUrl": "/media/image.jpg",
       │    "Icon": "icon-key"
       │  }
       │
       ├─ unwrapData() function
       │  └─ Extracts 'data' field if wrapped
       │
       ├─ toUiSponsorshipProgram() transformation
       │  └─ Maps & normalizes fields:
       │     • name (PascalCase → camelCase)
       │     • description
       │     • targetAmount (string → number)
       │     • collectedAmount (string → number)
       │     • imageUrl (relative → absolute)
       │     • icon (passes through)
       │
       ├─ Normalized Data
       │  {
       │    "id": 1,
       │    "name": "Program Name",
       │    "description": "...",
       │    "targetAmount": 50000,
       │    "collectedAmount": 12000,
       │    "imageUrl": "https://api.example.com/media/image.jpg",
       │    "icon": "icon-key",
       │    "isActive": true,
       │    "createdAt": "2026-04-19T10:30:00Z"
       │  }
       │
       └─ React Component
          └─ Receives clean, typed data
             ready for display
```

---

## 🎨 Modal State Management

```
SponsorshipManagementAPI Component State
│
├─ modalStep: ModalStep
│  ├─ null (closed)
│  ├─ "choose-type" (pick regular/urgent)
│  ├─ "add-regular" (create sponsorship)
│  ├─ "add-urgent" (create emergency)
│  ├─ "edit-regular" (edit sponsorship)
│  ├─ "edit-urgent" (edit emergency)
│  ├─ "delete-regular" (confirm delete sponsorship)
│  └─ "delete-urgent" (confirm delete emergency)
│
├─ selectedItem: SponsorshipProgram | EmergencyCase | null
│  └─ Used for edit/delete operations
│
├─ filters
│  ├─ searchTerm
│  ├─ type (regular/urgent)
│  └─ status (active/inactive)
│
└─ sortBy (date/name/amount)

Modal Lifecycle:
   [Closed]
       ↓ user clicks Add
   [Choose Type]
       ↓ user selects type
   [Add Form Modal]
       ├─ user fills form
       └─ submits → mutation → onSuccess
           └─ [Back to Closed]
       
   [Closed]
       ↓ user clicks Edit
   [Edit Form Modal] (pre-filled)
       ├─ user modifies
       └─ submits → mutation → onSuccess
           └─ [Back to Closed]
```

---

## ⚠️ Error Handling Flow

```
API Call
    │
    ├─ Error occurs
    │
    ├─ getApiErrorMessage(error)
    │  ├─ Extract status code
    │  ├─ Extract message
    │  ├─ Translate to Arabic
    │  └─ Return user-friendly message
    │
    ├─ onError handler in mutation
    │  ├─ Show toast.error(message)
    │  ├─ (For update) Rollback cache
    │  └─ Log error (dev mode)
    │
    ├─ Component receives:
    │  ├─ error state
    │  ├─ isError = true
    │  └─ Can show retry button
    │
    └─ User can:
       ├─ Retry operation
       ├─ Try different data
       └─ Contact support

Error Messages Mapped:
   400 Bad Request → "البيانات غير صحيحة"
   401 Unauthorized → "غير مخول الوصول"
   403 Forbidden → "ليس لديك صلاحية"
   404 Not Found → "العنصر غير موجود"
   500 Server Error → "خطأ في الخادم"
   Network Error → "خطأ في الاتصال"
```

---

## 📈 Performance Optimization Visualization

```
┌──────────────────────────────────────────┐
│  Without Caching & Optimization          │
├──────────────────────────────────────────┤
│                                          │
│  Component A mounts → API Call (1s)      │
│  Component B mounts → API Call (1s)      │
│  Component C mounts → API Call (1s)      │
│  Component D mounts → API Call (1s)      │
│                                          │
│  Total time: 4+ seconds                  │
│  Requests: 4                             │
│  Server load: High                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  With React Query Caching                │
├──────────────────────────────────────────┤
│                                          │
│  Component A mounts → API Call (1s)      │
│                         ↓ [Cache]        │
│  Component B mounts → [Cache Hit] (0ms)  │
│  Component C mounts → [Cache Hit] (0ms)  │
│  Component D mounts → [Cache Hit] (0ms)  │
│                                          │
│  Total time: ~1 second                   │
│  Requests: 1 (3 saved)                   │
│  Server load: Reduced by 75%             │
└──────────────────────────────────────────┘

Optimistic Update Benefit:
   Without:
   │ User click → Spinner (waiting)
   │ API response → Data updates
   │ Perceived latency: Full API time
   
   With:
   │ User click → Data updates immediately
   │ API response (confirms) → No change visible
   │ Perceived latency: Instant!
```

---

## 🔗 Integration with Other Systems

```
┌─────────────────────────────────────────┐
│  Sponsorship API Management             │
├─────────────────────────────────────────┤
│                                         │
│  Provides:                              │
│  • Sponsorship programs data            │
│  • Emergency cases data                 │
│  • CRUD operations                      │
│                                         │
└─────────┬──────────────────────────────┘
          │
    ┌─────┴──────┬─────────────┬──────────┐
    │            │             │          │
    ▼            ▼             ▼          ▼
┌───────┐  ┌─────────┐  ┌──────────┐ ┌────────┐
│Donation│ │Dashboard│  │Analytics│ │Receipt │
│System  │  │System   │  │System    │ │System  │
└───────┘  └─────────┘  └──────────┘ └────────┘
    │            │             │          │
    └─────┬──────┴─────────────┴──────────┘
          │
    Uses sponsorship data:
    • Fetch list for donations
    • Update collected amounts
    • Track progress
    • Generate reports
```

---

**Architecture Diagrams Generated:** April 19, 2026
