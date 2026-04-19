# UrgencyLevel System - Quick Reference Guide

## Overview
The UrgencyLevel system has been refactored from a simple toggle to a **proper 3-state enum-based selector** with full type safety.

## Values

| Value | Label (Arabic) | Label (English) | Color | Icon |
|-------|---|---|---|---|
| **1** | عادي | Normal | 🔵 Blue | AlertCircle |
| **2** | عاجل | Urgent | 🟠 Orange | Zap |
| **3** | حرج جداً | Critical | 🔴 Red | Flame |

## Core Files

### Type Definitions
```typescript
// src/features/UrgentCases/types/urgency-level.types.ts
export enum UrgencyLevel {
  Normal = 1,
  Urgent = 2,
  Critical = 3,
}

// Usage in components:
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);
```

### Component Structure
- **UrgencyLevelSelector**: 3-button selector component
  - Displays options visually with colors and icons
  - Handles selection via `onChange` callback
  - Type-safe with `UrgencyLevel` enum

```typescript
// Usage:
<UrgencyLevelSelector 
  value={urgencyLevel} 
  onChange={setUrgencyLevel}
/>
```

### Form Implementation

**AddUrgentCaseModal:**
```typescript
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);

// Validate
if (!urgencyLevel || (urgencyLevel !== 1 && urgencyLevel !== 2 && urgencyLevel !== 3)) {
  setError('يجب تحديد مستوى الأولوية.');
  return false;
}

// Submit
await createMutation.mutateAsync({
  urgencyLevel,  // Send enum value (1, 2, or 3)
  // ... other fields
});
```

**EditUrgentCaseModal:**
```typescript
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);

// Pre-fill from case data
setUrgencyLevel(
  typeof caseData.urgencyLevel === 'number'
    ? (caseData.urgencyLevel as UrgencyLevel)
    : UrgencyLevel.Normal
);

// Submit (note the payload wrapper)
await updateMutation.mutateAsync({
  id: caseData.id,
  payload: {
    urgencyLevel,  // Send enum value (1, 2, or 3)
    // ... other fields
  }
});
```

## API Integration

### Create Request
```json
{
  "Title": "...",
  "Description": "...",
  "RequiredAmount": 5000,
  "ReceivedAmount": 0,
  "UrgencyLevel": 2,  // Send as number: 1, 2, or 3
  "Image": "..."
}
```

### Update Request
```json
{
  "id": 123,
  "urgencyLevel": 1,  // Send as number: 1, 2, or 3
  "title": "...",
  "description": "...",
  // ... other fields
}
```

## Display Usage

### Show as Badge
```typescript
import { UrgencyLevelBadge } from '@/features/UrgentCases/components/urgent-list/UrgencyLevelBadge';

<UrgencyLevelBadge 
  level={caseData.urgencyLevel}  // Pass number or enum
  showIcon={true}
  animate={true}
/>
```

### Get Label
```typescript
import { getUrgencyLevelLabel } from '@/features/UrgentCases/types/urgency-level.types';

const label = getUrgencyLevelLabel(2);  // Returns: "عاجل"
```

## Default Behavior

- **Form Default:** Always `UrgencyLevel.Normal` (1)
- **Pre-fill Fallback:** If data is invalid, uses `UrgencyLevel.Normal` (1)
- **API Fallback:** If missing, server defaults to `UrgencyLevel.Normal` (1)

## Validation

**Required Fields:**
- ✅ Urgency level must be selected (default is Normal)
- ✅ Must be valid enum value (1, 2, or 3)
- ✅ Can't be null or undefined after selection

**Error Messages:**
```typescript
'يجب تحديد مستوى الأولوية.'  // Arabic
// Translates to: "You must select an urgency level."
```

## Type Safety

### All interfaces use UrgencyLevel enum
```typescript
interface CreateUrgentCasePayload {
  urgencyLevel: UrgencyLevel;  // NOT number, NOT string
}

interface UpdateUrgentCasePayload {
  urgencyLevel?: UrgencyLevel;  // Optional but strongly typed
}

interface UrgentCase {
  urgencyLevel: UrgencyLevel;  // NOT number, NOT string
}
```

## Common Patterns

### Initialize state
```typescript
const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.Normal);
```

### Handle change
```typescript
<UrgencyLevelSelector 
  value={urgencyLevel}
  onChange={setUrgencyLevel}  // Receives UrgencyLevel value
/>
```

### Reset to default
```typescript
setUrgencyLevel(UrgencyLevel.Normal);  // Reset to 1
```

### Convert from API data
```typescript
// If received as number from API:
const level = Number(apiData.urgencyLevel) as UrgencyLevel;

// If type is uncertain:
const level = typeof data === 'number' 
  ? (data as UrgencyLevel)
  : UrgencyLevel.Normal;
```

## Testing Checklist

- [ ] Default selection on form load is Normal (blue)
- [ ] Clicking each button selects that option
- [ ] Selected button shows highlighted state
- [ ] Form validates that a value is selected
- [ ] API payload contains correct numeric value (1, 2, or 3)
- [ ] Pre-filled value matches existing case urgency
- [ ] Badge displays correct color and label
- [ ] Update immediately reflects in optimistic UI

## Troubleshooting

**Issue:** Type error "not assignable to type UrgencyLevel"
```
Solution: Ensure you're passing enum value (1, 2, 3) or converting from number
const level = Number(value) as UrgencyLevel;
```

**Issue:** Badge shows "غير محدد" (undefined)
```
Solution: Check that urgencyLevel value is 1, 2, or 3
console.log(caseData.urgencyLevel);  // Should be 1, 2, or 3
```

**Issue:** Form won't submit with error "يجب تحديد مستوى الأولوية"
```
Solution: Ensure urgencyLevel state is set to a valid value
setUrgencyLevel(UrgencyLevel.Normal);  // Reset to default
```

---

**Last Updated:** April 19, 2026  
**Version:** 1.0 - Post-Refactoring  
**Status:** ✅ Production Ready
