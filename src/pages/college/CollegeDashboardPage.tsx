import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  GraduationCap,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  ArrowRight,
  BarChart3,
  Activity,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collegeAPI, jobsAPI, eventsAPI, campaignsAPI } from '../../lib/api';
import { EmploymentChart } from '../../components/dashboard/EmploymentChart';

const CollegeDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({
    totalAlumni: 0,
    verifiedAlumni: 0,
    totalStudents: 0,
    verifiedStudents: 0,
    totalJobs: 0,
    totalEvents: 0,
    totalCampaigns: 0,
    totalRaised: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load stats from backend
      const statsData = await collegeAPI.getStats();
      
      // Map backend response to frontend format
      // Backend returns: alumniCount, alumniVerifiedCount, studentCount, studentsVerifiedCount
      const mappedStats = {
        totalAlumni: statsData.alumniCount || 0,
        verifiedAlumni: statsData.alumniVerifiedCount || 0,
        totalStudents: statsData.studentCount || 0,
        verifiedStudents: statsData.studentsVerifiedCount || 0,
        totalJobs: 0,
        totalEvents: 0,
        totalCampaigns: 0,
        totalRaised: 0,
      };

      // Fetch additional stats
      try {
        // Get jobs count
        const jobsResponse = await jobsAPI.getFiltered({ by: 'college' });
        const jobsArray = Array.isArray(jobsResponse)
          ? jobsResponse
          : (jobsResponse as { jobs?: unknown[] }).jobs ?? [];
        mappedStats.totalJobs = jobsArray.length;
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }

      try {
        // Get events count
        const eventsResponse = await eventsAPI.getFiltered({ by: 'college' });
        const eventsArray = Array.isArray(eventsResponse)
          ? eventsResponse
          : (eventsResponse as { events?: unknown[] }).events ?? [];
        mappedStats.totalEvents = eventsArray.length;

        // Get upcoming events count
        const upcomingResponse = await eventsAPI.getFiltered({ upcoming: true });
        const upcomingArray = Array.isArray(upcomingResponse)
          ? upcomingResponse
          : (upcomingResponse as { events?: unknown[] }).events ?? [];
        setUpcomingEvents(upcomingArray.length);
      } catch (err) {
        console.error('Failed to load events:', err);
      }

      try {
        // Get campaigns and calculate totalRaised
        const campaigns = await campaignsAPI.getMyCampaigns();
        mappedStats.totalCampaigns = campaigns.length;

        // Calculate total raised from all campaigns
        mappedStats.totalRaised = campaigns.reduce((sum: number, campaign) => {
          return sum + (campaign.totalRaised ?? 0);
        }, 0);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      }

      setStats(mappedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Alumni',
      value: stats.totalAlumni,
      description: `${stats.verifiedAlumni} verified`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      link: '/college/alumni',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      description: `${stats.verifiedStudents} verified`,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      link: '/college/students',
    },
    {
      title: 'Job Postings',
      value: stats.totalJobs,
      description: 'Active opportunities',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      link: '/jobs',
    },
    {
      title: 'Funds Raised',
      value: (() => {
        const raised = stats.totalRaised || 0;
        if (raised === 0) return '$0';
        if (raised < 1000) return `$${raised}`;
        return `$${(raised / 1000).toFixed(0)}k`;
      })(),
      description: 'From campaigns',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      link: '/events',
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
        <h1 className="text-3xl font-bold tracking-tight">College Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Manage your institution's alumni network and activities.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
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
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/college/bulk-import">
                <Upload className="h-5 w-5 mb-2" />
                <span className="font-semibold">Bulk Import</span>
                <span className="text-xs text-muted-foreground mt-1">Import students/alumni</span>
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
              <span className="text-2xl font-bold">{stats.totalJobs}</span>
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
              <span className="text-2xl font-bold">{stats.totalCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Raised</span>
              <span className="text-lg font-semibold">
                {(() => {
                  const raised = stats.totalRaised || 0;
                  if (raised === 0) return '$0';
                  if (raised < 1000) return `$${raised}`;
                  return `$${(raised / 1000).toFixed(0)}k`;
                })()}
              </span>
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
                <p className="text-sm text-muted-foreground">{stats.verifiedAlumni} verified</p>
              </div>
              <div className="text-3xl font-bold">{stats.totalAlumni}</div>
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
                <p className="text-sm text-muted-foreground">{stats.verifiedStudents} verified</p>
              </div>
              <div className="text-3xl font-bold">{stats.totalStudents}</div>
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

