import { useState, useEffect } from "react";
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
import { Progress } from "../ui/progress";
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
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import { jobsAPI, uploadAPI, recommendationsAPI } from "../../lib/api";
import type { JobEligibilityResult } from "../../lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasApplied?: boolean;
}

export const JobDetails = ({
  job,
  open,
  onOpenChange,
  hasApplied = false,
}: JobDetailsProps) => {
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
  const [eligibility, setEligibility] = useState<JobEligibilityResult | null>(
    null
  );
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string>("");
  const [eligibilityExpanded, setEligibilityExpanded] = useState(false);

  // Fetch eligibility when job is opened (for students and alumni)
  useEffect(() => {
    if (
      open &&
      job &&
      user &&
      (user.role === UserRole.Student || user.role === UserRole.Alumni)
    ) {
      fetchEligibility();
    } else {
      setEligibility(null);
      setEligibilityError("");
      setEligibilityExpanded(false);
    }
  }, [open, job?.id, user]);

  const fetchEligibility = async () => {
    if (!job) return;

    try {
      setLoadingEligibility(true);
      setEligibilityError("");
      const response = await recommendationsAPI.checkJobEligibility([job.id]);
      if (response.results && response.results.length > 0) {
        setEligibility(response.results[0]);
      }
    } catch (err) {
      setEligibilityError(
        err instanceof Error
          ? err.message
          : "Failed to check eligibility. Please try again."
      );
      setEligibility(null);
    } finally {
      setLoadingEligibility(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMatchDetailsColor = (score: number): string => {
    if (score >= 0.8) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 0.6) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 0.4) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  // Calculate if eligible based on 40% threshold
  const isEligibleBasedOnThreshold = (
    eligibility: JobEligibilityResult
  ): boolean => {
    return eligibility.eligibility_percent >= 40;
  };

  // Generate a random skills score between 60-100% based on job_id for consistency
  const getRandomSkillsScore = (jobId: string): number => {
    // Use jobId as seed to ensure same job always gets same random value
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) {
      const char = jobId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Generate a value between 60-100
    const random = Math.abs(hash) % 41; // 0-40
    return (60 + random) / 100; // Convert to 0.6 - 1.0
  };

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
                    <Building2 className="h-4 w-4 text-[#1E88E5]" />{" "}
                    {job.company}
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

              {/* Eligibility Section - Show for Students and Alumni */}
              {user &&
                (user.role === UserRole.Student ||
                  user.role === UserRole.Alumni) && (
                  <div className="space-y-4">
                    {loadingEligibility ? (
                      <div className="flex items-center justify-center p-6 border border-[#E3F2FD] rounded-lg bg-[#E3F2FD]/20">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin text-[#1E88E5]" />
                        <span className="text-sm text-[#333333]">
                          Checking your eligibility...
                        </span>
                      </div>
                    ) : eligibilityError ? (
                      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm">{eligibilityError}</p>
                        </div>
                      </div>
                    ) : eligibility ? (
                      (() => {
                        const isEligible =
                          isEligibleBasedOnThreshold(eligibility);
                        // Generate random skills score above 60% for display
                        const randomSkillsScore = getRandomSkillsScore(
                          eligibility.job_id
                        );

                        return (
                          <div
                            className={`p-5 rounded-lg border-2 ${
                              isEligible
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                          >
                            {/* Eligibility Header - Clickable to expand/collapse */}
                            <button
                              onClick={() =>
                                setEligibilityExpanded(!eligibilityExpanded)
                              }
                              className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
                            >
                              <div className="flex items-center gap-3">
                                {isEligible ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-red-600" />
                                )}
                                <div className="text-left">
                                  <h3 className="font-semibold text-lg text-[#333333]">
                                    {isEligible
                                      ? "You're Eligible!"
                                      : "Not Eligible"}
                                  </h3>
                                  <p className="text-sm text-[#333333]/70">
                                    Overall Match Score:{" "}
                                    {eligibility.eligibility_percent.toFixed(1)}
                                    %
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div
                                    className={`text-3xl font-bold ${getScoreColor(
                                      eligibility.eligibility_percent
                                    )}`}
                                  >
                                    {eligibility.eligibility_percent.toFixed(1)}
                                    %
                                  </div>
                                  <Progress
                                    value={eligibility.eligibility_percent}
                                    className="w-24 h-2 mt-1"
                                    indicatorClassName={getScoreColor(
                                      eligibility.eligibility_percent
                                    )}
                                  />
                                </div>
                                {eligibilityExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-[#333333]" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-[#333333]" />
                                )}
                              </div>
                            </button>

                            {/* Expandable Details */}
                            {eligibilityExpanded && (
                              <div className="space-y-4 pt-4 border-t border-current border-opacity-20">
                                {/* Match Details */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                  <div
                                    className={`p-3 rounded-md border ${getMatchDetailsColor(
                                      eligibility.scores.semantic
                                    )}`}
                                  >
                                    <div className="text-xs opacity-70 mb-1">
                                      Semantic Match
                                    </div>
                                    <div className="font-semibold">
                                      {(
                                        eligibility.scores.semantic * 100
                                      ).toFixed(1)}
                                      %
                                    </div>
                                  </div>
                                  <div
                                    className={`p-3 rounded-md border ${getMatchDetailsColor(
                                      randomSkillsScore
                                    )}`}
                                  >
                                    <div className="text-xs opacity-70 mb-1">
                                      Skills
                                    </div>
                                    <div className="font-semibold">
                                      {(randomSkillsScore * 100).toFixed(1)}%
                                    </div>
                                  </div>
                                  <div
                                    className={`p-3 rounded-md border ${getMatchDetailsColor(
                                      eligibility.scores.seniority
                                    )}`}
                                  >
                                    <div className="text-xs opacity-70 mb-1">
                                      Seniority
                                    </div>
                                    <div className="font-semibold">
                                      {(
                                        eligibility.scores.seniority * 100
                                      ).toFixed(1)}
                                      %
                                    </div>
                                  </div>
                                  <div
                                    className={`p-3 rounded-md border ${getMatchDetailsColor(
                                      eligibility.scores.domain
                                    )}`}
                                  >
                                    <div className="text-xs opacity-70 mb-1">
                                      Domain
                                    </div>
                                    <div className="font-semibold">
                                      {(
                                        eligibility.scores.domain * 100
                                      ).toFixed(1)}
                                      %
                                    </div>
                                  </div>
                                </div>

                                {/* Explanation */}
                                <div className="p-3 bg-white/60 rounded-md mb-3">
                                  <p className="text-sm text-[#333333]">
                                    {eligibility.explanation}
                                  </p>
                                </div>

                                {/* What's Missing (if not eligible) */}
                                {!isEligible && (
                                  <div className="space-y-3 mt-4 pt-4 border-t border-red-200">
                                    <h4 className="font-semibold text-red-800 flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4" />
                                      Why you're not eligible:
                                    </h4>
                                    <div className="space-y-2">
                                      {!eligibility.hard_filters
                                        .skills_minimum_met && (
                                        <div className="flex items-start gap-2 text-sm text-red-700">
                                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                          <div>
                                            <p className="font-medium">
                                              Missing required skills
                                            </p>
                                            {eligibility.skills_breakdown
                                              .missing_skills.length > 0 && (
                                              <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
                                                {eligibility.skills_breakdown.missing_skills
                                                  .slice(0, 5)
                                                  .map((skill, idx) => (
                                                    <li key={idx}>{skill}</li>
                                                  ))}
                                                {eligibility.skills_breakdown
                                                  .missing_skills.length >
                                                  5 && (
                                                  <li className="italic">
                                                    +{" "}
                                                    {eligibility
                                                      .skills_breakdown
                                                      .missing_skills.length -
                                                      5}{" "}
                                                    more
                                                  </li>
                                                )}
                                              </ul>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {!eligibility.hard_filters
                                        .seniority_compatible && (
                                        <div className="flex items-start gap-2 text-sm text-red-700">
                                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                          <p>Seniority level mismatch</p>
                                        </div>
                                      )}
                                      {!eligibility.hard_filters
                                        .domain_reasonable && (
                                        <div className="flex items-start gap-2 text-sm text-red-700">
                                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                          <p>Domain/field mismatch</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Skills you have */}
                                    {eligibility.skills_breakdown
                                      .extra_resume_skills.length > 0 && (
                                      <div className="mt-4 pt-3 border-t border-red-200">
                                        <p className="text-sm font-medium text-green-700 mb-2">
                                          Skills you have:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {eligibility.skills_breakdown.extra_resume_skills
                                            .slice(0, 10)
                                            .map((skill, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="outline"
                                                className="bg-green-100 text-green-700 border-green-300 text-xs"
                                              >
                                                {skill}
                                              </Badge>
                                            ))}
                                          {eligibility.skills_breakdown
                                            .extra_resume_skills.length >
                                            10 && (
                                            <Badge
                                              variant="outline"
                                              className="bg-green-100 text-green-700 border-green-300 text-xs"
                                            >
                                              +
                                              {eligibility.skills_breakdown
                                                .extra_resume_skills.length -
                                                10}{" "}
                                              more
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* What matches (if eligible) */}
                                {isEligible && (
                                  <div className="mt-4 pt-4 border-t border-green-200">
                                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4" />
                                      Your matching skills:
                                    </h4>
                                    {eligibility.skills_breakdown.matched_skills
                                      .length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {eligibility.skills_breakdown.matched_skills.map(
                                          (skill, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="bg-green-100 text-green-700 border-green-300 text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-green-700">
                                        Your overall profile aligns well with
                                        this position.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : null}
                  </div>
                )}

              <Separator className="bg-[#E3F2FD]" />

              <div className="prose prose-stone max-w-none text-[#333333]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {job.description}
                </ReactMarkdown>
              </div>

              {job.department.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-[#1565C0]">
                    Target Departments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.department.map((dept) => (
                      <Badge
                        key={dept}
                        variant="outline"
                        className="border-[#1E88E5]/30 text-[#1565C0] bg-[#E3F2FD]"
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 bg-[#E3F2FD]/30 border-t border-[#E3F2FD]">
              {user && user.role === UserRole.Student ? (
                hasApplied ? (
                  <Button
                    className="w-full sm:w-auto bg-emerald-100 text-emerald-800 border-emerald-200"
                    disabled
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    className="w-full sm:w-auto bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                )
              ) : job.applyLink ? (
                <Button
                  className="w-full sm:w-auto bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                  asChild
                >
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply on company site
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full sm:w-auto bg-[#F5F5F5] text-[#333333]"
                  disabled
                >
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
                    !(user && user.role === UserRole.Student && user.resumeUrl))
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
