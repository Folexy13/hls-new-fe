import { apiClient } from "@/config/axios";

export interface PrincipalProfilePayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  profession?: string;
  currentPlaceOfWork?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  preferredPaymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  password?: string;
}

export const principalService = {
  async getMe() {
    const response = await apiClient.get("/api/v2/principals/me");
    return response.data?.data;
  },

  async updateMe(payload: PrincipalProfilePayload) {
    const response = await apiClient.put("/api/v2/principals/me", payload);
    return response.data?.data;
  },

  async getIncomeSummary() {
    const response = await apiClient.get("/api/v2/principals/me/income-summary");
    return response.data?.data;
  },

  async getWallet() {
    const response = await apiClient.get("/api/v2/wallet");
    return response.data?.data?.wallet ?? null;
  },

  async getWithdrawals() {
    const response = await apiClient.get("/api/v2/wallet/withdrawals");
    return response.data?.data?.withdrawals ?? [];
  },
};
