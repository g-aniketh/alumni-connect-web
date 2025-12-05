import { api } from "./base";
import type {
  BackendAlumni,
  BackendMentorship,
  MentorshipRequestCreate,
  MentorshipStatusUpdate,
  MentorshipDatesUpdate,
  MentorshipFeedbackRequest,
} from "../../types/api";

// Mentorships API endpoints
export const mentorshipsAPI = {
  // Get available mentors (public)
  getMentors: async (params?: {
    skills?: string;
    industry?: string;
    company?: string;
  }): Promise<BackendAlumni[]> => {
    const queryParams = new URLSearchParams();
    if (params?.skills) queryParams.append("skills", params.skills);
    if (params?.industry) queryParams.append("industry", params.industry);
    if (params?.company) queryParams.append("company", params.company);
    const query = queryParams.toString();
    return api.get<BackendAlumni[]>(
      `/mentorships/mentors${query ? `?${query}` : ""}`
    );
  },

  // Get my mentorships (authenticated - alumni/student)
  getMy: async (
    status?: string
  ): Promise<{
    total: number;
    mentorships: BackendMentorship[];
  }> => {
    const query = status ? `?status=${status}` : "";
    return api.get<{
      total: number;
      mentorships: BackendMentorship[];
    }>(`/mentorships/my${query}`);
  },

  // Get pending requests (authenticated - alumni/student)
  getPending: async (): Promise<{
    total: number;
    requests: BackendMentorship[];
  }> => {
    return api.get<{
      total: number;
      requests: BackendMentorship[];
    }>("/mentorships/my/pending");
  },

  // Get mentorship by ID (authenticated - participants only)
  getById: async (
    id: string
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.get<{
      message: string;
      mentorship: BackendMentorship;
    }>(`/mentorships/${id}`);
  },

  // Create mentorship request (authenticated - verified student only)
  createRequest: async (
    data: MentorshipRequestCreate
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.post<{
      message: string;
      mentorship: BackendMentorship;
    }>("/mentorships/request", data);
  },

  // Update mentorship status (authenticated - mentor only)
  updateStatus: async (
    id: string,
    data: MentorshipStatusUpdate
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: BackendMentorship;
    }>(`/mentorships/${id}/status`, data);
  },

  // Update mentorship dates (authenticated - mentor only)
  updateDates: async (
    id: string,
    data: MentorshipDatesUpdate
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: BackendMentorship;
    }>(`/mentorships/${id}/dates`, data);
  },

  // End mentorship (authenticated - mentor/mentee)
  end: async (
    id: string
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.put<{
      message: string;
      mentorship: BackendMentorship;
    }>(`/mentorships/${id}/end`);
  },

  // Add feedback (authenticated - mentor/mentee)
  addFeedback: async (
    id: string,
    data: MentorshipFeedbackRequest
  ): Promise<{
    message: string;
    mentorship: BackendMentorship;
  }> => {
    return api.post<{
      message: string;
      mentorship: BackendMentorship;
    }>(`/mentorships/${id}/feedback`, data);
  },
};

