import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { JobType } from "../../types";
import { jobsAPI } from "../../lib/api";
import type { BackendJob } from "../../types/api";
import { BackendJobType } from "../../types/api";

const CollegeJobEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [job, setJob] = useState<BackendJob | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    location: string;
    type: JobType;
    salaryMin: string;
    salaryMax: string;
    referralAvailable: boolean;
    requirements: string;
  }>({
    title: "",
    description: "",
    location: "",
    type: JobType.FullTime,
    salaryMin: "",
    salaryMax: "",
    referralAvailable: false,
    requirements: "",
  });

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");
      const jobData = await jobsAPI.getById(id!);
      setJob(jobData);

      // Map backend jobType to frontend JobType
      const typeMap: Record<string, JobType> = {
        full_time: JobType.FullTime,
        part_time: JobType.PartTime,
        contract: JobType.Contract,
        internship: JobType.Internship,
      };

      setFormData({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: typeMap[jobData.jobType] || JobType.FullTime,
        salaryMin: jobData.salaryMin?.toString() || "",
        salaryMax: jobData.salaryMax?.toString() || "",
        referralAvailable: jobData.referral || false,
        requirements: jobData.requirements?.join("\n") || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      // Convert frontend JobType to backend format
      const jobTypeMap: Record<JobType, BackendJobType> = {
        [JobType.FullTime]: BackendJobType.FullTime,
        [JobType.PartTime]: BackendJobType.PartTime,
        [JobType.Contract]: BackendJobType.Contract,
        [JobType.Internship]: BackendJobType.Internship,
      };

      const requirements = formData.requirements
        ? formData.requirements.split("\n").filter((r) => r.trim())
        : [];

      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements,
        location: formData.location,
        jobType: jobTypeMap[formData.type],
        salaryMin: formData.salaryMin
          ? parseFloat(formData.salaryMin)
          : undefined,
        salaryMax: formData.salaryMax
          ? parseFloat(formData.salaryMax)
          : undefined,
        salaryCurrency: "USD",
        referral: formData.referralAvailable,
      };

      await jobsAPI.update(id, jobData);
      alert("Job updated successfully!");
      navigate("/college/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found</p>
          <Button onClick={() => navigate("/college/jobs")} className="mt-4">
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Job Posting</h1>
        <p className="text-muted-foreground">
          Update the details of your job posting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Update the information about the job position.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Intern"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Remote, On Campus"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as JobType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, requirements, and responsibilities..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements (one per line) *
              </Label>
              <Textarea
                id="requirements"
                placeholder="e.g., Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in React and Node.js"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (Annual)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="30000"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salaryMin: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (Annual)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="50000"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salaryMax: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-md bg-blue-50 dark:bg-blue-950">
              <Checkbox
                id="referral"
                checked={formData.referralAvailable}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    referralAvailable: checked === true,
                  }))
                }
              />
              <Label
                htmlFor="referral"
                className="text-sm font-normal cursor-pointer"
              >
                This job is a referral from my company (will be highlighted to
                students)
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/college/jobs")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeJobEditPage;
