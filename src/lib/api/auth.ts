import { api } from "./base";
import type {
  LoginResponse,
  SignupResponse,
  CurrentUserResponse,
  AlumniSignupRequest,
  StudentSignupRequest,
  CollegeSignupRequest,
} from "../../types/api";

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

  // Logout (role-specific)
  logoutAlumni: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/alumni/logout");
  },

  logoutStudent: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/students/logout");
  },

  logoutCollege: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/colleges/logout");
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

