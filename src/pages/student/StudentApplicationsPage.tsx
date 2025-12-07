import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { jobsAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type { BackendJobApplication, BackendJob } from "../../types/api";
import {
  Calendar,
  Building2,
  MapPin,
  X,
  Search,
  ArrowRight,
  Briefcase,
  Palette,
  Code,
  Database,
  Search as SearchIcon,
  Terminal,
} from "lucide-react";

const StudentApplicationsPage = () => {
  useAuth(); // For future use
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const myApplications = await jobsAPI.getMyApplications();
      setApplications(myApplications);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    try {
      await jobsAPI.withdrawApplication(applicationId);
      await loadApplications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to withdraw application"
      );
    }
  };

  // Get job icon based on title/type
  const getJobIcon = (title: string, jobType?: string) => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("design") ||
      lowerTitle.includes("ui") ||
      lowerTitle.includes("ux") ||
      lowerTitle.includes("product design")
    ) {
      return Palette;
    }
    if (
      lowerTitle.includes("frontend") ||
      lowerTitle.includes("front-end") ||
      lowerTitle.includes("developer")
    ) {
      return Code;
    }
    if (
      lowerTitle.includes("data") ||
      lowerTitle.includes("analyst") ||
      lowerTitle.includes("science")
    ) {
      return Database;
    }
    if (lowerTitle.includes("researcher") || lowerTitle.includes("research")) {
      return SearchIcon;
    }
    if (lowerTitle.includes("engineer") || lowerTitle.includes("software")) {
      return Terminal;
    }
    return Briefcase;
  };

  // Get job icon color
  const getJobIconColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("design") ||
      lowerTitle.includes("ui") ||
      lowerTitle.includes("ux") ||
      lowerTitle.includes("product design")
    ) {
      return "text-pink-500";
    }
    if (
      lowerTitle.includes("frontend") ||
      lowerTitle.includes("front-end") ||
      lowerTitle.includes("developer")
    ) {
      return "text-blue-500";
    }
    if (
      lowerTitle.includes("data") ||
      lowerTitle.includes("analyst") ||
      lowerTitle.includes("science")
    ) {
      return "text-green-500";
    }
    if (lowerTitle.includes("researcher") || lowerTitle.includes("research")) {
      return "text-orange-500";
    }
    if (lowerTitle.includes("engineer") || lowerTitle.includes("software")) {
      return "text-blue-600";
    }
    return "text-blue-500";
  };

  // Filter and sort applications
  const filteredAndSortedApplications = applications
    .filter((app) => {
      // Status filter
      if (statusFilter !== "all") {
        if (
          app.status.toLowerCase() !==
          statusFilter.toLowerCase().replace(" ", "_")
        ) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const job =
          typeof app.jobId === "object" ? (app.jobId as BackendJob) : null;
        const searchLower = searchQuery.toLowerCase();
        const jobTitle = job?.title?.toLowerCase() || "";
        const company =
          job && job.postedBy && typeof job.postedBy.posterId === "object"
            ? job.postedBy.posterId.name?.toLowerCase() || ""
            : "";
        const location = job?.location?.toLowerCase() || "";

        if (
          !jobTitle.includes(searchLower) &&
          !company.includes(searchLower) &&
          !location.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (dateFilter === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200";
      case "interview_scheduled":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200";
      case "offered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      applied: "Applied",
      under_review: "Under Review",
      interview_scheduled: "Interviewing",
      offered: "Offered",
      rejected: "Rejected",
    };
    return (
      statusMap[status.toLowerCase()] ||
      status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              My Applications
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Track the status of your job applications
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">
                    Interviewing
                  </SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Date: Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredAndSortedApplications.length === 0 ? (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                No Applications Found
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                {searchQuery || statusFilter !== "all"
                  ? "No applications match your filters. Try adjusting your search or filters."
                  : "You haven't applied to any jobs yet. Start browsing available positions!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a href="/jobs">Browse Jobs →</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-slate-200 dark:border-slate-700">
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        JOB DETAILS
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        LOCATION
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        DATE APPLIED
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        STATUS
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        ACTION
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedApplications.map((app) => {
                      const job =
                        typeof app.jobId === "object"
                          ? (app.jobId as BackendJob)
                          : null;

                      if (!job || !job.title) return null;

                      const posterName =
                        job &&
                        job.postedBy &&
                        typeof job.postedBy.posterId === "object"
                          ? job.postedBy.posterId.name
                          : "Company";

                      const JobIcon = getJobIcon(job.title, job.jobType);
                      const iconColor = getJobIconColor(job.title);

                      // Get icon background color
                      const getIconBgColor = (title: string) => {
                        const lowerTitle = title.toLowerCase();
                        if (
                          lowerTitle.includes("design") ||
                          lowerTitle.includes("ui") ||
                          lowerTitle.includes("ux") ||
                          lowerTitle.includes("product design")
                        ) {
                          return "bg-pink-50 dark:bg-pink-950";
                        }
                        if (
                          lowerTitle.includes("frontend") ||
                          lowerTitle.includes("front-end") ||
                          lowerTitle.includes("developer")
                        ) {
                          return "bg-blue-50 dark:bg-blue-950";
                        }
                        if (
                          lowerTitle.includes("data") ||
                          lowerTitle.includes("analyst") ||
                          lowerTitle.includes("science")
                        ) {
                          return "bg-green-50 dark:bg-green-950";
                        }
                        if (
                          lowerTitle.includes("researcher") ||
                          lowerTitle.includes("research")
                        ) {
                          return "bg-orange-50 dark:bg-orange-950";
                        }
                        if (
                          lowerTitle.includes("engineer") ||
                          lowerTitle.includes("software")
                        ) {
                          return "bg-blue-50 dark:bg-blue-950";
                        }
                        return "bg-blue-50 dark:bg-blue-950";
                      };

                      // Format date
                      const appliedDate = new Date(app.createdAt);
                      const formattedDate = appliedDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      );

                      // Get location (handle "Company • Location" format)
                      const locationParts = job.location?.split(" • ") || [];
                      const location =
                        locationParts.length > 1
                          ? locationParts[1]
                          : job.location || "N/A";

                      return (
                        <TableRow
                          key={app._id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border-b border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={`${iconColor} p-2 rounded-lg ${getIconBgColor(job.title)}`}
                              >
                                <JobIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                  {job.title}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  at {posterName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-slate-700 dark:text-slate-300">
                              {location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-slate-700 dark:text-slate-300">
                              {formattedDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(app.status)} border font-medium`}
                            >
                              {formatStatus(app.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="hover:bg-blue-100 dark:hover:bg-blue-900"
                            >
                              <a href={`/jobs/${job._id}`}>
                                <ArrowRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentApplicationsPage;
