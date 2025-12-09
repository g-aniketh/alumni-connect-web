import { api } from "./base";
import type { BackendStudent, CreditEligibilityResponse } from "../../types/api";

// Student API endpoints
export const studentAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    student: BackendStudent;
  }> => {
    return api.get<{ student: BackendStudent }>("/students/profile");
  },

  updateProfile: async (
    id: string,
    data: Partial<BackendStudent>
  ): Promise<{
    message: string;
    student: BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: BackendStudent;
    }>(`/students/profile/${id}`, data);
  },

  deleteProfile: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/students/profile/${id}`);
  },

  // Credit Eligibility
  checkEligibility: async (): Promise<CreditEligibilityResponse> => {
    return api.get<CreditEligibilityResponse>("/students/credits/eligibility");
  },
};
