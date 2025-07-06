
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
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/v2/auth/login', credentials);
      const data = response.data.data;
      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Login successful, token stored:', token);
      } else {
        console.warn('No token found in login response:', data);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/v2/auth/register', userData);
      const data = response.data.data;
      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Registration successful, token stored:', token);
      } else {
        console.warn('No token found in registration response:', data);
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v2/auth/refresh', {
    refreshToken,
    });
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/api/v2/auth/logout', {
      refreshToken,
    });
  },
};
