import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './tokenManager';

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // CRITICAL: sends HttpOnly cookie automatically
});

// ── Request Interceptor ──────────────────────────────────
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Double-check withCredentials
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Only handle 401 errors
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Avoid infinite loop: don't retry refresh or login endpoints
        const url = originalRequest.url ?? '';
        if (url.includes('/auth/refresh') || url.includes('/auth/login')) {
            return Promise.reject(error);
        }

        // Prevent duplicate retry
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // If already refreshing, queue the request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token as string}`;
                return axiosInstance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axiosInstance.post<{ accessToken: string }>(
                '/auth/refresh',
            );

            const newToken = data.accessToken;
            tokenManager.setAccessToken(newToken);

            // Sync Zustand store — lazy import to avoid circular dependency
            const { useAuthStore } = await import('../store/authSlice');
            useAuthStore.getState().setAccessToken(newToken);

            processQueue(null, newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            tokenManager.clearAccessToken();

            // Dispatch session-expired event for logout listener
            window.dispatchEvent(new Event('auth:session-expired'));

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default axiosInstance;