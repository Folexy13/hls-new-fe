import { apiClient } from "@/config/axios";

export interface WholesalerSupplement {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  strength?: string | null;
  dosageForm?: string | null;
  budgetRange?: string | null;
  expiryDate?: string | null;
  tags?: Record<string, string[]>;
  wholesalers?: Array<{
    wholesalerUserId?: number;
    name?: string;
    email?: string;
    price?: number;
    contact?: string;
    address?: string;
    updatedAt?: string;
  }> | null;
}

export interface GalleryResponse {
  supplements: WholesalerSupplement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface WholesalerProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  strength?: string | null;
  dosageForm?: string | null;
  budgetRange?: string | null;
  expiryDate?: string | null;
  tags?: Record<string, string[]>;
  status?: string;
}

export const wholesalerService = {
  async getGallery(page = 1, limit = 100): Promise<GalleryResponse> {
    const uniqueById = (supplements: WholesalerSupplement[]) => {
      const seen = new Set<number>();
      return supplements.filter((supplement) => {
        if (seen.has(supplement.id)) return false;
        seen.add(supplement.id);
        return true;
      });
    };

    const normalize = (payload: any): GalleryResponse => {
      const data = payload?.data ?? payload ?? {};
      const supplements = uniqueById(data?.supplements ?? payload?.supplements ?? []);
      const meta = data?.meta ?? payload?.meta ?? {
        total: supplements.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(supplements.length / limit)),
        hasNextPage: false,
        hasPrevPage: page > 1,
      };

      return { supplements, meta };
    };

    const response = await apiClient.get("/api/v2/supplements/wholesaler/gallery", {
      params: { page, limit },
    });
    return normalize(response.data);
  },

  async savePrice(id: number, payload: { price: number; contact?: string; address?: string }) {
    const response = await apiClient.put(`/api/v2/supplements/wholesaler/gallery/${id}/price`, payload);
    return response.data?.data?.supplement;
  },

  async createProduct(payload: WholesalerProductPayload) {
    const response = await apiClient.post("/api/v2/supplements/wholesaler/products", payload);
    return response.data?.data?.supplement;
  },
};
