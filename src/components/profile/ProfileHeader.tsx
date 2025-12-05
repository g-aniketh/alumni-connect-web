import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { UserRole } from "../../types";
import { Card, CardHeader, CardContent } from "../ui/card";
import { FileUpload } from "./FileUpload";
import { useState, useEffect } from "react";
import { uploadAPI } from "../../lib/api";
import type { ProfileFormData } from "../../types/profile";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: UserRole;
    avatar?: string;
    mentorshipAvailable?: boolean;
  };
  isEditing: boolean;
  formData: ProfileFormData;
  onFormDataChange: (data: ProfileFormData) => void;
}

export const ProfileHeader = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: ProfileHeaderProps) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >(user.avatar);

  // Load profile picture URLs from backend
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (!isEditing) {
        try {
          const files = await uploadAPI.getMyFiles();
          // Use optimized URL if available, fallback to HD, then original
          const pictureUrl =
            files.profilePicture?.optimized ||
            files.profilePicture?.hd ||
            files.profilePicture?.original ||
            user.avatar;
          setProfilePictureUrl(pictureUrl || undefined);
        } catch {
          // If error, use the avatar from user object
          setProfilePictureUrl(user.avatar);
        }
      } else {
        // When editing, use the current user avatar
        setProfilePictureUrl(user.avatar);
      }
    };

    loadProfilePicture();
  }, [user.avatar, isEditing]);

  const handleProfilePictureUpload = (
    url: string,
    urlHD?: string,
    urlOptimized?: string
  ) => {
    // Use optimized URL if available, fallback to HD, then original
    const bestUrl = urlOptimized || urlHD || url;
    setProfilePictureUrl(bestUrl);
    // Update form data if needed
    onFormDataChange({ ...formData, avatar: bestUrl } as ProfileFormData);
  };

  const handleProfilePictureDelete = () => {
    setProfilePictureUrl(undefined);
    onFormDataChange({ ...formData, avatar: undefined } as ProfileFormData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profilePictureUrl}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={"name" in formData ? formData.name : ""}
                onChange={e =>
                  onFormDataChange({
                    ...formData,
                    name: e.target.value,
                  } as ProfileFormData)
                }
                className="text-2xl font-bold mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold">{user.name}</h2>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{user.role}</Badge>
              {user.role === UserRole.Alumni && user.mentorshipAvailable && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Open for Mentorship
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {isEditing && (
        <CardContent>
          <FileUpload
            type="profile-picture"
            currentUrl={profilePictureUrl}
            onUploadSuccess={handleProfilePictureUpload}
            onDelete={handleProfilePictureDelete}
          />
        </CardContent>
      )}
    </Card>
  );
};
