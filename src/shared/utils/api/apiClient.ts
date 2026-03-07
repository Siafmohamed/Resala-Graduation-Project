import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/**
 * Shared Axios instance for non-auth API calls.
 * For authenticated requests, attach the token in your feature's service
 * or use the auth module's axiosInstance (which has interceptors).
 *
 * When using mock data, replace this with a mock adapter in development:
 * e.g. new MockAdapter(apiClient) and reply with mock data.
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
