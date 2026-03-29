import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
    [key: string]: unknown;
}

// ── Storage Keys ─────────────────────────────────────────
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'resala_access_token',
    REFRESH_TOKEN: 'resala_refresh_token',
    SESSION_DATA: 'resala_session',
} as const;

// ── Token Manager (Cookie-based, production grade) ────────────────────────
export const tokenManager = {
    // NOTE: Tokens are now stored in HTTP-only secure cookies by the server.
    // Frontend does not directly access access_token or refresh_token.
    // We rely on 'withCredentials: true' for all requests.

    // For backwards compatibility and session UI state:
    setTokens(_accessToken: string, _refreshToken: string): void {
        // No-op: handled by server cookies
    },

    getAccessToken(): string | null {
        const session = this.getSessionData<any>();
        return session?.accessToken || null;
    },

    getRefreshToken(): string | null {
        const session = this.getSessionData<any>();
        return session?.refreshToken || null;
    },

    clearTokens(): void {
        localStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        // Also clear any other potential auth-related keys
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('resala_')) {
                localStorage.removeItem(key);
            }
        });
        sessionStorage.clear();
        // Note: Logout endpoint should clear cookies on the server
    },

    // ── Session data persistence (Non-sensitive info only) ─────────────
    setSessionData(data: any): void {
        localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(data));
    },

    getSessionData<T>(): T | null {
        const raw = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
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
        const decoded = this.decodeToken<any>(token);
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
    updateAccessToken(_accessToken: string): void {
        // Handled by server cookies
    },
};