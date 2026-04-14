
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
// Used as a session expiry guard (based on refresh token exp when available).
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const ACCESS_TOKEN_EXPIRY_KEY = 'accessTokenExpiry';

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // Pad base64 if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const getTokenExpiryDate = (token: string): Date | null => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  // exp is seconds since epoch
  return new Date(payload.exp * 1000);
};

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    console.log('Setting tokens:', { accessToken: accessToken.substring(0, 20) + '...', refreshToken: refreshToken.substring(0, 20) + '...' });
    // Use localStorage for persistence across page refreshes
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // Store access token expiry (for proactive refresh). Fallback to 15 minutes when unknown.
    const accessExp = getTokenExpiryDate(accessToken);
    if (accessExp) {
      localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, accessExp.toISOString());
    } else {
      const fallback = new Date(Date.now() + 15 * 60 * 1000);
      localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, fallback.toISOString());
    }

    // Session expiry should track refresh token lifetime when possible.
    // Fallback: keep previous behavior (7 days) if refresh token isn't a JWT.
    const refreshExp = getTokenExpiryDate(refreshToken);
    const expiryDate = refreshExp ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
  },

  // Session expiry: driven by refresh token expiration (preferred) or the fallback guard.
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date() > new Date(expiry);
  },

  getAccessTokenExpiresAt(): Date | null {
    const expiry = localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
    if (!expiry) return null;
    const d = new Date(expiry);
    return Number.isNaN(d.getTime()) ? null : d;
  },

  hasValidTokens(): boolean {
    // Don't treat an expired access token as "invalid session" if refresh token is still good.
    // The axios interceptor / AuthWrapper will refresh it.
    return !this.isTokenExpired() &&
      this.getRefreshToken() !== null &&
      this.getAccessToken() !== null;
  },
};
