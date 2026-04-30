import { apiClient } from "@/config/axios";

export const paystackService = {
  async initializePackCheckout(packId: string, shippingAddress: string, callbackUrl?: string) {
    const response = await apiClient.post("/api/v2/paystack/checkout/pack", {
      packId,
      shippingAddress,
      callbackUrl,
    });
    return response.data?.data ?? response.data;
  },

  async verifyCheckout(reference: string) {
    const response = await apiClient.get(`/api/v2/paystack/verify/${reference}`);
    return response.data?.data ?? response.data;
  },
};
