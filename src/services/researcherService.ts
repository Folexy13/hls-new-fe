import { apiClient } from "@/config/axios";

export type ResearcherSupplementPayload = {
  name: string;
  description: string;
  price: number;
  stock?: number;
  imageUrl?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  strength?: string | null;
  dosageForm?: string | null;
  budgetRange?: string | null;
  tags?: Record<string, string[]>;
  wholesalers?: Array<{ name: string; price: number; contact: string; address: string }>;
  status?: string;
  type?: string;
  code?: string;
};

export const researcherService = {
  async verifyBenfekCode(code: string) {
    const response = await apiClient.post("/api/v2/researcher/verify-benfek-code", { code });
    return response.data.data;
  },

  async getSupplements(params?: { page?: number; limit?: number; search?: string; code?: string }) {
    const response = await apiClient.get("/api/v2/researcher/supplements", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 100,
        search: params?.search,
        code: params?.code,
      },
    });
    return response.data.data?.supplements || [];
  },

  async createSupplement(payload: ResearcherSupplementPayload) {
    const response = await apiClient.post("/api/v2/researcher/supplements", payload);
    return response.data.data?.supplement;
  },

  async updateSupplement(id: string | number, payload: Partial<ResearcherSupplementPayload>) {
    const response = await apiClient.put(`/api/v2/researcher/supplements/${id}`, payload);
    return response.data.data?.supplement;
  },

  async deleteSupplement(id: string | number) {
    await apiClient.delete(`/api/v2/researcher/supplements/${id}`);
  },

  async dispatchPack(payload: {
    code: string;
    packId: string;
    packName: string;
    items: Array<{ id: string | number; quantity: number }>;
    status?: string;
  }) {
    const response = await apiClient.post("/api/v2/researcher/packs/dispatch", payload);
    return response.data.data?.pack;
  },

  async getBenfekPacks(code: string) {
    const response = await apiClient.get(`/api/v2/researcher/packs/${code}`);
    return response.data.data?.packs || [];
  },
};
