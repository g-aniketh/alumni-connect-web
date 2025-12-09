import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Upload,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";
import { uploadAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

interface FileUploadProps {
  type: "profile-picture" | "resume";
  currentUrl?: string;
  onUploadSuccess: (url: string, urlHD?: string, urlOptimized?: string) => void;
  onDelete?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  parse?: boolean; // For resume uploads - parse with ML model
  update?: boolean; // For resume uploads - update profile with parsed data
}

export const FileUpload = ({
  type,
  currentUrl,
  onUploadSuccess,
  onDelete,
  accept,
  maxSizeMB = type === "profile-picture" ? 5 : 10,
  label,
  description,
  parse = false,
  update = false,
}: FileUploadProps) => {
  const { refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUploadFile = useCallback(
    async (file: File) => {
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(
          `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller file.`
        );
        return;
      }

      // Validate file type
      if (type === "resume" && !file.type.includes("pdf")) {
        setError("Only PDF files are allowed for resumes");
        return;
      }

      if (type === "profile-picture" && !file.type.startsWith("image/")) {
        setError(
          "Only image files (JPEG, PNG, GIF, WebP) are allowed for profile pictures"
        );
        return;
      }

      setError("");
      setUploading(true);
      setSuccess(false);

      try {
        let result;
        if (type === "profile-picture") {
          result = await uploadAPI.uploadProfilePicture(file);
          onUploadSuccess(result.url, result.urlHD, result.urlOptimized);
          // Update user with new profile picture URLs
          if (result.user) {
            await refreshUser();
          }
        } else {
          result = await uploadAPI.uploadResume(file, parse, update);
          // Check if parsing failed during upload
          if (result.parsed === false && parse) {
            console.warn("Resume upload succeeded but parsing may have failed. Will retry parsing.");
          }
          onUploadSuccess(result.url);
          // Update user with new resume URL
          if (result.user) {
            await refreshUser();
          }
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload file");
      } finally {
        setUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [maxSizeMB, type, onUploadSuccess, refreshUser]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await validateAndUploadFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        await validateAndUploadFile(file);
      }
    },
    [validateAndUploadFile]
  );

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete your ${
          type === "profile-picture" ? "profile picture" : "resume"
        }?`
      )
    ) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (type === "profile-picture") {
        await uploadAPI.deleteProfilePicture();
      } else {
        await uploadAPI.deleteResume();
      }
      await refreshUser();
      if (onDelete) {
        onDelete();
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setUploading(false);
    }
  };

  const getDefaultLabel = () => {
    if (label) return label;
    return type === "profile-picture" ? "Profile Picture" : "Resume";
  };

  const getDefaultDescription = () => {
    if (description) return description;
    if (type === "profile-picture") {
      return "Upload a profile picture (JPEG, PNG, GIF, WebP - Max 5MB)";
    }
    return "Upload your resume (PDF only - Max 10MB)";
  };

  const getDefaultAccept = () => {
    if (accept) return accept;
    if (type === "profile-picture") {
      return "image/jpeg,image/png,image/gif,image/webp";
    }
    return "application/pdf";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{getDefaultLabel()}</Label>
        {currentUrl && !uploading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={uploading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <div className="flex items-start gap-4">
        {type === "profile-picture" && (
          <div className="relative shrink-0">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-all",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/50",
              uploading && "opacity-50 pointer-events-none"
            )}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept={getDefaultAccept()}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id={`file-upload-${type}`}
            />

            <div className="flex flex-col items-center justify-center text-center space-y-3">
              {type === "profile-picture" ? (
                <div className="rounded-full bg-primary/10 p-3">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
              ) : (
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              )}

              <div className="space-y-1">
                <Label
                  htmlFor={`file-upload-${type}`}
                  className="cursor-pointer"
                >
                  <span className="text-sm font-medium text-primary hover:underline">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : success ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Uploaded successfully!
                      </span>
                    ) : currentUrl ? (
                      "Click to change or drag and drop"
                    ) : (
                      "Click to upload or drag and drop"
                    )}
                  </span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  {getDefaultDescription()}
                </p>
              </div>

              {!uploading && !success && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {currentUrl ? "Change File" : "Choose File"}
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}

          {success && !error && (
            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {type === "profile-picture" ? "Profile picture" : "Resume"}{" "}
                  uploaded successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
