import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { JobCard } from "../components/jobs/JobCard";
import { JobFilters } from "../components/jobs/JobFilters";
import { JobDetails } from "../components/jobs/JobDetails";
import { ApplicationManagement } from "../components/jobs/ApplicationManagement";
import { Button } from "../components/ui/button";
import { jobsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import type { BackendJob } from "../types/api";
import { JobType } from "../types";
import { Plus } from "lucide-react";

const JobsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [myJobs, setMyJobs] = useState<BackendJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loadingMyJobs, setLoadingMyJobs] = useState(false);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    loadJobs();
    if (
      user &&
      (user.role === UserRole.Alumni || user.role === UserRole.College)
    ) {
      loadMyJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      // If user is authenticated, get filtered jobs (college context)
      // Otherwise, get all public jobs
      if (user) {
        const response = await jobsAPI.getFiltered({ available: true });
        const jobsList = Array.isArray(response)
          ? response
          : ((response as { jobs?: typeof jobs }).jobs ?? []);
        setJobs(jobsList);
      } else {
        const allJobs = await jobsAPI.getAll();
        setJobs(allJobs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const loadMyJobs = async () => {
    try {
      setLoadingMyJobs(true);
      const myPostedJobs = await jobsAPI.getMyPosted();
      setMyJobs(myPostedJobs);
    } catch (err) {
      console.error("Failed to load my jobs:", err);
    } finally {
      setLoadingMyJobs(false);
    }
  };

  const handleTypeChange = (type: JobType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSalaryMin(0);
    setLocationSearch("");
  };

  // Map backend jobType to frontend JobType for filtering
  const mapBackendJobType = (backendType: string): JobType => {
    const typeMap: Record<string, JobType> = {
      full_time: JobType.FullTime,
      part_time: JobType.PartTime,
      contract: JobType.Contract,
      internship: JobType.Internship,
    };
    return typeMap[backendType] || JobType.FullTime;
  };

  const filteredJobs = jobs.filter((job) => {
    // Type Filter
    if (selectedTypes.length > 0) {
      const jobType = mapBackendJobType(job.jobType);
      if (!selectedTypes.includes(jobType)) {
        return false;
      }
    }

    // Salary Filter (Simple min check)
    if (job.salaryMin && job.salaryMin < salaryMin) {
      return false;
    }

    // Location Filter
    if (
      locationSearch &&
      !job.location.toLowerCase().includes(locationSearch.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleViewDetails = (job: BackendJob) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  // Transform BackendJob to Job for components
  const transformJob = (backendJob: BackendJob) => {
    const posterName =
      typeof backendJob.postedBy.posterId === "object"
        ? backendJob.postedBy.posterId.name
        : "Company";

    return {
      id: backendJob._id,
      title: backendJob.title,
      description: backendJob.description,
      company: posterName,
      location: backendJob.location,
      type: mapBackendJobType(backendJob.jobType),
      salaryMin: backendJob.salaryMin,
      salaryMax: backendJob.salaryMax,
      department: [], // Backend doesn't have department array, it's in requirements
      referralAvailable: backendJob.referral || false,
      postedDate: backendJob.createdAt,
      postedBy: backendJob.postedBy.posterType,
      applyLink: undefined, // Not in backend model
    };
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

  const canCreateJobs =
    user && (user.role === UserRole.Alumni || user.role === UserRole.College);
  const createJobPath =
    user?.role === UserRole.Alumni
      ? "/alumni/jobs/create"
      : "/college/jobs/create";

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Jobs & Internships
            </h1>
            <p className="text-muted-foreground">
              Find your next career opportunity or internship within the alumni
              network.
            </p>
          </div>
          {canCreateJobs && (
            <Button asChild>
              <Link to={createJobPath}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {canCreateJobs ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Posted Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <aside className="hidden lg:block lg:col-span-1">
                <JobFilters
                  selectedTypes={selectedTypes}
                  onTypeChange={handleTypeChange}
                  salaryRange={[salaryMin, 200000]}
                  onSalaryChange={(range) => setSalaryMin(range[0])}
                  locationSearch={locationSearch}
                  onLocationChange={setLocationSearch}
                  onClearFilters={handleClearFilters}
                />
              </aside>

              {/* Job Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((backendJob) => {
                    const job = transformJob(backendJob);
                    return (
                      <JobCard
                        key={backendJob._id}
                        job={job}
                        onViewDetails={() => handleViewDetails(backendJob)}
                      />
                    );
                  })}
                </div>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No jobs found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-jobs" className="mt-6">
            {loadingMyJobs ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading your jobs...
              </div>
            ) : myJobs.length > 0 ? (
              <div className="space-y-6">
                {myJobs.map((backendJob) => {
                  const job = transformJob(backendJob);
                  return (
                    <div key={backendJob._id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link
                              to={
                                user?.role === UserRole.Alumni
                                  ? `/alumni/jobs/edit/${backendJob._id}`
                                  : `/college/jobs/edit/${backendJob._id}`
                              }
                            >
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link
                              to={
                                user?.role === UserRole.Alumni
                                  ? `/alumni/jobs/applications?jobId=${backendJob._id}`
                                  : `/college/jobs/applications?jobId=${backendJob._id}`
                              }
                            >
                              View Applications
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <ApplicationManagement job={backendJob} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium mb-2">No jobs posted yet</p>
                <p className="text-sm mb-4">
                  Start by creating your first job posting
                </p>
                <Button asChild>
                  <Link to={createJobPath}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <JobFilters
              selectedTypes={selectedTypes}
              onTypeChange={handleTypeChange}
              salaryRange={[salaryMin, 200000]}
              onSalaryChange={(range) => setSalaryMin(range[0])}
              locationSearch={locationSearch}
              onLocationChange={setLocationSearch}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Job Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((backendJob) => {
                const job = transformJob(backendJob);
                return (
                  <JobCard
                    key={backendJob._id}
                    job={job}
                    onViewDetails={() => handleViewDetails(backendJob)}
                  />
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No jobs found matching your criteria.
              </div>
            )}
          </div>
        </div>
      )}

      <JobDetails
        job={selectedJob ? transformJob(selectedJob) : null}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default JobsPage;
