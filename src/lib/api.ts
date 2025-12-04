import { API_BASE_URL, STORAGE_KEYS } from "./constants";
import type { Alumni, Student, College } from "../types";
import type {
  LoginResponse,
  SignupResponse,
  CurrentUserResponse,
  AlumniSignupRequest,
  StudentSignupRequest,
  CollegeSignupRequest,
} from "../types/api";

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
  },
  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },
};

// API Client with automatic token handling
class ApiClient {
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
      return new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

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
      tokenService.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      tokenService.clearTokens();
      return false;
    }
  }

  // HTTP Methods
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

// Auth API endpoints
export const authAPI = {
  // Signup
  signupAlumni: async (data: AlumniSignupRequest): Promise<SignupResponse> => {
    return api.post<SignupResponse>("/alumni/signup", data);
  },

  signupStudent: async (
    data: StudentSignupRequest
  ): Promise<SignupResponse> => {
    return api.post<SignupResponse>("/students/signup", data);
  },

  signupCollege: async (
    data: CollegeSignupRequest
  ): Promise<SignupResponse> => {
    return api.post<SignupResponse>("/colleges/signup", data);
  },

  // Login
  loginAlumni: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/alumni/login", { email, password });
  },

  loginStudent: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/students/login", { email, password });
  },

  loginCollege: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/colleges/login", { email, password });
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/logout");
  },

  // Get current user
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    return api.get<CurrentUserResponse>("/auth/me");
  },

  // Password operations
  requestPasswordReset: async (
    email: string,
    userType: string
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/request-password-reset", {
      email,
      userType,
    });
  },

  resetPassword: async (
    token: string,
    userType: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/reset-password", {
      token,
      userType,
      newPassword,
    });
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  // Email verification
  verifyEmail: async (
    token: string,
    userType: string
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/verify-email", {
      token,
      userType,
    });
  },
};
