import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import type { BackendJob } from "../../types/api";
import { jobsAPI } from "../../lib/api";
import { ApplicationManagement } from "../../components/jobs/ApplicationManagement";

const AlumniJobApplicationsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<BackendJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await jobsAPI.getMyPosted();
      setJobs(data);
      setSelectedJob((prev) => prev ?? data[0] ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your jobs",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Job Applications
        </h1>
        <p className="text-muted-foreground">
          Review and manage applications for the jobs you have posted.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted-foreground">
          You have not posted any jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Your Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {jobs.map((job) => (
                  <Button
                    key={job._id}
                    variant={
                      selectedJob?._id === job._id ? "default" : "outline"
                    }
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium truncate">
                        {job.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {job.location}
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedJob ? selectedJob.title : "Select a job"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationManagement job={selectedJob} />
              </CardContent>
            </Card>
          </main>
        </div>
      )}
    </div>
  );
};

export default AlumniJobApplicationsPage;


