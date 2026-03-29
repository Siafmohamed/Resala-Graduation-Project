import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './tokenManager';
import type { RefreshTokenResponse } from '../types/auth.types';

// In production, we must use relative paths to avoid "Mixed Content" errors (HTTPS -> HTTP).
// Vercel rewrites in vercel.json will handle the proxying to the backend.
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If we're in production and the URL is absolute HTTP, we ignore it to prevent Mixed Content errors.
  // Instead, we return an empty string to use relative paths which Vercel will proxy.
  if (import.meta.env.PROD && envUrl?.startsWith('http://')) {
    return '';
  }
  
  return envUrl || '';
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const rawAxios = axios.create({
  baseURL: getBaseURL(),
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function doRefresh(): Promise<string | null> {
  const session = tokenManager.getSessionData<any>();
  if (!session?.refreshToken) {
    console.warn('[Auth] No refresh token available');
    return null;
  }

  try {
    console.log('[Auth] Attempting to refresh access token...');
    
    // We send the refreshToken in the body as per RefreshTokenResponse interface
    // But we ALSO attach it as a Bearer token just in case the backend requires it for the refresh endpoint
    const { data } = await rawAxios.post<RefreshTokenResponse>(
      '/v1/auth/refresh-token',
      { refreshToken: session.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${session.refreshToken}`
        }
      }
    );

    if (data.succeeded && data.data) {
      console.log('[Auth] Token refreshed successfully');
      
      const newSession = {
        ...session,
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken || session.refreshToken
      };
      
      // Update session in localStorage via tokenManager
      tokenManager.setSessionData(newSession);
      
      return data.data.token;
    }
    
    console.warn('[Auth] Refresh failed: succeeded=false');
    return null;
  } catch (err) {
    console.error('[Auth] Refresh error:', err);
    return null;
  }
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach Authorization header if token exists in session
    const session = tokenManager.getSessionData<any>();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. Handle Network Errors
    if (!error.response) {
      console.error("Network error or server unreachable");
      return Promise.reject(error);
    }

    // 2. Only handle 401 Unauthorized
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // 3. Prevent infinite loops on auth endpoints
    const url = originalRequest.url ?? '';
    if (
      url.includes('/v1/auth/login') ||
      url.includes('/v1/auth/refresh-token') ||
      url.includes('/v1/auth/logout')
    ) {
      tokenManager.clearTokens();
      window.dispatchEvent(new Event('auth:session-expired'));
      return Promise.reject(error);
    }

    // 4. Silent Retry: only retry once
    if (originalRequest._retry) {
      tokenManager.clearTokens();
      window.dispatchEvent(new Event('auth:session-expired'));
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 5. Handle Concurrent Refreshes
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const result = await doRefresh();
      
      // Set refreshing to false BEFORE processing queue and retrying
      isRefreshing = false;

      if (result) {
        processQueue(null, result);
        return axiosInstance(originalRequest);
      } else {
        processQueue(new Error("Refresh failed"));
        tokenManager.clearTokens();
        window.dispatchEvent(new Event('auth:session-expired'));
        return Promise.reject(error);
      }
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);
      tokenManager.clearTokens();
      window.dispatchEvent(new Event('auth:session-expired'));
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
