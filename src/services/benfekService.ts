import { apiClient } from "@/config/axios";

export interface BenfekProfilePayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  whatsappNumber?: string;
  deliveryAddress?: string;
  dropOffAddress?: string;
  benfekName?: string;
  benfekAge?: string;
  benfekGender?: string;
  allergies?: string;
  scares?: string;
  familyCondition?: string;
  medications?: string;
  hasCurrentCondition?: boolean;
  basicNickname?: string;
  basicWeight?: string;
  basicHeight?: string;
  lifestyleHabits?: string;
  lifestyleFun?: string;
  lifestylePriority?: string;
  preferenceDrugForm?: string;
  preferenceBudget?: number;
}

export interface SupportTicketPayload {
  category: string;
  subject: string;
  message: string;
}

export const benfekService = {
  async getProfile() {
    const response = await apiClient.get("/api/v2/benfek/profile");
    return response.data?.data?.profile;
  },

  async updateProfile(payload: BenfekProfilePayload) {
    const response = await apiClient.put("/api/v2/benfek/profile", payload);
    return response.data?.data?.profile;
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const response = await apiClient.put("/api/v2/benfek/password", payload);
    return response.data;
  },

  async getOrders() {
    const response = await apiClient.get("/api/v2/benfek/orders");
    return response.data?.data;
  },

  async getSupportTickets() {
    const response = await apiClient.get("/api/v2/benfek/support");
    return response.data?.data?.tickets || [];
  },

  async createSupportTicket(payload: SupportTicketPayload) {
    const response = await apiClient.post("/api/v2/benfek/support", payload);
    return response.data?.data?.ticket;
  },
};
