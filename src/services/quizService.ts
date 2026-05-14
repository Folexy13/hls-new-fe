import { apiClient } from "../config/axios";

export interface CompleteQuizPayload {
  code: string;
  basics: {
    nickname?: string;
    weight: string;
    height: string;
  };
  lifestyle: {
    habits: string;
    funActivities: string;
    desires: string;
    priority: string;
  };
  preferences: {
    drugForm: string;
    budget: number;
  };
}

export const quizService = {
  async submitQuizData(quizData: CompleteQuizPayload): Promise<void> {
    await apiClient.post("/api/v2/quiz-code/complete", quizData);
  },
};
