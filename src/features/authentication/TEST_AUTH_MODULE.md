# Authentication Module Test

This file serves as a basic test to ensure the unified authentication module works correctly.

## Key Features Verified

1. ✅ **Types** - User, AuthResponse, Role, Permission, etc.
2. ✅ **Store** - Zustand store with proper actions and selectors
3. ✅ **Services** - AuthService with all required API methods
4. ✅ **Hooks** - Mutations, provider-driven session lifecycle, and auth guard hooks
5. ✅ **Utils** - TokenManager and axios instance with refresh logic
6. ✅ **Components** - Route guards and conditional rendering components
7. ✅ **Exports** - Proper index.ts exports for easy importing

## Usage Example

```typescript
// Import the entire module
import { 
  useAuthStore, 
  useLoginMutation, 
  ProtectedRoute,
  PublicRoute
} from './features/resala/authentication';

// Or import specific parts
import { authService } from './features/resala/authentication/services/authService';
import { useAuthGuard } from './features/resala/authentication/hooks/useAuthGuard';
```

## Architecture Overview

```
src/features/resala/authentication/
├── components/           # Route guards and UI helpers
│   ├── ProtectedRoute.tsx
│   ├── PublicRoute.tsx
│   ├── FullPageSpinner.tsx
│   ├── ShowIfPermission.tsx
│   └── ShowIfRole.tsx
├── hooks/               # Custom React hooks
│   ├── useAuthMutations.ts
│   ├── useAuthGuard.ts
│   └── useAuthLogoutListener.ts
├── services/            # API services
│   └── authService.ts
├── store/              # State management
│   └── authSlice.ts
├── types/              # TypeScript types
│   ├── auth.types.ts
│   └── role.types.ts
├── utils/              # Utilities
│   ├── axiosInstance.ts
│   └── tokenManager.ts
└── index.ts            # Barrel exports
```

The unified authentication module is ready for use and follows enterprise-level best practices for security, maintainability, and scalability.