import { useState } from 'react';
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
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { type Job, JobApplicationStatus } from '../../types';
import { Briefcase, MapPin, DollarSign, Calendar, Building2, Upload, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetails = ({ job, open, onOpenChange }: JobDetailsProps) => {
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeFile: null as File | null,
    resumeFileName: '',
  });
  
  if (!job) return null;

  const handleApply = () => {
    if (user && user.role === UserRole.Student) {
      setShowApplicationForm(true);
    } else if (job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData(prev => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name,
      }));
    }
  };

  const handleSubmitApplication = () => {
    if (user && user.role === UserRole.Student) {
      const submissionData = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        studentId: user.id,
        appliedOn: new Date().toISOString().split('T')[0],
        status: JobApplicationStatus.Applied,
        coverLetter: applicationData.coverLetter,
        resumeFileName: applicationData.resumeFileName,
      };
      console.log('Job Application Submitted:', submissionData);
      // In real app, would upload resume and submit to API
      setShowApplicationForm(false);
      setApplicationData({ coverLetter: '', resumeFile: null, resumeFileName: '' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setShowApplicationForm(false);
        setApplicationData({ coverLetter: '', resumeFile: null, resumeFileName: '' });
      }
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {!showApplicationForm ? (
          <>
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
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Submit your application for this position at {job.company}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume / CV *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="resume"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                  >
                    <Upload className="h-4 w-4" />
                    {applicationData.resumeFileName || 'Upload Resume'}
                  </Label>
                  {applicationData.resumeFileName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {applicationData.resumeFileName}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Add a personalized cover letter to stand out
                </p>
              </div>

              {job.referralAvailable && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Referral Available:</strong> This position has an alumni referral. Your application will be highlighted.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowApplicationForm(false);
                  setApplicationData({ coverLetter: '', resumeFile: null, resumeFileName: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={!applicationData.resumeFile}
              >
                Submit Application
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

