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

// Alumni API endpoints
export const alumniAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    alumni: import("../types/api").BackendAlumni;
  }> => {
    return api.get<{ alumni: import("../types/api").BackendAlumni }>(
      "/alumni/profile"
    );
  },

  updateProfile: async (
    id: string,
    data: Partial<import("../types/api").BackendAlumni>
  ): Promise<{
    message: string;
    alumni: import("../types/api").BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: import("../types/api").BackendAlumni;
    }>(`/alumni/profile/${id}`, data);
  },

  deleteProfile: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/alumni/profile/${id}`);
  },
};

// Jobs API endpoints
export const jobsAPI = {
  // Get all jobs (public)
  getAll: async (): Promise<import("../types/api").BackendJob[]> => {
    return api.get<import("../types/api").BackendJob[]>("/jobs");
  },

  // Search jobs (public)
  search: async (params: {
    keyword?: string;
    location?: string;
    jobType?: string;
  }): Promise<import("../types/api").BackendJob[]> => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.jobType) queryParams.append("jobType", params.jobType);
    return api.get<import("../types/api").BackendJob[]>(
      `/jobs/search?${queryParams.toString()}`
    );
  },

  // Get filtered jobs (authenticated - college context)
  getFiltered: async (params?: {
    by?: string;
    available?: boolean;
  }): Promise<
    | import("../types/api").BackendJob[]
    | { total: number; jobs: import("../types/api").BackendJob[] }
  > => {
    const queryParams = new URLSearchParams();
    if (params?.by) queryParams.append("by", params.by);
    if (params?.available !== undefined)
      queryParams.append("available", params.available.toString());
    return api.get<
      | import("../types/api").BackendJob[]
      | { total: number; jobs: import("../types/api").BackendJob[] }
    >(`/jobs/filter?${queryParams.toString()}`);
  },

  // Get job by ID (public)
  getById: async (id: string): Promise<import("../types/api").BackendJob> => {
    return api.get<import("../types/api").BackendJob>(`/jobs/${id}`);
  },

  // Create job (authenticated - verified alumni/college)
  create: async (
    data: import("../types/api").JobCreateRequest
  ): Promise<{ message: string; job: import("../types/api").BackendJob }> => {
    return api.post<{
      message: string;
      job: import("../types/api").BackendJob;
    }>("/jobs", data);
  },

  // Update job (authenticated - owner only)
  update: async (
    id: string,
    data: Partial<import("../types/api").JobCreateRequest>
  ): Promise<{ message: string; job: import("../types/api").BackendJob }> => {
    return api.put<{ message: string; job: import("../types/api").BackendJob }>(
      `/jobs/${id}`,
      data
    );
  },

  // Delete job (authenticated - owner only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/jobs/${id}`);
  },

  // Get my posted jobs (authenticated)
  getMyPosted: async (): Promise<import("../types/api").BackendJob[]> => {
    return api.get<import("../types/api").BackendJob[]>("/jobs/my/posted");
  },

  // Apply for job (authenticated - verified student/alumni)
  apply: async (
    jobId: string,
    data: import("../types/api").JobApplicationRequest
  ): Promise<{
    message: string;
    application: import("../types/api").BackendJobApplication;
  }> => {
    return api.post<{
      message: string;
      application: import("../types/api").BackendJobApplication;
    }>(`/jobs/${jobId}/apply`, data);
  },

  // Get my applications (authenticated)
  getMyApplications: async (): Promise<
    import("../types/api").BackendJobApplication[]
  > => {
    return api.get<import("../types/api").BackendJobApplication[]>(
      "/jobs/my/applications"
    );
  },

  // Get applications for a job (authenticated - owner only)
  getJobApplications: async (
    jobId: string
  ): Promise<import("../types/api").BackendJobApplication[]> => {
    return api.get<import("../types/api").BackendJobApplication[]>(
      `/jobs/${jobId}/applications`
    );
  },

  // Update application status (authenticated - job owner only)
  updateApplicationStatus: async (
    applicationId: string,
    status: string
  ): Promise<{
    message: string;
    application: import("../types/api").BackendJobApplication;
  }> => {
    return api.put<{
      message: string;
      application: import("../types/api").BackendJobApplication;
    }>(`/jobs/applications/${applicationId}/status`, { status });
  },

  // Withdraw application (authenticated - applicant only)
  withdrawApplication: async (
    applicationId: string
  ): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(
      `/jobs/applications/${applicationId}/withdraw`
    );
  },
};

// Events API endpoints
export const eventsAPI = {
  // Get all events (public)
  getAll: async (): Promise<import("../types/api").BackendEvent[]> => {
    return api.get<import("../types/api").BackendEvent[]>("/events");
  },

  // Search events (public)
  search: async (params: {
    keyword?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<import("../types/api").BackendEvent[]> => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    return api.get<import("../types/api").BackendEvent[]>(
      `/events/search?${queryParams.toString()}`
    );
  },

  // Get filtered events (authenticated - college context)
  getFiltered: async (params?: {
    by?: string;
    upcoming?: boolean;
  }): Promise<
    | import("../types/api").BackendEvent[]
    | { total: number; events: import("../types/api").BackendEvent[] }
  > => {
    const queryParams = new URLSearchParams();
    if (params?.by) queryParams.append("by", params.by);
    if (params?.upcoming !== undefined)
      queryParams.append("upcoming", params.upcoming.toString());
    return api.get<
      | import("../types/api").BackendEvent[]
      | { total: number; events: import("../types/api").BackendEvent[] }
    >(`/events/filter?${queryParams.toString()}`);
  },

  // Get event by ID (public)
  getById: async (id: string): Promise<import("../types/api").BackendEvent> => {
    return api.get<import("../types/api").BackendEvent>(`/events/${id}`);
  },

  // Create event (authenticated - verified alumni/college)
  create: async (
    data: import("../types/api").EventCreateRequest
  ): Promise<import("../types/api").BackendEvent> => {
    return api.post<import("../types/api").BackendEvent>("/events", data);
  },

  // Update event (authenticated - organizer only)
  update: async (
    id: string,
    data: Partial<import("../types/api").EventCreateRequest>
  ): Promise<{
    message: string;
    event: import("../types/api").BackendEvent;
  }> => {
    return api.put<{
      message: string;
      event: import("../types/api").BackendEvent;
    }>(`/events/${id}`, data);
  },

  // Delete event (authenticated - organizer only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/events/${id}`);
  },

  // Get my organized events (authenticated)
  getMyOrganized: async (): Promise<import("../types/api").BackendEvent[]> => {
    return api.get<import("../types/api").BackendEvent[]>(
      "/events/my/organized"
    );
  },

  // Register for event (authenticated - verified student only)
  register: async (
    data: import("../types/api").EventRegisterRequest
  ): Promise<{
    message: string;
    registration: import("../types/api").BackendEventRegistration;
  }> => {
    return api.post<{
      message: string;
      registration: import("../types/api").BackendEventRegistration;
    }>("/events/register", data);
  },

  // Get my registrations (authenticated - student only)
  getMyRegistrations: async (): Promise<
    import("../types/api").BackendEventRegistration[]
  > => {
    return api.get<import("../types/api").BackendEventRegistration[]>(
      "/events/my/registrations"
    );
  },

  // Get event registrations (authenticated - organizer only)
  getEventRegistrations: async (
    eventId: string
  ): Promise<import("../types/api").BackendEventRegistration[]> => {
    return api.get<import("../types/api").BackendEventRegistration[]>(
      `/events/${eventId}/registrations`
    );
  },

  // Update registration status (authenticated - organizer only)
  updateRegistrationStatus: async (
    registrationId: string,
    status: string
  ): Promise<{
    message: string;
    registration: import("../types/api").BackendEventRegistration;
  }> => {
    return api.put<{
      message: string;
      registration: import("../types/api").BackendEventRegistration;
    }>(`/events/registrations/${registrationId}/status`, { status });
  },

  // Cancel registration (authenticated - student only)
  cancelRegistration: async (
    registrationId: string
  ): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(
      `/events/registrations/${registrationId}`
    );
  },
};

// Mentorships API endpoints
export const mentorshipsAPI = {
  // Get available mentors (public)
  getMentors: async (params?: {
    skills?: string;
    industry?: string;
    company?: string;
  }): Promise<import("../types/api").BackendAlumni[]> => {
    const queryParams = new URLSearchParams();
    if (params?.skills) queryParams.append("skills", params.skills);
    if (params?.industry) queryParams.append("industry", params.industry);
    if (params?.company) queryParams.append("company", params.company);
    const query = queryParams.toString();
    return api.get<import("../types/api").BackendAlumni[]>(
      `/mentorships/mentors${query ? `?${query}` : ""}`
    );
  },

  // Get my mentorships (authenticated - alumni/student)
  getMy: async (
    status?: string
  ): Promise<{
    total: number;
    mentorships: import("../types/api").BackendMentorship[];
  }> => {
    const query = status ? `?status=${status}` : "";
    return api.get<{
      total: number;
      mentorships: import("../types/api").BackendMentorship[];
    }>(`/mentorships/my${query}`);
  },

  // Get pending requests (authenticated - alumni/student)
  getPending: async (): Promise<{
    total: number;
    requests: import("../types/api").BackendMentorship[];
  }> => {
    return api.get<{
      total: number;
      requests: import("../types/api").BackendMentorship[];
    }>("/mentorships/my/pending");
  },

  // Get mentorship by ID (authenticated - participants only)
  getById: async (
    id: string
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.get<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>(`/mentorships/${id}`);
  },

  // Create mentorship request (authenticated - verified student only)
  createRequest: async (
    data: import("../types/api").MentorshipRequestCreate
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.post<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>("/mentorships/request", data);
  },

  // Update mentorship status (authenticated - mentor only)
  updateStatus: async (
    id: string,
    data: import("../types/api").MentorshipStatusUpdate
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>(`/mentorships/${id}/status`, data);
  },

  // Update mentorship dates (authenticated - mentor only)
  updateDates: async (
    id: string,
    data: import("../types/api").MentorshipDatesUpdate
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>(`/mentorships/${id}/dates`, data);
  },

  // End mentorship (authenticated - mentor/mentee)
  end: async (
    id: string
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>(`/mentorships/${id}/end`);
  },

  // Add feedback (authenticated - mentor/mentee)
  addFeedback: async (
    id: string,
    data: import("../types/api").MentorshipFeedbackRequest
  ): Promise<{
    message: string;
    mentorship: import("../types/api").BackendMentorship;
  }> => {
    return api.post<{
      message: string;
      mentorship: import("../types/api").BackendMentorship;
    }>(`/mentorships/${id}/feedback`, data);
  },
};

// Student API endpoints
export const studentAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    student: import("../types/api").BackendStudent;
  }> => {
    return api.get<{ student: import("../types/api").BackendStudent }>(
      "/students/profile"
    );
  },

  updateProfile: async (
    id: string,
    data: Partial<import("../types/api").BackendStudent>
  ): Promise<{
    message: string;
    student: import("../types/api").BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: import("../types/api").BackendStudent;
    }>(`/students/profile/${id}`, data);
  },

  deleteProfile: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/students/profile/${id}`);
  },
};

// College API endpoints
export const collegeAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    college: import("../types/api").BackendCollege;
  }> => {
    return api.get<{ college: import("../types/api").BackendCollege }>(
      "/colleges/profile"
    );
  },

  updateProfile: async (
    data: Partial<import("../types/api").BackendCollege>
  ): Promise<{
    message: string;
    college: import("../types/api").BackendCollege;
  }> => {
    return api.put<{
      message: string;
      college: import("../types/api").BackendCollege;
    }>("/colleges/profile", data);
  },

  deleteProfile: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>("/colleges/profile");
  },

  // Public endpoint to get all college names (for signup dropdowns)
  getAllCollegeNames: async (): Promise<string[]> => {
    const response = await api.get<{ colleges: string[] }>("/colleges/list");
    return response.colleges;
  },

  // Stats
  getStats: async (): Promise<{
    alumniCount: number;
    alumniVerifiedCount: number;
    studentCount: number;
    studentsVerifiedCount: number;
    batchesCount?: number;
    batches?: unknown[];
  }> => {
    return api.get<{
      alumniCount: number;
      alumniVerifiedCount: number;
      studentCount: number;
      studentsVerifiedCount: number;
      batchesCount?: number;
      batches?: unknown[];
    }>("/colleges/stats");
  },

  // Alumni Management
  getAllAlumni: async (): Promise<import("../types/api").BackendAlumni[]> => {
    return api.get<import("../types/api").BackendAlumni[]>("/colleges/alumni");
  },

  addAlumni: async (data: {
    name: string;
    email: string;
    password?: string;
    graduationYear: number;
    degree: string;
    department: string;
    currentJobTitle?: string;
    company?: string;
    skills?: string[];
    linkedInProfile?: string;
  }): Promise<{
    message: string;
    alumni: import("../types/api").BackendAlumni;
  }> => {
    return api.post<{
      message: string;
      alumni: import("../types/api").BackendAlumni;
    }>("/colleges/alumni", data);
  },

  addAlumniBulk: async (data: {
    alumni: Array<{
      name: string;
      email: string;
      password?: string;
      graduationYear: number;
      degree: string;
      department: string;
      currentJobTitle?: string;
      company?: string;
      skills?: string[];
      linkedInProfile?: string;
    }>;
  }): Promise<{
    message: string;
    created: number;
    alumni: import("../types/api").BackendAlumni[];
  }> => {
    return api.post<{
      message: string;
      created: number;
      alumni: import("../types/api").BackendAlumni[];
    }>("/colleges/alumni/bulk", data);
  },

  updateAlumni: async (
    id: string,
    data: Partial<import("../types/api").BackendAlumni>
  ): Promise<{
    message: string;
    alumni: import("../types/api").BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: import("../types/api").BackendAlumni;
    }>(`/colleges/alumni/profile/${id}`, data);
  },

  deleteAlumni: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/colleges/alumni/profile/${id}`);
  },

  // Student Management
  getAllStudents: async (): Promise<
    import("../types/api").BackendStudent[]
  > => {
    return api.get<import("../types/api").BackendStudent[]>(
      "/colleges/students"
    );
  },

  addStudent: async (data: {
    name: string;
    email: string;
    password?: string;
    rollNumber: string;
    enrollmentYear: number;
    department: string;
    degree: string;
    graduationYear: number;
  }): Promise<{
    message: string;
    student: import("../types/api").BackendStudent;
  }> => {
    return api.post<{
      message: string;
      student: import("../types/api").BackendStudent;
    }>("/colleges/students", data);
  },

  addStudentsBulk: async (data: {
    students: Array<{
      name: string;
      email: string;
      password?: string;
      rollNumber: string;
      enrollmentYear: number;
      department: string;
      degree: string;
      graduationYear: number;
    }>;
  }): Promise<{
    message: string;
    created: number;
    students: import("../types/api").BackendStudent[];
  }> => {
    return api.post<{
      message: string;
      created: number;
      students: import("../types/api").BackendStudent[];
    }>("/colleges/students/bulk", data);
  },

  updateStudent: async (
    id: string,
    data: Partial<import("../types/api").BackendStudent>
  ): Promise<{
    message: string;
    student: import("../types/api").BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: import("../types/api").BackendStudent;
    }>(`/colleges/student/profile/${id}`, data);
  },

  deleteStudent: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/colleges/student/profile/${id}`);
  },

  // Verification
  verifyAlumni: async (
    alumniId: string
  ): Promise<{
    message: string;
    alumni: import("../types/api").BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: import("../types/api").BackendAlumni;
    }>(`/colleges/verify/alumni/${alumniId}`);
  },

  verifyStudent: async (
    studentId: string
  ): Promise<{
    message: string;
    student: import("../types/api").BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: import("../types/api").BackendStudent;
    }>(`/colleges/verify/student/${studentId}`);
  },

  getPendingVerifications: async (): Promise<{
    alumni: import("../types/api").BackendAlumni[];
    students: import("../types/api").BackendStudent[];
  }> => {
    const response = await api.get<{
      pendingAlumni: import("../types/api").BackendAlumni[];
      pendingStudents: import("../types/api").BackendStudent[];
    }>("/colleges/pending-verifications");

    return {
      alumni: response.pendingAlumni ?? [],
      students: response.pendingStudents ?? [],
    };
  },
};

// Campaigns API endpoints
export const campaignsAPI = {
  // Get all campaigns (public)
  getAll: async (): Promise<import("../types/api").BackendCampaign[]> => {
    return api.get<import("../types/api").BackendCampaign[]>("/campaigns");
  },

  // Get active campaigns (public)
  getActive: async (): Promise<import("../types/api").BackendCampaign[]> => {
    return api.get<import("../types/api").BackendCampaign[]>(
      "/campaigns/active"
    );
  },

  // Get campaign by ID (public)
  getById: async (
    id: string
  ): Promise<import("../types/api").BackendCampaign> => {
    return api.get<import("../types/api").BackendCampaign>(`/campaigns/${id}`);
  },

  // Create campaign (authenticated - college only)
  create: async (
    data: import("../types/api").CampaignCreateRequest
  ): Promise<{
    message: string;
    campaign: import("../types/api").BackendCampaign;
  }> => {
    return api.post<{
      message: string;
      campaign: import("../types/api").BackendCampaign;
    }>("/campaigns", data);
  },

  // Update campaign (authenticated - college owner only)
  update: async (
    id: string,
    data: Partial<import("../types/api").CampaignCreateRequest>
  ): Promise<{
    message: string;
    campaign: import("../types/api").BackendCampaign;
  }> => {
    return api.put<{
      message: string;
      campaign: import("../types/api").BackendCampaign;
    }>(`/campaigns/${id}`, data);
  },

  // Delete campaign (authenticated - college owner only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/campaigns/${id}`);
  },

  // Get my campaigns (authenticated - college only)
  getMyCampaigns: async (): Promise<
    import("../types/api").BackendCampaign[]
  > => {
    return api.get<import("../types/api").BackendCampaign[]>(
      "/campaigns/my/campaigns"
    );
  },

  // Get campaign statistics (authenticated - college owner only)
  getCampaignStats: async (
    campaignId: string
  ): Promise<{
    totalRaised: number;
    totalVolunteeringHours: number;
    countFinancialContributors: number;
    countVolunteeringContributors: number;
  }> => {
    return api.get<{
      totalRaised: number;
      totalVolunteeringHours: number;
      countFinancialContributors: number;
      countVolunteeringContributors: number;
    }>(`/campaigns/${campaignId}/stats`);
  },

  // Get campaign contributions (authenticated - college owner only)
  getCampaignContributions: async (
    campaignId: string
  ): Promise<import("../types/api").BackendContribution[]> => {
    return api.get<import("../types/api").BackendContribution[]>(
      `/campaigns/${campaignId}/contributions`
    );
  },

  // Contribute financially (authenticated - verified alumni/student)
  contributeFinancial: async (data: {
    campaignId: string;
    amount: number;
    paymentMethod: string;
  }): Promise<{
    message: string;
    contribution: import("../types/api").BackendContribution;
  }> => {
    return api.post<{
      message: string;
      contribution: import("../types/api").BackendContribution;
    }>("/campaigns/contribute/financial", data);
  },

  // Contribute volunteer hours (authenticated - verified alumni/student)
  contributeVolunteer: async (data: {
    campaignId: string;
    hours: number;
    date: string;
  }): Promise<{
    message: string;
    contribution: import("../types/api").BackendContribution;
  }> => {
    return api.post<{
      message: string;
      contribution: import("../types/api").BackendContribution;
    }>("/campaigns/contribute/volunteer", data);
  },

  // Get my contributions (authenticated)
  getMyContributions: async (): Promise<
    import("../types/api").BackendContribution[]
  > => {
    return api.get<import("../types/api").BackendContribution[]>(
      "/campaigns/my/contributions"
    );
  },
};
