// API Response Types based on Backend Interfaces

export interface BackendAlumni {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
  isVerified: boolean;
  graduationYear: number;
  degree: string;
  collegeId?: string;
  collegeName: string;
  department: string;
  skills?: string[];
  currentDesignation?: string;
  currentEmployer?: string;
  location?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  personalWebsite?: string;
  resumeUrl?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendStudent {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  gender?: string;
  phoneNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  rollNumber: string;
  collegeId?: string;
  collegeName: string;
  enrollmentYear: number;
  department: string;
  degree: string;
  graduationYear: number;
  personalWebsite?: string;
  skills?: string[];
  resumeUrl?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCollege {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  address: string;
  establishedYear: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  departments: string[];
  degreesOffered: string[];
  linkedInProfile?: string;
  collegeLogoUrl?: string;
  alumniCount?: number;
  alumniVerifiedCount?: number;
  studentCount?: number;
  studentsVerifiedCount?: number;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface LoginResponse {
  token: string;
  alumni?: { id: string; name: string; email: string };
  student?: { id: string; name: string; email: string };
  college?: { id: string; name: string; email: string };
}

export interface SignupResponse {
  message: string;
  verifyUrl?: string;
}

export interface CurrentUserResponse {
  user: BackendAlumni | BackendStudent | BackendCollege;
  role: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: unknown;
}

// Signup Request Types
export interface AlumniSignupRequest {
  name: string;
  email: string;
  password: string;
  graduationYear: number;
  degree: string;
  collegeName: string;
  department: string;
  currentJobTitle?: string;
  company?: string;
  skills?: string[];
  linkedInProfile?: string;
}

export interface StudentSignupRequest {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  collegeName: string;
  enrollmentYear: number;
  department: string;
  degree: string;
  graduationYear: number;
}

export interface CollegeSignupRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  establishedYear: number;
  departments: string[];
  degreesOffered: string[];
}

export type SignupRequest =
  | AlumniSignupRequest
  | StudentSignupRequest
  | CollegeSignupRequest;
