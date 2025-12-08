import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  FileText,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
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
import { motion } from "motion/react";
import StudentDashboardSkeleton from "./StudentDashboardSkeleton";
import { StudentAnalytics } from "../../components/dashboard/AnalyticsWidgets";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [myMentorships, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<
    BackendEventRegistration[]
  >([]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [myApplications, mentorshipsResponse, registrations] =
        await Promise.all([
          jobsAPI.getMyApplications(),
          mentorshipsAPI.getMy(),
          eventsAPI.getMyRegistrations(),
        ]);

      setApplications(myApplications);
      setEventRegistrations(registrations);

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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const activeApplications = applications.filter((app) =>
    ["applied", "under_review", "interview_scheduled"].includes(app.status)
  );
  const activeMentorships = myMentorships.filter(
    (m) => m.status.toLowerCase() === "active"
  );

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  if (user && user.role === UserRole.Student && !(user as Student).isVerified) {
    return (
      <div className="bg-stone-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto text-center max-w-md space-y-4 p-4">
          <CheckCircle2 className="w-12 h-12 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-semibold">
            Account Pending Verification
          </h1>
          <p className="text-gray-500">
            Your student account is awaiting verification by your college. Once
            verified, you'll gain access to all features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome, {user?.name.split(" ")[0]}
          </h1>
          <p className="text-gray-500 mt-2">
            Here's a look at your professional journey and opportunities.
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
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <StudentAnalytics />
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <DashboardSection
              title="My Active Applications"
              description="Track the status of jobs you've applied for."
              linkTo="/student/applications"
            >
              {activeApplications.length > 0 ? (
                <div className="space-y-4">
                  {activeApplications.slice(0, 3).map((app, i) => (
                    <ApplicationCard
                      key={app._id ?? `app-${i}`}
                      application={app}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No active applications."
                  cta={{ text: "Find a Job", link: "/jobs" }}
                  icon={<Briefcase />}
                />
              )}
            </DashboardSection>
            <DashboardSection
              title="My Mentorships"
              description="Manage your connections with mentors."
              linkTo="/student/mentorships"
            >
              {activeMentorships.length > 0 ? (
                <div className="space-y-4">
                  {activeMentorships.slice(0, 3).map((m, i) => (
                    <MentorshipCard
                      key={m._id ?? `mentorship-${i}`}
                      mentorship={m}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You have no active mentors."
                  cta={{ text: "Find a Mentor", link: "/student/alumni" }}
                  icon={<Users />}
                />
              )}
            </DashboardSection>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <DashboardSection title="Quick Actions">
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
              icon={Briefcase}
                  title="Browse Jobs"
              link="/jobs"
            />
                <QuickActionButton
              icon={Users}
                  title="Find Mentors"
                  link="/student/alumni"
                />
                <QuickActionButton
              icon={Calendar}
                  title="My Events"
                  link="/student/events"
                />
                <QuickActionButton
              icon={FileText}
                  title="My Applications"
                  link="/student/applications"
                />
              </div>
            </DashboardSection>
            <DashboardSection
              title="My Events"
              description="Your upcoming event registrations."
              linkTo="/student/events"
            >
              {eventRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {eventRegistrations.slice(0, 3).map((reg, i) => (
                    <EventCard
                      key={reg._id ?? `event-${reg.eventId ?? i}-${i}`}
                      registration={reg}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You're not registered for any events."
                  cta={{ text: "Browse Events", link: "/events" }}
                />
              )}
            </DashboardSection>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSection = ({ title, description, linkTo, children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </div>
        {linkTo && (
          <Button variant="ghost" size="sm" asChild>
            <Link to={linkTo}>
              View all <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);

const QuickActionButton = ({ icon: Icon, title, link }) => (
  <Button
    asChild
    variant="outline"
    className="h-auto flex-col items-center p-4 justify-center hover:bg-stone-100 transition-colors gap-2"
  >
    <Link to={link}>
      <Icon className="w-6 h-6" />
      <span className="font-semibold text-sm text-center">{title}</span>
    </Link>
  </Button>
);

const ApplicationCard = ({ application, delay }) => {
  const job =
    typeof application.jobId === "object"
      ? (application.jobId as BackendJob)
      : null;
  if (!job) return null;

  const posterName =
    job.postedBy && typeof job.postedBy.posterId === "object"
      ? job.postedBy.posterId.name
      : job.postedBy?.posterType
      ? job.postedBy.posterType
      : "Company";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-4 rounded-lg border p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
        <div className="flex-1">
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm text-gray-500">
            {posterName}
          </p>
        </div>
        <Badge variant="outline">{application.status.replace("_", " ")}</Badge>
      </div>
    </motion.div>
  );
};

const MentorshipCard = ({ mentorship, delay }) => {
  const mentor =
    typeof mentorship.mentorId === "object"
      ? (mentorship.mentorId as BackendAlumni)
      : null;
  if (!mentor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-4 rounded-lg border p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
        <Avatar className="h-10 w-10">
          <AvatarImage src={mentor.profilePictureUrl} alt={mentor.name} />
          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{mentor.name}</p>
          <p className="text-sm text-gray-500">
            {mentor.currentDesignation || "Mentor"}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
    </motion.div>
  );
};

const EventCard = ({ registration, delay }) => {
  const event =
    typeof registration.eventId === "object"
      ? (registration.eventId as BackendEvent)
      : null;
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-4 rounded-lg border p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
        <div className="flex flex-col items-center justify-center w-12 text-center bg-stone-200 rounded-md p-1">
          <span className="text-xs font-bold uppercase">
            {new Date(event.eventDate).toLocaleString("default", {
              month: "short",
            })}
          </span>
          <span className="text-xl font-bold">
            {new Date(event.eventDate).getDate()}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold line-clamp-1">{event.title}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{event.location}</p>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ message, cta, icon }) => (
  <div className="text-center py-12 flex flex-col items-center">
    <div className="p-3 bg-stone-100 rounded-full mb-4">
      {icon && <div className="w-8 h-8 text-gray-400">{icon}</div>}
    </div>
    <p className="font-medium text-gray-500">{message}</p>
    {cta && (
      <Button asChild variant="outline" className="mt-4">
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

export default StudentDashboardPage;
