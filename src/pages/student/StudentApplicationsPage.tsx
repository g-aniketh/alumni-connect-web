import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { mockJobs, mockJobApplications } from '../../data/mockData';
import { JobApplicationStatus } from '../../types';
import { Calendar, Building2, MapPin } from 'lucide-react';

const StudentApplicationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get applications for current student (in real app, would filter by studentId from auth)
  const studentApplications = mockJobApplications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });


  const getStatusColor = (status: JobApplicationStatus) => {
    switch (status) {
      case JobApplicationStatus.Applied:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case JobApplicationStatus.UnderReview:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case JobApplicationStatus.Interviewing:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case JobApplicationStatus.Rejected:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case JobApplicationStatus.Offered:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return '';
    }
  };

  // Get job details for each application
  const applicationsWithJobs = studentApplications.map((app) => {
    const job = mockJobs.find((j) => j.id === app.jobId);
    return { ...app, job };
  });

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications.
        </p>
      </div>

      {applicationsWithJobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>
              You haven't applied to any jobs yet. Start browsing available positions!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/jobs" className="text-primary hover:underline">
              Browse Jobs →
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Badge>
            {Object.values(JobApplicationStatus).map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Badge>
            ))}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationsWithJobs.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">
                        {app.job?.title || 'Job Not Found'}
                      </div>
                      {app.job?.referralAvailable && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Alumni Referral
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {app.job?.company || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {app.job?.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(app.appliedOn).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(app.status)}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;

