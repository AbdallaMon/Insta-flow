/**
 * Token Storage Utility Functions
 * Manages accessToken (memory) and refreshToken (localStorage)
 */

const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

// ============================================================================
// ACCESS TOKEN (In-Memory - Short-lived)
// ============================================================================

let inMemoryAccessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export const setAccessToken = (token: string): void => {
  inMemoryAccessToken = token;
};

export const clearAccessToken = (): void => {
  inMemoryAccessToken = null;
};

// ============================================================================
// REFRESH TOKEN (LocalStorage - Persistent)
// ============================================================================

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearRefreshToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ============================================================================
// USER DATA (LocalStorage - For UI Display)
// ============================================================================

export const getStoredUser = (): unknown | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

// ============================================================================
// CLEAR ALL (Logout)
// ============================================================================

export const clearAllTokens = (): void => {
  clearAccessToken();
  clearRefreshToken();
  clearStoredUser();
};
