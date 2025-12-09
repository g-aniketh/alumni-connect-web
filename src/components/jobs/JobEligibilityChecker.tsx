import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Loader2, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { recommendationsAPI } from "../../lib/api";
import type { JobEligibilityResult } from "../../lib/api";
import type { BackendJob } from "../../types/api";

interface JobEligibilityCheckerProps {
  jobs: BackendJob[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobEligibilityChecker = ({
  jobs,
  open,
  onOpenChange,
}: JobEligibilityCheckerProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobEligibilityResult[]>([]);
  const [error, setError] = useState<string>("");

  const handleCheckEligibility = async () => {
    if (jobs.length === 0) {
      setError("Please select at least one job");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const jobIds = jobs.map((job) => job._id);
      const response = await recommendationsAPI.checkJobEligibility(jobIds);
      setResults(response.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check job eligibility"
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Check Job Eligibility</DialogTitle>
          <DialogDescription>
            Use AI to check your eligibility for selected jobs based on your
            profile, skills, and experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {results.length === 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  You have selected <strong>{jobs.length}</strong> job
                  {jobs.length !== 1 ? "s" : ""} to check eligibility for.
                </p>
              </div>
              <Button
                onClick={handleCheckEligibility}
                disabled={loading || jobs.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking Eligibility...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Check Eligibility for {jobs.length} Job
                    {jobs.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Eligibility Results</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResults([])}
                >
                  Check Again
                </Button>
              </div>
              {results.map((result) => (
                <div
                  key={result.job_id}
                  className={`p-4 rounded-lg border-2 ${getScoreColor(
                    result.eligibility_score
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {result.job_title}
                      </h4>
                      <p className="text-sm opacity-80">{result.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={result.eligible ? "default" : "secondary"}
                        className={
                          result.eligible
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                        }
                      >
                        {result.eligible ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {result.eligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                      <div className="text-2xl font-bold">
                        {result.eligibility_score}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xs opacity-70 mb-1">
                        Skills Match
                      </div>
                      <div className="font-semibold">
                        {result.match_details.skills_match}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs opacity-70 mb-1">
                        Experience Match
                      </div>
                      <div className="font-semibold">
                        {result.match_details.experience_match}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs opacity-70 mb-1">
                        Education Match
                      </div>
                      <div className="font-semibold">
                        {result.match_details.education_match}%
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded-md mt-3">
                    <p className="text-sm">{result.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
