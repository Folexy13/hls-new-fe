
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // Set expiry to 7 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  },

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearTokens();
      return null;
    }
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearTokens();
      return null;
    }
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired(): boolean {
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date() > new Date(expiry);
  },

  hasValidTokens(): boolean {
    return !this.isTokenExpired() && 
           this.getAccessToken() !== null && 
           this.getRefreshToken() !== null;
  },
};
