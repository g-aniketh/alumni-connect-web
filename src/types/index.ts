export const ContributionType = {
  Financial: "Financial Contribution",
  Volunteer: "Volunteer Time",
} as const;

export type ContributionType = (typeof ContributionType)[keyof typeof ContributionType];

export const Department = {

  CS: "Computer Science",
  EE: "Electrical Engineering",
  Mech: "Mechanical Engineering",
  Civil: "Civil Engineering",
  Business: "Business",
  Arts: "Arts",
  Science: "Science",
} as const;

export type Department = (typeof Department)[keyof typeof Department];

export const JobType = {
  FullTime: "Full Time",
  PartTime: "Part Time",
  Internship: "Internship",
  Contract: "Contract",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const EventStatus = {
  Upcoming: "Upcoming",
  Ongoing: "Ongoing",
  Completed: "Completed",
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

export const UserRole = {
  Alumni: "Alumni",
  Student: "Student",
  College: "College",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface Alumni {
  id: string;
  name: string;
  email: string;
  role: typeof UserRole.Alumni;
  department: Department;
  graduationYear: number;
  degree: string;
  currentEmployer: string;
  designation: string;
  skills: string[];
  avatar?: string;
  mentorshipAvailable?: boolean; // true = Open for Mentorship, false/undefined = Busy
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role: typeof UserRole.Student;
  department: Department;
  rollNumber: string;
  enrollmentYear: number;
  degree: string;
  skills: string[];
  avatar?: string;
}

export interface College {
  id: string;
  name: string;
  email: string;
  role: typeof UserRole.College;
  establishedYear: number;
  website: string;
  location: string;
  stats: {
    alumniCount: number;
    studentCount: number;
  };
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  department: Department[];
  salaryMin?: number;
  salaryMax?: number;
  referralAvailable: boolean;
  postedBy: string;
  postedDate: string;
  applyLink?: string;
}

export const JobApplicationStatus = {
  Applied: "Applied",
  UnderReview: "Under Review",
  Interviewing: "Interviewing",
  Offered: "Offered",
  Rejected: "Rejected",
} as const;

export type JobApplicationStatus =
  (typeof JobApplicationStatus)[keyof typeof JobApplicationStatus];

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  status: JobApplicationStatus;
  appliedOn: string;
  updatedOn?: string;
  notes?: string;
  referralRequested?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  organizer: string;
  targetAmount: number;
  totalRaised: number;
  status: EventStatus;
  deadline: string;
  image?: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: EventStatus;
  organizer: string;
  image?: string;
}

export const EventRegistrationStatus = {
  Registered: "Registered",
  Waitlisted: "Waitlisted",
  Attended: "Attended",
  Cancelled: "Cancelled",
} as const;

export type EventRegistrationStatus =
  (typeof EventRegistrationStatus)[keyof typeof EventRegistrationStatus];

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  status: EventRegistrationStatus;
  registeredOn: string;
  checkedIn?: boolean;
}

export const MentorshipStatus = {
  Pending: "Pending",
  Accepted: "Accepted",
  Declined: "Declined",
  Completed: "Completed",
} as const;

export type MentorshipStatus =
  (typeof MentorshipStatus)[keyof typeof MentorshipStatus];

export interface MentorshipRequest {
  id: string;
  studentId: string;
  alumniId: string;
  status: MentorshipStatus;
  requestedOn: string;
  message?: string;
  updatedOn?: string;
}

export interface Newsletter {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedOn: string;
  tags?: string[];
  coverImage?: string;
  link?: string;
}
