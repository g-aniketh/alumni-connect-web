import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, mentorshipsAPI, eventsAPI } from '../../lib/api';
import type { BackendJobApplication, BackendMentorship, BackendEvent, BackendJob, BackendStudent } from '../../types/api';
import { UserRole, type Student } from '../../types';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [myMentorships, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<BackendEvent[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<BackendJob[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load my applications
      const myApplications = await jobsAPI.getMyApplications();
      setApplications(myApplications);

      // Load my mentorships
      const mentorshipsResponse = await mentorshipsAPI.getMy();
      const allMentorships = mentorshipsResponse.mentorships.filter((m: BackendMentorship) => {
        const menteeId =
          typeof m.menteeId === 'object'
            ? (m.menteeId as BackendStudent)._id ?? ''
            : m.menteeId;
        return menteeId === user?.id;
      });
      setMyMentorships(allMentorships);

      // Load upcoming events (filtered by college context)
      const eventsResponse = await eventsAPI.getFiltered({ upcoming: true });
      const events = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.events;
      setUpcomingEvents(events.slice(0, 3));

      // Load featured jobs (filtered by college context)
      const jobsResponse = await jobsAPI.getFiltered({ available: true });
      const jobsArray = Array.isArray(jobsResponse)
        ? jobsResponse
        : (jobsResponse as { jobs?: typeof featuredJobs }).jobs ?? [];
      setFeaturedJobs(jobsArray.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    app => app.status === 'applied' || app.status === 'under_review' || app.status === 'interview_scheduled'
  ).length;

  const activeMentorships = myMentorships.filter(m => m.status.toLowerCase() === 'active').length;
  const pendingMentorships = myMentorships.filter(m => m.status.toLowerCase() === 'pending').length;

  const recentApplications = applications.slice(0, 3);

  const stats = [
    {
      title: 'Active Applications',
      value: activeApplications,
      description: 'Under review',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active Mentorships',
      value: activeMentorships,
      description: 'Ongoing relationships',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Total Applications',
      value: totalApplications,
      description: 'All time',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      description: 'Registered',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

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
          <h1 className="text-2xl font-semibold">Account Pending Verification</h1>
          <p className="text-muted-foreground">
            Your student account has been created but is not yet verified by your college.
            Once your college administrator verifies your account, you&apos;ll be able to
            access your dashboard and all student features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Track your applications, mentorships, and opportunities.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/student/alumni">
                <Search className="h-5 w-5 mb-2" />
                <span className="font-semibold">Find Mentors</span>
                <span className="text-xs text-muted-foreground mt-1">Browse alumni directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/jobs">
                <Briefcase className="h-5 w-5 mb-2" />
                <span className="font-semibold">Browse Jobs</span>
                <span className="text-xs text-muted-foreground mt-1">Find opportunities</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/student/applications">
                <FileText className="h-5 w-5 mb-2" />
                <span className="font-semibold">My Applications</span>
                <span className="text-xs text-muted-foreground mt-1">Track status</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/student/mentorships">
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="font-semibold">Mentorships</span>
                <span className="text-xs text-muted-foreground mt-1">Manage relationships</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/student/applications">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => {
                  const job = typeof app.jobId === 'object' ? app.jobId as BackendJob : null;
                  if (!job) return null;

                  const getStatusBadge = (status: string) => {
                    switch (status.toLowerCase()) {
                      case 'applied':
                        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3 mr-1" />Applied</Badge>;
                      case 'under_review':
                        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>;
                      case 'offered':
                        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Offered</Badge>;
                      case 'rejected':
                        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
                      default:
                        return <Badge variant="outline">{status}</Badge>;
                    }
                  };

                  const posterName = typeof job.postedBy.posterId === 'object' 
                    ? job.postedBy.posterId.name 
                    : 'Company';

                  return (
                    <div key={app._id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{job.title}</h4>
                          {job.referral && (
                            <Badge variant="secondary" className="text-xs">Referral</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{posterName}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-muted-foreground">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
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
                <p>No applications yet</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don't miss out</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/events">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="p-3 border rounded-lg hover:bg-accent transition-colors">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Featured Job Opportunities</CardTitle>
            <CardDescription>Recommended positions for you</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/jobs">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredJobs.map((job) => {
              const posterName = typeof job.postedBy.posterId === 'object' 
                ? job.postedBy.posterId.name 
                : 'Company';
              
              return (
                <Card key={job._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{posterName}</CardDescription>
                    </div>
                      {job.referral && (
                      <Badge variant="secondary" className="text-xs">Referral</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{job.jobType}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                      <Link to={`/jobs/${job._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mentorship Status */}
      {(activeMentorships > 0 || pendingMentorships > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Mentorship Status</CardTitle>
            <CardDescription>Your mentorship relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Mentorships</p>
                    <p className="text-2xl font-bold">{activeMentorships}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Requests</p>
                    <p className="text-2xl font-bold">{pendingMentorships}</p>
                  </div>
                </div>
              </div>
            </div>
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link to="/student/mentorships">Manage Mentorships</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboardPage;

