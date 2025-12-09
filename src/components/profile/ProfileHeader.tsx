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
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-primary/10 shadow-lg">
              <AvatarImage
                src={profilePictureUrl}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
            {isEditing ? (
              <Input
                value={"name" in formData ? formData.name : ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    name: e.target.value,
                  } as ProfileFormData)
                }
                className="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {user.name}
              </h2>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {user.role}
              </Badge>
              {user.role === UserRole.Alumni && user.mentorshipAvailable && (
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-sm px-3 py-1"
                >
                  Open for Mentorship
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {isEditing && (
        <CardContent className="pt-0">
          <div className="border-t pt-6">
            <FileUpload
              type="profile-picture"
              currentUrl={profilePictureUrl}
              onUploadSuccess={handleProfilePictureUpload}
              onDelete={handleProfilePictureDelete}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};
