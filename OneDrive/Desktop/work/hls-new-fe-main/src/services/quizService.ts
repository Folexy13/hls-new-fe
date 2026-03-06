import { apiClient } from "../config/axios";

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
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const quizService = {
  async submitQuizData(quizData: any): Promise<void> {
    await apiClient.post("/api/v2/auth/quiz", {
      quizData,
    });
  },
};
