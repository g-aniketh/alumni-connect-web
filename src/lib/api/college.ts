import { api } from "./base";
import type {
  BackendCollege,
  BackendAlumni,
  BackendStudent,
  CreditUpdateResult,
  EligibleStudent,
  GraduationProcessResponse,
} from "../../types/api";

// College API endpoints
export const collegeAPI = {
  // Profile Management
  getProfile: async (): Promise<{
    college: BackendCollege;
  }> => {
    return api.get<{ college: BackendCollege }>("/colleges/profile");
  },

  updateProfile: async (
    data: Partial<BackendCollege>
  ): Promise<{
    message: string;
    college: BackendCollege;
  }> => {
    return api.put<{
      message: string;
      college: BackendCollege;
    }>("/colleges/profile", data);
  },

  deleteProfile: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>("/colleges/profile");
  },

  // Get all college names (for signup dropdowns) - Public endpoint
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
  getAllAlumni: async (): Promise<BackendAlumni[]> => {
    return api.get<BackendAlumni[]>("/colleges/alumni");
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
    alumni: BackendAlumni;
  }> => {
    return api.post<{
      message: string;
      alumni: BackendAlumni;
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
    alumni: BackendAlumni[];
  }> => {
    return api.post<{
      message: string;
      created: number;
      alumni: BackendAlumni[];
    }>("/colleges/alumni/bulk", data);
  },

  updateAlumni: async (
    id: string,
    data: Partial<BackendAlumni>
  ): Promise<{
    message: string;
    alumni: BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: BackendAlumni;
    }>(`/colleges/alumni/profile/${id}`, data);
  },

  deleteAlumni: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/colleges/alumni/profile/${id}`);
  },

  // Student Management
  getAllStudents: async (): Promise<BackendStudent[]> => {
    return api.get<BackendStudent[]>("/colleges/students");
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
    student: BackendStudent;
  }> => {
    return api.post<{
      message: string;
      student: BackendStudent;
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
    students: BackendStudent[];
  }> => {
    return api.post<{
      message: string;
      created: number;
      students: BackendStudent[];
    }>("/colleges/students/bulk", data);
  },

  updateStudent: async (
    id: string,
    data: Partial<BackendStudent>
  ): Promise<{
    message: string;
    student: BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: BackendStudent;
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
    alumni: BackendAlumni;
  }> => {
    return api.put<{
      message: string;
      alumni: BackendAlumni;
    }>(`/colleges/verify/alumni/${alumniId}`);
  },

  verifyStudent: async (
    studentId: string
  ): Promise<{
    message: string;
    student: BackendStudent;
  }> => {
    return api.put<{
      message: string;
      student: BackendStudent;
    }>(`/colleges/verify/student/${studentId}`);
  },

  getPendingVerifications: async (): Promise<{
    alumni: BackendAlumni[];
    students: BackendStudent[];
  }> => {
    const response = await api.get<{
      pendingAlumni: BackendAlumni[];
      pendingStudents: BackendStudent[];
    }>("/colleges/pending-verifications");

    return {
      alumni: response.pendingAlumni ?? [],
      students: response.pendingStudents ?? [],
    };
  },

  // Credit System & Graduation Management
  updateDegreeCredits: async (
    degreeCredits: Record<string, number>
  ): Promise<{
    message: string;
    college: BackendCollege;
  }> => {
    return api.put<{
      message: string;
      college: BackendCollege;
    }>("/colleges/profile", { degreeCredits });
  },

  updateStudentCredits: async (data: {
    rollNumber: string;
    credits: number;
  }): Promise<{
    message: string;
    creditsUpdated: boolean;
    converted: boolean;
    previousCredits: number;
    currentCredits: number;
    requiredCredits: number;
    creditsRemaining?: number;
    alumniId?: string;
    conversionError?: string;
  }> => {
    return api.post<{
      message: string;
      creditsUpdated: boolean;
      converted: boolean;
      previousCredits: number;
      currentCredits: number;
      requiredCredits: number;
      creditsRemaining?: number;
      alumniId?: string;
      conversionError?: string;
    }>("/colleges/students/updateCredits", data);
  },

  syncCreditsFromDB: async (filters?: {
    departments?: string[];
    degree?: string;
    rollNumbers?: string[];
    enrollmentYear?: number;
    graduationYear?: number;
  }): Promise<{
    message: string;
    processed: number;
    updated: number;
    converted: number;
    failed: number;
    results: CreditUpdateResult[];
  }> => {
    return api.post<{
      message: string;
      processed: number;
      updated: number;
      converted: number;
      failed: number;
      results: CreditUpdateResult[];
    }>("/colleges/updateCredits", filters || {});
  },

  getEligibleStudents: async (): Promise<{
    message: string;
    eligible: EligibleStudent[];
    total: number;
  }> => {
    return api.get<{
      message: string;
      eligible: EligibleStudent[];
      total: number;
    }>("/colleges/graduations/eligible");
  },

  processEligibleGraduations: async (): Promise<GraduationProcessResponse> => {
    return api.post<GraduationProcessResponse>("/colleges/graduations/process");
  },

  checkStudentEligibility: async (
    rollNumber: string
  ): Promise<{
    eligible: boolean;
    credits: number;
    requiredCredits: number;
    message: string;
  }> => {
    return api.get<{
      eligible: boolean;
      credits: number;
      requiredCredits: number;
      message: string;
    }>(`/students/credits/eligibility/${rollNumber}`);
  },

  convertStudentToAlumni: async (data: {
    rollNumber: string;
  }): Promise<{
    message: string;
    success: boolean;
    alumniId: string;
  }> => {
    return api.post<{
      message: string;
      success: boolean;
      alumniId: string;
    }>("/students/credits/convert", data);
  },
};
