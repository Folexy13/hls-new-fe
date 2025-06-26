
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

// Request interceptor to add bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    // alert(`Token: ${token}`); // Debugging line to check token
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
          const response = await axios.post(`${API_BASE_URL}/api/v2/auth/refresh`, {
            refreshToken
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          tokenManager.setTokens(access_token, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          tokenManager.clearTokens();
          window.location.href = '/auth/signin';
        }
      }
    }

    return Promise.reject(error);
  }
);
