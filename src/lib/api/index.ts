// Re-export base API client and token service
export { api, tokenService, ApiClient } from "./base";
export type { ApiError, ApiResponse } from "./base";

// Re-export all API modules
export { authAPI } from "./auth";
export { alumniAPI } from "./alumni";
export { studentAPI } from "./student";
export { collegeAPI } from "./college";
export { jobsAPI } from "./jobs";
export { eventsAPI } from "./events";
export { mentorshipsAPI } from "./mentorships";
export { campaignsAPI } from "./campaigns";
export { uploadAPI } from "./upload";
export { recommendationsAPI } from "./recommendations";
export { connectionsAPI } from "./connections";
export type {
  ParseResumeResponse,
  ParsedResumeProfile,
  JobEligibilityResponse,
  JobEligibilityResult,
  MentorRecommendationsResponse,
  RecommendedMentor,
  StudentRecommendationsResponse,
  RecommendedStudent,
  RecommendationHealthResponse,
} from "./recommendations";
