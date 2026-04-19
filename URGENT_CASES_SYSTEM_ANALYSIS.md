# Urgent Cases System - Complete Analysis

## 📋 Table of Contents
1. [File Structure](#file-structure)
2. [Data Models & Types](#data-models--types)
3. [API Payloads](#api-payloads)
4. [Services](#services)
5. [Hooks & Functions](#hooks--functions)
6. [UI Components](#ui-components)
7. [Form Modals](#form-modals)
8. [System Architecture & Data Flow](#system-architecture--data-flow)

---

## 🗂️ File Structure

```
src/features/UrgentCases/
├── components/
│   ├── urgent-forms/
│   │   ├── AddUrgentCaseModal.tsx          ✅ Create modal
│   │   ├── EditUrgentCaseModal.tsx         ✅ Update modal
│   │   ├── DeleteUrgentCaseModal.tsx       ✅ Delete modal
│   │   ├── UrgentCaseFormFields.tsx        (Empty/Shared)
│   │   ├── UrgencyLevelSelector.tsx
│   │   ├── StatusToggle.tsx
│   │   ├── TargetAmountField.tsx
│   │   └── DeadlineField.tsx
│   ├── urgent-list/
│   │   ├── UrgentCasesList.tsx             (Empty)
│   │   ├── UrgentCaseRow.tsx               (Empty)
│   │   ├── UrgentCaseFilters.tsx
│   │   ├── UrgentCaseSearchBar.tsx
│   │   ├── UrgentCasePagination.tsx
│   │   └── UrgencyLevelBadge.tsx
│   ├── urgent-details/
│   │   ├── UrgentCaseDetailModal.tsx       (Empty)
│   │   ├── UrgentCaseInfoCard.tsx
│   │   ├── FundingProgressCard.tsx
│   │   └── DonationHistory.tsx
│   ├── progress/
│   │   ├── FundingProgress.tsx
│   │   ├── DonationStats.tsx
│   │   ├── DonorsList.tsx
│   │   └── TimeRemaining.tsx
│   ├── UrgentCasesPage.tsx                 ✅ Main page
│   └── UrgentCasesLayout.tsx               (Empty)
├── hooks/
│   ├── useUrgentCases.ts                   ✅ Main query hooks
│   ├── useCreateUrgentCase.ts              (Uses main hook)
│   ├── useUpdateUrgentCase.ts              (Uses main hook)
│   ├── useDeleteUrgentCase.ts              (Uses main hook)
│   ├── useUrgentCaseProgress.ts
│   ├── useCloseUrgentCase.ts
│   ├── useImageUpload.ts
│   └── useUrgentFilters.ts
├── services/
│   ├── urgentCasesService.ts               ✅ API service
│   ├── urgentCaseService.ts
│   ├── progressService.ts
│   └── imageUploadService.ts
├── store/
│   └── urgentCaseSlice.ts                  (Empty - Redux)
├── types/
│   ├── urgent-case.types.ts                ✅ Main types
│   ├── urgency-level.types.ts              ✅ Urgency enum
│   ├── urgent-status.types.ts              (Empty)
│   ├── urgent-form.types.ts
│   ├── progress.types.ts
│   └── urgentCases.types.ts
└── index.ts                                ✅ Exports
```

---

## 📊 Data Models & Types

### 1. **UrgentCase Interface**
```typescript
// Location: src/api/services/urgentCasesService.ts
interface UrgentCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel | number;
  isActive: boolean;
  createdOn?: string;
  createdAt?: string;
}
```

### 2. **UrgencyLevel Enum**
```typescript
// Location: src/features/UrgentCases/types/urgency-level.types.ts
enum UrgencyLevel {
  Normal = 1,        // عادي
  Urgent = 2,        // عاجل
  Critical = 3,      // حرج جداً
}

// Display labels
const urgencyLevelLabels = {
  1: 'عادي',
  2: 'عاجل',
  3: 'حرج جداً',
};
```

### 3. **UrgentCaseFormValues Interface**
```typescript
interface UrgentCaseFormValues {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;
  isActive: boolean;
  imageFile?: File | null;
  imagePreview?: string | null;
}
```

---

## 🔄 API Payloads

### 1. **CreateUrgentCasePayload** (POST)
```typescript
interface CreateUrgentCasePayload {
  image?: File | string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount?: number;      // Default: 0
  urgencyLevel: UrgencyLevel | number;
  isActive?: boolean;             // Default: true
}

// Backend expects PascalCase:
// {
//   Title: string,
//   Description: string,
//   RequiredAmount: number,
//   ReceivedAmount: number,
//   Image: string (URL or base64),
//   UrgencyLevel: number (1-3),
//   IsActive?: boolean
// }
```

**API Endpoint:** `POST /v1/emergency-cases`

### 2. **UpdateUrgentCasePayload** (PUT)
```typescript
interface UpdateUrgentCasePayload {
  image?: File | string;
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  urgencyLevel?: UrgencyLevel | number;
  isActive?: boolean;
}

// Backend expects camelCase:
// {
//   id: number,
//   title?: string,
//   description?: string,
//   requiredAmount?: number,
//   urgencyLevel?: number,
//   imageUrl?: string,
//   isActive?: boolean
// }
```

**API Endpoint:** `PUT /v1/emergency-cases/{id}`

### 3. **Delete Payload**
```typescript
// No body required
// API Endpoint: DELETE /v1/emergency-cases/{id}
```

---

## 🛠️ Services

### **urgentCasesService** 
**File:** `src/api/services/urgentCasesService.ts`

#### Methods:

1. **`getAll(): Promise<UrgentCase[]>`**
   - Fetches all urgent cases
   - Endpoint: `GET /v1/emergency-cases`
   - Data transformation: Converts PascalCase API response to camelCase UI format

2. **`getById(id: number): Promise<UrgentCase>`**
   - Fetches a single urgent case
   - Endpoint: `GET /v1/emergency-cases/{id}`

3. **`create(payload: CreateUrgentCasePayload): Promise<UrgentCase>`**
   - Creates a new urgent case
   - Endpoint: `POST /v1/emergency-cases`
   - Converts form payload to backend PascalCase format
   - Default image URL if none provided

4. **`update(id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase>`**
   - Updates existing urgent case
   - Endpoint: `PUT /v1/emergency-cases/{id}`
   - Only sends non-undefined fields

5. **`delete(id: number): Promise<void>`**
   - Deletes urgent case
   - Endpoint: `DELETE /v1/emergency-cases/{id}`

### **Helper Functions:**

```typescript
// Data transformation utilities
const unwrapData = <T>(response: ApiResponse<T> | T): T
// Extracts data from API response wrapper

const toUiUrgentCase = (item: any): UrgentCase
// Converts backend PascalCase to UI camelCase format
// Maps: Title→title, Description→description
//       RequiredAmount/TargetAmount→targetAmount
//       ReceivedAmount→collectedAmount
//       UrgencyLevel→urgencyLevel
//       Image→imageUrl, IsActive→isActive
```

---

## 🎣 Hooks & Functions

### **Main Query Hooks**
**File:** `src/features/UrgentCases/hooks/useUrgentCases.ts`

#### 1. **useUrgentCases()**
```typescript
function useUrgentCases()
// Returns: useQuery<UrgentCase[]>
// Fetches all urgent cases
// Cache time: 5 minutes
// Query key: ['urgent-cases', 'list']
```

#### 2. **useUrgentCase(id: number)**
```typescript
function useUrgentCase(id: number)
// Returns: useQuery<UrgentCase>
// Fetches single urgent case by ID
// Uses initial data from list cache if available
```

#### 3. **useCreateUrgentCase()**
```typescript
function useCreateUrgentCase()
// Returns: useMutation<CreateUrgentCasePayload>
// Actions:
//   - onSuccess: Invalidates list cache + success toast
//   - onError: Shows error toast with API message
```

#### 4. **useUpdateUrgentCase()**
```typescript
function useUpdateUrgentCase()
// Returns: useMutation<{id, payload}>
// Features:
//   - OPTIMISTIC UPDATE: Updates cache immediately
//   - onMutate: Snapshots previous data for rollback
//   - onError: Rolls back to previous state if fails
//   - onSuccess: Invalidates cache + success toast
// Updates both list and detail caches
```

#### 5. **useDeleteUrgentCase()**
```typescript
function useDeleteUrgentCase()
// Returns: useMutation<number (id)>
// Actions:
//   - onSuccess: Invalidates list cache + success toast
//   - onError: Shows error toast
```

### **Query Keys Pattern**
```typescript
const urgentCaseQueryKeys = {
  all: ['urgent-cases'],
  lists: () => ['urgent-cases', 'list'],
  details: () => ['urgent-cases', 'detail'],
  detail: (id: number) => ['urgent-cases', 'detail', id],
}
```

---

## 🎨 UI Components

### **Main Page Component**
**File:** `src/features/UrgentCases/components/UrgentCasesPage.tsx`

#### Features:
- Displays list of all urgent cases
- Add new urgent case button
- Edit/Delete actions for each case
- State management for modals
- Loading and error states
- Empty state handling

#### State:
```typescript
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedCase, setSelectedCase] = useState<UrgentCase | null>(null);
```

---

## 📝 Form Modals

### **1. AddUrgentCaseModal**
**File:** `src/features/UrgentCases/components/urgent-forms/AddUrgentCaseModal.tsx`

#### Displayed Fields:
- **Title** (Required, max 200 chars)
- **Description** (Required, max 500 chars)
- **Target Amount** (Required, > 0)
- **Collected Amount** (Optional, <= target amount)
- **Urgency Level** (Required, dropdown selector)
- **Image Upload** (Optional, drag-drop or file select)
- **Is Active** (Toggle, default true)

#### Validations:
- Title: Required, max 200 characters
- Description: Required, max 500 characters
- Target Amount: Must be > 0
- Collected Amount: Must be <= target amount
- Image: JPG/PNG/WebP, max 5MB

#### Visual Elements:
- Modal header with gradient (Red-Orange)
- Form fields in 2-column grid layout (1 column on mobile)
- Error alert with animation
- Image drag-drop area with preview
- Character counters for text fields
- Progress indicator (collected/target %)
- Submit button with loading state

#### Form State:
```typescript
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [targetAmount, setTargetAmount] = useState(0);
const [collectedAmount, setCollectedAmount] = useState(0);
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Urgent);
const [isActive, setIsActive] = useState(true);
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [draggingImg, setDraggingImg] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### Form Submission:
```typescript
handleSubmit() {
  if (!validateForm()) return;
  
  await createMutation.mutateAsync({
    title: title.trim(),
    description: description.trim(),
    targetAmount,
    collectedAmount,
    urgencyLevel,
    isActive,
    image: imageFile || imagePreview,
  });
  
  // Resets form and closes modal on success
}
```

---

### **2. EditUrgentCaseModal**
**File:** `src/features/UrgentCases/components/urgent-forms/EditUrgentCaseModal.tsx`

#### Differences from Add Modal:
- **Requires case data:** `case: UrgentCase | null` prop
- **Pre-fills form** from existing case data via `useEffect`
- **Header color:** Blue-Cyan gradient (vs Red-Orange)
- **Icon:** Edit instead of Plus
- **Same validations** as Add modal

#### Form Initialization:
```typescript
useEffect(() => {
  if (isOpen && caseData) {
    setTitle(caseData.title);
    setDescription(caseData.description);
    setTargetAmount(caseData.targetAmount);
    setCollectedAmount(caseData.collectedAmount);
    setUrgencyLevel(caseData.urgencyLevel as UrgencyLevel);
    setIsActive(caseData.isActive);
    if (caseData.imageUrl) {
      setImagePreview(caseData.imageUrl);
    }
    setError(null);
  }
}, [isOpen, caseData]);
```

#### Form Submission:
```typescript
handleSubmit() {
  if (!validateForm() || !caseData) return;
  
  await updateMutation.mutateAsync({
    id: caseData.id,
    title: title.trim(),
    description: description.trim(),
    targetAmount,
    collectedAmount,
    urgencyLevel,
    isActive,
    image: imageFile || imagePreview,
  });
}
```

---

### **3. DeleteUrgentCaseModal**
**File:** `src/features/UrgentCases/components/urgent-forms/DeleteUrgentCaseModal.tsx`

#### Purpose:
Confirmation dialog for deleting an urgent case

#### Display Elements:
- **Header:** Red-Orange gradient with warning icon
- **Case Details:**
  - Title
  - Target Amount
- **Warning Message:** "This action cannot be undone"
- **Confirmation Info:** Shows impact (donations, related data)

#### Actions:
- **Cancel Button:** Closes modal
- **Delete Button:** Triggers deletion
  - Shows loading spinner during deletion
  - Confirms with success toast

#### Form State:
```typescript
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  if (!caseData) return;
  await deleteMutation.mutateAsync(caseData.id);
  onSuccess?.();
  onClose();
}
```

---

## 🔀 System Architecture & Data Flow

### **Component Hierarchy**
```
App
└── UrgentCasesPage (Main page)
    ├── useUrgentCases() [Query]
    ├── AddUrgentCaseModal
    │   └── useCreateUrgentCase() [Mutation]
    ├── EditUrgentCaseModal
    │   └── useUpdateUrgentCase() [Mutation]
    ├── DeleteUrgentCaseModal
    │   └── useDeleteUrgentCase() [Mutation]
    └── (Other components)
        ├── UrgentCasesList
        ├── UrgentCaseFilters
        ├── UrgentCasePagination
        └── UrgencyLevelBadge
```

### **Data Flow Diagram**

#### 1. **Read Flow (GET)**
```
UrgentCasesPage
    ↓
useUrgentCases() [useQuery]
    ↓
urgentCasesService.getAll()
    ↓
API: GET /v1/emergency-cases
    ↓
Backend returns: [PascalCase data]
    ↓
toUiUrgentCase() [transforms to camelCase]
    ↓
React Query Cache
    ↓
Component receives: UrgentCase[] [camelCase]
```

#### 2. **Create Flow (POST)**
```
User fills AddModal
    ↓
validateForm() [client-side validation]
    ↓
handleSubmit()
    ↓
createMutation.mutateAsync({payload})
    ↓
useCreateUrgentCase() [useMutation]
    ↓
urgentCasesService.create(payload)
    ↓
Convert payload to PascalCase
    ↓
API: POST /v1/emergency-cases
    ↓
Backend returns: UrgentCase [PascalCase]
    ↓
toUiUrgentCase() [transform]
    ↓
onSuccess:
    - Invalidate list query cache
    - Show success toast
    - Reset form
    - Close modal
    ↓
Component re-fetches data
    ↓
Page updates with new case
```

#### 3. **Update Flow (PUT)**
```
User clicks Edit → EditModal opens
    ↓
useEffect: Pre-fills form from caseData
    ↓
User modifies fields
    ↓
validateForm() [client-side validation]
    ↓
handleSubmit()
    ↓
updateMutation.mutateAsync({id, payload})
    ↓
useUpdateUrgentCase() [useMutation]
    ↓
onMutate (OPTIMISTIC UPDATE):
    - Cancel pending queries
    - Snapshot previous data
    - Update list cache immediately
    - Update detail cache immediately
    ↓
urgentCasesService.update(id, payload)
    ↓
Convert to backend format (camelCase)
    ↓
API: PUT /v1/emergency-cases/{id}
    ↓
onSuccess:
    - Invalidate list cache
    - Show success toast
    ↓
onError:
    - Rollback list cache to snapshot
    - Rollback detail cache to snapshot
    - Show error toast
```

#### 4. **Delete Flow (DELETE)**
```
User clicks Delete → DeleteModal opens
    ↓
Show confirmation with case details
    ↓
User clicks "Confirm Delete"
    ↓
handleDelete()
    ↓
deleteM mutation.mutateAsync(caseId)
    ↓
useDeleteUrgentCase() [useMutation]
    ↓
urgentCasesService.delete(id)
    ↓
API: DELETE /v1/emergency-cases/{id}
    ↓
onSuccess:
    - Invalidate list cache
    - Show success toast
    - Close modal
    - Trigger onSuccess callback
    ↓
Page re-fetches data
    ↓
Case removed from list
```

### **Cache Management**

**React Query Cache Strategy:**
```typescript
Query Keys:
- ['urgent-cases']
- ['urgent-cases', 'list']           ← List cache
- ['urgent-cases', 'detail']
- ['urgent-cases', 'detail', {id}]  ← Detail cache

Stale Time: 5 minutes
GC Time: Configurable (QUERY_GC_TIME constant)

Invalidation Triggers:
- Create: Invalidates 'list' query
- Update: Invalidates 'list' and detail queries
- Delete: Invalidates 'list' query
```

### **Error Handling**

```typescript
Error Flow:
Try block (API call)
    ↓
Catch: onError in mutation
    ↓
getApiErrorMessage(error) [utility function]
    ↓
toast.error(message) [Show user-friendly message]
    ↓
For Update: Rollback optimistic changes
```

### **Form Validation Flow**

```typescript
validateForm():
  1. Check title: non-empty, ≤ 200 chars
  2. Check description: non-empty, ≤ 500 chars
  3. Check targetAmount: > 0
  4. Check collectedAmount: ≤ targetAmount
  5. Return validation result
  
validateImageFile(file):
  1. Check type: JPG/PNG/WebP only
  2. Check size: ≤ 5MB
  3. Return validation result
```

### **Image Handling**

```typescript
Image Upload Process:
1. User selects file (drag-drop or input)
2. validateImageFile(file)
3. Create FileReader
4. Convert to base64: DataURL
5. Set imagePreview [for display]
6. Set imageFile [for submission]

Form Submission:
- If imageFile exists: Send File
- If imagePreview exists: Send base64 string
- Backend converts to URL or stores base64
```

---

## 📱 Display on Page

### **UrgentCasesPage Layout**

1. **Header Section**
   - Title: "الحالات العاجلة" (Urgent Cases)
   - Subtitle: "متابعة أولويات جمع التبرعات..."
   - "Add New Case" button (Red-Orange gradient)

2. **Loading State**
   - Card with loading text
   - Shows while fetching data

3. **Error State**
   - Red border alert
   - Error message in Arabic
   - Shows if API fails

4. **Empty State**
   - Emoji icon (📋)
   - "No urgent cases found" message
   - Prompts to create one

5. **Data Display**
   - List of urgent case rows
   - Each row shows:
     - Case title
     - Urgency level badge (Normal/Urgent/Critical)
     - Target amount
     - Collected amount
     - Progress bar
     - Edit/Delete action buttons

---

## 🎯 Key System Features

### **1. Language Support**
- RTL layout (Arabic): `dir="rtl"` on modal containers
- Bilingual urgency labels:
  - Normal: عادي / Normal
  - Urgent: عاجل / Urgent
  - Critical: حرج جداً / Critical

### **2. Real-time Feedback**
- Character counters (title, description)
- Percentage progress (collected/target)
- Visual validation (green check/red X)
- Toast notifications (success/error)

### **3. Responsive Design**
- 2-column form grid (desktop)
- 1-column form grid (mobile)
- Responsive modal sizing
- Mobile-friendly input

### **4. Optimistic Updates**
- Update mutation shows changes immediately
- Rolls back if API fails
- Provides instant user feedback

### **5. Data Transformation**
- Backend: PascalCase (Title, Description, RequiredAmount)
- Frontend: camelCase (title, description, targetAmount)
- Automatic conversion in service layer

---

## 📌 Important Notes

1. **File Size Limit:** 5MB for images
2. **Text Limits:** Title 200 chars, Description 500 chars
3. **Amount Validation:** Collected ≤ Target
4. **Default Image:** If none provided, uses placeholder URL
5. **Urgency Levels:** 1=Normal, 2=Urgent, 3=Critical
6. **Cache Duration:** 5 minutes before stale
7. **Error Messages:** Localized in Arabic
8. **Delete Impact:** Removes all related donation data

---

## 🔗 API Integration Summary

| Operation | Method | Endpoint | Payload |
|-----------|--------|----------|---------|
| List All | GET | `/v1/emergency-cases` | - |
| Get One | GET | `/v1/emergency-cases/{id}` | - |
| Create | POST | `/v1/emergency-cases` | CreateUrgentCasePayload |
| Update | PUT | `/v1/emergency-cases/{id}` | UpdateUrgentCasePayload |
| Delete | DELETE | `/v1/emergency-cases/{id}` | - |

---

**Last Updated:** 2026-04-19
**System Version:** React + TypeScript + React Query + Tailwind CSS
