import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
}

let _accessToken: string | null = null;

export const tokenManager = {
    setAccessToken(token: string): void {
        _accessToken = token;
    },

    getAccessToken(): string | null {
        return _accessToken;
    },

    clearAccessToken(): void {
        _accessToken = null;
    },

    isAccessTokenExpired(): boolean {
        if (!_accessToken) return true;
        try {
            const decoded = jwtDecode<JwtPayload>(_accessToken);
            // Treat as expired 30 seconds before actual expiry
            return decoded.exp * 1000 - 30_000 < Date.now();
        } catch {
            return true;
        }
    },

    hasValidAccessToken(): boolean {
        return !!_accessToken && !this.isAccessTokenExpired();
    },
};