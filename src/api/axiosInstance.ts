import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '@/features/authentication/utils/tokenManager';

export interface UnifiedApiError {
  status: number;
  message: string;
  originalError: unknown;
}

type RetriableConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
  _retry?: boolean;
};

const API_TIMEOUT_MS = 15_000;
const RETRY_DELAYS_MS = [1000, 2000, 4000];
let activeRequests = 0;
const loadingListeners = new Set<(isLoading: boolean) => void>();

const getBaseURL = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (envBaseUrl) return envBaseUrl;
  return '/api';
};

const pendingControllers = new Set<AbortController>();
const requestControllers = new WeakMap<object, AbortController>();
const refreshClient = axios.create({
  baseURL: getBaseURL(),
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
});

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

// `isRefreshing` acts as a mutex for refresh calls.
// When true, there is already an in-flight refresh request and no other request is allowed
// to trigger another refresh call.
let isRefreshing = false;
// `failedQueue` stores requests that got 401 while refresh is in progress.
// Once refresh succeeds, every queued request is replayed with the new token.
let failedQueue: QueueItem[] = [];
// `refreshController` tracks the in-flight refresh request so it can be aborted on logout.
let refreshController: AbortController | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const isRefreshUrl = (url?: string) => !!url && url.includes('/v1/auth/refresh-token');
const processFailedQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (token) {
      item.resolve(token);
      return;
    }
    item.reject(error);
  });
  failedQueue = [];
};

const setAuthorizationHeader = (request: RetriableConfig, token: string) => {
  const headers = request.headers as { set?: (header: string, value: string) => void; Authorization?: string };
  if (typeof headers?.set === 'function') {
    headers.set('Authorization', `Bearer ${token}`);
    return;
  }
  request.headers = { ...(request.headers || {}), Authorization: `Bearer ${token}` } as RetriableConfig['headers'];
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshController) {
    refreshController.abort();
  }
  refreshController = new AbortController();

  try {
    const response = await refreshClient.post('/v1/auth/refresh-token', {}, {
      signal: refreshController.signal,
    });
    const refreshedToken = response?.data?.data?.token as string | undefined;
    if (!refreshedToken) {
      throw new Error('Refresh endpoint did not return a token');
    }
    tokenManager.setAccessToken(refreshedToken);
    return refreshedToken;
  } finally {
    refreshController = null;
  }
};
const emitLoading = () => {
  const isLoading = activeRequests > 0;
  loadingListeners.forEach((listener) => listener(isLoading));
};

export const apiLoadingState = {
  subscribe(listener: (isLoading: boolean) => void) {
    loadingListeners.add(listener);
    listener(activeRequests > 0);
    return () => loadingListeners.delete(listener);
  },
  isLoading: () => activeRequests > 0,
};

const shouldRetry = (error: AxiosError, retryCount: number): boolean => {
  if (retryCount >= RETRY_DELAYS_MS.length) return false;

  const status = error.response?.status;
  if (status && [400, 401, 403, 404].includes(status)) return false;
  if (status === 503) return true;

  const isTimeout = error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout');
  const isNetwork = !error.response;
  return isTimeout || isNetwork;
};

const buildUnifiedError = (error: AxiosError): UnifiedApiError => {
  if (!error.response) {
    return {
      status: 0,
      message: 'Network error: unable to reach the server.',
      originalError: error,
    };
  }

  const responseData = error.response.data as { message?: string } | undefined;
  return {
    status: error.response.status,
    message: responseData?.message || error.message || 'Unexpected API error',
    originalError: error,
  };
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  activeRequests += 1;
  emitLoading();
  const token = tokenManager.getAccessToken() 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Default `Content-Type: application/json` breaks FormData: body is multipart but the
  // header still said JSON → 415. Remove it so the runtime sets multipart with boundary.
  if (config.data instanceof FormData) {
    const h = config.headers;
    if (h && typeof (h as { delete?: (key: string) => void }).delete === 'function') {
      (h as { delete: (key: string) => void }).delete('Content-Type');
    } else {
      delete (h as Record<string, unknown>)['Content-Type'];
    }
  }

  config.headers['X-Request-ID'] = crypto.randomUUID();

  const controller = new AbortController();
  pendingControllers.add(controller);
  config.signal = controller.signal;
  requestControllers.set(config, controller);

  if (import.meta.env.DEV) {
    const method = (config.method || 'GET').toUpperCase();
    console.log(`[API] ${method} ${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    emitLoading();
    const controller = requestControllers.get(response.config);
    if (controller) pendingControllers.delete(controller);
    return response.data;
  },
  async (error: AxiosError) => {
    activeRequests = Math.max(0, activeRequests - 1);
    emitLoading();
    const originalRequest = error.config as RetriableConfig | undefined;
    const controller = originalRequest ? requestControllers.get(originalRequest) : undefined;
    if (controller) pendingControllers.delete(controller);

    // Enhanced error logging for debugging
    if (error.response) {
      const method = (originalRequest?.method || 'GET').toUpperCase();
      const url = originalRequest?.url || 'unknown';
      const status = error.response.status;
      const errorData = error.response.data;
      console.log('[API ERROR FULL DATA]:', error.response?.data);
      if (import.meta.env.DEV) {
        console.error(`[API ERROR] ${method} ${url} - ${status}`);
        console.error('[API ERROR] Response:', errorData);
        if (originalRequest?.data) {
          console.error('[API ERROR] Request Payload:', originalRequest.data);
        }
        // Log token info for debugging auth issues
        const currentToken = tokenManager.getAccessToken();
        if (currentToken) {
          const role = tokenManager.getRoleFromToken();
          const decoded = tokenManager.decodeToken<{ exp?: number }>(currentToken);
          console.log('[API ERROR] Current token role:', role, 'exp:', new Date(decoded?.exp ? decoded.exp * 1000 : 0));
        }
      }
    }

    // Handle 403 Forbidden - might indicate role/permission issue after session switch
    if (error.response?.status === 403) {
      if (import.meta.env.DEV) {
        console.warn('[API] 403 Forbidden - possible role/permission mismatch after session switch');
      }
      // Don't retry 403 - it's a permanent permission issue
      throw buildUnifiedError(error);
    }

    if (error.response?.status === 401 && originalRequest && !isRefreshUrl(originalRequest.url)) {
      if (originalRequest._retry) {
        tokenManager.clearTokens();
        window.dispatchEvent(new Event('auth:session-expired'));
        throw buildUnifiedError(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken) => {
              setAuthorizationHeader(originalRequest, newToken);
              resolve(api(originalRequest as AxiosRequestConfig));
            },
            reject: (queueError) => reject(queueError),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processFailedQueue(null, newToken);
        setAuthorizationHeader(originalRequest, newToken);
        return api(originalRequest as AxiosRequestConfig);
      } catch (refreshError) {
        processFailedQueue(refreshError, null);
        tokenManager.clearTokens();
        window.dispatchEvent(new Event('auth:session-expired'));
        throw buildUnifiedError(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      if (shouldRetry(error, retryCount)) {
        originalRequest._retryCount = retryCount + 1;
        await sleep(RETRY_DELAYS_MS[retryCount]);
        return api(originalRequest as AxiosRequestConfig);
      }
    }

    throw buildUnifiedError(error);
  },
);

/**
 * Clears all pending request state and cancels in-flight requests.
 * Called on logout/role switch to prevent stale tokens from being used.
 * This ensures the old session's request queue doesn't interfere with the new session.
 */
export const clearAxiosInterceptorState = (): void => {
  // Cancel all pending requests
  pendingControllers.forEach(controller => {
    try {
      controller.abort();
    } catch {
      // Ignore abort errors if controller already aborted
    }
  });
  pendingControllers.clear();

  // Abort any in-flight refresh request to prevent race conditions during logout
  if (refreshController) {
    try {
      refreshController.abort();
    } catch {
      // Ignore abort errors
    }
    refreshController = null;
  }
  
  // Reset the request controller WeakMap by clearing references
  // (WeakMap cleanup happens automatically with GC, but we document this here)
  
  // Clear the failed request queue to prevent stale requests from being retried
  failedQueue = [];
  
  // Reset the refresh mutex flag
  isRefreshing = false;

  if (import.meta.env.DEV) {
    console.log('[Axios] Interceptor state cleared - all pending requests cancelled');
  }
};

export default api;
