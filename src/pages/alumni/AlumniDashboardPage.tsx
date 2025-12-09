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
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { mentorshipsAPI, jobsAPI, eventsAPI } from "../../lib/api";
import type {
  BackendMentorship,
  BackendJob,
  BackendEvent,
  BackendStudent,
  BackendAlumni,
} from "../../types/api";
import { motion } from "motion/react";
import AlumniDashboardSkeleton from "./AlumniDashboardSkeleton";
import { AlumniAnalytics } from "../../components/dashboard/AnalyticsWidgets";
import { JobDetails } from "../../components/jobs/JobDetails";
import { JobType } from "../../types";
import type React from "react";

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
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");

      // Handle mentorships - gracefully handle 403 errors for unverified users
      try {
        const mentorshipsResponse = await mentorshipsAPI.getMy();
        const allMentorships = mentorshipsResponse.mentorships.filter(
          (m: BackendMentorship) => {
            const mentorId =
              typeof m.mentorId === "object"
                ? ((m.mentorId as BackendAlumni)._id ?? "")
                : m.mentorId;
            return mentorId === user.id;
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
      } catch (mentorshipErr) {
        // Silently handle 403 errors for unverified users (allow them to use the app)
        const errorMessage = mentorshipErr instanceof Error ? mentorshipErr.message : "";
        const isVerificationError = 
          errorMessage.includes("403") || 
          errorMessage.includes("Forbidden") || 
          errorMessage.includes("Access denied") ||
          errorMessage.includes("not verified");
        
        if (!isVerificationError) {
          // Only log non-verification errors
          console.warn("Failed to load mentorships:", mentorshipErr);
        }
        // Set empty defaults for unverified users
        setPendingMentorshipRequests([]);
        setActiveMentorships([]);
        setTotalMentorships(0);
      }

      const jobs = await jobsAPI.getMyPosted();
      setMyJobs(jobs.slice(0, 3));

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

  const transformJob = (backendJob: BackendJob) => {
    const posterName =
      typeof backendJob.postedBy.posterId === "object"
        ? backendJob.postedBy.posterId.name
        : "Company";
    return {
      id: backendJob._id,
      title: backendJob.title,
      description: backendJob.description,
      company: posterName,
      location: backendJob.location,
      type: backendJob.jobType as JobType,
      salaryMin: backendJob.salaryMin,
      salaryMax: backendJob.salaryMax,
      department: [],
      referralAvailable: backendJob.referral || false,
      postedDate: backendJob.createdAt,
      postedBy: backendJob.postedBy.posterType,
      applyLink: undefined,
    };
  };

  const handleViewJobDetails = (job: BackendJob) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
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
    return <AlumniDashboardSkeleton />;
  }

  return (
    <div className="bg-[#E3F2FD] min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-[#333333] mt-2">
            Here's your hub for mentorship, career opportunities, and community
            engagement.
          </p>
        </motion.div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Pending Requests"
              value={pendingMentorshipRequests.length}
              icon={<MessageSquare className="w-6 h-6 text-[#1E88E5]" />}
            />
            <StatCard
              title="Active Mentorships"
              value={activeMentorships.length}
              icon={<Users className="w-6 h-6 text-[#1E88E5]" />}
            />
            <StatCard
              title="Jobs Posted"
              value={myJobs.length}
              icon={<Briefcase className="w-6 h-6 text-[#1E88E5]" />}
            />
            <StatCard
              title="Total Mentorships"
              value={totalMentorships}
              icon={<TrendingUp className="w-6 h-6 text-[#1E88E5]" />}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-[#1E88E5]/30 bg-white p-4 shadow-sm">
            <AlumniAnalytics />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white border-[#1E88E5]/30">
            <CardHeader>
              <CardTitle className="text-[#1565C0]">Quick Actions</CardTitle>
              <CardDescription className="text-[#333333]/80">Common tasks and shortcuts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionButton
                icon={MessageSquare}
                title="Mentorships"
                link="/alumni/mentorships"
                className="bg-indigo-50 border-indigo-100 hover:bg-indigo-100"
              />
              <QuickActionButton
                icon={Plus}
                title="Post a Job"
                link="/alumni/jobs/create"
                className="bg-rose-50 border-rose-100 hover:bg-rose-100"
              />
              <QuickActionButton
                icon={GraduationCap}
                title="View Students"
                link="/alumni/students"
                className="bg-teal-50 border-teal-100 hover:bg-teal-100"
              />
              <QuickActionButton
                icon={Users}
                title="Alumni Network"
                link="/alumni/network"
                className="bg-amber-50 border-amber-100 hover:bg-amber-100"
              />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Mentorship Requests</CardTitle>
                  <CardDescription>
                    Students requesting your guidance.
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/alumni/mentorships">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {pendingMentorshipRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingMentorshipRequests.map((request, i) => {
                      const student = getStudentInfo(request);
                      if (!student) return null;
                      return (
                        <MentorshipRequestCard
                          key={request._id}
                          request={request}
                          student={student}
                          delay={i * 0.1}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    message="No pending mentorship requests."
                    icon={<MessageSquare className="w-10 h-10 text-gray-400" />}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Active Mentorships</CardTitle>
                <CardDescription>Your ongoing relationships.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeMentorships.length > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-100 flex items-center justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <p className="font-semibold">
                        {activeMentorships.length} Active
                      </p>
                      <Button asChild variant="outline" size="sm" className="bg-white hover:bg-emerald-100">
                        <Link to="/alumni/mentorships">Manage All</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    message="No active mentorships."
                    icon={<Users className="w-10 h-10 text-gray-400" />}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Job Postings</CardTitle>
                <CardDescription>
                  Jobs you've shared with the community.
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/alumni/jobs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {myJobs.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myJobs.map((job, i) => (
                    <JobCard key={job._id} job={job} delay={i * 0.1} onViewDetails={handleViewJobDetails} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No job postings yet."
                  cta={{
                    text: "Post Your First Job",
                    link: "/alumni/jobs/create",
                  }}
                  icon={<Briefcase className="w-10 h-10 text-gray-400" />}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Connect with the community.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/events">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event, i) => (
                    <EventCard key={event._id} event={event} delay={i * 0.1} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No upcoming events."
                  icon={<Calendar className="w-10 h-10 text-gray-400" />}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <JobDetails
          job={selectedJob ? transformJob(selectedJob) : null}
          open={isJobDetailsOpen}
          onOpenChange={setIsJobDetailsOpen}
        />
      </div>
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
};

const StatCard = ({
  title,
  value,
  icon,
}: StatCardProps) => (
  <Card
    className="p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-white border-[#1E88E5]/30"
  >
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#333333]/80">{title}</CardTitle>
      <div className="p-2 bg-[#E3F2FD] rounded-lg border border-[#1E88E5]/20">
        {icon}
      </div>
    </div>
    <CardContent className="p-0">
      <div className="text-2xl font-bold text-[#1565C0]">{value}</div>
    </CardContent>
  </Card>
);

type QuickActionButtonProps = {
  icon: LucideIcon;
  title: string;
  link: string;
  className?: string;
};

const QuickActionButton = ({ icon: Icon, title, link }: QuickActionButtonProps) => (
  <Button
    asChild
    variant="outline"
    className="h-auto flex-col items-start p-4 justify-start transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white hover:bg-[#E3F2FD] border-[#1E88E5]/30 text-[#1565C0]"
  >
    <Link to={link}>
      <Icon className="w-5 h-5 text-[#1E88E5]" />
      <span className="font-semibold mt-2">{title}</span>
    </Link>
  </Button>
);

type MentorshipRequestCardProps = {
  request: BackendMentorship;
  student: BackendStudent;
  delay: number;
};

const MentorshipRequestCard = ({
  request,
  student,
  delay,
}: MentorshipRequestCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="flex items-start gap-4 rounded-lg border p-4 bg-white border-[#1E88E5]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <Avatar className="h-12 w-12 border-2 border-[#E3F2FD]">
        <AvatarImage src={student.profilePictureUrl} alt={student.name} />
        <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">{student.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-[#1565C0]">{student.name}</p>
            <p className="text-sm text-[#333333]/80">{student.degree}</p>
          </div>
          <Badge variant="outline" className="bg-[#E3F2FD] text-[#1565C0] border-[#1E88E5]/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </div>
        <p className="mt-2 text-sm text-[#333333] line-clamp-2">
          {request.message}
        </p>
        <Button variant="outline" size="sm" className="mt-3 bg-[#1E88E5] hover:bg-[#1565C0] text-white border-none" asChild>
          <Link to="/alumni/mentorships">View Request</Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

type JobCardProps = {
  job: BackendJob;
  delay: number;
  onViewDetails: (job: BackendJob) => void;
};

const JobCard = ({ job, delay, onViewDetails }: JobCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card 
      className="h-full flex flex-col bg-white border-[#1E88E5]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      onClick={() => onViewDetails(job)}
    >
      <CardHeader>
        <CardTitle className="text-base text-[#1565C0]">{job.title}</CardTitle>
        <CardDescription className="text-[#333333]/80">
          {job.jobType} • {job.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full bg-[#E3F2FD] hover:bg-[#1E88E5] text-[#1565C0] hover:text-white border-[#1E88E5]/30"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(job);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

type EventCardProps = {
  event: BackendEvent;
  delay: number;
};

const EventCard = ({ event, delay }: EventCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className="h-full flex flex-col bg-white border-[#1E88E5]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-base text-[#1565C0]">{event.title}</CardTitle>
        <CardDescription className="text-[#333333]/80">
          {new Date(event.eventDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button variant="outline" size="sm" className="w-full bg-[#E3F2FD] hover:bg-[#1E88E5] text-[#1565C0] hover:text-white border-[#1E88E5]/30" asChild>
          <Link to={`/events`}>View Event</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

type EmptyStateProps = {
  message: string;
  cta?: { text: string; link: string };
  icon?: React.ReactNode;
};

const EmptyState = ({ message, cta, icon }: EmptyStateProps) => (
  <div className="text-center py-12">
    {icon && (
      <div className="inline-block p-4 bg-[#E3F2FD] rounded-full text-[#1E88E5]">{icon}</div>
    )}
    <p className="mt-4 text-[#333333]">{message}</p>
    {cta && (
      <Button asChild className="mt-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white">
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

export default AlumniDashboardPage;
