# Sponsorship API - Quick File Reference

## 📄 File Structure

```
src/
├── api/services/
│   └── sponsorshipService.ts            ✅ Main API service
│
└── features/SponsorshipCases/
    ├── components/
    │   ├── SponsorshipManagementAPI.tsx  ✅ Main UI page
    │   ├── sponsorship-forms/            Forms & modals
    │   ├── sponsorship-list/             List components
    │   ├── sponsorship-details/          Detail views
    │   ├── image-upload/                 Image upload
    │   └── svg-icon/                     Icon utilities
    │
    ├── hooks/
    │   └── useSponsorships.ts            ✅ All React Query hooks
    │
    ├── services/
    │   ├── sponsorshipService.ts         (Empty - re-exports from API)
    │   ├── sponsorshipCasesService.ts
    │   ├── emergencyCases.service.ts
    │   ├── imageUploadService.ts
    │   └── svgService.ts
    │
    ├── types/
    │   ├── sponsorship.types.ts          ✅ Main type definitions
    │   ├── sponsorshipCases.types.ts
    │   ├── sponsorship-status.types.ts   (Empty)
    │   ├── sponsorship-form.types.ts
    │   └── image-upload.types.ts
    │
    └── store/
        └── (Redux slices - not currently used)
```

---

## 🔧 Core Files Breakdown

### **API Service Layer**

#### `src/api/services/sponsorshipService.ts` (380+ lines)

**Purpose:** Main API communication service

**Exports:**

```typescript
// ✅ Types
interface SponsorshipProgram {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  createdAt: string;
}

interface CreateSponsorshipPayload {
  name: string;
  description: string;
  targetAmount: number;
  imageUrl?: string;
  icon?: string;
  isActive?: boolean;
  collectedAmount?: number;
  imageFile?: File;
  iconFile?: File;
}

interface UpdateSponsorshipPayload {
  name?: string;
  description?: string;
  targetAmount?: number;
  imageUrl?: string;
  icon?: string;
  isActive?: boolean;
  collectedAmount?: number;
  imageFile?: File;
  iconFile?: File;
}

interface EmergencyCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  urgencyLevel: string;      // "High" | "Medium"
  requiredAmount: number;
  targetAmount: number;      // Same as requiredAmount
  collectedAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  isCritical: boolean;       // Derived: true if urgencyLevel === "High"
  createdAt?: string;
  createdOn?: string;
}
```

**API Objects:**

```typescript
✅ sponsorshipApi = {
  create(payload)      → POST /v1/sponsorships
  update(id, payload)  → PUT /v1/sponsorships/{id}
  delete(id)           → DELETE /v1/sponsorships/{id}
  getAll(params)       → GET /v1/sponsorships
  getById(id)          → GET /v1/sponsorships/{id}
}

✅ emergencyApi = {
  create(payload)      → POST /v1/emergency-cases
  update(id, payload)  → PUT /v1/emergency-cases/{id}
  delete(id)           → DELETE /v1/emergency-cases/{id}
  getAll()             → GET /v1/emergency-cases
  getById(id)          → GET /v1/emergency-cases/{id}
}
```

**Helper Functions:**

```typescript
✅ unwrapData<T>(response)       // Extract data from API wrapper
✅ toUiSponsorshipProgram(item) // Transform backend → UI format
✅ toUiEmergencyCase(item)      // Transform emergency case
✅ normalizeImageUrl(url)       // Convert relative → absolute URLs
✅ normalizeIcon(icon)          // Normalize SVG icon refs
✅ getAuthorizedHeaders()       // Add Bearer token to requests
```

---

### **React Query Hooks**

#### `src/features/SponsorshipCases/hooks/useSponsorships.ts` (250+ lines)

**Purpose:** Data fetching and mutation management

**Query Hooks (Read):**

```typescript
✅ useSponsorships()
   Returns: UseQueryResult<SponsorshipProgram[]>
   Endpoint: GET /v1/sponsorships
   Cache: 5 minutes
   Features:
     • Auto-refetch on window focus: false
     • Auto-refetch on reconnect: false
     • Returns array of programs

✅ useSponsorship(id: number)
   Returns: UseQueryResult<SponsorshipProgram>
   Endpoint: GET /v1/sponsorships/{id}
   Features:
     • Only enabled if id is truthy
     • Uses list cache as initial data
     • Auto-refetch: disabled

✅ useEmergencyCases()
   Returns: UseQueryResult<EmergencyCase[]>
   Endpoint: GET /v1/emergency-cases
   Cache: 5 minutes
   Features:
     • Separate query key from sponsorships
     • Same cache behavior

✅ useEmergencyCase(id: number)
   Returns: UseQueryResult<EmergencyCase>
   Endpoint: GET /v1/emergency-cases/{id}
   Features:
     • Uses list cache as initial data
     • Only refetches if not in cache
```

**Mutation Hooks (Write):**

```typescript
✅ useCreateSponsorship()
   Returns: UseMutationResult<SponsorshipProgram, Error, CreateSponsorshipPayload>
   Triggers:
     • mutation.mutate(payload)
     • Posts to /v1/sponsorships
     • onSuccess: Invalidate list cache
     • onSuccess: Show toast "تم إنشاء برنامج الكفالة بنجاح"
     • onError: Show error toast with message

✅ useUpdateSponsorship()
   Returns: UseMutationResult<SponsorshipProgram, Error, {id, payload}>
   Features:
     • OPTIMISTIC UPDATE: Updates cache immediately
     • onMutate: Snapshots previous data for rollback
     • Puts to /v1/sponsorships/{id}
     • onSuccess: Invalidate cache
     • onError: Rollback to snapshot
     • Shows toast notifications

✅ useDeleteSponsorship()
   Returns: UseMutationResult<void, Error, number>
   Triggers:
     • mutation.mutate(id)
     • Deletes /v1/sponsorships/{id}
     • onSuccess: Invalidate list cache
     • onSuccess: Toast "تم حذف برنامج الكفالة بنجاح"
     • onError: Error toast

✅ useCreateEmergencyCase()
   Similar to create sponsorship
   Toast: "تم إنشاء الحالة الحرجة بنجاح"

✅ useUpdateEmergencyCase()
   Similar to update sponsorship
   + Optimistic update with rollback

✅ useDeleteEmergencyCase()
   Similar to delete sponsorship
   Toast: "تم حذف الحالة الحرجة بنجاح"
```

**Query Key Management:**

```typescript
✅ sponsorshipQueryKeys = {
  all: ['sponsorships'],
  lists: () => ['sponsorships', 'list'],
  details: () => ['sponsorships', 'detail'],
  detail: (id) => ['sponsorships', 'detail', id]
}

✅ emergencyQueryKeys = {
  all: ['emergency-cases'],
  lists: () => ['emergency-cases', 'list'],
  details: () => ['emergency-cases', 'detail'],
  detail: (id) => ['emergency-cases', 'detail', id]
}
```

---

### **UI Components**

#### `src/features/SponsorshipCases/components/SponsorshipManagementAPI.tsx` (1000+ lines)

**Purpose:** Main management interface

**Key Functions:**

```typescript
// ✅ ChooseTypeModal()
// Shows dialog to select between:
// • Regular Sponsorship (heart icon)
// • Urgent Case (alert icon)

// ✅ CaseFormModal()
// Reusable form for add/edit operations
// Mode: "add" | "edit"
// Fields:
//   • title/name (text input)
//   • description (textarea)
//   • targetAmount (number input)
//   • collectedAmount (number input)
//   • urgencyLevel (dropdown for emergency)
//   • imageFile (image upload)
//   • iconFile (SVG upload for sponsorship)
//   • isActive (toggle)

// ✅ DeleteConfirmModal()
// Confirmation dialog before deletion
// Shows case details for confirmation

// ✅ RegularSponsorshipSection()
// Displays list of sponsorships
// Features:
//   • Grid/List view toggle
//   • Search & filter
//   • Edit/Delete actions
//   • Progress bar
//   • Images & icons

// ✅ UrgentCasesSection()
// Displays emergency cases
// Similar features to sponsorships
```

**State Management:**

```typescript
const [modalStep, setModalStep] = useState<ModalStep>(null);
const [selectedItem, setSelectedItem] = useState(null);
const [viewType, setViewType] = useState('grid');
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({...});

// Modal steps:
// null (closed)
// "choose-type" (pick regular/urgent)
// "add-regular" (create sponsorship)
// "add-urgent" (create emergency)
// "edit-regular" (edit sponsorship)
// "edit-urgent" (edit emergency)
// "delete-regular" (confirm delete sponsorship)
// "delete-urgent" (confirm delete emergency)
```

**Used Hooks:**

```typescript
✅ useSponsorships()       → Fetch all programs
✅ useCreateSponsorship()  → Create mutation
✅ useUpdateSponsorship()  → Update mutation
✅ useDeleteSponsorship()  → Delete mutation
✅ useEmergencyCases()     → Fetch emergencies
✅ useCreateEmergencyCase()→ Create emergency
✅ useUpdateEmergencyCase()→ Update emergency
✅ useDeleteEmergencyCase()→ Delete emergency
```

---

## 📊 Type Definitions

### `src/features/SponsorshipCases/types/sponsorship.types.ts`

```typescript
✅ Duration = "شهري" | "سنوي" | "حسب الحالة"

✅ SponsorshipCategory = 
   "أسرة"      (Family)
   "طالب"      (Student)
   "يتيم"      (Orphan)
   "مريض"      (Patient)
   "موسمي"     (Seasonal)
   "عاجل"      (Urgent)
   "emergency"

✅ interface Sponsorship {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  targetAmount: number;
  collectedAmount?: number;
  active: boolean;
  category: SponsorshipCategory;
  duration?: Duration;
}

✅ interface EmergencyCase extends Sponsorship {
  category: "emergency";
  patientName?: string;
  medicalCondition?: string;
}

✅ interface CreateSponsorshipPayload {
  name: string;
  description: string;
  targetAmount: number;
  imageUrl?: string;
  icon?: string;
  category?: SponsorshipCategory;
}

✅ interface UpdateSponsorshipPayload 
   extends Partial<CreateSponsorshipPayload> {
  active?: boolean;
}
```

---

## 🔗 Import Paths

### **From API Layer:**
```typescript
import { sponsorshipApi, emergencyApi } 
  from '@/api/services/sponsorshipService';
import type { 
  SponsorshipProgram, 
  EmergencyCase,
  CreateSponsorshipPayload,
  UpdateSponsorshipPayload
} from '@/api/services/sponsorshipService';
```

### **From Hooks:**
```typescript
import { 
  useSponsorships,
  useCreateSponsorship,
  useUpdateSponsorship,
  useDeleteSponsorship,
  useEmergencyCases,
  useCreateEmergencyCase,
  useUpdateEmergencyCase,
  useDeleteEmergencyCase,
  sponsorshipQueryKeys,
  emergencyQueryKeys
} from '@/features/SponsorshipCases/hooks/useSponsorships';
```

### **From Types:**
```typescript
import type { 
  Sponsorship,
  SponsorshipCategory,
  Duration
} from '@/features/SponsorshipCases/types/sponsorship.types';
```

---

## 📈 API Endpoints Summary

### **Sponsorship Endpoints**

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| Get All | GET | `/v1/sponsorships` | ✅ Active |
| Get One | GET | `/v1/sponsorships/{id}` | ✅ Active |
| Create | POST | `/v1/sponsorships` | ✅ Active |
| Update | PUT | `/v1/sponsorships/{id}` | ✅ Active |
| Delete | DELETE | `/v1/sponsorships/{id}` | ✅ Active |

**Query Parameters:**
- `isActive?: boolean` - Filter by active status

**Request Body (Create):**
```json
{
  "name": "string",
  "description": "string",
  "targetAmount": number,
  "imageUrl": "string (optional)",
  "icon": "string (optional)"
}
```

### **Emergency Cases Endpoints**

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| Get All | GET | `/v1/emergency-cases` | ✅ Active |
| Get One | GET | `/v1/emergency-cases/{id}` | ✅ Active |
| Create | POST | `/v1/emergency-cases` | ✅ Active |
| Update | PUT | `/v1/emergency-cases/{id}` | ✅ Active |
| Delete | DELETE | `/v1/emergency-cases/{id}` | ✅ Active |

**Request Body (Create):**
```json
{
  "title": "string",
  "description": "string",
  "requiredAmount": number,
  "imageUrl": "string (optional)",
  "urgencyLevel": 1 or 2
}
```

---

## ✅ Feature Checklist

| Feature | Status | Location |
|---------|--------|----------|
| API Service Layer | ✅ Complete | `sponsorshipService.ts` |
| React Query Hooks | ✅ Complete | `useSponsorships.ts` |
| Type Definitions | ✅ Complete | `sponsorship.types.ts` |
| UI Management Page | ✅ Complete | `SponsorshipManagementAPI.tsx` |
| Create Mutation | ✅ Complete | Hooks |
| Update Mutation | ✅ Complete | Hooks |
| Delete Mutation | ✅ Complete | Hooks |
| Optimistic Updates | ✅ Complete | Update hook |
| Error Handling | ✅ Complete | Hooks |
| Caching Strategy | ✅ Complete | React Query |
| Image Upload | ✅ Complete | Form component |
| Icon Upload | ✅ Complete | Form component |
| Validation | ✅ Complete | Form component |
| RTL Support | ✅ Complete | UI components |
| Toast Notifications | ✅ Complete | Hooks |
| Form Modals | ✅ Complete | UI components |

---

## 🎯 Usage Examples

### **Fetch All Sponsorships**
```typescript
import { useSponsorships } from '@/features/SponsorshipCases/hooks/useSponsorships';

function MyComponent() {
  const { data: sponsorships, isLoading, error } = useSponsorships();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {sponsorships?.map(s => (
        <li key={s.id}>{s.name}</li>
      ))}
    </ul>
  );
}
```

### **Create Sponsorship**
```typescript
import { useCreateSponsorship } from '@/features/SponsorshipCases/hooks/useSponsorships';

function CreateForm() {
  const mutation = useCreateSponsorship();
  
  const handleSubmit = (formData) => {
    mutation.mutate({
      name: formData.name,
      description: formData.description,
      targetAmount: formData.amount,
      imageUrl: formData.image,
      icon: formData.icon
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### **Update Sponsorship (Optimistic)**
```typescript
const mutation = useUpdateSponsorship();

const handleUpdate = (sponsorshipId, changes) => {
  mutation.mutate({
    id: sponsorshipId,
    payload: changes
  });
  // UI updates immediately!
};
```

---

## 🔐 Authentication

**All requests include:**
```typescript
headers: {
  Authorization: `Bearer ${accessToken}`
}
```

Token retrieved from:
1. `tokenManager.getAccessToken()`
2. Fallback: `localStorage.getItem('token')`

---

## 📚 Related Files

- `/src/api/services/sponsorshipService.ts` - Main API
- `/src/features/SponsorshipCases/hooks/useSponsorships.ts` - React Query hooks
- `/src/features/SponsorshipCases/components/SponsorshipManagementAPI.tsx` - UI
- `/src/features/SponsorshipCases/types/sponsorship.types.ts` - Type definitions
- `/src/api/axiosInstance.ts` - HTTP client with interceptors
- `/src/features/authentication/utils/tokenManager.ts` - Token management

---

## 🎯 Key System Features

✅ **Unified API**: Both sponsorships and emergency cases use same pattern
✅ **Type Safety**: Full TypeScript support, no `any` types
✅ **Caching**: 5-minute stale time reduces API calls
✅ **Optimistic Updates**: UI updates immediately
✅ **Error Handling**: Arabic toast messages
✅ **Authentication**: Bearer token in all requests
✅ **Localization**: RTL layout with Arabic text
✅ **Image Handling**: Support for uploads and URLs
✅ **Validation**: Form and file validation
✅ **Performance**: Cache sharing and deduplication

---

**Quick Reference Generated:** April 19, 2026
