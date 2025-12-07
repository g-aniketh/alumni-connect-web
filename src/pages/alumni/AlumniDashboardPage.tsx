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
import { motion } from "motion/react";
import AlumniDashboardSkeleton from "./AlumniDashboardSkeleton";

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
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");

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
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-2">
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
              icon={<MessageSquare />}
              isHighlighted
            />
            <StatCard
              title="Active Mentorships"
              value={activeMentorships.length}
              icon={<Users />}
            />
            <StatCard
              title="Jobs Posted"
              value={myJobs.length}
              icon={<Briefcase />}
            />
            <StatCard
              title="Total Mentorships"
              value={totalMentorships}
              icon={<TrendingUp />}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionButton
                icon={<MessageSquare />}
                title="Mentorships"
                link="/alumni/mentorships"
              />
              <QuickActionButton
                icon={<Plus />}
                title="Post a Job"
                link="/alumni/jobs/create"
              />
              <QuickActionButton
                icon={<GraduationCap />}
                title="View Students"
                link="/alumni/students"
              />
              <QuickActionButton
                icon={<Users />}
                title="Alumni Network"
                link="/alumni/network"
              />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                    <div className="p-4 rounded-lg bg-stone-100 flex items-center justify-between">
                      <p className="font-semibold">
                        {activeMentorships.length} Active
                      </p>
                      <Button asChild variant="outline" size="sm">
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
                    <JobCard key={job._id} job={job} delay={i * 0.1} />
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
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, isHighlighted = false }) => (
  <Card
    className={`p-6 transition-all ${isHighlighted ? "bg-black text-white" : "bg-white"}`}
  >
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </div>
    <CardContent className="p-0">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const QuickActionButton = ({ icon, title, link }) => (
  <Button
    asChild
    variant="outline"
    className="h-auto flex-col items-start p-4 justify-start hover:bg-stone-100 transition-colors"
  >
    <Link to={link}>
      {icon}
      <span className="font-semibold mt-2">{title}</span>
    </Link>
  </Button>
);

const MentorshipRequestCard = ({ request, student, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="flex items-start gap-4 rounded-lg border p-4 bg-white hover:bg-stone-50 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={student.profilePictureUrl} alt={student.name} />
        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-gray-500">{student.degree}</p>
          </div>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {request.message}
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link to="/alumni/mentorships">View Request</Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

const JobCard = ({ job, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className="h-full flex flex-col bg-white">
      <CardHeader>
        <CardTitle className="text-base">{job.title}</CardTitle>
        <CardDescription>
          {job.jobType} • {job.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/jobs/${job._id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const EventCard = ({ event, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className="h-full flex flex-col bg-white">
      <CardHeader>
        <CardTitle className="text-base">{event.title}</CardTitle>
        <CardDescription>
          {new Date(event.eventDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/events`}>View Event</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const EmptyState = ({ message, cta, icon }) => (
  <div className="text-center py-12">
    {icon && (
      <div className="inline-block p-4 bg-stone-100 rounded-full">{icon}</div>
    )}
    <p className="mt-4 text-gray-500">{message}</p>
    {cta && (
      <Button asChild className="mt-4">
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

export default AlumniDashboardPage;
