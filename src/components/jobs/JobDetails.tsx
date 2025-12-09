import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { type Job } from "../../types";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Upload,
  FileText,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import { jobsAPI, uploadAPI } from "../../lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetails = ({ job, open, onOpenChange }: JobDetailsProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<{
    message: string;
    resumeFile: File | null;
  }>({
    message: "",
    resumeFile: null,
  });

  if (!job) return null;

  const handleApply = () => {
    if (user && user.role === UserRole.Student) {
      setShowApplicationForm(true);
    } else if (job.applyLink) {
      window.open(job.applyLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData((prev) => ({ ...prev, resumeFile: file }));
    }
  };

  const handleSubmitApplication = async () => {
    if (!user || user.role !== UserRole.Student || !job) return;

    try {
      setLoading(true);
      setError("");

      let resumeUrl: string | undefined = undefined;

      if (applicationData.resumeFile) {
        const uploadResult = await uploadAPI.uploadResume(
          applicationData.resumeFile
        );
        resumeUrl = uploadResult.url;
      } else if (user.resumeUrl) {
        resumeUrl = user.resumeUrl;
      }

      if (!resumeUrl) {
        setError("A resume is required to apply.");
        setLoading(false);
        return;
      }

      const applicationDataToSend = {
        message: applicationData.message || undefined,
        resumeUrl: resumeUrl,
      };

      await jobsAPI.apply(job.id, applicationDataToSend);

      setShowApplicationForm(false);
      setApplicationData({ message: "", resumeFile: null });
      onOpenChange(false);
      alert("Application submitted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setShowApplicationForm(false);
          setApplicationData({ message: "", resumeFile: null });
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {!showApplicationForm ? (
          <>
            <DialogHeader className="p-6 bg-[#E3F2FD]/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-[#1565C0]">
                    {job.title}
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1 flex items-center gap-2 text-[#333333]">
                    <Building2 className="h-4 w-4 text-[#1E88E5]" /> {job.company}
                  </DialogDescription>
                </div>
                {job.referralAvailable && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <Star className="h-3 w-3 mr-1" />
                    Alumni Referral
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="px-6 pb-6 grid gap-6">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#333333]/80">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#1E88E5]" />
                  {job.type}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#1E88E5]" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#1E88E5]" />
                  {job.salaryMin && job.salaryMax
                    ? `$${job.salaryMin / 1000}k - $${job.salaryMax / 1000}k`
                    : job.salaryMin
                    ? `$${job.salaryMin / 1000}k+`
                    : "Competitive"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#1E88E5]" />
                  Posted: {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>

              <Separator className="bg-[#E3F2FD]" />

              <div className="prose prose-stone max-w-none text-[#333333]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {job.description}
                </ReactMarkdown>
              </div>

              {job.department.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-[#1565C0]">Target Departments</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.department.map((dept) => (
                      <Badge key={dept} variant="outline" className="border-[#1E88E5]/30 text-[#1565C0] bg-[#E3F2FD]">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 bg-[#E3F2FD]/30 border-t border-[#E3F2FD]">
              {user && user.role === UserRole.Student ? (
                <Button className="w-full sm:w-auto bg-[#1E88E5] hover:bg-[#1565C0] text-white" onClick={handleApply}>
                  Apply Now
                </Button>
              ) : job.applyLink ? (
                <Button className="w-full sm:w-auto bg-[#1E88E5] hover:bg-[#1565C0] text-white" asChild>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply on company site
                  </a>
                </Button>
              ) : (
                <Button className="w-full sm:w-auto bg-[#F5F5F5] text-[#333333]" disabled>
                  Applications closed
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="p-6">
              <DialogTitle className="text-2xl font-bold">
                Apply for {job.title}
              </DialogTitle>
              <DialogDescription>
                Submit your application to {job.company}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV *</Label>
                <div className="flex items-center gap-4">
                  <Label htmlFor="resume" className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-stone-50 hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium">
                        {applicationData.resumeFile
                          ? "File selected"
                          : "Click to upload"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                    </div>
                  </Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {applicationData.resumeFile && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-stone-100 p-3 rounded-md">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-medium truncate">
                        {applicationData.resumeFile.name}
                      </span>
                    </div>
                  )}
                </div>
                {!applicationData.resumeFile &&
                  user &&
                  user.role === UserRole.Student &&
                  user.resumeUrl && (
                  <p className="text-xs text-gray-500">
                    Your saved resume will be used if you don't upload a new
                    one.
                  </p>
                  )}
              </div>

              {error && (
                <div className="p-3 border border-red-200 bg-red-50 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Cover Letter (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you're a great fit for this role..."
                  value={applicationData.message}
                  onChange={(e) =>
                    setApplicationData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={5}
                />
              </div>
            </div>

            <DialogFooter className="p-6 bg-stone-50 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApplicationForm(false);
                  setApplicationData({ message: "", resumeFile: null });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={
                  loading ||
                  (!applicationData.resumeFile &&
                    !(
                      user &&
                      user.role === UserRole.Student &&
                      user.resumeUrl
                    ))
                }
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
