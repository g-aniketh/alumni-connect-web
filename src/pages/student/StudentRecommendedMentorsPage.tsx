import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Sparkles,
  Building2,
  TrendingUp,
  Users,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { recommendationsAPI, mentorshipsAPI } from "../../lib/api";
import type { MentorRecommendationsResponse } from "../../lib/api";
import { motion } from "motion/react";

const StudentRecommendedMentorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [recommendations, setRecommendations] =
    useState<MentorRecommendationsResponse | null>(null);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestedMentorIds, setRequestedMentorIds] = useState<Set<string>>(
    () => new Set()
  );
  const [mentorStatuses, setMentorStatuses] = useState<Record<string, string>>(
    {}
  );
  const [requestError, setRequestError] = useState<string>("");

  const normalizeStatus = (
    status: string | undefined
  ): "active" | "pending" | "" => {
    if (!status) return "";
    const s = status.trim().toLowerCase();
    if (
      [
        "active",
        "accepted",
        "approved",
        "ongoing",
        "on-going",
        "in-progress",
        "in_progress",
        "mentoring",
      ].includes(s)
    ) {
      return "active";
    }
    if (["pending", "requested", "request", "submitted"].includes(s)) {
      return "pending";
    }
    return "";
  };

  const loadExistingMentorships = useCallback(async () => {
    try {
      const response = await mentorshipsAPI.getMy();
      const mentorIds = new Set<string>();
      const statusMap: Record<string, string> = {};
      response.mentorships.forEach((m) => {
        const menteeId =
          typeof m.menteeId === "object"
            ? m.menteeId._id
            : (m.menteeId as string | undefined);
        const mentorId =
          typeof m.mentorId === "object"
            ? m.mentorId._id
            : (m.mentorId as string | undefined);
        const status = normalizeStatus(
          typeof m.status === "string" ? m.status : undefined
        );
        // Only consider mentorships where the current user is the mentee
        if (mentorId && menteeId && user?.id === menteeId) {
          mentorIds.add(mentorId);
          if (status) {
            const current = statusMap[mentorId];
            // prefer active over pending
            if (current !== "active" || status === "active") {
              statusMap[mentorId] = status;
            }
          }
        }
      });
      setRequestedMentorIds(mentorIds);
      setMentorStatuses(statusMap);
    } catch {
      // If this fails, we still allow the page to render; no user-facing error needed
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
    loadExistingMentorships();
  }, [loadExistingMentorships]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await recommendationsAPI.getRecommendedMentors();
      setRecommendations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load mentor recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorId: string) => {
    const existingStatus = mentorStatuses[mentorId];
    const normalized = normalizeStatus(existingStatus);
    if (
      normalized ||
      requestedMentorIds.has(mentorId) ||
      requestingId === mentorId
    ) {
      return;
    }

    try {
      setRequestError("");
      setRequestingId(mentorId);
      await mentorshipsAPI.createRequest({
        mentorId,
      });
      setRequestedMentorIds((prev) => new Set(prev).add(mentorId));
      setMentorStatuses((prev) => ({ ...prev, [mentorId]: "pending" }));
      await loadExistingMentorships();
      navigate("/student/mentorships");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send mentorship request";
      setRequestError(message);
    }
    setRequestingId(null);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-yellow-500";
    return "bg-orange-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Finding the best mentors for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Recommended Mentors
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered mentor recommendations based on your skills, interests,
            and career goals
          </p>
        </motion.div>

        {(error || requestError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || requestError}
            </p>
          </motion.div>
        )}

        {recommendations && recommendations.student && (
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Recommendations for {recommendations.student.name}
                  </p>
                  {recommendations.student.skills &&
                    recommendations.student.skills.length > 0 && (
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Skills: {recommendations.student.skills.join(", ")}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {recommendations &&
        recommendations.recommendations &&
        recommendations.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.recommendations.map((mentor) => (
              <motion.div
                key={mentor.alumni_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 border-2 border-blue-200">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {mentor.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {mentor.name}
                          </CardTitle>
                          {mentor.current_job_title && mentor.company && (
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">
                                {mentor.current_job_title} at {mentor.company}
                              </span>
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={`${getScoreColor(
                            mentor.match_score
                          )} text-white`}
                        >
                          {mentor.match_score}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mentor.skills && mentor.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.skills.slice(0, 5).map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {mentor.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{mentor.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-900 dark:text-blue-100">
                          {mentor.match_reasoning}
                        </p>
                      </div>
                    </div>

                    {(() => {
                      const status = normalizeStatus(
                        mentorStatuses[mentor.alumni_id]
                      );
                      const isPending = status === "pending";
                      const isActive = status === "active";
                      const isRequesting = requestingId === mentor.alumni_id;
                      const alreadyRequested =
                        requestedMentorIds.has(mentor.alumni_id) || isPending;
                      const disabled = isPending || isActive || isRequesting;
                      const label = isActive
                        ? "Already mentoring you"
                        : isPending || alreadyRequested
                          ? "Request pending"
                          : isRequesting
                            ? "Sending..."
                            : "Request Mentorship";
                      return (
                        <Button
                          onClick={() =>
                            handleRequestMentorship(mentor.alumni_id)
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-80 disabled:cursor-not-allowed"
                          disabled={disabled}
                        >
                          {isRequesting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4 mr-2" />
                          )}
                          {label}
                        </Button>
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-slate-400 mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No recommendations available
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">
                  We couldn't find any mentor recommendations at this time.
                  Please ensure your profile is complete with skills and
                  interests.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default StudentRecommendedMentorsPage;
