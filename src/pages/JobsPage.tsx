import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { JobDetails } from "../components/jobs/JobDetails";
import { ApplicationManagement } from "../components/jobs/ApplicationManagement";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { jobsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import type { BackendJob, BackendJobApplication } from "../types/api";
import { JobType } from "../types";
import {
  Plus,
  Search,
  Star,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";

const JobsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [myJobs, setMyJobs] = useState<BackendJob[]>([]);
  const [myApplications, setMyApplications] = useState<BackendJobApplication[]>(
    []
  );
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loadingMyJobs, setLoadingMyJobs] = useState(false);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [salaryMin] = useState<number>(0);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadJobs();
    if (
      user &&
      (user.role === UserRole.Alumni || user.role === UserRole.College)
    ) {
      loadMyJobs();
    }
    if (
      user &&
      (user.role === UserRole.Student || user.role === UserRole.Alumni)
    ) {
      loadMyApplications();
    }
  }, [user]);

  const loadMyApplications = async () => {
    try {
      const applications = await jobsAPI.getMyApplications();
      setMyApplications(applications);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

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

  // Check if user has applied to a job
  const hasApplied = (jobId: string): boolean => {
    if (!user || myApplications.length === 0) return false;
    return myApplications.some((app) => {
      const appJobId =
        typeof app.jobId === "object"
          ? (app.jobId as BackendJob)._id
          : app.jobId;
      return appJobId === jobId;
    });
  };

  // Get experience level from job title/description
  const getExperienceLevel = (job: BackendJob): string => {
    const title = job.title.toLowerCase();
    const desc = job.description.toLowerCase();
    if (
      title.includes("intern") ||
      title.includes("internship") ||
      desc.includes("intern")
    ) {
      return "Entry Level";
    }
    if (
      title.includes("senior") ||
      title.includes("lead") ||
      title.includes("principal") ||
      desc.includes("senior")
    ) {
      return "Senior Level";
    }
    if (
      title.includes("mid") ||
      desc.includes("mid-level") ||
      desc.includes("3+ years") ||
      desc.includes("2+ years")
    ) {
      return "Mid-Senior Level";
    }
    return "Entry Level";
  };

  const filteredJobs = jobs.filter((job) => {
    // Search Filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";
      const company =
        job.postedBy && typeof job.postedBy.posterId === "object"
          ? job.postedBy.posterId.name?.toLowerCase() || ""
          : "";

      if (
        !title.includes(searchLower) &&
        !description.includes(searchLower) &&
        !location.includes(searchLower) &&
        !company.includes(searchLower)
      ) {
        return false;
      }
    }

    // Type Filter
    if (selectedTypes.length > 0) {
      const jobType = mapBackendJobType(job.jobType);
      if (!selectedTypes.includes(jobType)) {
        return false;
      }
    }

    // Location Filter
    if (locationFilter !== "all") {
      const location = job.location?.toLowerCase() || "";
      if (locationFilter === "remote") {
        if (!location.includes("remote")) {
          return false;
        }
      } else {
        if (location.includes("remote")) {
          return false;
        }
      }
    }

    // Experience Filter
    if (experienceFilter !== "all") {
      const experience = getExperienceLevel(job);
      if (experienceFilter === "entry" && experience !== "Entry Level") {
        return false;
      }
      if (experienceFilter === "mid" && experience !== "Mid-Senior Level") {
        return false;
      }
      if (experienceFilter === "senior" && experience !== "Senior Level") {
        return false;
      }
    }

    // Salary Filter (Simple min check)
    if (job.salaryMin && job.salaryMin < salaryMin) {
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

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return "1 week ago";
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  // Get poster name
  const getPosterName = (job: BackendJob): string => {
    if (job.postedBy && typeof job.postedBy.posterId === "object") {
      return job.postedBy.posterId.name || "Company";
    }
    return "Company";
  };

  // Get company logo gradient based on company name
  const getLogoGradient = (companyName: string): string => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-red-500 to-orange-600",
      "from-green-500 to-teal-600",
      "from-indigo-500 to-blue-600",
      "from-pink-500 to-rose-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
    ];
    // Use company name to consistently assign gradient
    const index = companyName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Job Opportunities
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Find your next career opportunity or internship within the alumni
              network
            </p>
          </div>
          {canCreateJobs && (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to={createJobPath}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {canCreateJobs ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="my-jobs">My Posted Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Search and Filters */}
              <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search jobs by title, skill, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>

                    {/* Type Filter */}
                    <Select
                      value={
                        selectedTypes.length === 0 ? "all" : selectedTypes[0]
                      }
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedTypes([]);
                        } else {
                          setSelectedTypes([value as JobType]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Type: All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value={JobType.FullTime}>
                          Full-time
                        </SelectItem>
                        <SelectItem value={JobType.PartTime}>
                          Part-time
                        </SelectItem>
                        <SelectItem value={JobType.Internship}>
                          Internship
                        </SelectItem>
                        <SelectItem value={JobType.Contract}>
                          Contract
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Location Filter */}
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Location: All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Experience Filter */}
                    <Select
                      value={experienceFilter}
                      onValueChange={setExperienceFilter}
                    >
                      <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Experience: All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid-Senior Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Job Listings */}
              <div className="space-y-4">
                {filteredJobs.map((backendJob) => {
                  const posterName = getPosterName(backendJob);
                  const applied = hasApplied(backendJob._id);
                  const experience = getExperienceLevel(backendJob);
                  const jobType = mapBackendJobType(backendJob.jobType);

                  // Get location (handle "Company • Location" format)
                  const locationParts = backendJob.location?.split(" • ") || [];
                  const location =
                    locationParts.length > 1
                      ? locationParts[1]
                      : backendJob.location || "N/A";

                  return (
                    <Card
                      key={backendJob._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div
                            className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getLogoGradient(posterName)} flex items-center justify-center flex-shrink-0 shadow-md`}
                          >
                            <Building2 className="h-8 w-8 text-white" />
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                  {backendJob.title}
                                </h3>
                                <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                                  {posterName}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {backendJob.referral && (
                                  <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-200 border">
                                    <Star className="h-3 w-3 mr-1" />
                                    Alumni Referral
                                  </Badge>
                                )}
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 border">
                                  {jobType}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 border">
                                  {experience}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Posted{" "}
                                  {formatRelativeTime(backendJob.createdAt)}
                                  {backendJob.postedBy &&
                                    typeof backendJob.postedBy.posterId ===
                                    "object" &&
                                    backendJob.postedBy.posterId.name &&
                                    ` by ${backendJob.postedBy.posterId.name}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            {applied ? (
                              <Button
                                disabled
                                className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed min-w-[120px]"
                              >
                                Applied
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleViewDetails(backendJob)}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                              >
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredJobs.length === 0 && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-12 text-center">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        No jobs found
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        {searchQuery ||
                          locationFilter !== "all" ||
                          experienceFilter !== "all"
                          ? "Try adjusting your search or filters."
                          : "No job opportunities available at the moment."}
                      </p>
                    </CardContent>
                  </Card>
                )}
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
                      <div
                        key={backendJob._id}
                        className="border rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {job.title}
                            </h3>
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
          <>
            {/* Search and Filters */}
            <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search jobs by title, skill, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>

                  {/* Type Filter */}
                  <Select
                    value={
                      selectedTypes.length === 0 ? "all" : selectedTypes[0]
                    }
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedTypes([]);
                      } else {
                        setSelectedTypes([value as JobType]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Type: All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value={JobType.FullTime}>
                        Full-time
                      </SelectItem>
                      <SelectItem value={JobType.PartTime}>
                        Part-time
                      </SelectItem>
                      <SelectItem value={JobType.Internship}>
                        Internship
                      </SelectItem>
                      <SelectItem value={JobType.Contract}>Contract</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Location: All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Experience Filter */}
                  <Select
                    value={experienceFilter}
                    onValueChange={setExperienceFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Experience: All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid-Senior Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((backendJob) => {
                const posterName = getPosterName(backendJob);
                const applied = hasApplied(backendJob._id);
                const experience = getExperienceLevel(backendJob);
                const jobType = mapBackendJobType(backendJob.jobType);

                // Get location (handle "Company • Location" format)
                const locationParts = backendJob.location?.split(" • ") || [];
                let location =
                  locationParts.length > 1
                    ? locationParts[1]
                    : backendJob.location || "N/A";
                // Handle "Remote (US)" format
                if (location.toLowerCase().includes("remote")) {
                  location =
                    location.replace(/\(.*?\)/g, "").trim() || "Remote";
                }

                return (
                  <Card
                    key={backendJob._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-8 w-8 text-white" />
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {backendJob.title}
                              </h3>
                              <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                                {posterName}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {backendJob.referral && (
                                <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-200 border">
                                  <Star className="h-3 w-3 mr-1" />
                                  Alumni Referral
                                </Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 border">
                                {jobType}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 border">
                                {experience}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Posted{" "}
                                {formatRelativeTime(backendJob.createdAt)}
                                {backendJob.postedBy &&
                                  typeof backendJob.postedBy.posterId ===
                                  "object" &&
                                  backendJob.postedBy.posterId.name &&
                                  ` by ${backendJob.postedBy.posterId.name}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          {applied ? (
                            <Button
                              disabled
                              className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed min-w-[120px]"
                            >
                              Applied
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleViewDetails(backendJob)}
                              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                            >
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredJobs.length === 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      {searchQuery ||
                        locationFilter !== "all" ||
                        experienceFilter !== "all"
                        ? "Try adjusting your search or filters."
                        : "No job opportunities available at the moment."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        <JobDetails
          job={selectedJob ? transformJob(selectedJob) : null}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </div>
  );
};

export default JobsPage;
