import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Department, JobType } from '../../types';
import { useNavigate } from 'react-router-dom';

const AlumniJobCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    company: string;
    location: string;
    type: JobType;
    department: Department[];
    salaryMin: string;
    salaryMax: string;
    referralAvailable: boolean;
    applyLink: string;
  }>({
    title: '',
    description: '',
    company: '',
    location: '',
    type: JobType.FullTime,
    department: [],
    salaryMin: '',
    salaryMax: '',
    referralAvailable: false,
    applyLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
      postedBy: 'current-alumni-id', // Would come from auth context
      postedDate: new Date().toISOString().split('T')[0],
    };
    console.log('Job Created:', jobData);
    // In real app, would navigate to jobs list or show success message
    navigate('/jobs');
  };

  const toggleDepartment = (dept: Department) => {
    setFormData(prev => ({
      ...prev,
      department: prev.department.includes(dept)
        ? prev.department.filter(d => d !== dept)
        : [...prev.department, dept]
    }));
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Post a Job Opportunity</h1>
        <p className="text-muted-foreground">
          Share job openings with students and help them find opportunities.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the information about the job position.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Remote, San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as JobType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobType).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, requirements, and responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Target Departments *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-md">
                {Object.values(Department).map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={dept}
                      checked={formData.department.includes(dept)}
                      onCheckedChange={() => toggleDepartment(dept)}
                    />
                    <Label htmlFor={dept} className="text-sm font-normal cursor-pointer">
                      {dept}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (Annual)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="80000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (Annual)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="120000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applyLink">Application Link</Label>
              <Input
                id="applyLink"
                type="url"
                placeholder="https://company.com/careers/apply"
                value={formData.applyLink}
                onChange={(e) => setFormData(prev => ({ ...prev, applyLink: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-md bg-blue-50 dark:bg-blue-950">
              <Checkbox
                id="referral"
                checked={formData.referralAvailable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, referralAvailable: checked === true }))
                }
              />
              <Label htmlFor="referral" className="text-sm font-normal cursor-pointer">
                This job is a referral from my company (will be highlighted to students)
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniJobCreationPage;

