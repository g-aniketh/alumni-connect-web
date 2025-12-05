import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Linkedin, Github, Globe, FileText } from "lucide-react";
import type { Alumni, Student } from "../../types";
import { FileUpload } from "./FileUpload";
import { useState, useEffect } from "react";
import { uploadAPI } from "../../lib/api";
import type { AlumniFormData, StudentFormData } from "../../types/profile";

interface OnlinePresenceSectionProps {
  user: Alumni | Student;
  isEditing: boolean;
  formData: AlumniFormData | StudentFormData;
  onFormDataChange: (data: AlumniFormData | StudentFormData) => void;
}

export const OnlinePresenceSection = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: OnlinePresenceSectionProps) => {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(
    user.resumeUrl
  );

  // Load resume URL from backend
  useEffect(() => {
    const loadResume = async () => {
      if (!isEditing) {
        try {
          const files = await uploadAPI.getMyFiles();
          setResumeUrl(files.resumeUrl || user.resumeUrl || undefined);
        } catch {
          // If error, use the resumeUrl from user object
          setResumeUrl(user.resumeUrl);
        }
      } else {
        // When editing, use the current user resumeUrl
        setResumeUrl(user.resumeUrl);
      }
    };

    loadResume();
  }, [user.resumeUrl, isEditing]);

  const handleResumeUpload = (url: string) => {
    setResumeUrl(url);
    // Update form data
    onFormDataChange({ ...formData, resumeUrl: url } as
      | AlumniFormData
      | StudentFormData);
  };

  const handleResumeDelete = () => {
    setResumeUrl(undefined);
    onFormDataChange({ ...formData, resumeUrl: "" } as
      | AlumniFormData
      | StudentFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Presence</CardTitle>
        <CardDescription>Your professional links and portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            {isEditing ? (
              <Input
                id="linkedIn"
                type="url"
                value={formData.linkedInProfile || ""}
                onChange={e =>
                  onFormDataChange({
                    ...formData,
                    linkedInProfile: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/in/yourprofile"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                {user.linkedInProfile ? (
                  <a
                    href={user.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Profile</Label>
            {isEditing ? (
              <Input
                id="github"
                type="url"
                value={formData.githubProfile || ""}
                onChange={e =>
                  onFormDataChange({
                    ...formData,
                    githubProfile: e.target.value,
                  })
                }
                placeholder="https://github.com/yourusername"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4 text-muted-foreground" />
                {user.githubProfile ? (
                  <a
                    href={user.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Personal Website</Label>
            {isEditing ? (
              <Input
                id="website"
                type="url"
                value={formData.personalWebsite || ""}
                onChange={e =>
                  onFormDataChange({
                    ...formData,
                    personalWebsite: e.target.value,
                  })
                }
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {user.personalWebsite ? (
                  <a
                    href={user.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {isEditing ? (
              <FileUpload
                type="resume"
                currentUrl={resumeUrl}
                onUploadSuccess={handleResumeUpload}
                onDelete={handleResumeDelete}
              />
            ) : (
              <>
                <Label htmlFor="resume">Resume</Label>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {resumeUrl ? (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not uploaded</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
