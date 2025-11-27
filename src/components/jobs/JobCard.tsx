import { Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { type Job, JobType } from '../../types';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard = ({ job, onViewDetails }: JobCardProps) => {
  const isAlumniPosted = job.postedBy.startsWith('a'); // Simple check based on ID convention

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold line-clamp-1" title={job.title}>
            {job.title}
          </CardTitle>
          {isAlumniPosted && job.referralAvailable && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 shrink-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Referral
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{job.company}</div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {job.type}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax! / 1000).toFixed(0)}k` : 'Not Disclosed'}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
            {job.department.map(dept => (
                <Badge key={dept} variant="outline" className="text-xs font-normal">
                    {dept}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onViewDetails(job)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

