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
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { jobsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import type { BackendJob, BackendJobApplication } from "../types/api";
import { JobType } from "../types";
import { Plus, Search, Star, Briefcase, Users, Building2 } from "lucide-react";
import { motion } from "motion/react";
import JobsPageSkeleton from "./JobsPageSkeleton";
import type React from "react";

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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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
      const response = await jobsAPI.getFiltered({ available: true });
      const jobsList = Array.isArray(response)
        ? response
        : (response.jobs ?? []);
      setJobs(jobsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
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

  const filteredJobs = jobs.filter((job) => {
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
  });

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
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Job Opportunities
            </h1>
            <p className="text-gray-500 mt-2">
              Find your next career move within our exclusive network.
            </p>
          </div>
          {canCreateJobs && (
            <Button asChild>
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
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="my-jobs">My Posted Jobs</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="all" className="mt-6">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, skill, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full md:w-[200px]"
                  />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-Time">Full-time</SelectItem>
                      <SelectItem value="Part-Time">Part-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                filteredJobs.map((job) => (
                  <JobListItem
                    key={job._id}
                    job={job}
                    onSelect={handleViewDetails}
                    hasApplied={hasApplied(job._id)}
                  />
                ))
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
                myJobs.map((job) => (
                  <MyJobListItem
                    key={job._id}
                    job={job}
                    userRole={user?.role}
                  />
                ))
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
        />
      </div>
    </div>
  );
};

type JobListItemProps = {
  job: BackendJob;
  onSelect: (job: BackendJob) => void;
  hasApplied: boolean;
};

const JobListItem = ({ job, onSelect, hasApplied }: JobListItemProps) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
  >
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(job)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="h-6 w-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {typeof job.postedBy.posterId === "object"
              ? job.postedBy.posterId.name
              : "Company"}{" "}
            • {job.location}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 hidden md:flex">
          <Badge variant="outline">{job.jobType}</Badge>
          {job.referral && (
            <Badge className="bg-green-100 text-green-800">
              <Star className="h-3 w-3 mr-1" />
              Referral
            </Badge>
          )}
        </div>
        <div className="w-24 text-right">
          {hasApplied ? (
            <Button variant="outline" disabled>
              Applied
            </Button>
          ) : (
            <Button>Apply</Button>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

type MyJobListItemProps = {
  job: BackendJob;
  userRole?: string;
};

const MyJobListItem = ({ job, userRole }: MyJobListItemProps) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
  >
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Briefcase className="h-6 w-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.jobType} • {job.location}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">{job.totalApplications}</span>
          <span className="text-gray-500">Applicants</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
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
          <Button variant="outline" size="sm" asChild>
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

export default JobsPage;
