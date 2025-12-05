import { useState } from 'react';
import { UserRole, type Alumni, type Student, type College } from '../types';
import { alumniAPI, studentAPI, collegeAPI } from '../lib/api';

export const useProfileSave = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const saveProfile = async (
    user: Alumni | Student | College,
    formData: Record<string, any>,
    refreshUser: () => Promise<void>
  ): Promise<boolean> => {
    try {
      setError('');
      setLoading(true);
      
      let updateData: Record<string, unknown> = {};
      
      if (user.role === UserRole.Alumni) {
        const alumni = user as Alumni;
        updateData = {
          name: formData.name,
          email: formData.email,
          currentDesignation: formData.designation,
          currentEmployer: formData.currentEmployer,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : alumni.graduationYear,
          degree: formData.degree,
          department: formData.department,
          skills: formData.skills ? (formData.skills as string).split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          mentorshipAvailable: formData.mentorshipAvailable,
          linkedInProfile: formData.linkedInProfile?.trim() || undefined,
          githubProfile: formData.githubProfile?.trim() || undefined,
          personalWebsite: formData.personalWebsite?.trim() || undefined,
          resumeUrl: formData.resumeUrl?.trim() || undefined,
          bio: formData.bio?.trim() || undefined,
          location: formData.location?.trim() || undefined,
        };
        await alumniAPI.updateProfile(user.id, updateData);
      } else if (user.role === UserRole.Student) {
        const student = user as Student;
        updateData = {
          name: formData.name,
          email: formData.email,
          rollNumber: formData.rollNumber,
          enrollmentYear: formData.enrollmentYear ? parseInt(formData.enrollmentYear) : student.enrollmentYear,
          degree: formData.degree,
          department: formData.department,
          skills: formData.skills ? (formData.skills as string).split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          linkedInProfile: formData.linkedInProfile?.trim() || undefined,
          githubProfile: formData.githubProfile?.trim() || undefined,
          personalWebsite: formData.personalWebsite?.trim() || undefined,
          resumeUrl: formData.resumeUrl?.trim() || undefined,
          bio: formData.bio?.trim() || undefined,
        };
        await studentAPI.updateProfile(user.id, updateData);
      } else if (user.role === UserRole.College) {
        const college = user as College;
        updateData = {
          name: formData.name,
          email: formData.email,
          website: formData.website,
          address: formData.location, // Backend uses 'address' not 'location'
          establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : college.establishedYear,
        };
        await collegeAPI.updateProfile(updateData);
      }
      
      await refreshUser();
      alert('Profile updated successfully!');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveProfile, loading, error };
};

