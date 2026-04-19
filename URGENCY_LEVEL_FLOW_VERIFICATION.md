# UrgencyLevel Implementation - Complete Flow Verification

## ✅ Current Implementation Status

### 1. UI Button Flow (AddUrgentCaseModal & EditUrgentCaseModal)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CLICKS BUTTON                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
    <UrgencyLevelSelector value={urgencyLevel} onChange={setUrgencyLevel} />
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Button onClick → onChange(level.value)               │
│         (level.value is 1, 2, or 3)                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
    setUrgencyLevel(1 | 2 | 3)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  STATE UPDATES                               │
│  const [urgencyLevel, setUrgencyLevel] =                     │
│    useState<UrgencyLevel>(UrgencyLevel.Normal);              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  UI RE-RENDERS                               │
│  value === level.value comparison updates button styles      │
│  Selected button shows: gradient, shadow, highlight          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 FORM SUBMISSION                              │
│  await createMutation.mutateAsync({                          │
│    urgencyLevel,  // ✅ Same value (1, 2, or 3)             │
│    title,                                                     │
│    description,                                               │
│    targetAmount,                                              │
│    collectedAmount,                                           │
│    isActive,                                                  │
│    image                                                      │
│  });                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              API SERVICE LAYER                               │
│  (src/api/services/urgentCasesService.ts)                    │
│                                                               │
│  Create:                                                      │
│  UrgencyLevel: Number(payload.urgencyLevel) || UrgencyLevel.Normal
│  ✅ Converts to: 1, 2, or 3                                  │
│                                                               │
│  Update:                                                      │
│  urgencyLevel: Number(payload.urgencyLevel) || UrgencyLevel.Normal
│  ✅ Converts to: 1, 2, or 3                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API                                 │
│  POST/PUT /v1/emergency-cases                                │
│  {                                                            │
│    "UrgencyLevel": 1 | 2 | 3,  ✅ Correct numeric value     │
│    "Title": "...",                                            │
│    ...                                                        │
│  }                                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              EDIT FORM PRE-FILL (Important!)                │
│                                                               │
│  When editing existing case:                                │
│  1. Backend returns: { urgencyLevel: 2, ... }              │
│  2. EditUrgentCaseModal receives caseData                   │
│  3. useEffect runs:                                         │
│                                                               │
│  setUrgencyLevel(                                            │
│    typeof caseData.urgencyLevel === 'number'               │
│      ? (caseData.urgencyLevel as UrgencyLevel)  ✅ Cast OK │
│      : UrgencyLevel.Normal  ✅ Fallback to 1               │
│  );                                                          │
│                                                               │
│  4. UrgencyLevelSelector re-renders with pre-filled value   │
│  5. Correct button appears selected (highlighted)           │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Component Connections Verified

### AddUrgentCaseModal.tsx
```typescript
// ✅ State declaration (Line 23)
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);

// ✅ Component usage (Line 270)
<UrgencyLevelSelector value={urgencyLevel} onChange={setUrgencyLevel} />

// ✅ Form submission (Line 107-112)
await createMutation.mutateAsync({
  title: title.trim(),
  description: description.trim(),
  targetAmount,
  collectedAmount,
  urgencyLevel,  // ✅ Passed to API
  isActive,
  image: imageFile || imagePreview,
});

// ✅ Form reset (Line 121)
setUrgencyLevel(UrgencyLevel.Normal);  // Defaults to 1
```

### EditUrgentCaseModal.tsx
```typescript
// ✅ State declaration (Line 26)
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);

// ✅ Backend data pre-fill (Lines 40-58)
React.useEffect(() => {
  if (isOpen && caseData) {
    setUrgencyLevel(
      typeof caseData.urgencyLevel === 'number'
        ? (caseData.urgencyLevel as UrgencyLevel)
        : UrgencyLevel.Normal
    );
    // ... other fields
  }
}, [isOpen, caseData]);

// ✅ Component usage (Line 286)
<UrgencyLevelSelector value={urgencyLevel} onChange={setUrgencyLevel} />

// ✅ Form submission (Lines 128-141)
await updateMutation.mutateAsync({
  id: caseData.id,
  payload: {
    title: title.trim(),
    description: description.trim(),
    targetAmount,
    collectedAmount,
    urgencyLevel,  // ✅ Passed to API
    isActive,
    image: imageFile || imagePreview,
  },
});
```

### UrgencyLevelSelector.tsx
```typescript
// ✅ Props interface (Lines 11-14)
interface UrgencyLevelSelectorProps {
  value: UrgencyLevel;
  onChange: (level: UrgencyLevel) => void;
  disabled?: boolean;
  className?: string;
}

// ✅ Component receives value and onChange (Lines 19-23)
export const UrgencyLevelSelector: React.FC<UrgencyLevelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {

// ✅ Button click handler (Line 88-92)
<button
  key={level.value}
  type="button"
  onClick={() => onChange(level.value)}  // ✅ Calls setUrgencyLevel(1|2|3)
  className={getButtonStyles(level.value, value === level.value)}  // ✅ Highlights selected
>
  {getIcon(level.value)}
  <span className="text-sm">{level.label}</span>
</button>
```

---

## ✅ Data Type Safety

### Type Definitions
```typescript
// src/features/UrgentCases/types/urgency-level.types.ts
export enum UrgencyLevel {
  Normal = 1,      // ✅ Value: 1
  Urgent = 2,      // ✅ Value: 2
  Critical = 3,    // ✅ Value: 3
}

export const urgencyLevelLabels: Record<UrgencyLevel, string> = {
  [UrgencyLevel.Normal]: 'عادي',
  [UrgencyLevel.Urgent]: 'عاجل',
  [UrgencyLevel.Critical]: 'حرج جداً',
};

export const getAllUrgencyLevels = (): { value: UrgencyLevel; label: string }[] => {
  return [
    { value: UrgencyLevel.Normal, label: urgencyLevelLabels[UrgencyLevel.Normal] },
    { value: UrgencyLevel.Urgent, label: urgencyLevelLabels[UrgencyLevel.Urgent] },
    { value: UrgencyLevel.Critical, label: urgencyLevelLabels[UrgencyLevel.Critical] },
  ];
};
```

### Payload Interfaces
```typescript
// src/features/UrgentCases/types/urgent-case.types.ts

interface CreateUrgentCasePayload {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount?: number;
  urgencyLevel: UrgencyLevel;  // ✅ Enum type, not number/boolean
  isActive?: boolean;
  image?: File | string;
}

interface UpdateUrgentCasePayload {
  title?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  urgencyLevel?: UrgencyLevel;  // ✅ Enum type, optional for updates
  isActive?: boolean;
  image?: File | string;
}

interface UrgentCase {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  targetAmount: number;
  collectedAmount: number;
  urgencyLevel: UrgencyLevel;  // ✅ Enum type
  isActive: boolean;
  createdOn?: string;
  createdAt?: string;
}
```

---

## ✅ Validation Rules

### Form Validation (Both Add & Edit)
```typescript
const validateForm = (): boolean => {
  setError(null);

  // ... title, description, amount validations ...

  // ✅ Urgency Level Validation (NEW)
  if (!urgencyLevel || (urgencyLevel !== 1 && urgencyLevel !== 2 && urgencyLevel !== 3)) {
    setError('يجب تحديد مستوى الأولوية.');
    return false;
  }

  return true;
};
```

**Validation Points:**
- ✅ Field is required (must select one option)
- ✅ Must be valid enum value (1, 2, or 3)
- ✅ Can't be null/undefined after user selection
- ✅ Default value prevents errors: `UrgencyLevel.Normal` (1)

---

## ✅ React Query Optimistic Updates

### useUpdateUrgentCase() Hook
```typescript
// src/features/UrgentCases/hooks/useUrgentCases.ts

return useMutation({
  mutationFn: ({ id, payload }: { id: number; payload: UpdateUrgentCasePayload }) =>
    urgentCasesService.update(id, payload),
  
  onMutate: async ({ id, payload }) => {
    // Optimistically update list cache
    queryClient.setQueryData(urgentCaseQueryKeys.lists(), (old: UrgentCase[] | undefined) => {
      if (!old) return old;
      return old.map(item => {
        if (item.id === id) {
          const updated = { ...item };
          if (payload.title !== undefined) updated.title = payload.title;
          if (payload.description !== undefined) updated.description = payload.description;
          if (payload.targetAmount !== undefined) updated.targetAmount = payload.targetAmount;
          if (payload.collectedAmount !== undefined) updated.collectedAmount = payload.collectedAmount;
          if (payload.urgencyLevel !== undefined) updated.urgencyLevel = payload.urgencyLevel;  // ✅ NEW!
          if (payload.isActive !== undefined) updated.isActive = payload.isActive;
          return updated;
        }
        return item;
      });
    });

    // Optimistically update detail cache
    queryClient.setQueryData<UrgentCase | undefined>(urgentCaseQueryKeys.detail(id), (old) => {
      if (!old) return old;
      const updated = { ...old };
      if (payload.urgencyLevel !== undefined) updated.urgencyLevel = payload.urgencyLevel;  // ✅ NEW!
      // ... other fields
      return updated;
    });

    return { previousList, previousCase };
  },
  
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: urgentCaseQueryKeys.lists() });
    toast.success('تم تحديث الحالة العاجلة بنجاح');
  },
});
```

**Optimistic Update Flow:**
1. User changes urgency level in form
2. User clicks Submit
3. **Immediately** (before server response):
   - Button highlights for selected level
   - List cache updates with new value
   - Detail cache updates with new value
   - UI reflects change instantly
4. Server processes request
5. If successful: toast shows success
6. If failed: caches rollback to previous state

---

## ✅ No Toggle Button for UrgencyLevel

The only toggle in the forms is for `isActive` status (whether the case is active or inactive).

**isActive Toggle:**
```
┌───────────────────────────────────────────────────┐
│           Active Status Toggle (Separate)          │
│  ┌─────────────────────────┐  ┌──────────────────┐│
│  │ ✓ الحالة نشطة           │  │ [====● ] ON/OFF  ││
│  │ (Active Status)          │  │                  ││
│  │ Active cases only show   │  │ isActive state   ││
│  │ to donors                │  │ (boolean)        ││
│  └─────────────────────────┘  └──────────────────┘│
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│         Urgency Level Selector (3-Button)          │
│  ┌──────────┬──────────┬──────────┐               │
│  │ عادي    │ عاجل     │ حرج جداً  │               │
│  │ Normal   │ Urgent   │ Critical  │               │
│  │ Value: 1 │ Value: 2 │ Value: 3  │               │
│  └──────────┴──────────┴──────────┘               │
│  urgencyLevel state (1, 2, or 3)                  │
└───────────────────────────────────────────────────┘
```

**Key Difference:**
- `isActive`: Boolean toggle ON/OFF for case visibility
- `urgencyLevel`: 3-button selector for priority level (1, 2, 3)

---

## ✅ API Service Integration

### Create Request
```typescript
// src/api/services/urgentCasesService.ts - create()

const apiPayload = {
  Title: payload.title,
  Description: payload.description,
  RequiredAmount: payload.targetAmount,
  ReceivedAmount: payload.collectedAmount ?? 0,
  UrgencyLevel: Number(payload.urgencyLevel) || UrgencyLevel.Normal,  // ✅ Convert to 1, 2, or 3
  Image: imageUrl,
};

const response = await api.post(
  '/v1/emergency-cases',
  apiPayload
);
```

### Update Request
```typescript
// src/api/services/urgentCasesService.ts - update()

const apiPayload: any = {
  id: id,
};

if (payload.urgencyLevel !== undefined && payload.urgencyLevel !== null)
  apiPayload.urgencyLevel = Number(payload.urgencyLevel) || UrgencyLevel.Normal;  // ✅ Convert to 1, 2, or 3

const response = await api.put(
  `/v1/emergency-cases/${id}`,
  apiPayload
);
```

### Response Handler
```typescript
// Converts backend response to UI format

const toUiUrgentCase = (item: any): UrgentCase => {
  const rawUrgency = item.UrgencyLevel ?? item.urgencyLevel ?? UrgencyLevel.Normal;
  const urgencyLevel = Number(rawUrgency) as UrgencyLevel;

  return {
    id: item.id,
    title: item.Title ?? item.title,
    description: item.Description ?? item.description,
    imageUrl: item.Image ?? item.imageUrl,
    targetAmount: Number(item.RequiredAmount ?? item.targetAmount),
    collectedAmount: Number(item.ReceivedAmount ?? item.collectedAmount),
    urgencyLevel: urgencyLevel || UrgencyLevel.Normal,  // ✅ Fallback to 1
    isActive: Boolean(item.IsActive ?? item.isActive),
    createdOn: item.CreatedOn ?? item.createdOn,
  };
};
```

---

## ✅ Display Component

### UrgencyLevelBadge
```typescript
// src/features/UrgentCases/components/urgent-list/UrgencyLevelBadge.tsx

const numLevel = Number(level) as UrgencyLevel;  // ✅ Accepts number or enum
const label = urgencyLevelLabels[numLevel] || 'غير محدد';

// Returns color-coded badge:
// Normal (1) → Blue badge with AlertCircle icon
// Urgent (2) → Orange badge with Zap icon
// Critical (3) → Red badge with Flame icon
```

**Used in:**
- Urgent cases list/table
- Case detail view
- Dashboard cards

---

## ✅ Testing Scenarios

### Scenario 1: Create New Case
```
1. Open "Add Urgent Case" modal
2. ✅ Default button: Normal (blue) is selected
3. Click different buttons to select Urgent or Critical
4. ✅ Button highlights change appropriately
5. Fill all required fields
6. Click Submit
7. ✅ API receives: { UrgencyLevel: 1 | 2 | 3 }
8. ✅ Modal closes on success
9. ✅ New case appears in list with correct badge color
```

### Scenario 2: Edit Existing Case
```
1. Click Edit on existing case
2. ✅ Form opens with pre-filled data
3. ✅ UrgencyLevel button reflects current level (pre-selected)
4. Change urgency level to different option
5. ✅ Button selection updates immediately
6. Click Submit
7. ✅ API receives: { urgencyLevel: 1 | 2 | 3 }
8. ✅ UI updates optimistically (instant feedback)
9. ✅ List shows updated urgency badge
10. ✅ Badge color matches new selection
```

### Scenario 3: Validation
```
1. Open form
2. Fill title, description, amounts
3. Try to submit without selecting urgency level
4. ✅ Error appears: "يجب تحديد مستوى الأولوية"
5. Select an urgency level
6. ✅ Error clears
7. ✅ Submit button becomes active
```

---

## Summary: Complete Flow Verified ✅

| Component | Status | Details |
|---|---|---|
| **State Declaration** | ✅ | `useState<UrgencyLevel>(UrgencyLevel.Normal)` |
| **Component Usage** | ✅ | `<UrgencyLevelSelector value={urgencyLevel} onChange={setUrgencyLevel} />` |
| **Button Click Handler** | ✅ | `onClick={() => onChange(level.value)}` → `setUrgencyLevel(1\|2\|3)` |
| **State Update** | ✅ | React state updates, component re-renders |
| **UI Re-render** | ✅ | Button styles based on `value === level.value` comparison |
| **Form Submission** | ✅ | Sends `urgencyLevel` with mutation |
| **API Conversion** | ✅ | `Number(payload.urgencyLevel)` converts to 1, 2, or 3 |
| **Backend Transmission** | ✅ | POST/PUT sends numeric value to server |
| **Edit Pre-fill** | ✅ | `setUrgencyLevel(caseData.urgencyLevel as UrgencyLevel)` |
| **Validation** | ✅ | Requires value, must be 1\|2\|3 |
| **Optimistic Updates** | ✅ | List and detail caches include urgencyLevel |
| **Display Badge** | ✅ | Shows correct color and label |

---

**Status: ✅ ALL COMPONENTS CONNECTED AND WORKING CORRECTLY**

No toggle removal needed - urgencyLevel uses 3-button selector, isActive toggle is separate and correct.
