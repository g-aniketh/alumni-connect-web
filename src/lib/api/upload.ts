import { api, tokenService } from "./base";
import { API_BASE_URL } from "../constants";

// Upload API endpoints
export const uploadAPI = {
  // Upload profile picture (authenticated)
  uploadProfilePicture: async (
    file: File
  ): Promise<{
    message: string;
    url: string;
    urlHD: string;
    urlOptimized: string;
    user: {
      _id: string;
      name: string;
      email: string;
      profilePictureUrl?: string;
      profilePictureUrlHD?: string;
      profilePictureUrlOptimized?: string;
    };
  }> => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = tokenService.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/upload/profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload profile picture");
    }

    return response.json();
  },

  // Delete profile picture (authenticated)
  deleteProfilePicture: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>("/upload/profile-picture");
  },

  // Upload resume (authenticated - alumni/student)
  uploadResume: async (
    file: File
  ): Promise<{
    message: string;
    url: string;
    user: {
      _id: string;
      name: string;
      email: string;
      resumeUrl?: string;
    };
  }> => {
    const formData = new FormData();
    formData.append("resume", file);

    const token = tokenService.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/upload/resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload resume");
    }

    return response.json();
  },

  // Delete resume (authenticated - alumni/student)
  deleteResume: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>("/upload/resume");
  },

  // Get my files (authenticated)
  getMyFiles: async (): Promise<{
    profilePicture?: {
      original: string | null;
      hd: string | null;
      optimized: string | null;
    };
    resumeUrl?: string | null;
    collegeLogo?: {
      original: string | null;
      hd: string | null;
      optimized: string | null;
    };
  }> => {
    return api.get<{
      profilePicture?: {
        original: string | null;
        hd: string | null;
        optimized: string | null;
      };
      resumeUrl?: string | null;
      collegeLogo?: {
        original: string | null;
        hd: string | null;
        optimized: string | null;
      };
    }>("/upload/my-files");
  },

  // Get profile picture by user type and ID (public)
  getProfilePicture: async (
    userType: "alumni" | "student" | "college",
    userId: string
  ): Promise<{
    name: string;
    profilePicture: {
      original: string | null;
      hd: string | null;
      optimized: string | null;
    };
  }> => {
    return api.get<{
      name: string;
      profilePicture: {
        original: string | null;
        hd: string | null;
        optimized: string | null;
      };
    }>(`/upload/profile-picture/${userType}/${userId}`);
  },

  // Get resume by user type and ID (public)
  getResume: async (
    userType: "alumni" | "student",
    userId: string
  ): Promise<{
    name: string;
    resumeUrl: string | null;
  }> => {
    return api.get<{
      name: string;
      resumeUrl: string | null;
    }>(`/upload/resume/${userType}/${userId}`);
  },

  // Upload event banner (authenticated - organizer only)
  uploadEventBanner: async (
    eventId: string,
    file: File
  ): Promise<{
    message: string;
    eventBannerUrl: string;
    eventBannerUrlHD: string;
    eventBannerUrlOptimized: string;
  }> => {
    const formData = new FormData();
    formData.append("eventBanner", file);

    const token = tokenService.getAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/upload/event-banner/${eventId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload event banner");
    }

    return response.json();
  },

  // Delete event banner (authenticated - organizer only)
  deleteEventBanner: async (eventId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/upload/event-banner/${eventId}`);
  },

  // Get event banner (public)
  getEventBanner: async (
    eventId: string
  ): Promise<{
    eventId: string;
    title: string;
    eventBanner: {
      original: string | null;
      hd: string | null;
      optimized: string | null;
    };
  }> => {
    return api.get<{
      eventId: string;
      title: string;
      eventBanner: {
        original: string | null;
        hd: string | null;
        optimized: string | null;
      };
    }>(`/upload/event-banner/${eventId}`);
  },
};
