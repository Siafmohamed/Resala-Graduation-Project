# Urgent Case Card - API-Driven Implementation

## Overview

The Urgent Case Card system has been refactored to fetch data directly from the API using case IDs, rather than relying on data passed from a parent list component.

## API Endpoint

**Fetch Urgent Case by ID:**
```
GET /api/v1/emergency-cases/{id}
```

**Response Structure:**
```typescript
{
  succeeded: true,
  message: "Success",
  data: {
    id: number,
    title: string,
    description: string,
    imageUrl?: string,
    targetAmount: number,
    collectedAmount: number,
    urgencyLevel: 1 | 2 | 3,  // 1=Normal, 2=Urgent, 3=Critical
    isActive: boolean,
    createdAt?: string,
    createdOn?: string
  }
}
```

## Components

### 1. UrgentCaseCard

**Location:** `src/features/UrgentCases/components/urgent-list/UrgentCaseCard.tsx`

**Props:**
```typescript
interface UrgentCaseCardProps {
  caseId: number;           // Required: The ID of the urgent case to fetch
  onSuccess?: () => void;   // Optional: Callback when data changes
}
```

**Features:**
- Fetches case data directly from API by ID
- Displays card with:
  - Case image
  - Case title and description
  - Progress bar showing collection progress
  - Urgency level badge
  - Amount collected vs target amount
- Edit and delete buttons
- Loading state during data fetch
- Error state if fetch fails

**Usage:**
```tsx
import { UrgentCaseCard } from '@/features/UrgentCases/components/urgent-list/UrgentCaseCard';

export function MyComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UrgentCaseCard 
        caseId={123} 
        onSuccess={() => console.log('Case updated')}
      />
      <UrgentCaseCard caseId={124} />
      <UrgentCaseCard caseId={125} />
    </div>
  );
}
```

### 2. EditUrgentCaseModal

**Location:** `src/features/UrgentCases/components/urgent-forms/EditUrgentCaseModal.tsx`

**Props (Dual API):**

**Old API (Backward Compatible):**
```typescript
interface EditUrgentCaseModalProps {
  isOpen: boolean;           // Control modal visibility
  case: UrgentCase | null;   // Pre-fetched case data
  onClose: () => void;       // Called when closing
  onSuccess?: () => void;    // Called on successful update
}

// Usage:
<EditUrgentCaseModal
  isOpen={isEditOpen}
  case={selectedCase}
  onClose={() => setIsEditOpen(false)}
  onSuccess={() => refetchCases()}
/>
```

**New API (Recommended):**
```typescript
interface EditUrgentCaseModalProps {
  caseId: number;            // Case ID to fetch
  onClose: () => void;       // Called when closing
  onSuccess?: () => void;    // Called on successful update
}

// Usage:
<EditUrgentCaseModal
  caseId={123}
  onClose={() => setIsEditOpen(false)}
  onSuccess={() => handleSuccess()}
/>
```

**Features:**
- Accepts either pre-fetched case or just a case ID
- If caseId is provided, fetches data automatically via API
- Form validation
- Image upload with preview
- Urgency level selector (3 buttons: Normal, Urgent, Critical)
- Amount fields with validation
- Active/inactive toggle

### 3. DeleteUrgentCaseModal

**Location:** `src/features/UrgentCases/components/urgent-forms/DeleteUrgentCaseModal.tsx`

**Props:**
```typescript
interface DeleteUrgentCaseModalProps {
  caseItem: UrgentCase;
  onClose: () => void;
  onSuccess?: () => void;
}
```

## Hooks

### useUrgentCase(id: number)

**Location:** `src/features/UrgentCases/hooks/useUrgentCases.ts`

Fetches a single urgent case by ID using React Query.

```typescript
const { data, isLoading, isError, refetch } = useUrgentCase(123);
```

**Returns:**
```typescript
{
  data: UrgentCase | undefined,      // The fetched case
  isLoading: boolean,                // Loading state
  isError: boolean,                  // Error state
  refetch: () => void,               // Refetch function
  // ... other React Query hooks
}
```

### useUrgentCases()

Fetches all urgent cases.

```typescript
const { data, isLoading, isError } = useUrgentCases();
```

### useUpdateUrgentCase()

Updates an urgent case.

```typescript
const mutation = useUpdateUrgentCase();

mutation.mutateAsync({
  id: 123,
  payload: {
    title: 'Updated Title',
    urgencyLevel: 2,
    // ... other fields
  }
});
```

## Service Layer

### urgentCasesService

**Location:** `src/api/services/urgentCasesService.ts`

```typescript
export const urgentCasesService = {
  // Fetch single case by ID
  getById: async (id: number): Promise<UrgentCase>
  
  // Fetch all cases
  getAll: async (): Promise<UrgentCase[]>
  
  // Create new case
  create: async (payload: CreateUrgentCasePayload): Promise<UrgentCase>
  
  // Update existing case
  update: async (id: number, payload: UpdateUrgentCasePayload): Promise<UrgentCase>
  
  // Delete case
  delete: async (id: number): Promise<void>
}
```

## Example: Complete Implementation

### Grid of Case Cards

```tsx
import React, { useState } from 'react';
import { UrgentCaseCard } from '@/features/UrgentCases/components/urgent-list/UrgentCaseCard';
import { useUrgentCases } from '@/features/UrgentCases/hooks/useUrgentCases';

export function UrgentCasesGrid() {
  const { data: cases, isLoading, refetch } = useUrgentCases();

  if (isLoading) {
    return <div>Loading cases...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases?.map((caseItem) => (
        <UrgentCaseCard
          key={caseItem.id}
          caseId={caseItem.id}
          onSuccess={() => refetch()}
        />
      ))}
    </div>
  );
}
```

## Urgency Levels

```typescript
// UrgencyLevel enum: 1 = Normal, 2 = Urgent, 3 = Critical
export enum UrgencyLevel {
  NORMAL = 1,
  URGENT = 2,
  CRITICAL = 3,
}
```

### Urgency Level Labels (Arabic)

- `1` = عادي (Normal) - Blue badge
- `2` = عاجل (Urgent) - Orange badge
- `3` = حرج جداً (Critical) - Red badge

## Data Flow

```
User clicks "Edit" in UrgentCaseCard
    ↓
UrgentCaseCard opens EditUrgentCaseModal with caseId
    ↓
EditUrgentCaseModal uses useUrgentCase(caseId) hook
    ↓
Hook calls urgentCasesService.getById(caseId)
    ↓
Service makes GET /api/v1/emergency-cases/{id} request
    ↓
Response is normalized and cached by React Query
    ↓
Form is populated with fetched data
    ↓
User edits and submits
    ↓
updateMutation updates the case via API
    ↓
onSuccess callback triggers refetch in UrgentCaseCard
    ↓
Card displays updated data
```

## Caching Strategy

React Query Query Keys:
```typescript
const urgentCaseQueryKeys = {
  all: ['urgent-cases'] as const,
  lists: () => [...urgentCaseQueryKeys.all, 'list'],
  details: () => [...urgentCaseQueryKeys.all, 'detail'],
  detail: (id: number) => [...urgentCaseQueryKeys.details(), id],
};
```

**Cache Duration:**
- Stale time: 5 minutes
- Garbage collection time: Configured via `QUERY_GC_TIME`

## Error Handling

All components handle errors gracefully:

1. **UrgentCaseCard:** Shows error state if fetch fails
2. **EditUrgentCaseModal:** Shows error messages in form validation
3. **Hooks:** Toast notifications on error (handled by mutation hooks)

## Migration from Old Pattern

**Before (Old Pattern):**
```tsx
const { data } = useUrgentCases();
const selectedCase = data?.find(c => c.id === id);

<EditUrgentCaseModal
  isOpen={isOpen}
  case={selectedCase}
  onClose={() => setIsOpen(false)}
/>
```

**After (New Pattern):**
```tsx
<EditUrgentCaseModal
  caseId={id}
  onClose={() => setIsOpen(false)}
/>
```

## Benefits

✅ **Direct API Calls:** Each card fetches its own data
✅ **Reduced Props Drilling:** No need to pass data through multiple components
✅ **Better Caching:** React Query handles caching automatically
✅ **Separation of Concerns:** Components manage their own data
✅ **Scalability:** Easy to add more cards without data coordination
✅ **Real-time Updates:** Each card can refetch independently
