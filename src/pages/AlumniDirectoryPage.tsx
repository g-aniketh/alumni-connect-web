import { useState, useEffect } from "react";
import { AlumniProfileCard } from "../components/alumni/AlumniProfileCard";
import { AlumniSearchFilters } from "../components/alumni/AlumniSearchFilters";
import { type Alumni, UserRole } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { mentorshipsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { BackendAlumni } from "../types/api";

const AlumniDirectoryPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<BackendAlumni | null>(
    null
  );
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [areasOfInterest, setAreasOfInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError("");
      // Clear any existing data first - ensure no stale data
      setAlumni([]);

      // Fetch real data from API - no mock data, no fallback
      const mentors = await mentorshipsAPI.getMentors();

      // Validate response is an array
      if (!Array.isArray(mentors)) {
        console.error("Invalid API response:", mentors);
        throw new Error("Invalid response from server: expected array");
      }

      // Ensure we only use real data - filter out any invalid entries
      const validMentors = mentors.filter((a: BackendAlumni) => {
        return a && a._id && typeof a._id === "string" && a.name;
      });

      // Filter out current user if they're an alumni
      const filtered = validMentors.filter(
        (a: BackendAlumni) => a._id !== user?.id
      );

      // Only set data if we have valid results
      setAlumni(filtered);
    } catch (err) {
      console.error("Error loading alumni:", err);
      setError(err instanceof Error ? err.message : "Failed to load alumni");
      // Set empty array on error - no mock data, no fallback
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((alumni) => {
    // Name search (case-insensitive)
    const matchesName =
      nameSearch === "" ||
      (alumni.name &&
        alumni.name.toLowerCase().includes(nameSearch.toLowerCase()));

    // Skill search - check if any skill matches (case-insensitive)
    const matchesSkill =
      skillSearch === "" ||
      (alumni.skills &&
        alumni.skills.some((skill) =>
          skill.toLowerCase().includes(skillSearch.toLowerCase())
        ));

    // Company search (case-insensitive)
    const matchesCompany =
      companySearch === "" ||
      (alumni.currentEmployer &&
        alumni.currentEmployer
          .toLowerCase()
          .includes(companySearch.toLowerCase()));

    return matchesName && matchesSkill && matchesCompany;
  });

  // Transform BackendAlumni to Alumni for the component
  const transformAlumni = (backendAlumni: BackendAlumni): Alumni => {
    return {
      id: backendAlumni._id,
      name: backendAlumni.name,
      email: backendAlumni.email,
      avatar: backendAlumni.profilePictureUrl || "",
      role: UserRole.Alumni,
      isVerified: backendAlumni.isVerified,
      designation: backendAlumni.currentDesignation || "",
      currentEmployer: backendAlumni.currentEmployer || "",
      graduationYear: backendAlumni.graduationYear,
      degree: backendAlumni.degree,
      department:
        backendAlumni.department as unknown as import("../types").Department,
      skills: backendAlumni.skills || [],
      mentorshipAvailable: true, // Available mentors are shown
    };
  };

  const handleRequestMentorship = (alumni: Alumni) => {
    // Find the backend alumni by matching id
    const backendAlumni = filteredAlumni.find((a) => a._id === alumni.id);
    if (backendAlumni) {
      setSelectedAlumni(backendAlumni);
      setIsRequestDialogOpen(true);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedAlumni || !user) return;

    try {
      setSubmitting(true);
      setError("");

      const requestData = {
        mentorId: selectedAlumni._id,
        message: requestMessage.trim() || undefined,
        areasOfInterest: areasOfInterest.trim()
          ? areasOfInterest.split(",").map((a) => a.trim())
          : undefined,
      };

      await mentorshipsAPI.createRequest(requestData);

      setIsRequestDialogOpen(false);
      setSelectedAlumni(null);
      setRequestMessage("");
      setAreasOfInterest("");
      alert("Mentorship request sent successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send mentorship request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setNameSearch("");
    setSkillSearch("");
    setCompanySearch("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading alumni directory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Alumni Directory
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with alumni mentors and find guidance for your career
            journey.
          </p>
        </div>

        {error && !isRequestDialogOpen && (
          <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search & Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <AlumniSearchFilters
                nameSearch={nameSearch}
                onNameSearchChange={setNameSearch}
                skillSearch={skillSearch}
                onSkillSearchChange={setSkillSearch}
                companySearch={companySearch}
                onCompanySearchChange={setCompanySearch}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Alumni Cards Grid */}
          <div className="lg:col-span-3">
            {filteredAlumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAlumni.map((backendAlumni) => {
                  const alumni = transformAlumni(backendAlumni);
                  return (
                    <AlumniProfileCard
                      key={backendAlumni._id}
                      alumni={alumni}
                      onRequestMentorship={handleRequestMentorship}
                      viewerRole={user?.role}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700 rounded-lg p-12">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No alumni found
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mentorship Request Dialog */}
        <Dialog
          open={isRequestDialogOpen}
          onOpenChange={(open) => {
            setIsRequestDialogOpen(open);
            if (!open) {
              setRequestMessage("");
              setAreasOfInterest("");
              setError("");
            }
          }}
        >
          <DialogContent className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">
                Request Mentorship
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                {selectedAlumni && (
                  <>
                    Send a mentorship request to{" "}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {selectedAlumni.name}
                    </strong>{" "}
                    {selectedAlumni.currentEmployer
                      ? `at ${selectedAlumni.currentEmployer}`
                      : ""}
                    .
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {error && (
                <div className="p-3 border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {!user ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please log in as a student to request mentorship.
                </p>
              ) : user.role !== UserRole.Student ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Only students can request mentorship.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-slate-900 dark:text-slate-100"
                    >
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell the mentor why you're interested in their guidance..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      rows={4}
                      className="bg-white dark:bg-gray-700 border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="areasOfInterest"
                      className="text-slate-900 dark:text-slate-100"
                    >
                      Areas of Interest (Optional)
                    </Label>
                    <Textarea
                      id="areasOfInterest"
                      placeholder="e.g., Career guidance, Technical skills, Industry insights (comma-separated)"
                      value={areasOfInterest}
                      onChange={(e) => setAreasOfInterest(e.target.value)}
                      rows={2}
                      className="bg-white dark:bg-gray-700 border-slate-300 dark:border-slate-600"
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Enter areas where you'd like mentorship, separated by
                      commas
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRequestDialogOpen(false);
                  setRequestMessage("");
                  setAreasOfInterest("");
                  setError("");
                }}
                disabled={submitting}
                className="border-slate-300 dark:border-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={!user || user.role !== UserRole.Student || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlumniDirectoryPage;
