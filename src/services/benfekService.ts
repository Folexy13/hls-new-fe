import { apiClient } from "@/config/axios";
import { supportService } from './supportService';

export interface BenfekProfilePayload {
  email?: string;
  principalEmail?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  whatsappNumber?: string;
  deliveryAddress?: string;
  dropOffAddress?: string;
  preferredPharmacyName?: string;
  preferredPharmacyPhone?: string;
  notificationRemindersEnabled?: boolean;
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
  lifestyleDesires?: string;
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
    return supportService.getTickets();
  },

  async createSupportTicket(payload: SupportTicketPayload) {
    return supportService.createTicket(payload);
  },

  async getNotificationSummary(): Promise<{
    count: number;
    items?: Array<{ id: number; title: string; message: string; href?: string; count?: number; isRead?: boolean }>;
  }> {
    const response = await apiClient.get("/api/v2/benfek/notifications");
    return response.data?.data ?? { count: 0, items: [] };
  },

  async markAllNotificationsRead() {
    const response = await apiClient.patch("/api/v2/benfek/notifications/read-all");
    return response.data?.data;
  },

  async deleteNotification(id: number) {
    const response = await apiClient.delete(`/api/v2/benfek/notifications/${id}`);
    return response.data?.data;
  },
};
