import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  GraduationCap,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAlumni, mockStudents, mockJobs, mockEvents, mockCampaigns, mockNewsletters } from '../../data/mockData';
import { EventStatus } from '../../types';
import { EmploymentChart } from '../../components/dashboard/EmploymentChart';
import { DashboardStats } from '../../components/dashboard/DashboardStats';

const CollegeDashboardPage = () => {
  const { user } = useAuth();

  // Mock data calculations
  const totalAlumni = mockAlumni.length;
  const totalStudents = mockStudents.length;
  const totalJobs = mockJobs.length;
  const activeCampaigns = mockCampaigns.filter(c => c.status === EventStatus.Ongoing).length;
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.totalRaised, 0);
  const upcomingEvents = mockEvents.filter(e => e.status === EventStatus.Upcoming).length;
  const recentNewsletters = mockNewsletters.slice(0, 3);

  const stats = [
    {
      title: 'Total Alumni',
      value: totalAlumni,
      description: 'Registered members',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      link: '/college/alumni',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      description: 'Active students',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      link: '/college/students',
    },
    {
      title: 'Job Postings',
      value: totalJobs,
      description: 'Active opportunities',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      link: '/jobs',
    },
    {
      title: 'Funds Raised',
      value: `$${(totalRaised / 1000).toFixed(0)}k`,
      description: 'From campaigns',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      link: '/events',
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">College Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Manage your institution's alumni network and activities.
        </p>
      </div>

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
          <CardDescription>Common management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/college/alumni">
                <Users className="h-5 w-5 mb-2" />
                <span className="font-semibold">Manage Alumni</span>
                <span className="text-xs text-muted-foreground mt-1">View directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/college/students">
                <GraduationCap className="h-5 w-5 mb-2" />
                <span className="font-semibold">Manage Students</span>
                <span className="text-xs text-muted-foreground mt-1">View directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/college/jobs/create">
                <Plus className="h-5 w-5 mb-2" />
                <span className="font-semibold">Post Job</span>
                <span className="text-xs text-muted-foreground mt-1">Create listing</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/college/campaigns/create">
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="font-semibold">Create Campaign</span>
                <span className="text-xs text-muted-foreground mt-1">Start fundraising</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Alumni Employment Distribution
            </CardTitle>
            <CardDescription>Current employment status of alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <EmploymentChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New alumni registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Briefcase className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New job posted</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Event created</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Jobs Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage opportunities</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/jobs">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Jobs</span>
              <span className="text-2xl font-bold">{totalJobs}</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/college/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Events Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>Upcoming activities</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/events">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              <span className="text-2xl font-bold">{upcomingEvents}</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/college/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Campaigns Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>Fundraising initiatives</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/events">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="text-2xl font-bold">{activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Raised</span>
              <span className="text-lg font-semibold">${(totalRaised / 1000).toFixed(0)}k</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/college/campaigns/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Newsletters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Newsletters</CardTitle>
            <CardDescription>Latest posts and updates</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/college/newsletters">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/college/newsletters/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentNewsletters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentNewsletters.map((newsletter) => (
                <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
                  {newsletter.coverImage && (
                    <div className="h-32 w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={newsletter.coverImage} 
                        alt={newsletter.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{newsletter.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{newsletter.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(newsletter.publishedOn).toLocaleDateString()}</span>
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link to={`/college/newsletters/${newsletter.id}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No newsletters yet</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/college/newsletters/create">Create Your First Newsletter</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Directory Quick Access */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alumni Directory
            </CardTitle>
            <CardDescription>View and manage all registered alumni</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Total Alumni</p>
                <p className="text-sm text-muted-foreground">Registered members</p>
              </div>
              <div className="text-3xl font-bold">{totalAlumni}</div>
            </div>
            <Button asChild className="w-full">
              <Link to="/college/alumni">View Alumni Directory</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Student Directory
            </CardTitle>
            <CardDescription>View and manage all registered students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Total Students</p>
                <p className="text-sm text-muted-foreground">Active students</p>
              </div>
              <div className="text-3xl font-bold">{totalStudents}</div>
            </div>
            <Button asChild className="w-full">
              <Link to="/college/students">View Student Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollegeDashboardPage;

