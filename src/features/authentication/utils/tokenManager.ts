import { jwtDecode } from 'jwt-decode';
import type { SessionData } from '../types/auth.types';

interface JwtPayload {
    exp: number;
    [key: string]: unknown;
}

interface SessionDataStorage extends Partial<SessionData> {
    [key: string]: unknown;
}

// ── Storage Keys ─────────────────────────────────────────
const STORAGE_KEYS = {
    SESSION_DATA: 'resala_session',
} as const;

type AccessTokenAdapter = {
    get: () => string | null;
    set: (token: string | null) => void;
    clear: () => void;
};

// Access token storage adapter.
// Keeping this isolated makes it easy to swap localStorage with in-memory later.
const localStorageAccessTokenAdapter: AccessTokenAdapter = {
    get: () => {
        const session = tokenManager.getSessionData();
        return session?.accessToken || null;
    },
    set: (token) => {
        const session: SessionDataStorage = tokenManager.getSessionData() || {};
        if (token) {
            session.accessToken = token;
        } else {
            delete session.accessToken;
        }
        tokenManager.setSessionData(session as SessionData);
    },
    clear: () => {
        const session = tokenManager.getSessionData();
        if (!session) return;
        delete (session as any).accessToken;
        tokenManager.setSessionData(session);
    },
};

// ── Token Manager (localStorage with full session data) ──
export const tokenManager = {
    accessTokenAdapter: localStorageAccessTokenAdapter,

    // Store complete session data including tokens
    setSessionData(data: SessionData): void {
        localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(data));
    },

    getSessionData<T = SessionData>(): T | null {
        const raw = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    },

    getAccessToken(): string | null {
        return this.accessTokenAdapter.get();
    },

    setAccessToken(accessToken: string): void {
        this.accessTokenAdapter.set(accessToken);
    },

    getRefreshToken(): string | null {
        const session = this.getSessionData();
        return session?.refreshToken || null;
    },

    clearTokens(): void {
        this.accessTokenAdapter.clear();
        localStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
        
        // Clear all app-specific keys from localStorage and sessionStorage
        const clearPrefixed = (storage: Storage) => {
            const keysToRemove: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && (key.startsWith('resala_') || key.includes('auth') || key.includes('session'))) {
                    // Be careful not to remove generic "token" from other apps on same domain
                    // if it doesn't look like it belongs to us.
                    // But in this project's context, most auth keys should be cleared.
                    if (key.startsWith('resala_') || (key.includes('auth') && !key.includes('firebase'))) {
                        keysToRemove.push(key);
                    }
                }
            }
            keysToRemove.forEach(key => storage.removeItem(key));
        };

        clearPrefixed(localStorage);
        clearPrefixed(sessionStorage);
        
        // Ensure sessionStorage is completely cleared as it's tab-specific
        sessionStorage.clear();
    },

    // ── Token validation ─────────────────────────────────
    // Check if the JWT token has expired (using a 5-second buffer)
    isAccessTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) return true; // No token means expired/invalid
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            if (!decoded.exp) return false; // If no exp claim, assume valid conceptually until 401
            return (decoded.exp * 1000) - 5000 < Date.now();
        } catch {
            return true; // Parse error means invalid token
        }
    },

    /**
     * Decode JWT and extract data
     */
    decodeToken<T = JwtPayload>(token: string): T | null {
        try {
            return jwtDecode<T>(token);
        } catch {
            return null;
        }
    },

    /**
     * Get role from access token claims
     */
    getRoleFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;
        const decoded = this.decodeToken(token);
        // Common JWT claim names for roles: 'role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        return decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    },

    hasValidAccessToken(): boolean {
        return this.hasStoredSession() && !this.isAccessTokenExpired();
    },

    hasStoredSession(): boolean {
        return !!this.getSessionData();
    },

    // ── Update only the access token (after refresh) ─────
    updateAccessToken(accessToken: string): void {
        this.accessTokenAdapter.set(accessToken || null);
    },
};