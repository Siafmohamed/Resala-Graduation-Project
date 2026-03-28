# API Path Configuration Guide

## ✅ Fixed Configuration (No More Duplicate Paths!)

### 1. **Axios Base URL** (`axiosInstance.ts`)
```typescript
const axiosInstance = axios.create({
 baseURL: '/api', // ← ONLY /api, NOT /api/v1
 timeout: 10_000,
 headers: { 'Content-Type': 'application/json' },
 withCredentials: true,
});
```

### 2. **Service Calls** (`authService.ts`)
```typescript
export const authService = {
 async login(credentials: LoginCredentials): Promise<AuthResponse> {
 const { data } = await axiosInstance.post<AuthResponse>(
   '/v1/auth/login',  // ← Just /v1, NOT /api/v1
  credentials,
 );
 return data;
 },

 async createStaff(payload: StaffCreatePayload, token: string): Promise<StaffCreateResponse> {
 const { data } = await axiosInstance.post<StaffCreateResponse>(
   '/v1/auth/create-staff',  // ← Just /v1, NOT /api/v1
  payload,
   {
  headers: {
    Authorization: `Bearer ${token}`,
    },
   }
 );
 return data;
 },
};
```

### 3. **Vite Proxy** (`vite.config.ts`)
```typescript
server: {
 proxy: {
  '/api': {
    target: 'http://resala.runasp.net',
    changeOrigin: true,
  secure: false,
  }
 }
}
```

---

## 🎯 How It Works

### Request Flow:

1. **Frontend Call:**
   ```typescript
   axiosInstance.post('/v1/auth/login')
   // Result: /api + /v1/auth/login = /api/v1/auth/login
   ```

2. **Vite Proxy Intercepts:**
   ```
   Frontend: /api/v1/auth/login
   ↓
   Proxy sees "/api" prefix
   ↓
  Forwards to: http://resala.runasp.net/api/v1/auth/login
   ```

3. **Backend Receives:**
   ```
   POST http://resala.runasp.net/api/v1/auth/login
   ```

---

## 📐 General Rules

### ✅ DO:
- Set `baseURL: '/api'` in axios instance
- Use paths like `/v1/endpoint` in service calls
- Configure Vite proxy for `/api` prefix

### ❌ DON'T:
- Don't use `/api/v1` in baseURL (causes duplication)
- Don't use full paths like `/api/v1/...` in service calls
- Don't hardcode full URLs like `http://...` in frontend code

---

## 🔧 Quick Reference Table

| Component | Value | Purpose |
|-----------|-------|---------|
| `axios.baseURL` | `/api` | Combines with service paths |
| Service path | `/v1/auth/login` | Appended to baseURL |
| Vite proxy | `/api` → `http://resala.runasp.net` | Forwards requests |
| **Final URL** | `http://resala.runasp.net/api/v1/auth/login` | What backend receives |

---

## 🚀 Working Examples

### Login Endpoint:
```typescript
// Code:
axiosInstance.post('/v1/auth/login', { username, password })

// Becomes:
/api + /v1/auth/login = /api/v1/auth/login

// Proxied to:
http://resala.runasp.net/api/v1/auth/login
```

### Create Staff Endpoint:
```typescript
// Code:
axiosInstance.post('/v1/auth/create-staff', payload, { headers })

// Becomes:
/api + /v1/auth/create-staff = /api/v1/auth/create-staff

// Proxied to:
http://resala.runasp.net/api/v1/auth/create-staff
```

---

## 🎓 Key Takeaway

**Formula:**
```
baseURL ('/api') + servicePath ('/v1/endpoint') = Final Path ('/api/v1/endpoint')
                                              ↓
                                    Vite proxies to backend
```

This avoids duplication and keeps your configuration clean! ✨
