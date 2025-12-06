import { useState, useEffect } from 'react';
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
import { Button } from '../../components/ui/button';
import { jobsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { BackendJobApplication, BackendJob } from '../../types/api';
import { Calendar, Building2, MapPin, X } from 'lucide-react';

const StudentApplicationsPage = () => {
  useAuth(); // For future use
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const myApplications = await jobsAPI.getMyApplications();
      setApplications(myApplications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      await jobsAPI.withdrawApplication(applicationId);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw application');
    }
  };

  // Filter applications by status
  const studentApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase().replace(' ', '_');
  });


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'offered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return '';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {studentApplications.length === 0 ? (
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
            {['applied', 'under_review', 'interview_scheduled', 'offered', 'rejected'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter(status)}
              >
                {formatStatus(status)}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentApplications.map((app) => {
                  const job = typeof app.jobId === 'object' ? app.jobId as BackendJob : null;
                  const posterName = job && typeof job.postedBy.posterId === 'object' 
                    ? job.postedBy.posterId.name 
                    : job ? 'Company' : 'N/A';
                  
                  return (
                    <TableRow key={app._id}>
                      <TableCell>
                        <div className="font-medium">
                          {job?.title || 'Job Not Found'}
                        </div>
                        {job?.referral && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Alumni Referral
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {posterName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {job?.location || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(app.status)}
                        >
                          {formatStatus(app.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(app.status === 'applied' || app.status === 'under_review') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWithdraw(app._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;

