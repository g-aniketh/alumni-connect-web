import { useState } from "react";
import { UserRole, type Alumni, type Student, type College } from "../types";
import type {
  AlumniFormData,
  StudentFormData,
  CollegeFormData,
  ProfileFormData,
} from "../types/profile";

export const useProfileForm = (user: Alumni | Student | College | null) => {
  const getInitialFormData = (): ProfileFormData => {
    if (!user) {
      return { name: "", email: "" } as CollegeFormData;
    }

    const base = { name: user.name || "", email: user.email || "" };

    if (user.role === UserRole.Alumni) {
      const alumni = user as Alumni;
      return {
        ...base,
        currentEmployer: alumni.currentEmployer || "",
        designation: alumni.designation || "",
        graduationYear: alumni.graduationYear?.toString() || "",
        degree: alumni.degree || "",
        department: alumni.department || "",
        skills: alumni.skills?.join(", ") || "",
        mentorshipAvailable: alumni.mentorshipAvailable || false,
        linkedInProfile: alumni.linkedInProfile || "",
        githubProfile: alumni.githubProfile || "",
        personalWebsite: alumni.personalWebsite || "",
        resumeUrl: alumni.resumeUrl || "",
        bio: alumni.bio || "",
        location: alumni.location || "",
        avatar: alumni.avatar,
      } as AlumniFormData;
    } else if (user.role === UserRole.Student) {
      const student = user as Student;
      return {
        ...base,
        rollNumber: student.rollNumber || "",
        enrollmentYear: student.enrollmentYear?.toString() || "",
        degree: student.degree || "",
        department: student.department || "",
        skills: student.skills?.join(", ") || "",
        linkedInProfile: student.linkedInProfile || "",
        githubProfile: student.githubProfile || "",
        personalWebsite: student.personalWebsite || "",
        resumeUrl: student.resumeUrl || "",
        bio: student.bio || "",
        avatar: student.avatar,
      } as StudentFormData;
    } else {
      const college = user as College;
      return {
        ...base,
        website: college.website || "",
        location: college.location || "",
        establishedYear: college.establishedYear?.toString() || "",
        avatar: college.avatar,
      } as CollegeFormData;
    }
  };

  const [formData, setFormData] =
    useState<ProfileFormData>(getInitialFormData());

  const resetFormData = () => {
    setFormData(getInitialFormData());
  };

  const updateFormData = (updates: Partial<ProfileFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return {
    formData,
    setFormData,
    resetFormData,
    updateFormData,
    getInitialFormData,
  };
};
