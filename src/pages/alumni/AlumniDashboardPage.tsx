import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
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
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mentorshipsAPI, jobsAPI, eventsAPI } from '../../lib/api';
import type { BackendMentorship, BackendJob, BackendEvent, BackendStudent } from '../../types/api';

const AlumniDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pendingMentorshipRequests, setPendingMentorshipRequests] = useState<BackendMentorship[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<BackendMentorship[]>([]);
  const [totalMentorships, setTotalMentorships] = useState(0);
  const [myJobs, setMyJobs] = useState<BackendJob[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<BackendEvent[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load mentorships
      const mentorshipsResponse = await mentorshipsAPI.getMy();
      const allMentorships = mentorshipsResponse.mentorships.filter((m: BackendMentorship) => {
        const mentorId = typeof m.mentorId === 'object' ? (m.mentorId as any)._id : m.mentorId;
        return mentorId === user?.id;
      });
      
      setPendingMentorshipRequests(allMentorships.filter((m: BackendMentorship) => m.status.toLowerCase() === 'pending').slice(0, 3));
      setActiveMentorships(allMentorships.filter((m: BackendMentorship) => m.status.toLowerCase() === 'active'));
      setTotalMentorships(allMentorships.length);

      // Load my posted jobs
      const jobs = await jobsAPI.getMyPosted();
      setMyJobs(jobs.slice(0, 3));

      // Load upcoming events (filtered by college context)
      const eventsResponse = await eventsAPI.getFiltered({ upcoming: true });
      const events = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.events;
      setUpcomingEvents(events.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStudentInfo = (mentorship: BackendMentorship): BackendStudent | null => {
    if (typeof mentorship.menteeId === 'object') {
      return mentorship.menteeId as BackendStudent;
    }
    return null;
  };

  const stats = [
    {
      title: 'Pending Requests',
      value: pendingMentorshipRequests.length,
      description: 'Awaiting response',
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      link: '/alumni/mentorships',
    },
    {
      title: 'Active Mentorships',
      value: activeMentorships.length,
      description: 'Ongoing relationships',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      link: '/alumni/mentorships',
    },
    {
      title: 'Jobs Posted',
      value: myJobs.length,
      description: 'Your opportunities',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      link: '/jobs',
    },
    {
      title: 'Total Mentorships',
      value: totalMentorships,
      description: 'All time',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      link: '/alumni/mentorships',
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

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Manage your mentorship requests, job postings, and network.
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
            <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = stat.link}>
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
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/alumni/mentorships">
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="font-semibold">Mentorship Requests</span>
                <span className="text-xs text-muted-foreground mt-1">Review pending</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/alumni/jobs/create">
                <Plus className="h-5 w-5 mb-2" />
                <span className="font-semibold">Post a Job</span>
                <span className="text-xs text-muted-foreground mt-1">Share opportunity</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/alumni/students">
                <GraduationCap className="h-5 w-5 mb-2" />
                <span className="font-semibold">View Students</span>
                <span className="text-xs text-muted-foreground mt-1">Browse directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/alumni/network">
                <Users className="h-5 w-5 mb-2" />
                <span className="font-semibold">Alumni Network</span>
                <span className="text-xs text-muted-foreground mt-1">Connect with peers</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pending Mentorship Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Mentorship Requests</CardTitle>
              <CardDescription>Students requesting your guidance</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/alumni/mentorships">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingMentorshipRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingMentorshipRequests.map((request) => {
                  const student = getStudentInfo(request);
                  if (!student) return null;

                  return (
                    <div key={request._id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.profilePictureUrl} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.degree} • {student.department}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {request.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/alumni/mentorships">View Request</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests</p>
                <p className="text-sm mt-1">All mentorship requests have been responded to</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Mentorships */}
        <Card>
          <CardHeader>
            <CardTitle>Active Mentorships</CardTitle>
            <CardDescription>Ongoing relationships</CardDescription>
          </CardHeader>
          <CardContent>
            {activeMentorships.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-2xl font-bold">{activeMentorships.length}</p>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/alumni/mentorships">Manage All</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No active mentorships</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Job Postings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Job Postings</CardTitle>
            <CardDescription>Jobs you've posted for students</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/jobs">View All</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/alumni/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {myJobs.map((job) => (
                <Card key={job._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {typeof job.postedBy.posterId === 'object' 
                        ? job.postedBy.posterId.name 
                        : 'Posted by Alumni'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{job.jobType}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                    {job.referral && (
                      <Badge variant="secondary" className="text-xs">Referral Available</Badge>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/jobs/${job._id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No job postings yet</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/alumni/jobs/create">Post Your First Job</Link>
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
            <CardDescription>Events you might be interested in</CardDescription>
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
            <div className="grid gap-4 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{event.location}</span>
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link to={`/events/${event._id}`}>View Event</Link>
                    </Button>
                  </CardContent>
                </Card>
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
  );
};

export default AlumniDashboardPage;

