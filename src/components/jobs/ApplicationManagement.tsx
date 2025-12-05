import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type {
  BackendJob,
  BackendJobApplication,
  BackendStudent,
  BackendAlumni,
} from "../../types/api";
import { jobsAPI } from "../../lib/api";

interface ApplicationManagementProps {
  job: BackendJob | null;
}

const statusOptions = [
  "applied",
  "under_review",
  "interviewing",
  "offered",
  "rejected",
] as const;

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const getStatusVariant = (
  status: string
): "default" | "secondary" | "outline" => {
  switch (status.toLowerCase()) {
    case "applied":
      return "secondary";
    case "under_review":
      return "outline";
    case "interviewing":
      return "default";
    case "offered":
      return "default";
    case "rejected":
      return "outline";
    default:
      return "outline";
  }
};

export const ApplicationManagement = ({ job }: ApplicationManagementProps) => {
  const [applications, setApplications] = useState<BackendJobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedApplication, setSelectedApplication] =
    useState<BackendJobApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (job?._id) {
      void loadApplications(job._id);
    } else {
      setApplications([]);
    }
  }, [job?._id]);

  const loadApplications = async (jobId: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await jobsAPI.getJobApplications(jobId);
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    status: (typeof statusOptions)[number]
  ) => {
    try {
      setError("");
      await jobsAPI.updateApplicationStatus(applicationId, status);
      if (job?._id) {
        await loadApplications(job._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const openDetails = (application: BackendJobApplication) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };

  const getApplicant = (
    application: BackendJobApplication
  ): BackendStudent | BackendAlumni | null => {
    if (typeof application.applicantId === "object") {
      return application.applicantId as BackendStudent | BackendAlumni;
    }
    return null;
  };

  if (!job) {
    return (
      <p className="text-sm text-muted-foreground">
        Select a job to view its applications.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading applications...</p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No applications have been submitted for this job yet.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map(app => {
                const applicant = getApplicant(app);
                return (
                  <TableRow key={app._id}>
                    <TableCell>{applicant?.name ?? "Applicant"}</TableCell>
                    <TableCell>{applicant?.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(app.status)}>
                        {formatStatus(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      {statusOptions.map(status => (
                        <Button
                          key={status}
                          size="sm"
                          variant={
                            app.status.toLowerCase() === status
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            void handleStatusChange(app._id, status)
                          }
                        >
                          {formatStatus(status)}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDetails(app)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Applicant
                </p>
                <p className="text-sm">
                  {getApplicant(selectedApplication)?.name ?? "Applicant"}
                </p>
              </div>
              <Separator />
              {selectedApplication.message && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Message
                  </p>
                  <p className="text-sm whitespace-pre-line">
                    {selectedApplication.message}
                  </p>
                </div>
              )}
              {selectedApplication.resumeUrl && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Resume
                  </p>
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline"
                  >
                    View resume
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
