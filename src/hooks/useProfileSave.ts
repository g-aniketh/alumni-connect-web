import { useState } from "react";
import { UserRole, type Alumni, type Student, type College } from "../types";
import { alumniAPI, studentAPI, collegeAPI } from "../lib/api";
import type {
  ProfileFormData,
  AlumniFormData,
  StudentFormData,
  CollegeFormData,
} from "../types/profile";
import {
  isAlumniFormData,
  isStudentFormData,
  isCollegeFormData,
} from "../types/profile";

export const useProfileSave = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const saveProfile = async (
    user: Alumni | Student | College,
    formData: ProfileFormData,
    refreshUser: () => Promise<void>
  ): Promise<boolean> => {
    try {
      setError("");
      setLoading(true);

      // Ensure we have a valid user role
      const userRole = user.role;
      if (!userRole) {
        throw new Error(
          "User role is not defined. Please log out and log in again."
        );
      }

      // Check user role first - this is the primary check
      // Convert to string for comparison to handle any type mismatches
      const roleString = String(userRole);
      if (roleString === "Alumni" || roleString === UserRole.Alumni) {
        // Validate form data type
        if (!isAlumniFormData(formData)) {
          console.error("Form data validation failed:", {
            userRole: user.role,
            formDataKeys: Object.keys(formData),
            isAlumniFormData: isAlumniFormData(formData),
            isStudentFormData: isStudentFormData(formData),
            isCollegeFormData: isCollegeFormData(formData),
          });
          throw new Error(
            "Invalid form data: Expected alumni form data. Please refresh the page and try again."
          );
        }
        const alumni = user as Alumni;
        const alumniFormData = formData as AlumniFormData;
        const updateData = {
          name: alumniFormData.name,
          email: alumniFormData.email,
          currentDesignation: alumniFormData.designation,
          currentEmployer: alumniFormData.currentEmployer,
          graduationYear: alumniFormData.graduationYear
            ? parseInt(alumniFormData.graduationYear)
            : alumni.graduationYear,
          degree: alumniFormData.degree,
          department: alumniFormData.department,
          skills: alumniFormData.skills
            ? alumniFormData.skills
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s)
            : [],
          mentorshipAvailable: alumniFormData.mentorshipAvailable,
          linkedInProfile: alumniFormData.linkedInProfile?.trim() || undefined,
          githubProfile: alumniFormData.githubProfile?.trim() || undefined,
          personalWebsite: alumniFormData.personalWebsite?.trim() || undefined,
          resumeUrl: alumniFormData.resumeUrl?.trim() || undefined,
          bio: alumniFormData.bio?.trim() || undefined,
          location: alumniFormData.location?.trim() || undefined,
        };
        await alumniAPI.updateProfile(user.id, updateData);
      } else if (roleString === "Student" || roleString === UserRole.Student) {
        // Validate form data type
        if (!isStudentFormData(formData)) {
          throw new Error(
            "Invalid form data: Expected student form data. Please refresh the page and try again."
          );
        }
        const student = user as Student;
        const studentFormData = formData as StudentFormData;
        const updateData = {
          name: studentFormData.name,
          email: studentFormData.email,
          rollNumber: studentFormData.rollNumber,
          enrollmentYear: studentFormData.enrollmentYear
            ? parseInt(studentFormData.enrollmentYear)
            : student.enrollmentYear,
          degree: studentFormData.degree,
          department: studentFormData.department,
          skills: studentFormData.skills
            ? studentFormData.skills
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s)
            : [],
          linkedInProfile: studentFormData.linkedInProfile?.trim() || undefined,
          githubProfile: studentFormData.githubProfile?.trim() || undefined,
          personalWebsite: studentFormData.personalWebsite?.trim() || undefined,
          resumeUrl: studentFormData.resumeUrl?.trim() || undefined,
          bio: studentFormData.bio?.trim() || undefined,
        };
        await studentAPI.updateProfile(user.id, updateData);
      } else if (roleString === "College" || roleString === UserRole.College) {
        // Validate form data type
        if (!isCollegeFormData(formData)) {
          throw new Error(
            "Invalid form data: Expected college form data. Please refresh the page and try again."
          );
        }
        const college = user as College;
        const collegeFormData = formData as CollegeFormData;
        const updateData = {
          name: collegeFormData.name,
          email: collegeFormData.email,
          website: collegeFormData.website,
          address: collegeFormData.location, // Backend uses 'address' not 'location'
          establishedYear: collegeFormData.establishedYear
            ? parseInt(collegeFormData.establishedYear)
            : college.establishedYear,
        };
        await collegeAPI.updateProfile(updateData);
      } else {
        throw new Error(
          `Unknown user role: ${
            (user as { role?: string }).role || "undefined"
          }`
        );
      }

      await refreshUser();
      alert("Profile updated successfully!");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveProfile, loading, error };
};
