// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "alumni_connect_access_token",
  REFRESH_TOKEN: "alumni_connect_refresh_token",
  USER: "alumni_connect_user",
} as const;
