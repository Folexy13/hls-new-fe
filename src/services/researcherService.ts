import { apiClient } from "@/config/axios";

export type ResearcherSupplementPayload = {
  name: string;
  description: string;
  price: number;
  stock?: number;
  imageUrl?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  dosageForm?: string | null;
  budgetRange?: string | null;
  tags?: Record<string, string[]>;
  status?: string;
};

export const researcherService = {
  async verifyBenfekCode(code: string) {
    const response = await apiClient.post("/api/v2/researcher/verify-benfek-code", { code });
    return response.data.data;
  },

  async getSupplements() {
    const response = await apiClient.get("/api/v2/researcher/supplements", {
      params: { page: 1, limit: 100 },
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
    supplementIds: number[];
    status?: string;
  }) {
    const response = await apiClient.post("/api/v2/researcher/packs/dispatch", payload);
    return response.data.data?.pack;
  },
};
