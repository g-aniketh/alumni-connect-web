import { API_BASE_URL, STORAGE_KEYS } from "../constants";
import type { Alumni, Student, College } from "../../types";

// Types for API responses
export interface ApiError {
  message: string;
  error?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

type User = Alumni | Student | College;

// Token management
export const tokenService = {
  // Access/refresh tokens in localStorage
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },
  clearTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Clear verification cookie as well
    if (typeof document !== "undefined") {
      document.cookie = "ac_isVerified=; Path=/; Max-Age=0; SameSite=Lax";
    }
  },
  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },
  // Lightweight verification status cookie for quick checks across tabs
  setVerificationStatus: (isVerified: boolean): void => {
    if (typeof document === "undefined") return;
    const value = isVerified ? "true" : "false";
    document.cookie = `ac_isVerified=${value}; Path=/; SameSite=Lax`;
  },
  getVerificationStatus: (): boolean | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (const rawCookie of cookies) {
      const cookie = rawCookie.trim();
      if (cookie.startsWith("ac_isVerified=")) {
        const value = cookie.split("=")[1];
        if (value === "true") return true;
        if (value === "false") return false;
      }
    }
    return null;
  },
};

// API Client with automatic token handling
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = tokenService.getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token refresh on 401
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          const newToken = tokenService.getAccessToken();
          if (newToken) {
            const retryHeaders: Record<string, string> = {
              "Content-Type": "application/json",
              ...(options.headers as Record<string, string>),
              Authorization: `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, {
              ...options,
              headers: retryHeaders,
            });
            if (!retryResponse.ok) {
              throw await this.handleError(retryResponse);
            }
            return await retryResponse.json();
          }
        }
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        throw await this.handleError(response);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const errorData = await response.json();
      const message =
        errorData.message || errorData.error || `HTTP ${response.status}`;
      return new Error(message);
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        tokenService.clearTokens();
        return false;
      }

      const data = await response.json();
      if (data.accessToken && data.refreshToken) {
        // Backend returns both accessToken and refreshToken
        tokenService.setTokens(data.accessToken, data.refreshToken);
        return true;
      } else if (data.token) {
        // Fallback for single token response (legacy)
        tokenService.setTokens(data.token, data.token);
        return true;
      }
      return false;
    } catch {
      tokenService.clearTokens();
      return false;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Create API client instance
export const api = new ApiClient(API_BASE_URL);

