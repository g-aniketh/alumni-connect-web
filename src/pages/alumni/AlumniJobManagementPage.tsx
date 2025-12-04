import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { jobsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { BackendJob } from '../../types/api';
import { JobType } from '../../types';
import { Edit2, Trash2, Briefcase, Calendar, MapPin, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlumniJobManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [jobToDelete, setJobToDelete] = useState<BackendJob | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const myJobs = await jobsAPI.getMyPosted();
      setJobs(myJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      await jobsAPI.delete(jobToDelete._id);
      await loadJobs();
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      alert('Job deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const mapBackendJobType = (backendType: string): JobType => {
    const typeMap: Record<string, JobType> = {
      'full_time': JobType.FullTime,
      'part_time': JobType.PartTime,
      'contract': JobType.Contract,
      'internship': JobType.Internship,
    };
    return typeMap[backendType] || JobType.FullTime;
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Job Postings</h1>
          <p className="text-muted-foreground">
            Manage your job postings, view applications, and update job details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/alumni/jobs/create">
              <Briefcase className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/alumni/jobs/applications">View Applications</Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No jobs posted yet</p>
              <p className="text-sm mb-4">Start by posting your first job opportunity.</p>
              <Button asChild>
                <Link to="/alumni/jobs/create">Post Your First Job</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const posterName = typeof job.postedBy.posterId === 'object' 
                  ? job.postedBy.posterId.name 
                  : 'Company';
                
                return (
                  <TableRow key={job._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{posterName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapBackendJobType(job.jobType)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/alumni/jobs/applications?jobId=${job._id}`}
                        className="text-primary hover:underline"
                      >
                        {job.totalApplications || 0} applications
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/alumni/jobs/edit/${job._id}`)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setJobToDelete(job);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/jobs?jobId=${job._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone
              and will also delete all associated applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setJobToDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniJobManagementPage;
