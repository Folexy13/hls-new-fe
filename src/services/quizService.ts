import { apiClient } from "../config/axios";

export interface QuizCodeValidationResponse {
  valid: boolean;
  quizCode: {
    code: string;
    benfekName: string;
    benfekPhone: string;
    createdBy: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export interface CreateQuizCodeRequest {
  benfekName: string;
  benfekPhone: string;
  allergies?: string;
  scares?: string;
  familyCondition?: string;
  medications?: string;
  hasCurrentCondition?: boolean;
}

export interface QuizCode {
  id: number;
  code: string;
  isUsed: boolean;
  usedBy: number | null;
  usedAt: string | null;
  benfekName: string;
  benfekPhone: string;
  allergies: string | null;
  scares: string | null;
  familyCondition: string | null;
  medications: string | null;
  hasCurrentCondition: boolean;
  createdAt: string;
}

export const quizService = {
  /**
   * Validate a quiz code (public endpoint)
   */
  async validateQuizCode(code: string): Promise<QuizCodeValidationResponse> {
    const response = await apiClient.post("/api/v2/quiz-code/validate", { code });
    return response.data.data;
  },

  /**
   * Create a new quiz code (Principal only)
   */
  async createQuizCode(data: CreateQuizCodeRequest): Promise<QuizCode> {
    const response = await apiClient.post("/api/v2/quiz-code/create", data);
    return response.data.data;
  },

  /**
   * Get quiz codes created by the current principal
   */
  async getMyQuizCodes(page: number = 1, limit: number = 10): Promise<{
    codes: QuizCode[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`/api/v2/quiz-code/my-codes?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  /**
   * Delete a quiz code
   */
  async deleteQuizCode(id: number): Promise<void> {
    await apiClient.delete(`/api/v2/quiz-code/${id}`);
  },

  /**
   * Submit quiz/assessment data
   */
  async submitQuizData(quizData: {
    code: string;
    basic: {
      gender: string;
      nickname?: string;
      age: string;
      weight: string;
      height: string;
    };
    lifestyle: {
      habit: string;
      fun: string;
      routine: string;
      career: string;
    };
    preference: {
      drugForm: string;
      minBudget: string;
      maxBudget: string;
    };
  }): Promise<void> {
    await apiClient.post("/api/v2/auth/quiz", { quizData });
  },
};
