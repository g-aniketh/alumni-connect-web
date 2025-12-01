import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockJobs, mockJobApplications, mockMentorshipRequests, mockEvents } from '../../data/mockData';
import { JobApplicationStatus, MentorshipStatus, EventStatus } from '../../types';

const StudentDashboardPage = () => {
  const { user } = useAuth();

  // Mock data calculations
  const totalApplications = mockJobApplications.length;
  const activeApplications = mockJobApplications.filter(
    app => app.status === JobApplicationStatus.Applied || app.status === JobApplicationStatus.UnderReview
  ).length;
  const acceptedApplications = mockJobApplications.filter(
    app => app.status === JobApplicationStatus.Offered
  ).length;

  const activeMentorships = mockMentorshipRequests.filter(
    req => req.status === MentorshipStatus.Accepted
  ).length;
  const pendingMentorships = mockMentorshipRequests.filter(
    req => req.status === MentorshipStatus.Pending
  ).length;

  const upcomingEvents = mockEvents.filter(e => e.status === EventStatus.Upcoming).slice(0, 3);
  const recentApplications = mockJobApplications.slice(0, 3);
  const recentJobs = mockJobs.slice(0, 3);

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

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Track your applications, mentorships, and opportunities.
        </p>
      </div>

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
                  const job = mockJobs.find(j => j.id === app.jobId);
                  if (!job) return null;

                  const getStatusBadge = (status: JobApplicationStatus) => {
                    switch (status) {
                      case JobApplicationStatus.Applied:
                        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3 mr-1" />Applied</Badge>;
                      case JobApplicationStatus.UnderReview:
                        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>;
                      case JobApplicationStatus.Offered:
                        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Offered</Badge>;
                      case JobApplicationStatus.Rejected:
                        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
                      default:
                        return <Badge variant="outline">{status}</Badge>;
                    }
                  };

                  return (
                    <div key={app.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{job.title}</h4>
                          {job.referralAvailable && (
                            <Badge variant="secondary" className="text-xs">Referral</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-muted-foreground">
                            Applied {new Date(app.appliedOn).toLocaleDateString()}
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
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-accent transition-colors">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
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
            {recentJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="mt-1">{job.company}</CardDescription>
                    </div>
                    {job.referralAvailable && (
                      <Badge variant="secondary" className="text-xs">Referral</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.department.slice(0, 2).map((dept) => (
                      <Badge key={dept} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/jobs">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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

