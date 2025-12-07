import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Users,
  Briefcase,
  Calendar,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { mentorshipsAPI, jobsAPI, eventsAPI } from "../../lib/api";
import type {
  BackendMentorship,
  BackendJob,
  BackendEvent,
  BackendStudent,
  BackendAlumni,
} from "../../types/api";

const AlumniDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pendingMentorshipRequests, setPendingMentorshipRequests] = useState<
    BackendMentorship[]
  >([]);
  const [activeMentorships, setActiveMentorships] = useState<
    BackendMentorship[]
  >([]);
  const [totalMentorships, setTotalMentorships] = useState(0);
  const [myJobs, setMyJobs] = useState<BackendJob[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<BackendEvent[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load mentorships
      const mentorshipsResponse = await mentorshipsAPI.getMy();
      const allMentorships = mentorshipsResponse.mentorships.filter(
        (m: BackendMentorship) => {
          const mentorId =
            typeof m.mentorId === "object"
              ? ((m.mentorId as BackendAlumni)._id ?? "")
              : m.mentorId;
          return mentorId === user?.id;
        }
      );

      setPendingMentorshipRequests(
        allMentorships
          .filter(
            (m: BackendMentorship) => m.status.toLowerCase() === "pending"
          )
          .slice(0, 3)
      );
      setActiveMentorships(
        allMentorships.filter(
          (m: BackendMentorship) => m.status.toLowerCase() === "active"
        )
      );
      setTotalMentorships(allMentorships.length);

      // Load my posted jobs
      const jobs = await jobsAPI.getMyPosted();
      setMyJobs(jobs.slice(0, 3));

      // Load upcoming events (filtered by college context)
      const eventsResponse = await eventsAPI.getFiltered({ upcoming: true });
      const events = Array.isArray(eventsResponse)
        ? eventsResponse
        : eventsResponse.events;
      setUpcomingEvents(events.slice(0, 3));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStudentInfo = (
    mentorship: BackendMentorship
  ): BackendStudent | null => {
    if (typeof mentorship.menteeId === "object") {
      return mentorship.menteeId as BackendStudent;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
        <div className="container py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Alumni Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Manage your mentorship requests, job
            postings, and network.
          </p>
        </div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Pending Requests Card - Highlighted */}
          <Card className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Pending Requests
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {pendingMentorshipRequests.length}
              </div>
              <p className="text-xs text-white/80 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          {/* Active Mentorships Card */}
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Active Mentorships
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {activeMentorships.length}
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Ongoing relationships
              </p>
            </CardContent>
          </Card>

          {/* Jobs Posted Card */}
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Jobs Posted
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {myJobs.length}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Your opportunities
              </p>
            </CardContent>
          </Card>

          {/* Total Mentorships Card */}
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Total Mentorships
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {totalMentorships}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <CardTitle className="text-rose-900 dark:text-rose-100">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:bg-white dark:hover:bg-rose-900 hover:shadow-md transition-all"
              >
                <Link to="/alumni/mentorships">
                  <MessageSquare className="h-5 w-5 mb-2 text-amber-600" />
                  <span className="font-semibold">Mentorship Requests</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Review pending
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:bg-white dark:hover:bg-rose-900 hover:shadow-md transition-all"
              >
                <Link to="/alumni/jobs/create">
                  <Plus className="h-5 w-5 mb-2 text-blue-600" />
                  <span className="font-semibold">Post a Job</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Share opportunity
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:bg-white dark:hover:bg-rose-900 hover:shadow-md transition-all"
              >
                <Link to="/alumni/students">
                  <GraduationCap className="h-5 w-5 mb-2 text-green-600" />
                  <span className="font-semibold">View Students</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Browse directory
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:bg-white dark:hover:bg-rose-900 hover:shadow-md transition-all"
              >
                <Link to="/alumni/network">
                  <Users className="h-5 w-5 mb-2 text-purple-600" />
                  <span className="font-semibold">Alumni Network</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Connect with peers
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Mentorship Requests */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-yellow-200 dark:border-yellow-800">
              <div>
                <CardTitle className="text-yellow-900 dark:text-yellow-100">
                  Pending Mentorship Requests
                </CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  Students requesting your guidance
                </CardDescription>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-yellow-200 dark:hover:bg-yellow-800"
              >
                <Link to="/alumni/mentorships">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingMentorshipRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingMentorshipRequests.map((request) => {
                    const student = getStudentInfo(request);
                    if (!student) return null;

                    return (
                      <div
                        key={request._id}
                        className="flex items-start gap-4 p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg bg-white dark:bg-yellow-900/30 hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-700 transition-all"
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-yellow-300 dark:ring-yellow-700">
                          <AvatarImage
                            src={student.profilePictureUrl}
                            alt={student.name}
                          />
                          <AvatarFallback className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                                {student.name}
                              </h4>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                {student.degree} • {student.department}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          {request.message && (
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2 line-clamp-2">
                              {request.message}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="hover:bg-yellow-100 dark:hover:bg-yellow-800"
                            >
                              <Link to="/alumni/mentorships">View Request</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-yellow-700 dark:text-yellow-300">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending requests</p>
                  <p className="text-sm mt-1">
                    All mentorship requests have been responded to
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Mentorships */}
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-900 border-teal-200 dark:border-teal-800">
            <CardHeader className="border-b border-teal-200 dark:border-teal-800">
              <CardTitle className="text-teal-900 dark:text-teal-100">
                Active Mentorships
              </CardTitle>
              <CardDescription className="text-teal-700 dark:text-teal-300">
                Ongoing relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {activeMentorships.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 border-2 border-teal-200 dark:border-teal-800 rounded-lg bg-white dark:bg-teal-900/30">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-teal-500 rounded-lg shadow-sm">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                          Active
                        </p>
                        <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                          {activeMentorships.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full hover:bg-teal-100 dark:hover:bg-teal-800"
                  >
                    <Link to="/alumni/mentorships">Manage All</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-teal-700 dark:text-teal-300">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No active mentorships</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Job Postings */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-blue-200 dark:border-blue-800 flex-wrap gap-3">
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                My Job Postings
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Jobs you've posted for students
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <Link to="/jobs">View All</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link to="/alumni/jobs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {myJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myJobs.map((job) => (
                  <Card
                    key={job._id}
                    className="hover:shadow-lg transition-all border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900/30"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base line-clamp-2 text-blue-900 dark:text-blue-100">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="text-blue-700 dark:text-blue-300">
                            {typeof job.postedBy.posterId === "object"
                              ? job.postedBy.posterId.name
                              : "Posted by Alumni"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-xs text-blue-700 dark:text-blue-300">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 dark:bg-blue-900"
                        >
                          {job.jobType}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      </div>
                      {job.referral && (
                        <Badge className="text-xs bg-green-500 text-white">
                          Referral Available
                        </Badge>
                      )}
                      <Button
                        asChild
                        variant="outline"
                        className="w-full hover:bg-blue-100 dark:hover:bg-blue-800"
                      >
                        <Link to={`/jobs/${job._id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-blue-700 dark:text-blue-300">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No job postings yet</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <Link to="/alumni/jobs/create">Post Your First Job</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900 border-violet-200 dark:border-violet-800">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-violet-200 dark:border-violet-800">
            <div>
              <CardTitle className="text-violet-900 dark:text-violet-100">
                Upcoming Events
              </CardTitle>
              <CardDescription className="text-violet-700 dark:text-violet-300">
                Events you might be interested in
              </CardDescription>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-violet-200 dark:hover:bg-violet-800"
            >
              <Link to="/events">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event._id}
                    className="hover:shadow-lg transition-all border-2 border-violet-200 dark:border-violet-800 bg-white dark:bg-violet-900/30"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-violet-500 rounded-lg shadow-sm">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base line-clamp-2 text-violet-900 dark:text-violet-100">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-violet-700 dark:text-violet-300">
                            {event.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full mt-4 hover:bg-violet-100 dark:hover:bg-violet-800"
                      >
                        <Link to="/events">View Event</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-violet-700 dark:text-violet-300">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlumniDashboardPage;
