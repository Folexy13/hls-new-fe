
import axios from 'axios';
import { API_BASE_URL } from './env';
import { tokenManager } from '../utils/tokenManager';
import { getSafeUserMessage } from '../utils/apiError';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

export const refreshAuthTokens = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

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

  return refreshPromise;
};

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
    const responseData = error.response?.data;
    const requestUrl = String(originalRequest?.url || '');
    const isAuthRequest = requestUrl.includes('/api/v2/auth/login')
      || requestUrl.includes('/api/v2/auth/register')
      || requestUrl.includes('/api/v2/auth/refresh')
      || requestUrl.includes('/api/v2/auth/forgot-password')
      || requestUrl.includes('/api/v2/auth/reset-password');

    if (responseData?.message) {
      responseData.message = getSafeUserMessage(responseData.message);
    }

    if (typeof responseData?.error === 'string') {
      responseData.error = getSafeUserMessage(responseData.error);
    }

    if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshAuthTokens();

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
    }

    return Promise.reject(error);
  }
);
