import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import type { BackendJob } from "../../types/api";
import { jobsAPI } from "../../lib/api";
import { ApplicationManagement } from "../../components/jobs/ApplicationManagement";

const CollegeJobApplicationsPage = () => {
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
      setError(err instanceof Error ? err.message : "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1565C0]">
            Job Applications
          </h1>
          <p className="text-[#333333]">
            Review and manage applications for the jobs posted by your college.
          </p>
        </div>

        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[#333333]/60">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-[#333333]/60">No jobs have been posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 space-y-3">
              <Card className="bg-white border-[#1E88E5]/30">
                <CardHeader>
                  <CardTitle className="text-sm text-[#1565C0]">College Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {jobs.map((job) => (
                    <Button
                      key={job._id}
                      variant={
                        selectedJob?._id === job._id ? "default" : "outline"
                      }
                      className={`w-full justify-start text-left ${
                        selectedJob?._id === job._id
                          ? "bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                          : "border-[#1E88E5]/30 text-[#333333] hover:bg-[#E3F2FD] hover:text-[#1565C0]"
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium truncate">
                          {job.title}
                        </span>
                        <span className="text-xs opacity-80 truncate">
                          {job.location}
                        </span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </aside>

            <main className="lg:col-span-3 space-y-4">
              <Card className="bg-white border-[#1E88E5]/30">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1565C0]">
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
    </div>
  );
};

export default CollegeJobApplicationsPage;
