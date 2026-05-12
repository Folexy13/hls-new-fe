import { apiClient } from "@/config/axios";

export interface PrincipalProfilePayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  profession?: string;
  currentPlaceOfWork?: string;
  workCityAddress?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  referPharmacy?: boolean;
  referredPharmacyName?: string;
  referredPharmacyPhone?: string;
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

  async requestWithdrawal(payload: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) {
    const response = await apiClient.post("/api/v2/wallet/withdrawals", payload);
    return response.data?.data?.withdrawal;
  },

  async resolveCredit(id: number) {
    const response = await apiClient.post(`/api/v2/principals/me/credits/${id}/resolve`);
    return response.data?.data;
  },

  async getNotificationSummary(): Promise<{
    count: number;
    items?: Array<{ id: number; title: string; message: string; href?: string; count?: number; isRead?: boolean }>;
  }> {
    const response = await apiClient.get("/api/v2/principals/me/notifications");
    return response.data?.data ?? { count: 0, items: [] };
  },

  async markNotificationRead(id: number) {
    const response = await apiClient.patch(`/api/v2/principals/me/notifications/${id}/read`);
    return response.data?.data;
  },

  async markAllNotificationsRead() {
    const response = await apiClient.patch("/api/v2/principals/me/notifications/read-all");
    return response.data?.data;
  },

  async deleteNotification(id: number) {
    const response = await apiClient.delete(`/api/v2/principals/me/notifications/${id}`);
    return response.data?.data;
  },
};
