import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { type Job, JobApplicationStatus } from '../../types';
import { Briefcase, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetails = ({ job, open, onOpenChange }: JobDetailsProps) => {
  const { user } = useAuth();
  
  if (!job) return null;

  const handleApply = () => {
    if (user && user.role === UserRole.Student) {
      const applicationData = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        studentId: user.id,
        appliedDate: new Date().toISOString().split('T')[0],
        status: JobApplicationStatus.Applied,
        resumeUrl: '', // Would be uploaded in real app
        coverLetter: '', // Would be filled in real app
      };
      console.log('Job Application Submitted:', applicationData);
      // In real app, would navigate to applications page or show success message
      onOpenChange(false);
    } else if (job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <DialogDescription className="text-base mt-1 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {job.company}
              </DialogDescription>
            </div>
            {job.referralAvailable && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Referral Available
                </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {job.type}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              {job.salaryMin ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax?.toLocaleString()}` : 'Competitive'}
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Posted: {new Date(job.postedDate).toLocaleDateString()}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

           <div className="space-y-3">
            <h3 className="font-semibold text-lg">Target Departments</h3>
             <div className="flex flex-wrap gap-2">
                {job.department.map(dept => (
                    <Badge key={dept} variant="outline">{dept}</Badge>
                ))}
             </div>
          </div>
        </div>

        <DialogFooter>
          {user && user.role === UserRole.Student ? (
            <Button className="w-full sm:w-auto" onClick={handleApply}>
              Apply Now
            </Button>
          ) : job.applyLink ? (
            <Button className="w-full sm:w-auto" asChild>
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          ) : (
            <Button className="w-full sm:w-auto" disabled>
              Apply Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

