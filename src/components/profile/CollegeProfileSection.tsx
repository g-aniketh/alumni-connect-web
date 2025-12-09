import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MapPin } from "lucide-react";
import type { College } from "../../types";
import { FileUpload } from "./FileUpload";
import { useState, useEffect } from "react";
import { uploadAPI } from "../../lib/api";
import type { CollegeFormData } from "../../types/profile";

interface CollegeProfileSectionProps {
  user: College;
  isEditing: boolean;
  formData: CollegeFormData;
  onFormDataChange: (data: CollegeFormData) => void;
}

export const CollegeProfileSection = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: CollegeProfileSectionProps) => {
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | undefined>(
    user.avatar
  );

  // Load college logo from backend
  useEffect(() => {
    const loadCollegeLogo = async () => {
      if (!isEditing) {
        try {
          const files = await uploadAPI.getMyFiles();
          // Use optimized URL if available, fallback to HD, then original
          const logoUrl =
            files.collegeLogo?.optimized ||
            files.collegeLogo?.hd ||
            files.collegeLogo?.original ||
            user.avatar;
          setCollegeLogoUrl(logoUrl || undefined);
        } catch {
          // If error, use the avatar from user object
          setCollegeLogoUrl(user.avatar);
        }
      } else {
        // When editing, use the current user avatar
        setCollegeLogoUrl(user.avatar);
      }
    };

    loadCollegeLogo();
  }, [user.avatar, isEditing]);

  const handleLogoUpload = (
    url: string,
    urlHD?: string,
    urlOptimized?: string
  ) => {
    // Use optimized URL if available, fallback to HD, then original
    const bestUrl = urlOptimized || urlHD || url;
    setCollegeLogoUrl(bestUrl);
    // Update form data if needed
    onFormDataChange({ ...formData, avatar: bestUrl } as CollegeFormData);
  };

  const handleLogoDelete = () => {
    setCollegeLogoUrl(undefined);
    onFormDataChange({ ...formData, avatar: undefined } as CollegeFormData);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Institution Information</CardTitle>
        <CardDescription>Your college or university details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing && (
          <FileUpload
            type="profile-picture"
            currentUrl={collegeLogoUrl}
            onUploadSuccess={handleLogoUpload}
            onDelete={handleLogoDelete}
            label="College Logo"
            description="Upload your college logo (JPEG, PNG, GIF, WebP - Max 5MB)"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="website" className="text-sm font-semibold">
              Website
            </Label>
            {isEditing ? (
              <Input
                id="website"
                type="url"
                value={formData.website || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, website: e.target.value })
                }
                className="h-11"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium break-all">
                  {user.website || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-semibold">
              Location
            </Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, location: e.target.value })
                }
                className="h-11"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {user.location || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="establishedYear" className="text-sm font-semibold">
            Established Year
          </Label>
          {isEditing ? (
            <Input
              id="establishedYear"
              type="number"
              value={formData.establishedYear || ""}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  establishedYear: e.target.value,
                })
              }
              className="h-11"
            />
          ) : (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-medium">
              {user.establishedYear || (
                <span className="text-muted-foreground italic">Not specified</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
