// Form data types for each user role
export interface AlumniFormData {
  name: string;
  email: string;
  currentEmployer: string;
  designation: string;
  graduationYear: string;
  degree: string;
  department: string;
  skills: string;
  mentorshipAvailable: boolean;
  linkedInProfile: string;
  githubProfile: string;
  personalWebsite: string;
  resumeUrl: string;
  bio: string;
  location: string;
  avatar?: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  rollNumber: string;
  enrollmentYear: string;
  degree: string;
  department: string;
  skills: string;
  linkedInProfile: string;
  githubProfile: string;
  personalWebsite: string;
  resumeUrl: string;
  bio: string;
  avatar?: string;
}

export interface CollegeFormData {
  name: string;
  email: string;
  website: string;
  location: string;
  establishedYear: string;
  avatar?: string;
}

// Union type for all form data
export type ProfileFormData = AlumniFormData | StudentFormData | CollegeFormData;

// Type guard functions
export function isAlumniFormData(data: ProfileFormData): data is AlumniFormData {
  return 'currentEmployer' in data && 'designation' in data;
}

export function isStudentFormData(data: ProfileFormData): data is StudentFormData {
  return 'rollNumber' in data && 'enrollmentYear' in data;
}

export function isCollegeFormData(data: ProfileFormData): data is CollegeFormData {
  return 'website' in data && 'establishedYear' in data && !('rollNumber' in data);
}

