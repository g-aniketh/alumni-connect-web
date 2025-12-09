import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Linkedin,
  Github,
  Globe,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Alumni, Student } from "../../types";
import { FileUpload } from "./FileUpload";
import { useState, useEffect } from "react";
import { uploadAPI, recommendationsAPI } from "../../lib/api";
import type { AlumniFormData, StudentFormData } from "../../types/profile";
import { isAlumniFormData } from "../../types/profile";

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
  const [parsingResume, setParsingResume] = useState(false);
  const [parseError, setParseError] = useState<string>("");
  const [parseSuccess, setParseSuccess] = useState<string>("");

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

  const handleResumeUpload = async (url: string) => {
    setResumeUrl(url);
    // Update form data
    const updatedFormData = { ...formData, resumeUrl: url } as
      | AlumniFormData
      | StudentFormData;
    onFormDataChange(updatedFormData);

    // Wait a bit for the backend to finish saving the resume URL,
    // then ensure resumeResponse is saved by calling the parse endpoint
    // This ensures resumeResponse exists even if upload-time parsing failed
    // The upload endpoint with parse=true&update=true should already parse and save resumeResponse,
    // but we call this as a fallback to guarantee resumeResponse is saved
    setTimeout(async () => {
      await autoParseAndPopulateResume(updatedFormData);
    }, 1500);
  };

  const autoParseAndPopulateResume = async (
    formDataToUse?: AlumniFormData | StudentFormData
  ) => {
    // Use the provided formData or current formData state
    const dataToUse = formDataToUse || formData;
    const currentResumeUrl = dataToUse.resumeUrl || resumeUrl;

    if (!currentResumeUrl) {
      console.warn("No resume URL available for parsing");
      return;
    }

    try {
      setParsingResume(true);
      setParseError("");
      setParseSuccess("");

      // Parse with auto-update enabled - this will save resumeResponse to database
      // This endpoint fetches the resume from Cloudinary URL and parses it
      const result = await recommendationsAPI.parseResume(true);
      setParseSuccess(
        result.message || "Resume parsed and profile updated successfully!"
      );

      // Update form data with parsed information
      const updatedData = { ...dataToUse };
      const profile = result.data.profile;

      // Update skills
      if (
        profile.skills?.hard_skills ||
        profile.skills?.programming_languages
      ) {
        const allSkills = [
          ...(profile.skills.hard_skills || []),
          ...(profile.skills.programming_languages || []),
          ...(profile.skills.frameworks || []),
          ...(profile.skills.tools || []),
        ];
        if (allSkills.length > 0 && "skills" in updatedData) {
          (updatedData as AlumniFormData | StudentFormData).skills = allSkills;
        }
      }

      // Update profile fields for alumni
      if (isAlumniFormData(updatedData)) {
        if (profile.basic_info?.current_role) {
          updatedData.designation = profile.basic_info.current_role;
        }
        if (profile.basic_info?.location) {
          updatedData.location = profile.basic_info.location;
        }
        // Try to extract company from experience
        if (profile.experience && profile.experience.length > 0) {
          const currentJob = profile.experience.find((exp) => exp.current);
          if (currentJob?.organization) {
            updatedData.currentEmployer = currentJob.organization;
          }
        }
      }

      // Update bio
      if (profile.basic_info?.summary && "bio" in updatedData) {
        (updatedData as AlumniFormData | StudentFormData).bio =
          profile.basic_info.summary;
      }

      // Update the form with parsed data
      onFormDataChange(updatedData);

      // Clear success message after 5 seconds
      setTimeout(() => setParseSuccess(""), 5000);
    } catch (err) {
      // Silent fail - don't show error if parsing fails, just log it
      console.warn("Failed to auto-parse resume:", err);
      setParseError(
        err instanceof Error
          ? err.message
          : "Failed to parse resume automatically"
      );
    } finally {
      setParsingResume(false);
    }
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
                onChange={(e) =>
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
                onChange={(e) =>
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
                onChange={(e) =>
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
                parse={true}
                update={true}
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

        {/* Resume Parsing Status - Only show when editing and parsing is in progress or completed */}
        {isEditing && (parsingResume || parseSuccess || parseError) && (
          <div className="mt-6 pt-6 border-t space-y-3">
            {parsingResume && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Parsing resume and updating profile...
                </p>
              </div>
            )}

            {parseError && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {parseError}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    You can still manually fill in your profile information.
                  </p>
                </div>
              </div>
            )}

            {parseSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {parseSuccess}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
