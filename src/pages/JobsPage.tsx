import { useState } from 'react';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobDetails } from '../components/jobs/JobDetails';
import { mockJobs } from '../data/mockData';
import { type Job, JobType } from '../types';
// Button import removed - not currently used

const JobsPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [locationSearch, setLocationSearch] = useState('');

  const handleTypeChange = (type: JobType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSalaryMin(0);
    setLocationSearch('');
  };

  const filteredJobs = mockJobs.filter(job => {
    // Type Filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) {
      return false;
    }

    // Salary Filter (Simple min check)
    if (job.salaryMin && job.salaryMin < salaryMin) {
        return false;
    }

    // Location Filter
    if (locationSearch && !job.location.toLowerCase().includes(locationSearch.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Jobs & Internships</h1>
        <p className="text-muted-foreground">
          Find your next career opportunity or internship within the alumni network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <JobFilters
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            salaryRange={[salaryMin, 200000]} // Only controlling min for now
            onSalaryChange={(range) => setSalaryMin(range[0])}
            locationSearch={locationSearch}
            onLocationChange={setLocationSearch}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Job Grid */}
        <div className="lg:col-span-3">
            {/* Mobile Filter Toggle could go here */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                <JobCard 
                    key={job.id} 
                    job={job} 
                    onViewDetails={handleViewDetails} 
                />
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No jobs found matching your criteria.
                </div>
            )}
        </div>
      </div>

      <JobDetails 
        job={selectedJob} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
      />
    </div>
  );
};

export default JobsPage;

