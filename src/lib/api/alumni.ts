import { api } from "./base";
import type { BackendAlumni } from "../../types/api";

// Alumni API endpoints
export const alumniAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    alumni: BackendAlumni;
  }> => {
    return api.get<{ alumni: BackendAlumni }>("/alumni/profile");
  },

  updateProfile: async (
    id: string,
    data: Partial<BackendAlumni>
  ): Promise<{
    message: string;
    alumni: BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: BackendAlumni;
    }>(`/alumni/profile/${id}`, data);
  },

  deleteProfile: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/alumni/profile/${id}`);
  },
};

