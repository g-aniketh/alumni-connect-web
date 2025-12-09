import { api } from "./base";

// Types for Recommendation API
export interface ParsedResumeProfile {
  basic_info: {
    full_name?: string;
    emails?: string[];
    phone_numbers?: string[];
    location?: string;
    current_role?: string;
    summary?: string;
  };
  education: Array<{
    degree?: string;
    field_of_study?: string;
    institution?: string;
    start_year?: number;
    end_year?: number;
    ongoing?: boolean;
  }>;
  experience: Array<{
    title?: string;
    organization?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    location?: string;
    description?: string;
  }>;
  skills: {
    hard_skills?: string[];
    soft_skills?: string[];
    programming_languages?: string[];
    tools?: string[];
    frameworks?: string[];
    certifications?: string[];
  };
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    outcomes?: string;
  }>;
  domains?: string[];
  seniority?: string;
  interests?: string[];
}

export interface ParseResumeResponse {
  message: string;
  data: {
    profile: ParsedResumeProfile;
    raw_text?: string;
    source?: string;
    model?: string;
  };
  profileUpdated: boolean;
}

export interface JobEligibilityResult {
  job_id: string;
  title: string;
  experience_level?: string;
  years_of_experience?: number | null;
  eligibility_percent: number;
  eligible: boolean;
  scores: {
    semantic: number;
    skills: number;
    seniority: number;
    domain: number;
  };
  hard_filters: {
    skills_minimum_met: boolean;
    seniority_compatible: boolean;
    domain_reasonable: boolean;
  };
  skills_breakdown: {
    matched_skills: string[];
    missing_skills: string[];
    extra_resume_skills: string[];
  };
  resume_domain?: string;
  job_domain?: string;
  explanation: string;
}

export interface JobEligibilityResponse {
  results: JobEligibilityResult[];
}

export interface RecommendedMentor {
  alumni_id: string;
  name: string;
  company?: string;
  current_job_title?: string;
  skills?: string[];
  match_score: number;
  match_reasoning: string;
}

export interface MentorRecommendationsResponse {
  student: {
    _id: string;
    name: string;
    department?: string;
    skills?: string[];
    interests?: string[];
  };
  recommendations: RecommendedMentor[];
}

export interface RecommendedStudent {
  student_id: string;
  name: string;
  department?: string;
  year?: number;
  skills?: string[];
  interests?: string[];
  match_score: number;
  match_reasoning: string;
}

export interface StudentRecommendationsResponse {
  alumni: {
    _id: string;
    name: string;
    current_job_title?: string;
    company?: string;
    skills?: string[];
  };
  recommendations: RecommendedStudent[];
}

export interface RecommendationHealthResponse {
  status: string;
  model_service?: string;
  timestamp?: string;
  error?: string;
}

export const recommendationsAPI = {
  /**
   * Parse resume from Cloudinary URL
   * @param update - If true, automatically updates user profile with parsed data
   */
  parseResume: async (update = false): Promise<ParseResumeResponse> => {
    const queryParam = update ? "?update=true" : "";
    return api.get<ParseResumeResponse>(`/recommendations/parse${queryParam}`);
  },

  /**
   * Check job eligibility for user against multiple jobs
   * @param jobIds - Array of job MongoDB ObjectIds to check
   */
  checkJobEligibility: async (
    jobIds: string[]
  ): Promise<JobEligibilityResponse> => {
    return api.post<JobEligibilityResponse>(
      "/recommendations/job-eligibility",
      {
        job_ids: jobIds,
      }
    );
  },

  /**
   * Get recommended jobs based on user profile (coming soon)
   */
  getRecommendedJobs: async (): Promise<{ message: string }> => {
    return api.get<{ message: string }>("/recommendations/jobs");
  },

  /**
   * Get recommended mentors for student
   * @param studentId - Optional student ID (defaults to current user for students)
   */
  getRecommendedMentors: async (
    studentId?: string
  ): Promise<MentorRecommendationsResponse> => {
    const body = studentId ? { id: studentId } : {};
    return api.post<MentorRecommendationsResponse>(
      "/recommendations/mentors",
      body
    );
  },

  /**
   * Get recommended students for mentor
   * @param studentIds - Array of student MongoDB ObjectIds to evaluate
   * @param alumniId - Optional alumni ID (defaults to current user for alumni)
   */
  getRecommendedStudents: async (
    studentIds: string[],
    alumniId?: string
  ): Promise<StudentRecommendationsResponse> => {
    const body: { studentIds: string[]; id?: string } = {
      studentIds,
    };
    if (alumniId) {
      body.id = alumniId;
    }
    return api.post<StudentRecommendationsResponse>(
      "/recommendations/students",
      body
    );
  },

  /**
   * Check recommendation model health and connectivity
   */
  checkHealth: async (): Promise<RecommendationHealthResponse> => {
    return api.get<RecommendationHealthResponse>("/recommendations/health");
  },
};
