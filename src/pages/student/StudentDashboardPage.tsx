import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Users,
  Briefcase,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  MessageSquare,
  Send,
  Video,
  Palette,
  Code,
  Database,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { jobsAPI, mentorshipsAPI, eventsAPI } from "../../lib/api";
import type {
  BackendJobApplication,
  BackendMentorship,
  BackendEvent,
  BackendJob,
  BackendStudent,
  BackendAlumni,
  BackendEventRegistration,
} from "../../types/api";
import { UserRole, type Student } from "../../types";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [myMentorships, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<BackendEvent[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<
    BackendEventRegistration[]
  >([]);
  const [activeMentors, setActiveMentors] = useState<BackendAlumni[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load my applications
      const myApplications = await jobsAPI.getMyApplications();
      setApplications(myApplications);

      // Load my mentorships
      const mentorshipsResponse = await mentorshipsAPI.getMy();
      const allMentorships = mentorshipsResponse.mentorships.filter(
        (m: BackendMentorship) => {
          const menteeId =
            typeof m.menteeId === "object"
              ? ((m.menteeId as BackendStudent)._id ?? "")
              : m.menteeId;
          return menteeId === user?.id;
        }
      );
      setMyMentorships(allMentorships);

      // Extract active mentors from active mentorships
      const activeMentorshipsList = allMentorships.filter(
        (m) => m.status.toLowerCase() === "active"
      );
      const mentors: BackendAlumni[] = [];
      activeMentorshipsList.forEach((m) => {
        if (typeof m.mentorId === "object") {
          mentors.push(m.mentorId as BackendAlumni);
        }
      });
      setActiveMentors(mentors.slice(0, 2)); // Show top 2 mentors

      // Load event registrations
      const registrations = await eventsAPI.getMyRegistrations();
      setEventRegistrations(registrations);

      // Load upcoming events from registrations
      const registeredEventIds = registrations
        .map((reg) =>
          typeof reg.eventId === "object" ? reg.eventId._id : reg.eventId
        )
        .filter(Boolean);

      // Get upcoming events (filtered by college context)
      const eventsResponse = await eventsAPI.getFiltered({ upcoming: true });
      const events = Array.isArray(eventsResponse)
        ? eventsResponse
        : eventsResponse.events;

      // Filter to only show registered events
      const registeredEvents = events.filter((event) =>
        registeredEventIds.includes(event._id)
      );
      setUpcomingEvents(registeredEvents.slice(0, 2));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    (app) =>
      app.status === "applied" ||
      app.status === "under_review" ||
      app.status === "interview_scheduled"
  );
  const awaitingResponseCount = applications.filter(
    (app) => app.status === "applied" || app.status === "under_review"
  ).length;

  const interviewScheduledApps = applications.filter(
    (app) => app.status === "interview_scheduled"
  );
  // Sort by updatedAt to get the next interview
  const sortedInterviews = [...interviewScheduledApps].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateA - dateB;
  });
  const nextInterview =
    sortedInterviews.length > 0 ? sortedInterviews[0] : null;

  const activeMentorshipsCount = myMentorships.filter(
    (m) => m.status.toLowerCase() === "active"
  ).length;

  // Count events registered this week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const eventsThisWeek = eventRegistrations.filter((reg) => {
    const regDate = new Date(reg.createdAt);
    return regDate >= weekAgo;
  }).length;

  // Calculate application status breakdown for analytics
  const applicationStatusBreakdown = {
    applied: applications.filter((app) => app.status === "applied").length,
    underReview: applications.filter((app) => app.status === "under_review")
      .length,
    interviewing: applications.filter(
      (app) => app.status === "interview_scheduled"
    ).length,
    offered: applications.filter((app) => app.status === "offered").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  // Calculate success rate (offered / total)
  const successRate =
    totalApplications > 0
      ? Math.round(
          (applicationStatusBreakdown.offered / totalApplications) * 100
        )
      : 0;

  // Calculate response rate (any response / total)
  const responseRate =
    totalApplications > 0
      ? Math.round(
          ((totalApplications - applicationStatusBreakdown.applied) /
            totalApplications) *
            100
        )
      : 0;

  const recentApplications = applications.slice(0, 4);

  // Helper function to format relative time
  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1d ago";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks === 1) return "1w ago";
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    return `${Math.floor(diffInWeeks / 4)}mo ago`;
  };

  // Helper function to format date for events
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  // Helper function to format interview date
  const formatInterviewDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${dayName}, ${displayHours}:${displayMinutes}${ampm}`;
  };

  // Get job icon based on title/type
  const getJobIcon = (title: string, jobType?: string) => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("design") ||
      lowerTitle.includes("ui") ||
      lowerTitle.includes("ux")
    ) {
      return Palette;
    }
    if (
      lowerTitle.includes("frontend") ||
      lowerTitle.includes("front-end") ||
      lowerTitle.includes("react") ||
      lowerTitle.includes("angular") ||
      lowerTitle.includes("vue")
    ) {
      return Code;
    }
    if (
      lowerTitle.includes("data") ||
      lowerTitle.includes("analyst") ||
      lowerTitle.includes("science")
    ) {
      return Database;
    }
    return Briefcase;
  };

  // Get job icon color - matching screenshot colors
  const getJobIconColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("design") ||
      lowerTitle.includes("ui") ||
      lowerTitle.includes("ux") ||
      lowerTitle.includes("product design")
    ) {
      return "text-pink-500"; // Pink for design roles
    }
    if (
      lowerTitle.includes("frontend") ||
      lowerTitle.includes("front-end") ||
      lowerTitle.includes("developer")
    ) {
      return "text-gray-600"; // Grey for frontend
    }
    if (
      lowerTitle.includes("data") ||
      lowerTitle.includes("analyst") ||
      lowerTitle.includes("science")
    ) {
      return "text-green-600"; // Green for data science
    }
    return "text-blue-600"; // Blue for default/software engineer
  };

  // No stats array needed - we'll render cards directly

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Block unverified students at the page level as a safety net
  if (user && user.role === UserRole.Student && !(user as Student).isVerified) {
    return (
      <div className="container py-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold">
            Account Pending Verification
          </h1>
          <p className="text-muted-foreground">
            Your student account has been created but is not yet verified by
            your college. Once your college administrator verifies your account,
            you&apos;ll be able to access your dashboard and all student
            features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Stats Grid - Top Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Applications Card - Highlighted */}
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Total Applications
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {totalApplications}
              </div>
              {totalApplications > 0 && (
                <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {activeApplications.length} active
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Applications Card */}
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Active Applications
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                <Send className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {activeApplications.length}
              </div>
              {awaitingResponseCount > 0 && (
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {awaitingResponseCount} awaiting response
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Interviews Card */}
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Upcoming Interviews
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                <Video className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {interviewScheduledApps.length}
              </div>
              {nextInterview ? (
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Next:{" "}
                  {formatInterviewDate(
                    nextInterview.updatedAt || nextInterview.createdAt
                  )}
                </p>
              ) : (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  No interviews scheduled
                </p>
              )}
            </CardContent>
          </Card>

          {/* My Mentors Card */}
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                My Mentors
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {activeMentorshipsCount}
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {activeMentorshipsCount > 0
                  ? "Active mentorships"
                  : "No active mentors"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Application Analytics & Progress */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Application Progress Card */}
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="text-base text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Application Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-indigo-700 dark:text-indigo-300">
                    Response Rate
                  </span>
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                    {responseRate}%
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${responseRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-indigo-700 dark:text-indigo-300">
                    Success Rate
                  </span>
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                    {successRate}%
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Offers Received
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                    {applicationStatusBreakdown.offered}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status Breakdown */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-base text-orange-900 dark:text-orange-100">
                Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-orange-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Applied
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                  {applicationStatusBreakdown.applied}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-orange-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Under Review
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                  {applicationStatusBreakdown.underReview}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-orange-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Interviewing
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                  {applicationStatusBreakdown.interviewing}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-orange-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600 shadow-sm"></div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Offered
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {applicationStatusBreakdown.offered}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-orange-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm"></div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Rejected
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                  {applicationStatusBreakdown.rejected}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Events Registered Card */}
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
            <CardHeader>
              <CardTitle className="text-base text-pink-900 dark:text-pink-100 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events Registered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 text-pink-900 dark:text-pink-100">
                {eventRegistrations.length}
              </div>
              {eventsThisWeek > 0 && (
                <p className="text-sm text-pink-700 dark:text-pink-300 mb-4">
                  {eventsThisWeek} registered this week
                </p>
              )}
              {upcomingEvents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-pink-700 dark:text-pink-300">
                    Upcoming
                  </p>
                  {upcomingEvents.slice(0, 2).map((event) => {
                    const { month, day } = formatEventDate(event.eventDate);
                    return (
                      <div
                        key={event._id}
                        className="flex items-center gap-2 text-sm p-2 rounded-lg bg-white/50 dark:bg-pink-900/50"
                      >
                        <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        <span className="flex-1 truncate text-pink-900 dark:text-pink-100 font-medium">
                          {event.title}
                        </span>
                        <span className="text-xs text-pink-700 dark:text-pink-300">
                          {month} {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Applications */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                  Recent Applications
                </CardTitle>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Track your latest job applications
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <Link to="/student/applications">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map((app) => {
                    const job =
                      typeof app.jobId === "object"
                        ? (app.jobId as BackendJob)
                        : null;
                    if (!job || !job.title) return null;

                    const getStatusBadge = (status: string) => {
                      switch (status.toLowerCase()) {
                        case "applied":
                          return (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                            >
                              Applied
                            </Badge>
                          );
                        case "under_review":
                          return (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200"
                            >
                              Under Review
                            </Badge>
                          );
                        case "interview_scheduled":
                          return (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200"
                            >
                              Interviewing
                            </Badge>
                          );
                        case "offered":
                          return (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200"
                            >
                              Offered
                            </Badge>
                          );
                        case "rejected":
                          return (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300"
                            >
                              Rejected
                            </Badge>
                          );
                        default:
                          return (
                            <Badge variant="outline">
                              {status
                                .split("_")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(" ")}
                            </Badge>
                          );
                      }
                    };

                    // Safely get poster name with null checks
                    // Note: Backend only populates specific fields, so postedBy might not be populated
                    let posterName = "Company";
                    if (job.postedBy) {
                      if (job.postedBy.posterId) {
                        if (typeof job.postedBy.posterId === "object") {
                          posterName = job.postedBy.posterId.name || "Company";
                        }
                      }
                    }

                    const JobIcon = getJobIcon(job.title || "Job", job.jobType);
                    const iconColor = getJobIconColor(job.title || "Job");

                    // Extract location from job - format: "Company • Location"
                    // If location contains " • ", split it; otherwise use location as-is
                    const jobLocation = job.location || "";
                    let company = posterName;
                    let location = jobLocation || "Location not specified";

                    if (jobLocation.includes(" • ")) {
                      const locationParts = jobLocation.split(" • ");
                      company = locationParts[0] || posterName;
                      location = locationParts[1] || jobLocation;
                    } else if (jobLocation) {
                      // If location doesn't have " • ", try to extract company from postedBy
                      // Otherwise, use the location as the location field
                      location = jobLocation;
                    }

                    // Get icon background color based on job type
                    const getIconBgColor = (title: string) => {
                      const lowerTitle = title.toLowerCase();
                      if (
                        lowerTitle.includes("design") ||
                        lowerTitle.includes("ui") ||
                        lowerTitle.includes("ux") ||
                        lowerTitle.includes("product design")
                      ) {
                        return "bg-pink-50 dark:bg-pink-950";
                      }
                      if (
                        lowerTitle.includes("frontend") ||
                        lowerTitle.includes("front-end") ||
                        lowerTitle.includes("developer")
                      ) {
                        return "bg-gray-50 dark:bg-gray-950";
                      }
                      if (
                        lowerTitle.includes("data") ||
                        lowerTitle.includes("analyst") ||
                        lowerTitle.includes("science")
                      ) {
                        return "bg-green-50 dark:bg-green-950";
                      }
                      return "bg-blue-50 dark:bg-blue-950";
                    };

                    return (
                      <div
                        key={app._id}
                        className="flex items-start gap-3 p-4 border-2 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all bg-white dark:bg-slate-800/80 hover:shadow-md border-slate-200 dark:border-slate-700"
                      >
                        <div
                          className={`${iconColor} mt-0.5 flex-shrink-0 p-2 rounded-lg ${getIconBgColor(job.title)}`}
                        >
                          <JobIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-semibold text-sm leading-tight text-slate-900 dark:text-slate-100">
                              {job.title}
                            </h4>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            {company} • {location}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Applied {formatRelativeTime(app.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                  <Button asChild variant="outline" className="mt-4" size="sm">
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events - Moved to analytics section above */}
        </div>

        {/* Bottom Section - Events and Mentors */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Events */}
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-cyan-200 dark:border-cyan-800">
              <div>
                <CardTitle className="text-lg text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <p className="text-xs text-cyan-700 dark:text-cyan-300 mt-1">
                  Your registered events
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-cyan-200 dark:hover:bg-cyan-800"
              >
                <Link to="/events">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const { month, day } = formatEventDate(event.eventDate);
                    const eventDate = new Date(event.eventDate);
                    const isThisMonth = eventDate.getMonth() === now.getMonth();
                    const monthColor = isThisMonth
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-500 dark:text-gray-400";

                    // Parse location and time
                    const locationParts = event.location.split(" • ");
                    const location = locationParts[0] || event.location;
                    const time = locationParts[1] || event.startTime || "";

                    return (
                      <div
                        key={event._id}
                        className="flex items-start gap-3 p-3 border-2 rounded-lg hover:border-cyan-300 dark:hover:border-cyan-700 transition-all hover:shadow-md bg-white dark:bg-cyan-900/50 border-cyan-200 dark:border-cyan-800"
                      >
                        <div className="flex flex-col items-center min-w-[60px] flex-shrink-0 p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900">
                          <div
                            className={`text-xs font-semibold ${monthColor}`}
                          >
                            {month}
                          </div>
                          <div className="text-lg font-bold text-cyan-900 dark:text-cyan-100">
                            {day}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-1 text-cyan-900 dark:text-cyan-100">
                            {event.title}
                          </h4>
                          <p className="text-xs text-cyan-700 dark:text-cyan-300">
                            {location} {time && `• ${time}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                  <Button asChild variant="outline" className="mt-4" size="sm">
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Mentors Section */}
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-teal-200 dark:border-teal-800">
              <div>
                <CardTitle className="text-lg text-teal-900 dark:text-teal-100 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Mentors
                </CardTitle>
                <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                  Your active mentorship connections
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-teal-200 dark:hover:bg-teal-800"
              >
                <Link to="/student/alumni">
                  Directory
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeMentors.length > 0 ? (
                <div className="space-y-3">
                  {activeMentors.map((mentor) => {
                    const designation = mentor.currentDesignation || "";
                    const employer = mentor.currentEmployer || "";
                    const roleText =
                      designation && employer
                        ? `${designation} at ${employer}`
                        : designation || employer || "Mentor";

                    return (
                      <div
                        key={mentor._id}
                        className="flex items-center justify-between p-3 border-2 rounded-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all hover:shadow-md bg-white dark:bg-teal-900/50 border-teal-200 dark:border-teal-800"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-teal-300 dark:border-teal-700 ring-2 ring-teal-200 dark:ring-teal-800">
                            <AvatarImage
                              src={
                                mentor.profilePictureUrlOptimized ||
                                mentor.profilePictureUrlHD ||
                                mentor.profilePictureUrl
                              }
                              alt={mentor.name}
                            />
                            <AvatarFallback className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200">
                              {mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-1 text-teal-900 dark:text-teal-100">
                              {mentor.name}
                            </h4>
                            <p className="text-xs text-teal-700 dark:text-teal-300 line-clamp-1">
                              {roleText}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 flex-shrink-0 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full"
                        >
                          <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No active mentors</p>
                  <Button asChild variant="outline" className="mt-4" size="sm">
                    <Link to="/student/alumni">Find Mentors</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
