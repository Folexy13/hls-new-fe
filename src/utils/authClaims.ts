import { tokenManager } from "@/utils/tokenManager";

type JwtClaims = {
  userId?: number;
  email?: string;
  role?: string;
  researcherType?: string | null;
  [key: string]: unknown;
};

const decodeJwtClaims = (token: string): JwtClaims | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
};

export const getAuthClaims = (): JwtClaims | null => {
  const accessToken = tokenManager.getAccessToken();
  if (!accessToken) return null;
  return decodeJwtClaims(accessToken);
};

export const canViewWholesaleDetails = (): boolean => {
  const claims = getAuthClaims();
  const role = String(claims?.role || "").toLowerCase();
  const researcherType = String(claims?.researcherType || "").toLowerCase();
  return role === "principal" || (role === "researcher" && researcherType === "checker");
};

