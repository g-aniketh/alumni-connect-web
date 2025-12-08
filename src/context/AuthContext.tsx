/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { UserRole, type Alumni, type Student, type College } from "../types";
import { authAPI, tokenService } from "../lib/api";
import type {
  BackendAlumni,
  BackendStudent,
  BackendCollege,
  SignupRequest,
} from "../types/api";

type User = Alumni | Student | College;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole, email: string, password: string) => Promise<void>;
  signup: (role: UserRole, data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map backend role (lowercase) to frontend role (capitalized)
const mapBackendRoleToFrontend = (backendRole: string): UserRole => {
  const lowerRole = backendRole.toLowerCase();
  if (lowerRole === "alumni") {
    return UserRole.Alumni;
  } else if (lowerRole === "student") {
    return UserRole.Student;
  } else if (lowerRole === "college") {
    return UserRole.College;
  }
  // Default fallback (shouldn't happen, but TypeScript needs it)
  throw new Error(`Invalid role: ${backendRole}`);
};

// Helper to transform backend user to frontend user format
const transformUser = (
  backendUser: BackendAlumni | BackendStudent | BackendCollege,
  role: string | UserRole // Accept both string (from backend) and UserRole
): User => {
  // Normalize role to frontend UserRole enum
  const frontendRole =
    typeof role === "string" ? mapBackendRoleToFrontend(role) : role;

  const baseUser = {
    id: backendUser._id || (backendUser as { id?: string }).id || "",
    name: backendUser.name,
    email: backendUser.email,
    role: frontendRole,
  };

  if (frontendRole === UserRole.Alumni) {
    const alumni = backendUser as BackendAlumni;
    return {
      ...baseUser,
      role: UserRole.Alumni,
      isVerified: alumni.isVerified,
      department: alumni.department as import("../types").Department,
      graduationYear: alumni.graduationYear,
      degree: alumni.degree,
      currentEmployer: alumni.currentEmployer || "",
      designation: alumni.currentDesignation || "",
      skills: alumni.skills || [],
      avatar:
        alumni.profilePictureUrlOptimized ||
        alumni.profilePictureUrlHD ||
        alumni.profilePictureUrl,
      mentorshipAvailable: true, // Default, can be updated
      linkedInProfile: alumni.linkedInProfile,
      githubProfile: alumni.githubProfile,
      personalWebsite: alumni.personalWebsite,
      resumeUrl: alumni.resumeUrl,
      bio: alumni.bio,
      location: alumni.location,
    } as Alumni;
  } else if (frontendRole === UserRole.Student) {
    const student = backendUser as BackendStudent;
    return {
      ...baseUser,
      role: UserRole.Student,
      isVerified: student.isVerified,
      department: student.department as import("../types").Department,
      rollNumber: student.rollNumber,
      enrollmentYear: student.enrollmentYear,
      degree: student.degree,
      skills: student.skills || [],
      avatar:
        student.profilePictureUrlOptimized ||
        student.profilePictureUrlHD ||
        student.profilePictureUrl,
      linkedInProfile: student.linkedInProfile,
      githubProfile: student.githubProfile,
      personalWebsite: student.personalWebsite,
      resumeUrl: student.resumeUrl,
      bio: student.bio,
    } as Student;
  } else {
    const college = backendUser as BackendCollege;
    return {
      ...baseUser,
      role: UserRole.College,
      establishedYear: college.establishedYear,
      website: college.website || "",
      location: college.address,
      stats: {
        alumniCount: college.alumniCount || 0,
        studentCount: college.studentCount || 0,
      },
      avatar:
        college.collegeLogoUrlOptimized ||
        college.collegeLogoUrlHD ||
        college.collegeLogoUrl,
    } as College;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount - persist authentication on refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = tokenService.getUser();
        const token = tokenService.getAccessToken();

        if (storedUser && token) {
          // Set user immediately from storage for instant UI update
          setUser(storedUser);

          // Then verify token is still valid by fetching current user
          try {
            const response = await authAPI.getCurrentUser();
            if (response.user) {
              // Backend returns role as lowercase string, transformUser will map it correctly
              const transformedUser = transformUser(
                response.user,
                response.role // Pass as string, transformUser will map it
              );
              setUser(transformedUser);
              tokenService.setUser(transformedUser);

              // Update verification status - use transformed user's role (already mapped)
              const frontendRole = transformedUser.role;
              if (
                frontendRole === UserRole.Alumni ||
                frontendRole === UserRole.Student
              ) {
                const typedUser = transformedUser as Alumni | Student;
                tokenService.setVerificationStatus(typedUser.isVerified);
              } else {
                tokenService.setVerificationStatus(true);
              }
            }
          } catch (error) {
            // Token invalid or expired, try to refresh
            console.warn(
              "Token validation failed, attempting refresh...",
              error
            );
            try {
              // The ApiClient should handle token refresh automatically
              // If refresh also fails, clear storage
              const refreshToken = tokenService.getRefreshToken();
              if (!refreshToken) {
                throw new Error("No refresh token available");
              }
              // If we get here, token refresh might have worked
              // Try getting user again
              const response = await authAPI.getCurrentUser();
              if (response.user) {
                // Backend returns role as lowercase string, transformUser will map it correctly
                const transformedUser = transformUser(
                  response.user,
                  response.role // Pass as string, transformUser will map it
                );
                setUser(transformedUser);
                tokenService.setUser(transformedUser);
              }
            } catch (refreshError) {
              // Both validation and refresh failed, clear storage
              console.error("Token refresh failed, logging out:", refreshError);
              tokenService.clearTokens();
              setUser(null);
            }
          }
        } else {
          // No stored user or token, ensure clean state
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        tokenService.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    role: UserRole,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      let response: import("../types/api").LoginResponse;

      switch (role) {
        case UserRole.Alumni:
          response = await authAPI.loginAlumni(email, password);
          break;
        case UserRole.Student:
          response = await authAPI.loginStudent(email, password);
          break;
        case UserRole.College:
          response = await authAPI.loginCollege(email, password);
          break;
        default:
          throw new Error("Invalid role");
      }

      // Store token (backend login returns single token, use it as both access and refresh)
      // When token expires, use refresh-token endpoint to get new access/refresh tokens
      if (response.token) {
        tokenService.setTokens(response.token, response.token);
      } else if (response.accessToken && response.refreshToken) {
        // Handle case where backend returns separate tokens
        tokenService.setTokens(response.accessToken, response.refreshToken);
      }

      // Fetch full user profile to check verification status
      let userResponse: import("../types/api").CurrentUserResponse;
      try {
        userResponse = await authAPI.getCurrentUser();
      } catch {
        // If we can't fetch user profile, clear tokens and throw error
        tokenService.clearTokens();
        throw new Error("Unable to fetch user profile. Please try again.");
      }

      if (userResponse.user) {
        // role is already UserRole enum from login function parameter
        // But we should use the role from the response to be safe
        const transformedUser = transformUser(
          userResponse.user,
          userResponse.role // Backend returns lowercase, transformUser will map it
        );
        setUser(transformedUser);
        tokenService.setUser(transformedUser);

        // Persist verification status in cookie for alumni/students
        if (role === UserRole.Alumni || role === UserRole.Student) {
          const typedUser = transformedUser as Alumni | Student;
          tokenService.setVerificationStatus(typedUser.isVerified);
        } else {
          tokenService.setVerificationStatus(true);
        }
      } else {
        // If we can't get user profile, we can't verify email status
        // Clear tokens and throw error
        tokenService.clearTokens();
        throw new Error("Unable to fetch user profile. Please try again.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      console.error("Login error:", error);
      throw new Error(errorMessage);
    }
  };

  const signup = async (role: UserRole, data: SignupRequest): Promise<void> => {
    try {
      switch (role) {
        case UserRole.Alumni:
          await authAPI.signupAlumni(
            data as import("../types/api").AlumniSignupRequest
          );
          break;
        case UserRole.Student:
          await authAPI.signupStudent(
            data as import("../types/api").StudentSignupRequest
          );
          break;
        case UserRole.College:
          await authAPI.signupCollege(
            data as import("../types/api").CollegeSignupRequest
          );
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      console.error("Signup error:", error);
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call role-specific logout endpoint
      if (user) {
        switch (user.role) {
          case UserRole.Alumni:
            await authAPI.logoutAlumni();
            break;
          case UserRole.Student:
            await authAPI.logoutStudent();
            break;
          case UserRole.College:
            await authAPI.logoutCollege();
            break;
        }
      }
    } catch (error: unknown) {
      console.error("Logout error:", error);
    } finally {
      tokenService.clearTokens();
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        // Backend returns role as lowercase string, transformUser will map it correctly
        const transformedUser = transformUser(
          response.user,
          response.role // Pass as string, transformUser will map it
        );
        setUser(transformedUser);
        tokenService.setUser(transformedUser);

        // Use transformed user's role (already mapped to frontend format)
        const frontendRole = transformedUser.role;
        if (
          frontendRole === UserRole.Alumni ||
          frontendRole === UserRole.Student
        ) {
          const typedUser = transformedUser as Alumni | Student;
          tokenService.setVerificationStatus(typedUser.isVerified);
        } else {
          tokenService.setVerificationStatus(true);
        }
      }
    } catch (error: unknown) {
      console.error("Error refreshing user:", error);
      // If refresh fails, logout user
      tokenService.clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
