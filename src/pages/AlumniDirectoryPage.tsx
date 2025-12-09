import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import type { BackendAlumni, BackendStudent } from "../types/api";
import { domains, type Domain, type Role } from "../lib/domainData";
const PAGE_SIZE = 9;

const AlumniDirectoryPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
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
  const [mentorStatuses, setMentorStatuses] = useState<Record<string, string>>(
    {}
  );
  const [visibleAlumniCount, setVisibleAlumniCount] = useState(PAGE_SIZE);

  const normalizeStatus = (
    status: string | undefined
  ): "active" | "pending" | "" => {
    if (!status) return "";
    const s = status.trim().toLowerCase();
    if (
      [
        "active",
        "accepted",
        "approved",
        "ongoing",
        "on-going",
        "in-progress",
        "in_progress",
        "mentoring",
      ].includes(s)
    ) {
      return "active";
    }
    if (["pending", "requested", "request", "submitted"].includes(s)) {
      return "pending";
    }
    return "";
  };

  // Get domain and role from URL params
  const domainId = searchParams.get("domain");
  const roleId = searchParams.get("role");

  useEffect(() => {
    loadAlumni();
    loadExistingMentorships();
  }, []);
  const loadExistingMentorships = async () => {
    if (!user) return;
    try {
      const response = await mentorshipsAPI.getMy();
      const statusMap: Record<string, string> = {};
      response.mentorships.forEach((m) => {
        const menteeId =
          typeof m.menteeId === "object"
            ? (m.menteeId as BackendStudent | { _id?: string })._id
            : (m.menteeId as string | undefined);
        const mentorId =
          typeof m.mentorId === "object"
            ? (m.mentorId as BackendAlumni | { _id?: string })._id
            : (m.mentorId as string | undefined);
        const status = normalizeStatus(
          typeof m.status === "string" ? m.status : undefined
        );
        if (menteeId === user.id && mentorId && status) {
          const current = statusMap[mentorId];
          // prefer active over pending
          if (current !== "active" || status === "active") {
            statusMap[mentorId] = status;
          }
        }
      });
      setMentorStatuses(statusMap);
    } catch {
      // Non-blocking; keep UI functional even if this fails
    }
  };


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

  // Get relevant skills/keywords from domain and role
  const getRoleKeywords = (
    domainId: string | null,
    roleId: string | null
  ): string[] => {
    if (!domainId || !roleId) return [];

    const domain = domains.find((d: Domain) => d.id === domainId);
    if (!domain) return [];

    const role = domain.roles.find((r: Role) => r.id === roleId);
    if (!role) return [];

    const keywords: string[] = [];

    // Add role title keywords
    const titleWords = role.title.toLowerCase().split(/\s+/);
    keywords.push(...titleWords.filter((word: string) => word.length > 2));

    // Extract skills from roadmap steps
    role.roadmap.forEach((step: { step: string; description: string }) => {
      const stepKeywords = step.description.toLowerCase().split(/[,\s&]+/);
      keywords.push(
        ...stepKeywords.filter(
          (word: string) =>
            word.length > 2 &&
            ![
              "learn",
              "understand",
              "master",
              "build",
              "create",
              "work",
              "focus",
              "handle",
            ].includes(word)
        )
      );
    });

    // Map common keywords to skill names
    const skillMapping: Record<string, string[]> = {
      frontend: [
        "React",
        "Vue.js",
        "Angular",
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
      ],
      backend: [
        "Node.js",
        "Python",
        "Java",
        "Database Management",
        "REST",
        "GraphQL",
        "API Design",
      ],
      fullstack: ["React", "Node.js", "Full Stack", "Full-Stack"],
      ai: [
        "Machine Learning",
        "Data Science",
        "Artificial Intelligence",
        "Python",
      ],
      data: [
        "Data Science",
        "Machine Learning",
        "Database Management",
        "Big Data",
      ],
      devops: ["DevOps", "Docker", "AWS", "Cloud Computing", "CI/CD"],
      cybersecurity: ["Cybersecurity", "Security"],
      cloud: ["Cloud Computing", "AWS", "Azure", "Google Cloud Platform"],
    };

    // Check for keyword matches and add corresponding skills
    const lowerKeywords = keywords.map((k) => k.toLowerCase());
    Object.entries(skillMapping).forEach(([key, skills]) => {
      if (lowerKeywords.some((k) => k.includes(key) || key.includes(k))) {
        keywords.push(...skills);
      }
    });

    return keywords.filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
  };

  const roleKeywords = getRoleKeywords(domainId, roleId);
  const selectedDomain = domainId
    ? domains.find((d: Domain) => d.id === domainId)
    : null;
  const selectedRole =
    selectedDomain && roleId
      ? selectedDomain.roles.find((r: Role) => r.id === roleId)
      : null;

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

    // Domain/Role filtering - if domain and role are provided, filter by matching skills/designation
    let matchesDomainRole = true;
    if (domainId && roleId && roleKeywords.length > 0) {
      const alumniSkills = (alumni.skills || []).map((s: string) =>
        s.toLowerCase()
      );
      const alumniDesignation = (alumni.currentDesignation || "").toLowerCase();
      const alumniCompany = (alumni.currentEmployer || "").toLowerCase();
      const roleTitle = (selectedRole?.title || "").toLowerCase();

      // Check if alumni has matching skills or designation
      const hasMatchingSkill = roleKeywords.some((keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          alumniSkills.some(
            (skill: string) =>
              skill.includes(lowerKeyword) || lowerKeyword.includes(skill)
          ) ||
          alumniDesignation.includes(lowerKeyword) ||
          alumniCompany.includes(lowerKeyword) ||
          roleTitle
            .split(" ")
            .some((word: string) => alumniDesignation.includes(word))
        );
      });

      // Also check if designation contains role title words
      const roleTitleWords = roleTitle
        .split(/\s+/)
        .filter((w: string) => w.length > 2);
      const hasMatchingDesignation = roleTitleWords.some((word: string) =>
        alumniDesignation.includes(word)
      );

      matchesDomainRole = hasMatchingSkill || hasMatchingDesignation;
    }

    return matchesName && matchesSkill && matchesCompany && matchesDomainRole;
  });

  useEffect(() => {
    setVisibleAlumniCount(PAGE_SIZE);
  }, [nameSearch, skillSearch, companySearch, domainId, roleId, filteredAlumni.length]);

  // If domain/role filtering results in no matches, show all alumni (excluding domain/role filter)
  const displayAlumni =
    filteredAlumni.length === 0 &&
    domainId &&
    roleId &&
    nameSearch === "" &&
    skillSearch === "" &&
    companySearch === ""
      ? alumni.filter((alumniItem) => {
          // Name search (case-insensitive)
          const nameSearchLower = nameSearch.toLowerCase();
          const matchesName =
            nameSearch === "" ||
            (alumniItem.name &&
              alumniItem.name.toLowerCase().includes(nameSearchLower));

          // Skill search - check if any skill matches (case-insensitive)
          const skillSearchLower = skillSearch.toLowerCase();
          const matchesSkill =
            skillSearch === "" ||
            (alumniItem.skills &&
              alumniItem.skills.some((skill: string) =>
                skill.toLowerCase().includes(skillSearchLower)
              ));

          // Company search (case-insensitive)
          const companySearchLower = companySearch.toLowerCase();
          const matchesCompany =
            companySearch === "" ||
            (alumniItem.currentEmployer &&
              alumniItem.currentEmployer
                .toLowerCase()
                .includes(companySearchLower));

          return matchesName && matchesSkill && matchesCompany;
        })
      : filteredAlumni;

  // Hide mentors where the student already has an active or pending mentorship
  const visibleAlumni = displayAlumni.filter((alumniItem) => {
    const status = normalizeStatus(mentorStatuses[alumniItem._id]);
    return status !== "active" && status !== "pending";
  });
  const visibleAlumniSlice = visibleAlumni.slice(0, visibleAlumniCount);

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
      const status = normalizeStatus(mentorStatuses[backendAlumni._id]);
      if (status === "pending") {
        setError("You already have a pending mentorship request with this mentor.");
      } else if (status === "active") {
        setError("This mentor is already mentoring you (mentorship is ongoing).");
      } else {
        setError("");
      }
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedAlumni || !user) return;
    const existingStatus = normalizeStatus(mentorStatuses[selectedAlumni._id]);
    if (existingStatus === "pending" || existingStatus === "active") {
      setError(
        existingStatus === "active"
          ? "This mentor is already mentoring you (mentorship is ongoing)."
          : "You already have a pending mentorship request with this mentor."
      );
      return;
    }

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
      setMentorStatuses((prev) => ({
        ...prev,
        [requestData.mentorId]: "pending",
      }));
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center pt-[10vh]">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-[10vh]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Alumni Directory
            {selectedDomain && selectedRole && (
              <span className="text-lg font-normal text-slate-600 dark:text-slate-400 ml-2">
                - {selectedRole.title} in {selectedDomain.title}
              </span>
            )}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {selectedDomain && selectedRole
              ? `Alumni working in ${selectedRole.title} or have related skills. ${filteredAlumni.length > 0 ? `${filteredAlumni.length} matching alumni found.` : `No matching alumni found. Showing all ${displayAlumni.length} available alumni.`}`
              : "Connect with alumni mentors and find guidance for your career journey."}
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
          <div className="lg:col-span-3 space-y-4">
            {visibleAlumniSlice.length > 0 ? (
              <>
                {filteredAlumni.length === 0 && domainId && roleId && (
                  <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
                    <p className="text-sm font-medium">
                      No alumni found matching {selectedRole?.title} in{" "}
                      {selectedDomain?.title}. Showing all available alumni.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visibleAlumniSlice.map((backendAlumni) => {
                    const alumni = transformAlumni(backendAlumni);
                    return (
                      <AlumniProfileCard
                        key={backendAlumni._id}
                        alumni={alumni}
                        onRequestMentorship={handleRequestMentorship}
                        viewerRole={user?.role}
                        mentorshipStatus={mentorStatuses[backendAlumni._id]}
                        isRequesting={
                          submitting && selectedAlumni?._id === backendAlumni._id
                        }
                      />
                    );
                  })}
                </div>
                {visibleAlumniSlice.length < visibleAlumni.length && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setVisibleAlumniCount((count) =>
                          Math.min(count + PAGE_SIZE, visibleAlumni.length)
                        )
                      }
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </>
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
