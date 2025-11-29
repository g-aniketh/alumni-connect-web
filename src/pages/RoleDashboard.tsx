import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  FileText,
  GraduationCap,
  Plus
} from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Manage your career journey.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alumni Directory
            </CardTitle>
            <CardDescription>Connect with alumni mentors</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/student/alumni">View Alumni</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs & Applications
            </CardTitle>
            <CardDescription>Browse jobs and track applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/student/applications">My Applications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>Register for upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/events">View Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Campaigns
            </CardTitle>
            <CardDescription>Support fundraising initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/events">View Campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AlumniDashboard = () => {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Dashboard</h1>
        <p className="text-muted-foreground">Stay connected and give back to your alma mater.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alumni Network
            </CardTitle>
            <CardDescription>Connect with fellow alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/alumni/network">View Alumni</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Students
            </CardTitle>
            <CardDescription>View students and mentorship requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/alumni/students">View Students</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs
            </CardTitle>
            <CardDescription>Browse and post job opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/alumni/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>View and create events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View Events</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/alumni/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Campaigns
            </CardTitle>
            <CardDescription>Support fundraising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/events">View Campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CollegeDashboard = () => {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">College Dashboard</h1>
        <p className="text-muted-foreground">Manage your institution's alumni network.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alumni Directory
            </CardTitle>
            <CardDescription>View all registered alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/college/alumni">View Alumni</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Students
            </CardTitle>
            <CardDescription>Manage student records</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/college/students">View Students</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs
            </CardTitle>
            <CardDescription>Post and manage job listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/jobs">View Jobs</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/college/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>Create and manage events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View Events</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/college/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Campaigns
            </CardTitle>
            <CardDescription>Manage fundraising campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View Campaigns</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/college/campaigns/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Newsletters
            </CardTitle>
            <CardDescription>Post newsletters and blog updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/college/newsletters">View Newsletters</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/college/newsletters/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  switch (user.role) {
    case UserRole.Student:
      return <StudentDashboard />;
    case UserRole.Alumni:
      return <AlumniDashboard />;
    case UserRole.College:
      return <CollegeDashboard />;
    default:
      return null;
  }
};

export default RoleDashboard;

