# Urgent Cases System - Visual Architecture

## 🏗️ Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    UrgentCasesPage.tsx                       │
│                    (Main Container)                          │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─── useUrgentCases() ──────→ [Query: List all cases]
             │
             ├─── State Management:
             │    ├── isAddModalOpen
             │    ├── isEditModalOpen  
             │    ├── isDeleteModalOpen
             │    └── selectedCase
             │
             ├─────────────────────────────────┐
             │                                 │
    ┌────────▼────────┐    ┌────────────────▼──────────┐
    │ AddUrgentCase   │    │  EditUrgentCase Modal      │
    │ Modal.tsx       │    │  Modal.tsx                 │
    └────────┬────────┘    └────────────┬───────────────┘
             │                          │
        [Mutation]              [Mutation + Optimistic Update]
             │                          │
     useCreateUrgentCase()      useUpdateUrgentCase()
             │                          │
             ▼                          ▼
    urgentCasesService         urgentCasesService
    .create()                  .update()
             │                          │
             └──────────┬───────────────┘
                        │
             ┌──────────▼──────────┐
             │ DeleteUrgentCase    │
             │ Modal.tsx           │
             └──────────┬──────────┘
                        │
                   [Mutation]
                        │
              useDeleteUrgentCase()
                        │
                        ▼
              urgentCasesService
              .delete()
                        │
                        └─── [Invalidate Cache]
                             └─→ Data Refetch
                                 └─→ UI Update
```

## 🔄 Data Flow Diagram

```
                    ┌──────────────────────────┐
                    │   User Interaction       │
                    └────────────┬─────────────┘
                                 │
                  ┌──────────────┼──────────────┐
                  │              │              │
            ┌─────▼────┐   ┌────▼────┐   ┌────▼────┐
            │   Create  │   │ Update  │   │ Delete  │
            └─────┬────┘   └────┬────┘   └────┬────┘
                  │             │             │
      ┌───────────┴─────────────┼─────────────┴───────────┐
      │                         │                         │
      ▼                         ▼                         ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Validation  │         │ Validation  │         │ Confirmation│
│ Form Data   │         │ Form Data   │         │             │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
  ┌─────────────────────────────────────────────────────────┐
  │         React Query Mutation (useMutation)              │
  │                                                         │
  │  onMutate → onSuccess → onError                         │
  └──────────────────┬──────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  API Service Transform     │
        │  (careToBackendFormat)     │
        │  camelCase ↔ PascalCase    │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Backend API Call         │
        │  (Axios Instance)          │
        │                            │
        │  POST/PUT/DELETE           │
        │  /v1/emergency-cases       │
        └────────────┬───────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼────┐              ┌────▼────┐
    │ Success│              │  Error  │
    └───┬────┘              └────┬────┘
        │                        │
        ▼                        ▼
    ┌─────────────┐          ┌──────────────┐
    │ Invalidate  │          │ Show Toast   │
    │ Cache       │          │ Error Msg    │
    │             │          │              │
    │ Refetch     │          │ Rollback     │
    │ Data        │          │ (if update)  │
    └─────┬───────┘          └──────────────┘
          │
          ▼
    ┌────────────────┐
    │ Update UI      │
    │ Refresh List   │
    │ Close Modal    │
    │ Reset Form     │
    └────────────────┘
```

## 📦 State Management Flow

```
┌─────────────────────────────────────┐
│  Local Component State              │
│  (UrgentCasesPage.tsx)              │
│                                     │
│  • isAddModalOpen                   │
│  • isEditModalOpen                  │
│  • isDeleteModalOpen                │
│  • selectedCase                     │
└──────────────┬──────────────────────┘
               │
        ┌──────┴────────┐
        │               │
        ▼               ▼
   ┌─────────┐    ┌──────────────┐
   │ Modal   │    │  React Query │
   │ States  │    │  Cache       │
   │         │    │              │
   │ • Open/ │    │ • List Query │
   │   Close │    │ • Detail     │
   │ • Case  │    │   Queries    │
   │   Data  │    │              │
   │         │    │ • Mutations  │
   └─────────┘    │              │
                  │ • Optimistic │
                  │   Updates    │
                  └──────────────┘
```

## 🔌 Service Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│          Component Layer (React)                    │
│     (Modal, Page, Form Components)                  │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐  ┌────────▼───────┐
│  useUrgentCases│  │  useCreateCase │
│  (Hook Layer)  │  │  useUpdateCase │
│                │  │  useDeleteCase │
└───────┬────────┘  └────────┬───────┘
        │                    │
        └──────────┬─────────┘
                   │
        ┌──────────▼──────────┐
        │ React Query         │
        │ (Cache & Sync)      │
        │                     │
        │ • useQuery          │
        │ • useMutation       │
        │ • invalidateQueries │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────┐
        │ urgentCasesService      │
        │ (API Service Layer)     │
        │                         │
        │ • getAll()              │
        │ • getById()             │
        │ • create()              │
        │ • update()              │
        │ • delete()              │
        │                         │
        │ + Data Transformation   │
        │   (camelCase ↔ Pascal)  │
        └──────────┬──────────────┘
                   │
        ┌──────────▼──────────┐
        │ Axios Instance      │
        │ (HTTP Client)       │
        │                     │
        │ • Interceptors      │
        │ • Error Handling    │
        │ • Auth Headers      │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Backend API       │
        │ /v1/emergency-cases │
        │                     │
        │ • GET (list/one)    │
        │ • POST (create)     │
        │ • PUT (update)      │
        │ • DELETE (delete)   │
        └─────────────────────┘
```

## 📋 Form Field Validation Flow

```
┌──────────────────────────────────┐
│   User Input in Form Field       │
└────────────┬─────────────────────┘
             │
    ┌────────▼────────┐
    │ onChange Event  │
    │ Update State    │
    └────────┬────────┘
             │
    ┌────────▼────────────────┐
    │ Real-time Validation:   │
    │                         │
    │ ✓ Character Counter     │
    │ ✓ Format Check          │
    │ ✓ Range Check           │
    │ ✓ Dependency Check      │
    │                         │
    │ (Display visual feedback│
    │  Green ✓ / Red ✗)       │
    └────────┬────────────────┘
             │
    ┌────────▼─────────────────┐
    │ Form Submission:         │
    │                          │
    │ validateForm()           │
    │ ├─ Title: !empty, ≤200  │
    │ ├─ Description: !empty  │
    │ ├─ Target > 0           │
    │ ├─ Collected ≤ Target   │
    │ └─ Image: type/size ok  │
    │                          │
    │ Returns: boolean         │
    └────────┬──────────────────┘
             │
      ┌──────┴──────┐
      │ Valid       │ Invalid
      │             │
      ▼             ▼
    ┌──┐         ┌────────────┐
    │✓ │         │Show Error  │
    │  │         │Alert       │
    └──┘         │(Animated)  │
    Submit       └────────────┘
    to API       Focus field
```

## 🎨 Modal Lifecycle

```
┌─────────────────────────────────────┐
│  Modal Closed (isOpen = false)      │
└──────────────┬──────────────────────┘
               │
               ▼
        (User clicks button)
               │
        ┌──────▼──────┐
        │ isOpen=true │
        └──────┬──────┘
               │
    ┌──────────▼──────────────┐
    │   Modal Initialization  │
    │   (if Edit Modal)       │
    │                         │
    │   useEffect() triggers: │
    │   • Pre-fill form data  │
    │   • Set image preview   │
    │   • Clear errors        │
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────┐
    │   User Interaction  │
    │                     │
    │ • Edit form fields  │
    │ • Upload image      │
    │ • Validate input    │
    │ • Real-time feedback│
    └──────────┬──────────┘
               │
        ┌──────┴──────┐
        │             │
   ┌────▼────┐   ┌───▼──────┐
   │ Submit  │   │ Cancel   │
   └────┬────┘   └───┬──────┘
        │            │
    ┌───▼──────┐ ┌──▼────────┐
    │ Mutation │ │Close Modal │
    │ Triggers│ │Reset State │
    └───┬──────┘ └───────────┘
        │
    ┌───▼────────────┐
    │  Response:     │
    │ Success/Error  │
    └───┬────────────┘
        │
    ┌───▼──────────────┐
    │ onSuccess:       │
    │ • Invalidate     │
    │ • Show toast     │
    │ • Close modal    │
    │ • Refetch data   │
    └───────────────────┘
```

## 🖼️ Image Upload Pipeline

```
┌────────────────────────────────────┐
│   Image Upload Initiated           │
│  (Drag-drop or file input)         │
└────────────┬───────────────────────┘
             │
    ┌────────▼────────┐
    │ File Selected   │
    └────────┬────────┘
             │
    ┌────────▼──────────────┐
    │ Validation:           │
    │                       │
    │ ✓ Type check:         │
    │   JPG/PNG/WebP only   │
    │                       │
    │ ✓ Size check:         │
    │   Max 5MB             │
    │                       │
    │ ✓ Format check        │
    └────────┬──────────────┘
             │
      ┌──────┴──────┐
      │ Invalid     │ Valid
      │             │
      ▼             ▼
   ┌──────┐    ┌─────────────┐
   │Error │    │FileReader   │
   │Toast │    │.readAsData  │
   │      │    │ URL()       │
   └──────┘    └──────┬──────┘
                      │
               ┌──────▼──────┐
               │ Base64 Data │
               │ (preview)   │
               └──────┬──────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
    ┌───▼────┐              ┌───────▼────┐
    │Preview │              │Store File  │
    │Display │              │Object      │
    │(Img    │              │(for submit)│
    │tag)    │              └────────────┘
    └────────┘
        │
        │  (Form Submit)
        │
        ▼
    ┌──────────────┐
    │Send to API:  │
    │              │
    │• If File:    │
    │  → FormData  │
    │              │
    │• If Base64:  │
    │  → String    │
    │              │
    │• If URL:     │
    │  → String    │
    └──────────────┘
        │
        ▼
    Backend saves image
    Returns URL
        │
        ▼
    Store in component state
```

## 🔄 Optimistic Update Strategy (Edit)

```
┌──────────────────────────────────┐
│ User Submits Edit Form           │
└────────────┬─────────────────────┘
             │
    ┌────────▼─────────────────┐
    │ updateMutation.mutate()  │
    │ onMutate() runs:         │
    │ - Cancel pending queries │
    │ - Snapshot old data      │
    │ - Update cache           │
    │   IMMEDIATELY!           │
    └────────┬──────────────────┘
             │
        ┌────▼──────────────┐
        │ UI Updates Fast   │
        │ (No spinner wait) │
        └────┬──────────────┘
             │
        ┌────▼──────────────────────────┐
        │ API Call Happens in           │
        │ Background (mutationFn)       │
        └────┬───────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
  ┌───▼──┐     ┌───▼─────────┐
  │Success   │Error         │
  │          │              │
  │ onSuccess│ onError:     │
  │• Confirm │ Rollback to  │
  │  cache   │ snapshot     │
  │• Toast   │ Show Error   │
  │          │ Toast        │
  └──────────┴──────────────┘
```

## 📊 Query Key Hierarchy

```
┌─────────────────────────────────────────┐
│  Query Keys (for cache management)      │
├─────────────────────────────────────────┤
│                                         │
│  ['urgent-cases']                       │  ← Root key
│         │                               │
│         ├─ ['urgent-cases', 'list']     │  ← List queries
│         │    └─ Fetches all cases       │
│         │    └─ Updated by Create/Delete│
│         │                               │
│         └─ ['urgent-cases', 'detail']   │  ← Detail queries
│              │                          │
│              └─ [..., detail, {id}]     │  ← Single case
│                   └─ Updated by Update  │
│                   └─ Initial from list  │
│                                         │
└─────────────────────────────────────────┘

Cache Invalidation:
• Create  → invalidate('list')
• Update  → invalidate('list', 'detail/{id}')
• Delete  → invalidate('list')
```

---

## Key System Patterns

### Pattern 1: Service Layer Transformation
```
Backend Response (PascalCase)
    ↓
[transform via toUiUrgentCase()]
    ↓
Frontend State (camelCase)
    ↓
[display in components]
    ↓
User Submits Form
    ↓
[transform via service.create/update()]
    ↓
API Request (correct format for backend)
```

### Pattern 2: Mutation Lifecycle
```
[User Action]
    ↓
mutateAsync({payload})
    ↓
onMutate()  ← Optimistic update (update only)
    ↓
mutationFn() ← API call
    ↓
onSuccess() ← Invalidate & show toast
    ↓
onError()   ← Rollback & show error
```

### Pattern 3: Modal Control
```
[Component State]
    isOpen (boolean)
    ↓
selectedCase (data for edit/delete)
    ↓
[Modal Rendered if isOpen]
    ↓
[User submits]
    ↓
[Mutation runs]
    ↓
[onSuccess callback]
    ↓
[Close modal, reset state]
```

---

**Visual Architecture Generated:** 2026-04-19
