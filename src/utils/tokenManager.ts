
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    console.log('Setting tokens:', { accessToken: accessToken.substring(0, 20) + '...', refreshToken: refreshToken.substring(0, 20) + '...' });
    // Use localStorage for persistence across page refreshes
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // Set expiry to 7 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  },

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearTokens();
      return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearTokens();
      return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date() > new Date(expiry);
  },

  hasValidTokens(): boolean {
    return !this.isTokenExpired() && 
           this.getAccessToken() !== null && 
           this.getRefreshToken() !== null;
  },
};
