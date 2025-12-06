// API Response Types based on Backend Interfaces

// Backend Enums (matching Backend-Alumni-Connect/src/types/customTypes.ts)
export const BackendApplicationStatus = {
  Applied: "applied",
  UnderReview: "under_review",
  InterviewScheduled: "interview_scheduled",
  Offered: "offered",
  Rejected: "rejected",
} as const;

export type BackendApplicationStatus =
  (typeof BackendApplicationStatus)[keyof typeof BackendApplicationStatus];

export const BackendEventRegistrationStatus = {
  Registered: "registered",
  Attended: "attended",
  Cancelled: "cancelled",
  Waitlisted: "waitlisted",
} as const;

export type BackendEventRegistrationStatus =
  (typeof BackendEventRegistrationStatus)[keyof typeof BackendEventRegistrationStatus];

export const BackendJobType = {
  FullTime: "full_time",
  PartTime: "part_time",
  Internship: "internship",
  Contract: "contract",
  Temporary: "temporary",
} as const;

export type BackendJobType =
  (typeof BackendJobType)[keyof typeof BackendJobType];

export interface BackendAlumni {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  profilePictureUrlHD?: string;
  profilePictureUrlOptimized?: string;
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
  profilePictureUrlHD?: string;
  profilePictureUrlOptimized?: string;
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
  collegeLogoUrlHD?: string;
  collegeLogoUrlOptimized?: string;
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
  token?: string;
  accessToken?: string;
  refreshToken?: string;
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

// Job Types
export interface BackendJob {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  postedBy: {
    posterType: string;
    posterId: string | { _id: string; name: string; email: string };
  };
  totalApplications: number;
  jobType: BackendJobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  referral?: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobCreateRequest {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  jobType: BackendJobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  referral?: boolean;
  deadline?: string;
}

export interface JobApplicationRequest {
  message?: string;
  resumeUrl?: string;
}

export interface BackendJobApplication {
  _id: string;
  jobId: string | BackendJob;
  applicantType: string;
  applicantId: string | BackendStudent | BackendAlumni;
  status: BackendApplicationStatus;
  message?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  location: string;
  organizedBy: {
    organizerType: string;
    organizerId: string | { _id: string; name: string; email: string };
  };
  eventBannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreateRequest {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  eventBannerUrl?: string;
}

export interface EventRegisterRequest {
  eventId: string;
}

export interface BackendEventRegistration {
  _id: string;
  eventId: string | BackendEvent;
  participantType: string;
  participantId: string | BackendStudent;
  status: BackendEventRegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

// Mentorship Types
export interface BackendMentorship {
  _id: string;
  mentorId: string | BackendAlumni;
  menteeId: string | BackendStudent;
  status: string;
  startDate?: string;
  endDate?: string;
  message?: string;
  areasOfInterest?: string[];
  mentorFeedback?: {
    rating: number;
    comment?: string;
    submittedAt: string;
  };
  menteeFeedback?: {
    rating: number;
    comment?: string;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipRequestCreate {
  mentorId: string;
  message?: string;
  areasOfInterest?: string[];
}

export interface MentorshipStatusUpdate {
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface MentorshipDatesUpdate {
  startDate?: string;
  endDate?: string;
}

export interface MentorshipFeedbackRequest {
  rating: number;
  comment?: string;
}

// Campaign Types
export interface BackendCampaign {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount?: number;
  totalRaised?: number;
  totalVolunteeringHours?: number;
  createdBy: string | { _id: string; name: string; email: string };
  contributions?: string[];
  countFinancialContributors?: number;
  countVolunteeringContributors?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount?: number;
}

export interface BackendContribution {
  _id: string;
  campaignId: string | BackendCampaign;
  contributorType: "alumni" | "student";
  contributorId: string;
  contributionType: string;
  amount?: number;
  hours?: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
