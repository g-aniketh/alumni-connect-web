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

// Helper to transform backend user to frontend user format
const transformUser = (
  backendUser: BackendAlumni | BackendStudent | BackendCollege,
  role: UserRole
): User => {
  const baseUser = {
    id: backendUser._id || (backendUser as { id?: string }).id || "",
    name: backendUser.name,
    email: backendUser.email,
    role,
  };

  if (role === UserRole.Alumni) {
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
      avatar: alumni.profilePictureUrl,
      mentorshipAvailable: true, // Default, can be updated
      linkedInProfile: alumni.linkedInProfile,
      githubProfile: alumni.githubProfile,
      personalWebsite: alumni.personalWebsite,
      resumeUrl: alumni.resumeUrl,
      bio: alumni.bio,
      location: alumni.location,
    } as Alumni;
  } else if (role === UserRole.Student) {
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
      avatar: student.profilePictureUrl,
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
      avatar: college.collegeLogoUrl,
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
              const transformedUser = transformUser(
                response.user,
                response.role as UserRole
              );
              setUser(transformedUser);
              tokenService.setUser(transformedUser);

              // Update verification status
              const role = response.role as UserRole;
              if (role === UserRole.Alumni || role === UserRole.Student) {
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
                const transformedUser = transformUser(
                  response.user,
                  response.role as UserRole
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

      // Store token (backend returns single token, use it as both access and refresh)
      if (response.token) {
        tokenService.setTokens(response.token, response.token);
      }

      // Fetch full user profile
      const userResponse = await authAPI.getCurrentUser();
      if (userResponse.user) {
        const transformedUser = transformUser(userResponse.user, role);
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
        // Fallback to basic user info from login response
        const userData =
          response.alumni || response.student || response.college;
        if (userData) {
          // Create a minimal user object for transformation
          const minimalUser = {
            _id: userData.id,
            name: userData.name,
            email: userData.email,
          };
          const transformedUser = transformUser(
            minimalUser as BackendAlumni | BackendStudent | BackendCollege,
            role
          );
          setUser(transformedUser);
          tokenService.setUser(transformedUser);

          if (role === UserRole.Alumni || role === UserRole.Student) {
            const typedUser = transformedUser as Alumni | Student;
            tokenService.setVerificationStatus(typedUser.isVerified);
          } else {
            tokenService.setVerificationStatus(true);
          }
        }
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
      await authAPI.logout();
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
        const transformedUser = transformUser(
          response.user,
          response.role as UserRole
        );
        setUser(transformedUser);
        tokenService.setUser(transformedUser);

        const role = response.role as UserRole;
        if (role === UserRole.Alumni || role === UserRole.Student) {
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
