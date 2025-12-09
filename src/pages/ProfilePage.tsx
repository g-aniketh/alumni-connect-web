import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { UserRole, type Alumni, type Student, type College } from "../types";
import { Save, Edit2, X } from "lucide-react";
import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { BasicInfoSection } from "../components/profile/BasicInfoSection";
import { AlumniProfileSection } from "../components/profile/AlumniProfileSection";
import { StudentProfileSection } from "../components/profile/StudentProfileSection";
import { CollegeProfileSection } from "../components/profile/CollegeProfileSection";
import { useProfileForm } from "../hooks/useProfileForm";
import { useProfileSave } from "../hooks/useProfileSave";
import type {
  ProfileFormData,
  AlumniFormData,
  StudentFormData,
  CollegeFormData,
} from "../types/profile";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { formData, setFormData, resetFormData } = useProfileForm(user);
  const { saveProfile, loading, error } = useProfileSave();

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    const success = await saveProfile(user, formData, refreshUser);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    resetFormData();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-[10vh]">
      <div className="container py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Manage your profile information and preferences
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="lg" className="shadow-md">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel} size="lg">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading} size="lg" className="shadow-md">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/50 rounded-lg text-red-700 dark:text-red-300 shadow-sm">
              {error}
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          formData={formData}
          onFormDataChange={setFormData}
        />

        <BasicInfoSection
          user={user}
          isEditing={isEditing}
          formData={formData}
          onFormDataChange={setFormData}
        />

        {user.role === UserRole.Alumni && (
          <AlumniProfileSection
            user={user as Alumni}
            isEditing={isEditing}
            formData={formData as AlumniFormData}
            onFormDataChange={(data) => setFormData(data as ProfileFormData)}
          />
        )}

        {user.role === UserRole.Student && (
          <StudentProfileSection
            user={user as Student}
            isEditing={isEditing}
            formData={formData as StudentFormData}
            onFormDataChange={(data) => setFormData(data as ProfileFormData)}
          />
        )}

        {user.role === UserRole.College && (
          <CollegeProfileSection
            user={user as College}
            isEditing={isEditing}
            formData={formData as CollegeFormData}
            onFormDataChange={(data) => setFormData(data as ProfileFormData)}
          />
        )}

          {/* Account Actions */}
          <ChangePasswordForm
            onSuccess={() => {
              // Optionally refresh user data or show success message
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
