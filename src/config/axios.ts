
import axios from 'axios';
import { API_BASE_URL } from './env';
import { tokenManager } from '../utils/tokenManager';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

// Request interceptor to add bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          // Avoid multiple concurrent refreshes causing token invalidation.
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${API_BASE_URL}/api/v2/auth/refresh`, { refreshToken })
              .then((response) => {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
                tokenManager.setTokens(accessToken, newRefreshToken);
                return { accessToken, refreshToken: newRefreshToken };
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const { accessToken } = await refreshPromise;

          // Retry original request with new token
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed, logging out:', refreshError);
          tokenManager.clearTokens();
          window.location.href = '/auth/signin';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, force logout
        tokenManager.clearTokens();
        window.location.href = '/auth/signin';
      }
    }

    return Promise.reject(error);
  }
);
