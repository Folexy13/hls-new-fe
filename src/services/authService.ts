
import { apiClient } from '../config/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v2/auth/login', credentials);
    return response.data.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v2/auth/register', userData);
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v2/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/api/v2/auth/logout', {
      refresh_token: refreshToken,
    });
  },
};
