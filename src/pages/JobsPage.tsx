import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { JobDetails } from "../components/jobs/JobDetails";
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
import { jobsAPI, recommendationsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import type { BackendJob, BackendJobApplication } from "../types/api";
import type { JobEligibilityResult } from "../lib/api";
import { JobType } from "../types";
import {
  Plus,
  Search,
  Star,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import JobsPageSkeleton from "./JobsPageSkeleton";
import type React from "react";

const PAGE_SIZE = 6;
const MY_JOBS_PAGE_SIZE = 5;

const JobsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [error, setError] = useState<string>("");
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [jobEligibilityMap, setJobEligibilityMap] = useState<
    Map<string, JobEligibilityResult>
  >(new Map());
  const [myJobs, setMyJobs] = useState<BackendJob[]>([]);
  const [myApplications, setMyApplications] = useState<BackendJobApplication[]>(
    []
  );
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortByRelevance, setSortByRelevance] = useState(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [myJobsPage, setMyJobsPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, locationFilter, typeFilter, sortByRelevance]);

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
      const response = await jobsAPI.getFiltered({ available: true });
      const jobsList = Array.isArray(response)
        ? response
        : (response.jobs ?? []);
      setJobs(jobsList);

      // For students and alumni, load job eligibility scores for sorting
      if (
        user &&
        (user.role === UserRole.Student || user.role === UserRole.Alumni) &&
        jobsList.length > 0
      ) {
        await loadJobEligibility(jobsList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const loadJobEligibility = async (jobsList: BackendJob[]) => {
    if (jobsList.length === 0) return;

    try {
      setLoadingEligibility(true);
      const jobIds = jobsList.map((job) => job._id);

      // Check eligibility in batches if there are too many jobs (API might have limits)
      const batchSize = 20;
      const batches: string[][] = [];
      for (let i = 0; i < jobIds.length; i += batchSize) {
        batches.push(jobIds.slice(i, i + batchSize));
      }

      const eligibilityMap = new Map<string, JobEligibilityResult>();

      // Process batches sequentially to avoid overwhelming the API
      for (const batch of batches) {
        try {
          const eligibilityResponse =
            await recommendationsAPI.checkJobEligibility(batch);

          eligibilityResponse.results.forEach((result) => {
            eligibilityMap.set(result.job_id, result);
          });
        } catch (err) {
          // Silently fail for individual batches, continue with others
          console.warn("Failed to check eligibility for job batch:", err);
        }
      }

      setJobEligibilityMap(eligibilityMap);
    } catch (err) {
      // Silently fail - eligibility checking is optional
      console.warn("Failed to load job eligibility:", err);
    } finally {
      setLoadingEligibility(false);
    }
  };

  const loadMyJobs = async () => {
    try {
      const myPostedJobs = await jobsAPI.getMyPosted();
      setMyJobs(myPostedJobs);
    } catch (err) {
      console.error("Failed to load my jobs:", err);
    }
  };

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

  const filteredJobs = jobs
    .filter((job) => {
      const searchLower = searchQuery.toLowerCase();
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";
      const company =
        job.postedBy && typeof job.postedBy.posterId === "object"
          ? job.postedBy.posterId.name?.toLowerCase() || ""
          : "";

      return (
        (title.includes(searchLower) ||
          description.includes(searchLower) ||
          location.includes(searchLower) ||
          company.includes(searchLower)) &&
        (locationFilter
          ? location.includes(locationFilter.toLowerCase())
          : true) &&
        (typeFilter !== "all"
          ? job.jobType.toLowerCase() === typeFilter.toLowerCase()
          : true)
      );
    })
    .sort((a, b) => {
      // Only sort by relevance for students and alumni when enabled
      if (
        sortByRelevance &&
        (user?.role === UserRole.Student || user?.role === UserRole.Alumni)
      ) {
        const eligibilityA = jobEligibilityMap.get(a._id);
        const eligibilityB = jobEligibilityMap.get(b._id);

        // Jobs with eligibility scores come first, sorted by score (highest first)
        if (eligibilityA && eligibilityB) {
          return (
            eligibilityB.eligibility_percent - eligibilityA.eligibility_percent
          );
        }
        if (eligibilityA) return -1; // A has score, B doesn't
        if (eligibilityB) return 1; // B has score, A doesn't
      }

      // Default: sort by most recent
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalMyJobPages = Math.max(
    1,
    Math.ceil(myJobs.length / MY_JOBS_PAGE_SIZE)
  );
  const paginatedMyJobs = myJobs.slice(
    (myJobsPage - 1) * MY_JOBS_PAGE_SIZE,
    myJobsPage * MY_JOBS_PAGE_SIZE
  );

  const handleViewDetails = (job: BackendJob) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

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
      type: backendJob.jobType as JobType,
      salaryMin: backendJob.salaryMin,
      salaryMax: backendJob.salaryMax,
      department: [],
      referralAvailable: backendJob.referral || false,
      postedDate: backendJob.createdAt,
      postedBy: backendJob.postedBy.posterType,
      applyLink: undefined,
    };
  };

  if (loading) {
    return <JobsPageSkeleton />;
  }

  const canCreateJobs =
    user && (user.role === UserRole.Alumni || user.role === UserRole.College);
  const createJobPath =
    user?.role === UserRole.Alumni
      ? "/alumni/jobs/create"
      : "/college/jobs/create";

  return (
    <div className="bg-[#E3F2FD] min-h-screen">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
              Job Opportunities
            </h1>
            <p className="text-[#333333] mt-2">
              Find your next career move within our exclusive network.
            </p>
          </div>
          {canCreateJobs && (
            <Button
              asChild
              className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
            >
              <Link to={createJobPath}>
                <Plus className="h-4 w-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          )}
        </motion.div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {canCreateJobs && (
            <TabsList className="bg-white/80 backdrop-blur-sm border border-[#1E88E5]/20">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
              >
                All Jobs
              </TabsTrigger>
              <TabsTrigger
                value="my-jobs"
                className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
              >
                My Posted Jobs
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="all" className="mt-6">
            <Card className="mb-6 border-[#1E88E5]/30 shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1E88E5]" />
                    <Input
                      placeholder="Search by title, skill, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-[#E3F2FD] focus:border-[#1E88E5] focus:ring-[#1E88E5]"
                    />
                  </div>
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full md:w-[200px] border-[#E3F2FD] focus:border-[#1E88E5] focus:ring-[#1E88E5]"
                  />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px] border-[#E3F2FD]">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent className="border-[#E3F2FD]">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-Time">Full-time</SelectItem>
                      <SelectItem value="Part-Time">Part-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  {(user?.role === UserRole.Student ||
                    user?.role === UserRole.Alumni) && (
                    <Button
                      variant={sortByRelevance ? "default" : "outline"}
                      onClick={() => setSortByRelevance(!sortByRelevance)}
                      className={
                        sortByRelevance
                          ? "bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                          : ""
                      }
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {sortByRelevance ? "By Relevance" : "By Date"}
                    </Button>
                  )}
                </div>
                {loadingEligibility && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#1E88E5]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Calculating job matches...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filteredJobs.length > 0 ? (
                <>
                  {paginatedJobs.map((job) => (
                    <JobListItem
                      key={job._id}
                      job={job}
                      onSelect={handleViewDetails}
                      hasApplied={hasApplied(job._id)}
                      eligibility={jobEligibilityMap.get(job._id)}
                    />
                  ))}
                  <PaginationControls
                    page={page}
                    pageCount={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyState
                  message="No jobs found matching your criteria."
                  icon={<Briefcase className="w-12 h-12 text-gray-400" />}
                />
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="my-jobs" className="mt-6">
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {myJobs.length > 0 ? (
                <>
                  {paginatedMyJobs.map((job) => (
                    <MyJobListItem
                      key={job._id}
                      job={job}
                      userRole={user?.role}
                      onSelect={handleViewDetails}
                    />
                  ))}
                  <PaginationControls
                    page={myJobsPage}
                    pageCount={totalMyJobPages}
                    onPageChange={setMyJobsPage}
                  />
                </>
              ) : (
                <EmptyState
                  message="You haven't posted any jobs yet."
                  cta={{ text: "Post a Job", link: createJobPath }}
                  icon={<Briefcase className="w-12 h-12 text-gray-400" />}
                />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        <JobDetails
          job={selectedJob ? transformJob(selectedJob) : null}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          hasApplied={
            selectedJob ? hasApplied(selectedJob._id) : false
          }
        />
      </div>
    </div>
  );
};

type JobListItemProps = {
  job: BackendJob;
  onSelect: (job: BackendJob) => void;
  hasApplied: boolean;
  eligibility?: JobEligibilityResult;
};

const JobListItem = ({
  job,
  onSelect,
  hasApplied,
  eligibility,
}: JobListItemProps) => {
  const getMatchScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-300";
    if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-300";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
    >
      <Card
        className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-[#1E88E5]/30 hover:scale-[1.02]"
        onClick={() => onSelect(job)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#E3F2FD] flex items-center justify-center shrink-0 border border-[#1E88E5]/20">
            <Building2 className="h-6 w-6 text-[#1E88E5]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1565C0]">{job.title}</h3>
            <p className="text-sm text-[#333333]">
              {typeof job.postedBy.posterId === "object"
                ? job.postedBy.posterId.name
                : "Company"}{" "}
              • {job.location}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-[#333333]/80 flex-wrap">
              {eligibility && (
                <Badge
                  variant="outline"
                  className={`${getMatchScoreColor(
                    eligibility.eligibility_percent
                  )} border font-semibold`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {eligibility.eligibility_percent.toFixed(1)}% match
                </Badge>
              )}
            <Badge
              variant="outline"
              className="border-[#1E88E5]/30 text-[#1565C0] bg-[#E3F2FD]"
            >
              {job.jobType}
            </Badge>
            {job.referral && (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <Star className="h-3 w-3 mr-1" />
                Referral
              </Badge>
            )}
          </div>
          <div className="w-28 text-right">
            {hasApplied ? (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                Applied
              </Badge>
            ) : (
              <Button className="bg-[#1E88E5] hover:bg-[#1565C0] text-white">
                Apply
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

type MyJobListItemProps = {
  job: BackendJob;
  userRole?: string;
  onSelect: (job: BackendJob) => void;
};

const MyJobListItem = ({ job, userRole, onSelect }: MyJobListItemProps) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
  >
    <Card
      className="bg-white border-[#1E88E5]/30 hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02]"
      onClick={() => onSelect(job)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#E3F2FD] flex items-center justify-center shrink-0 border border-[#1E88E5]/20">
          <Briefcase className="h-6 w-6 text-[#1E88E5]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#1565C0]">{job.title}</h3>
          <p className="text-sm text-[#333333]">
            {job.jobType} • {job.location}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-[#1E88E5]" />
          <span className="font-semibold text-[#1565C0]">
            {job.totalApplications}
          </span>
          <span className="text-[#333333]/80">Applicants</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-[#1E88E5]/30 text-[#1565C0] hover:bg-[#E3F2FD]"
          >
            <Link
              to={
                userRole === UserRole.Alumni
                  ? `/alumni/jobs/edit/${job._id}`
                  : `/college/jobs/edit/${job._id}`
              }
            >
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-[#1E88E5]/30 text-[#1565C0] hover:bg-[#E3F2FD]"
          >
            <Link
              to={
                userRole === UserRole.Alumni
                  ? `/alumni/jobs/applications?jobId=${job._id}`
                  : `/college/jobs/applications?jobId=${job._id}`
              }
            >
              Applications
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

type EmptyStateProps = {
  message: string;
  cta?: { text: string; link: string };
  icon?: React.ReactNode;
};

const EmptyState = ({ message, cta, icon }: EmptyStateProps) => (
  <div className="text-center py-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
    {icon}
    <p className="mt-4 font-medium">{message}</p>
    {cta && (
      <Button asChild className="mt-4">
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

type PaginationControlsProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({
  page,
  pageCount,
  onPageChange,
}: PaginationControlsProps) => {
  const canPrev = page > 1;
  const canNext = page < pageCount;
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default JobsPage;
