import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { jobsAPI } from "../../lib/api";
import type { BackendJob } from "../../types/api";
import { JobType } from "../../types";
import { JobDetails } from "../../components/jobs/JobDetails";
import {
  Edit2,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Eye,
  Plus,
  Building2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CollegeJobManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [allJobs, setAllJobs] = useState<BackendJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<BackendJob[]>([]);
  const [filterBy, setFilterBy] = useState<"all" | "college" | "alumni">("all");
  const [jobToDelete, setJobToDelete] = useState<BackendJob | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    // Apply filter whenever filterBy or allJobs changes
    if (filterBy === "all") {
      setFilteredJobs(allJobs);
    } else if (filterBy === "college") {
      setFilteredJobs(
        allJobs.filter((job) => job.postedBy.posterType === "College")
      );
    } else if (filterBy === "alumni") {
      setFilteredJobs(
        allJobs.filter((job) => job.postedBy.posterType === "Alumni")
      );
    }
  }, [filterBy, allJobs]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch all jobs (college + alumni) for comprehensive view
      const response = await jobsAPI.getFiltered({ by: "all" });
      const jobsList = Array.isArray(response)
        ? response
        : ((response as { jobs?: BackendJob[] }).jobs ?? []);
      setAllJobs(jobsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
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
      alert("Job deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setDeleting(false);
    }
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

  const handleViewJobDetails = (job: BackendJob) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const mapBackendJobType = (backendType: string): JobType => {
    const typeMap: Record<string, JobType> = {
      full_time: JobType.FullTime,
      part_time: JobType.PartTime,
      contract: JobType.Contract,
      internship: JobType.Internship,
    };
    return typeMap[backendType] || JobType.FullTime;
  };

  if (loading) {
    return (
      <div className="container pt-[10vh] pb-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD] pt-[10vh]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#1565C0]">
              Job Postings Management
            </h1>
            <p className="text-[#333333]">
              Manage all job postings from your college and alumni network. View
              applications and update job details.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              asChild
              className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
            >
              <Link to="/college/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#1E88E5]/30 text-[#1565C0] hover:bg-[#E3F2FD]"
            >
              <Link to="/college/jobs/applications">View Applications</Link>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <Card className="bg-white border-[#1E88E5]/30">
          <CardContent className="pt-6">
            <Tabs
              value={filterBy}
              onValueChange={(value) =>
                setFilterBy(value as "all" | "college" | "alumni")
              }
            >
              <TabsList className="grid w-full grid-cols-3 bg-[#E3F2FD]">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
                >
                  All Jobs ({allJobs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="college"
                  className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  College Jobs (
                  {
                    allJobs.filter((j) => j.postedBy.posterType === "College")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="alumni"
                  className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Alumni Jobs (
                  {
                    allJobs.filter((j) => j.postedBy.posterType === "Alumni")
                      .length
                  }
                  )
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {filteredJobs.length === 0 ? (
          <Card className="bg-white border-[#1E88E5]/30">
            <CardContent className="py-12">
              <div className="text-center text-[#333333]/60">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#1E88E5]" />
                <p className="text-lg font-medium mb-2 text-[#1565C0]">
                  No jobs posted yet
                </p>
                <p className="text-sm mb-4">
                  Start by posting your first job opportunity.
                </p>
                <Button
                  asChild
                  className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                >
                  <Link to="/college/jobs/create">Post Your First Job</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border border-[#1E88E5]/20 bg-white">
            <Table>
              <TableHeader className="bg-[#E3F2FD]">
                <TableRow className="border-[#1E88E5]/20 hover:bg-[#E3F2FD]/80">
                  <TableHead className="text-[#1565C0]">Job Title</TableHead>
                  <TableHead className="text-[#1565C0]">Posted By</TableHead>
                  <TableHead className="text-[#1565C0]">Type</TableHead>
                  <TableHead className="text-[#1565C0]">Location</TableHead>
                  <TableHead className="text-[#1565C0]">Applications</TableHead>
                  <TableHead className="text-[#1565C0]">Posted Date</TableHead>
                  <TableHead className="text-[#1565C0]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => {
                  const posterName =
                    typeof job.postedBy.posterId === "object"
                      ? job.postedBy.posterId.name
                      : "Company";

                  return (
                    <TableRow
                      key={job._id}
                      className="border-[#1E88E5]/10 hover:bg-[#E3F2FD]/30 cursor-pointer"
                      onClick={() => handleViewJobDetails(job)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-[#1565C0]">
                            {job.title}
                          </div>
                          <div className="text-sm text-[#333333]/70">
                            {posterName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {job.postedBy.posterType === "Alumni" ? (
                            <>
                              <Badge
                                variant="outline"
                                className="border-green-300 text-green-700 bg-green-50"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                Alumni
                              </Badge>
                              {job.referral && (
                                <Badge
                                  variant="outline"
                                  className="border-purple-300 text-purple-700 bg-purple-50"
                                >
                                  Referral
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-blue-700 bg-blue-50"
                            >
                              <Building2 className="h-3 w-3 mr-1" />
                              College
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-[#1E88E5]/30 text-[#1565C0] bg-[#E3F2FD]"
                        >
                          {mapBackendJobType(job.jobType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-[#333333]">
                          <MapPin className="h-3 w-3 text-[#1E88E5]" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/college/jobs/applications?jobId=${job._id}`}
                          className="text-[#1E88E5] hover:underline font-medium"
                        >
                          {job.totalApplications || 0} applications
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-[#333333]/70">
                          <Calendar className="h-3 w-3 text-[#1E88E5]" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Only show edit/delete for college's own jobs */}
                          {job.postedBy.posterType === "College" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#1E88E5] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                                onClick={() =>
                                  navigate(`/college/jobs/edit/${job._id}`)
                                }
                                title="Edit Job"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setJobToDelete(job);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Delete Job"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#1E88E5] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                            onClick={() => handleViewJobDetails(job)}
                            title="View Job Details"
                          >
                            <Eye className="h-4 w-4" />
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
                Are you sure you want to delete "{jobToDelete?.title}"? This
                action cannot be undone and will also delete all associated
                applications.
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
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <JobDetails
          job={selectedJob ? transformJob(selectedJob) : null}
          open={isJobDetailsOpen}
          onOpenChange={setIsJobDetailsOpen}
        />
      </div>
    </div>
  );
};

export default CollegeJobManagementPage;
