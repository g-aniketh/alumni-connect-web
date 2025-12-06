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
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
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
  );
};

export default ProfilePage;
