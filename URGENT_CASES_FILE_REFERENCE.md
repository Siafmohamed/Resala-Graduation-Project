# Urgent Cases - Quick File Reference

## 📄 File-by-File Breakdown

### **Core Type Definitions**

#### `src/features/UrgentCases/types/urgent-case.types.ts`
```typescript
// Interfaces for data models
✓ UrgentCase              // Main data model
✓ CreateUrgentCasePayload // POST request payload
✓ UpdateUrgentCasePayload // PUT request payload
✓ UrgentCaseFormValues    // Form state interface

Key Properties:
- id: number
- title: string (max 200 chars)
- description: string (max 500 chars)
- imageUrl?: string
- targetAmount: number (must be > 0)
- collectedAmount: number (must be <= target)
- urgencyLevel: UrgencyLevel enum (1-3)
- isActive: boolean
- createdOn?: string
- createdAt?: string
```

#### `src/features/UrgentCases/types/urgency-level.types.ts`
```typescript
// Urgency level definitions
✓ UrgencyLevel (enum)
  - Normal = 1
  - Urgent = 2
  - Critical = 3

✓ UrgencyLevelType (type)
✓ urgencyLevelLabels (Record) - Arabic labels
✓ urgencyLevelLabelsEn (Record) - English labels
✓ urgencyLevelStyles (Record) - Tailwind classes
✓ getUrgencyLevelLabel(level) - Returns Arabic text
✓ getUrgencyLevelLabelEn(level) - Returns English text
✓ getAllUrgencyLevels() - Returns array of {value, label}

Usage:
const label = getUrgencyLevelLabel(UrgencyLevel.Critical);
// Returns: 'حرج جداً'
```

---

### **API Service Layer**

#### `src/api/services/urgentCasesService.ts`
**Purpose:** Main API communication service

```typescript
// Interfaces
✓ ApiResponse<T>              // API response wrapper
✓ UrgentCase                  // Data model
✓ CreateUrgentCasePayload     // Create payload
✓ UpdateUrgentCasePayload     // Update payload

// Helper Functions
✓ unwrapData<T>(response)     // Extract data from wrapper
✓ toUiUrgentCase(item)        // Transform backend → frontend

// Main Export: urgentCasesService object
✓ getAll()                    // GET /v1/emergency-cases
✓ getById(id)                 // GET /v1/emergency-cases/{id}
✓ create(payload)             // POST /v1/emergency-cases
✓ update(id, payload)         // PUT /v1/emergency-cases/{id}
✓ delete(id)                  // DELETE /v1/emergency-cases/{id}

Key Feature:
- Automatic data transformation (PascalCase ↔ camelCase)
- Error handling with unwrapData()
- Type-safe responses
```

#### `src/features/UrgentCases/services/urgentCasesService.ts`
```typescript
// Re-exports from API service
✓ export { urgentCasesService }
✓ export type { ApiResponse, UrgentCase, ... }

Usage Location: Hooks and components import from here
```

---

### **React Hooks (Data Management)**

#### `src/features/UrgentCases/hooks/useUrgentCases.ts`
**Purpose:** All React Query hooks for urgent cases

```typescript
// Query Hooks
✓ useUrgentCases()            // Fetch all cases
  Return: useQuery<UrgentCase[]>
  Cache: 5 minutes
  Key: ['urgent-cases', 'list']

✓ useUrgentCase(id)           // Fetch single case
  Return: useQuery<UrgentCase>
  Key: ['urgent-cases', 'detail', id]

// Mutation Hooks
✓ useCreateUrgentCase()       // Create new case
  Payload: CreateUrgentCasePayload
  Returns: useMutation
  onSuccess: Invalidate list cache

✓ useUpdateUrgentCase()       // Update existing case
  Payload: {id, payload}
  Features:
    - Optimistic update
    - onMutate snapshot
    - onError rollback
    - Invalidates both list & detail

✓ useDeleteUrgentCase()       // Delete case
  Payload: number (id)
  Returns: useMutation
  onSuccess: Invalidate list cache

// Query Key Management
✓ urgentCaseQueryKeys (object)
  - all: base key
  - lists(): for list queries
  - details(): for detail queries
  - detail(id): for specific item

// Error Handling
All mutations include:
  - onSuccess: toast.success(message)
  - onError: toast.error(getApiErrorMessage())
```

**Usage Example:**
```typescript
// In component:
const { data, isLoading } = useUrgentCases();
const createMutation = useCreateUrgentCase();

const handleCreate = async (payload) => {
  try {
    await createMutation.mutateAsync(payload);
  } catch (error) {
    // Error handled in hook
  }
};
```

---

### **UI Components**

#### `src/features/UrgentCases/components/UrgentCasesPage.tsx`
**Purpose:** Main page container

```typescript
// State
✓ data, isLoading, isError     (from useUrgentCases)
✓ isAddModalOpen               (local state)
✓ isEditModalOpen              (local state)
✓ isDeleteModalOpen            (local state)
✓ selectedCase                 (UrgentCase | null)

// Event Handlers
✓ handleEdit(case)             → Set selected, open edit modal
✓ handleDelete(case)           → Set selected, open delete modal
✓ handleSuccess()              → Refetch data

// Renders
✓ Header with title & add button
✓ Loading state
✓ Error state
✓ Empty state
✓ AddUrgentCaseModal
✓ EditUrgentCaseModal
✓ DeleteUrgentCaseModal
✓ UrgentCasesList (or similar)

Layout:
- Bilingual: dir="rtl" for RTL
- Responsive: flex gap spacing
- Gradient button with icon
- Card-based design
```

---

### **Modal Components (Forms)**

#### `src/features/UrgentCases/components/urgent-forms/AddUrgentCaseModal.tsx`
**Purpose:** Create new urgent case form modal

```typescript
// Props
interface AddUrgentCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// State
✓ title, description, targetAmount, collectedAmount
✓ urgencyLevel, isActive
✓ imageFile, imagePreview
✓ draggingImg, error

// Validation
✓ validateForm()               // Multi-field validation
✓ validateImageFile(file)      // Image type & size check

// Image Handling
✓ handleImageSelect(file)      // Process file
✓ handleImageDrop(e)           // Drag-drop handler

// Form Submit
✓ handleSubmit()               // Validate → Mutate → Close

// Display Elements
Header:
  - Icon: Plus (24px)
  - Title: "إضافة حالة عاجلة جديدة"
  - Subtitle: Description
  - Close button

Form Grid (2 columns desktop, 1 mobile):
Left Column:
  - Title field (200 char limit, counter)
  - Target Amount (with currency)
  - Collected Amount (with percentage)
  - Urgency Level selector

Right Column:
  - Description (500 char limit, counter)
  - Image upload (drag-drop zone)

Footer:
  - Cancel button
  - Submit button (with loading state)

Error Display:
  - Alert box with animation
  - Red background with icon
  - Detailed error message (Arabic)

Validations Shown:
  - ✓ Green checkmark if valid
  - ✗ Red X if invalid
  - Character counters
  - Progress percentage
```

---

#### `src/features/UrgentCases/components/urgent-forms/EditUrgentCaseModal.tsx`
**Purpose:** Edit existing urgent case modal

```typescript
// Props
interface EditUrgentCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  case: UrgentCase | null;          // The case to edit
  onSuccess?: () => void;
}

// Initialization
useEffect(() => {
  if (isOpen && caseData) {
    // Pre-fill all form fields from case data
    // Set image preview from imageUrl
    // Clear errors
  }
}, [isOpen, caseData]);

// Form Submission
✓ handleSubmit()               // Similar to Add, but with ID

// Key Differences from Add:
✓ Color scheme: Blue-Cyan gradient (vs Red-Orange)
✓ Icon: Edit (vs Plus)
✓ Pre-filled data: Loads from case prop
✓ Same validations
✓ Same display layout

// All other properties same as AddUrgentCaseModal
```

---

#### `src/features/UrgentCases/components/urgent-forms/DeleteUrgentCaseModal.tsx`
**Purpose:** Delete confirmation modal

```typescript
// Props
interface DeleteUrgentCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  case: UrgentCase | null;
  onSuccess?: () => void;
}

// State
✓ isDeleting (from deleteMutation.isPending)

// Handler
✓ handleDelete()               // Confirm deletion

// Display Elements
Header:
  - Icon: AlertTriangle (red background)
  - Title: "حذف الحالة العاجلة"
  - Subtitle: "هذا الإجراء لا يمكن التراجع عنه"

Content:
  - Confirmation text
  - Case details box:
    • العنوان: {title}
    • المبلغ: {targetAmount} جنيه
  - Warning banner:
    "⚠️ سيتم حذف جميع البيانات المرتبطة..."

Footer:
  - Cancel button
  - Delete button (red, shows spinner while loading)

States:
  - Normal: "تأكيد الحذف"
  - Loading: "جاري الحذف..." (with spinner)
  - Disabled while deleting
```

---

### **Sub-Components for Forms**

#### `src/features/UrgentCases/components/urgent-forms/UrgencyLevelSelector.tsx`
```typescript
// Props
interface Props {
  value: UrgencyLevel;
  onChange: (level: UrgencyLevel) => void;
}

// Renders dropdown/selector for urgency levels
// Options: Normal (1), Urgent (2), Critical (3)
// Uses urgencyLevelLabels for display
```

#### `src/features/UrgentCases/components/urgent-forms/StatusToggle.tsx`
```typescript
// Toggle component for isActive status
// Typically in form header
```

#### `src/features/UrgentCases/components/urgent-forms/TargetAmountField.tsx`
```typescript
// Reusable target amount input field
// With currency formatting
// Character count display
```

#### `src/features/UrgentCases/components/urgent-forms/DeadlineField.tsx`
```typescript
// Deadline/date picker field
// If used for urgent cases
```

---

### **List View Components**

#### `src/features/UrgentCases/components/urgent-list/`

| File | Purpose | Status |
|------|---------|--------|
| `UrgentCasesList.tsx` | Main list container | Empty (not implemented) |
| `UrgentCaseRow.tsx` | Individual case row | Empty (not implemented) |
| `UrgentCaseFilters.tsx` | Filter controls | Exists |
| `UrgentCaseSearchBar.tsx` | Search functionality | Exists |
| `UrgentCasePagination.tsx` | Pagination controls | Exists |
| `UrgencyLevelBadge.tsx` | Status badge display | Exists |

---

### **Detail View Components**

#### `src/features/UrgentCases/components/urgent-details/`

| File | Purpose | Status |
|------|---------|--------|
| `UrgentCaseDetailModal.tsx` | Full case details | Empty |
| `UrgentCaseInfoCard.tsx` | Case info display | Exists |
| `FundingProgressCard.tsx` | Funding progress | Exists |
| `DonationHistory.tsx` | Donation list | Exists |

---

### **Progress Components**

#### `src/features/UrgentCases/components/progress/`

| File | Purpose |
|------|---------|
| `FundingProgress.tsx` | Progress bar/chart |
| `DonationStats.tsx` | Statistics display |
| `DonorsList.tsx` | List of donors |
| `TimeRemaining.tsx` | Countdown display |

---

### **State Management (Redux)**

#### `src/features/UrgentCases/store/urgentCaseSlice.ts`
**Status:** Empty (not currently used)

Note: The system uses React Query instead of Redux for state management.

---

### **Export Index**

#### `src/features/UrgentCases/index.ts`
```typescript
// Exports services
export { urgentCasesService } from './services/urgentCasesService';

// Exports types
export type {
  ApiResponse,
  UrgentCase,
  CreateUrgentCasePayload,
  UpdateUrgentCasePayload,
} from './services/urgentCasesService';
```

---

## 🔗 Import Paths Summary

### From API Layer:
```typescript
import { urgentCasesService } from '@/api/services/urgentCasesService';
import type { ApiResponse, CreateUrgentCasePayload } 
  from '@/api/services/urgentCasesService';
```

### From Feature Layer:
```typescript
import { urgentCasesService } from '@/features/UrgentCases/services/urgentCasesService';
import { useUrgentCases, useCreateUrgentCase, ... } 
  from '@/features/UrgentCases/hooks/useUrgentCases';
import { UrgencyLevel, getUrgencyLevelLabel } 
  from '@/features/UrgentCases/types/urgency-level.types';
import type { UrgentCase, CreateUrgentCasePayload } 
  from '@/features/UrgentCases/types/urgent-case.types';
```

---

## 🎯 Data Flow Summary

### Creating a Case:
1. User fills **AddUrgentCaseModal**
2. Calls `validateForm()` and `validateImageFile()`
3. Calls `createMutation.mutateAsync(payload)`
4. **useCreateUrgentCase()** processes mutation
5. **urgentCasesService.create()** transforms data
6. API POST to `/v1/emergency-cases`
7. onSuccess: Invalidate cache → Refetch → Toast
8. Modal closes, form resets

### Updating a Case:
1. User clicks Edit → **EditUrgentCaseModal** opens
2. **useEffect** pre-fills form from selectedCase
3. User modifies fields
4. Calls `updateMutation.mutateAsync({id, payload})`
5. **useUpdateUrgentCase()** processes:
   - **onMutate**: Updates cache immediately (optimistic)
   - **mutationFn**: Makes API call
   - **onSuccess/onError**: Handles response
6. API PUT to `/v1/emergency-cases/{id}`
7. onSuccess: Confirm cache update + Toast
8. onError: Rollback cache + Toast
9. Modal closes

### Deleting a Case:
1. User clicks Delete → **DeleteUrgentCaseModal** opens
2. Shows confirmation with case details
3. User clicks "Confirm Delete"
4. Calls `deleteMutation.mutateAsync(id)`
5. **useDeleteUrgentCase()** processes mutation
6. API DELETE to `/v1/emergency-cases/{id}`
7. onSuccess: Invalidate list → Refetch → Toast
8. Modal closes, case removed from list

---

## 📊 Component Dependencies

```
UrgentCasesPage
├── useUrgentCases()
├── AddUrgentCaseModal
│   ├── useCreateUrgentCase()
│   ├── UrgencyLevelSelector
│   ├── Image upload handling
│   └── Form validation
├── EditUrgentCaseModal
│   ├── useUpdateUrgentCase()
│   ├── UrgencyLevelSelector
│   └── Form validation
└── DeleteUrgentCaseModal
    └── useDeleteUrgentCase()
```

---

## 🔐 Type Safety

All components and services use TypeScript interfaces:
- ✓ `UrgentCase` - Data model
- ✓ `CreateUrgentCasePayload` - Create request
- ✓ `UpdateUrgentCasePayload` - Update request
- ✓ `UrgentCaseFormValues` - Form state
- ✓ `UrgencyLevel` - Enum for levels

Benefits:
- Type checking at compile time
- IDE autocomplete
- Automatic refactoring support
- Documentation through types

---

## 🌐 Localization

All Arabic text is hardcoded in components:
- Form labels
- Button text
- Error messages
- Placeholder text
- Toast messages

Consider extracting to i18n if multi-language needed.

---

## 📝 Notes

1. **Redux unused:** `urgentCaseSlice.ts` is empty - using React Query instead
2. **Empty components:** Several list/detail components not yet implemented
3. **Image handling:** Supports both File objects and base64 strings
4. **Cache strategy:** 5-minute stale time with optimistic updates
5. **Error handling:** Centralized through mutation hooks with toast feedback
6. **RTL support:** Built-in with `dir="rtl"` directives
7. **Responsive:** Mobile-first design with Tailwind CSS

---

Generated: 2026-04-19
