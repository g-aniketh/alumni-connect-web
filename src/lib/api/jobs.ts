import { api } from "./base";
import type {
  BackendJob,
  BackendJobApplication,
  JobCreateRequest,
  JobApplicationRequest,
} from "../../types/api";

// Jobs API endpoints
export const jobsAPI = {
  // Get all jobs (public)
  getAll: async (): Promise<BackendJob[]> => {
    return api.get<BackendJob[]>("/jobs");
  },

  // Search jobs (public)
  search: async (params: {
    keyword?: string;
    location?: string;
    jobType?: string;
  }): Promise<BackendJob[]> => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.jobType) queryParams.append("jobType", params.jobType);
    return api.get<BackendJob[]>(`/jobs/search?${queryParams.toString()}`);
  },

  // Get filtered jobs (authenticated - college context)
  getFiltered: async (params?: {
    by?: string;
    available?: boolean;
  }): Promise<BackendJob[] | { total: number; jobs: BackendJob[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.by) queryParams.append("by", params.by);
    if (params?.available !== undefined)
      queryParams.append("available", params.available.toString());
    return api.get<BackendJob[] | { total: number; jobs: BackendJob[] }>(
      `/jobs/filter?${queryParams.toString()}`
    );
  },

  // Get job by ID (public)
  getById: async (id: string): Promise<BackendJob> => {
    return api.get<BackendJob>(`/jobs/${id}`);
  },

  // Create job (authenticated - verified alumni/college)
  create: async (
    data: JobCreateRequest
  ): Promise<{ message: string; job: BackendJob }> => {
    return api.post<{
      message: string;
      job: BackendJob;
    }>("/jobs", data);
  },

  // Update job (authenticated - owner only)
  update: async (
    id: string,
    data: Partial<JobCreateRequest>
  ): Promise<{ message: string; job: BackendJob }> => {
    return api.put<{ message: string; job: BackendJob }>(`/jobs/${id}`, data);
  },

  // Delete job (authenticated - owner only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/jobs/${id}`);
  },

  // Get my posted jobs (authenticated)
  getMyPosted: async (): Promise<BackendJob[]> => {
    return api.get<BackendJob[]>("/jobs/my/posted");
  },

  // Apply for job (authenticated - verified student/alumni)
  apply: async (
    jobId: string,
    data: JobApplicationRequest
  ): Promise<{
    message: string;
    application: BackendJobApplication;
  }> => {
    return api.post<{
      message: string;
      application: BackendJobApplication;
    }>(`/jobs/${jobId}/apply`, data);
  },

  // Get my applications (authenticated)
  getMyApplications: async (): Promise<BackendJobApplication[]> => {
    return api.get<BackendJobApplication[]>("/jobs/my/applications");
  },

  // Get applications for a job (authenticated - owner only)
  getJobApplications: async (
    jobId: string
  ): Promise<BackendJobApplication[]> => {
    return api.get<BackendJobApplication[]>(`/jobs/${jobId}/applications`);
  },

  // Update application status (authenticated - job owner only)
  updateApplicationStatus: async (
    applicationId: string,
    status: string
  ): Promise<{
    message: string;
    application: BackendJobApplication;
  }> => {
    return api.put<{
      message: string;
      application: BackendJobApplication;
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
