import { useState, useEffect, useCallback, useMemo } from "react";
import { AlumniProfileCard } from "../../components/alumni/AlumniProfileCard";
import { AlumniSearchFilters } from "../../components/alumni/AlumniSearchFilters";
import { type Alumni, UserRole } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { mentorshipsAPI, connectionsAPI } from "../../lib/api";
import type { BackendAlumni } from "../../types/api";
import { motion } from "motion/react";
import AlumniNetworkSkeleton from "./AlumniNetworkSkeleton";
import { useDebounce } from "../../hooks/useDebounce";

const PAGE_SIZE = 9;

const AlumniNetworkPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);

  const [nameSearch, setNameSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const debouncedNameSearch = useDebounce(nameSearch, 300);
  const debouncedSkillSearch = useDebounce(skillSearch, 300);
  const debouncedCompanySearch = useDebounce(companySearch, 300);

  const [selectedAlumni, setSelectedAlumni] = useState<BackendAlumni | null>(
    null
  );
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [sentConnectionIds, setSentConnectionIds] = useState<Set<string>>(
    () => new Set()
  );

  const loadAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const mentors = await mentorshipsAPI.getMentors();

      if (!Array.isArray(mentors)) {
        throw new Error("Invalid response from server: expected array");
      }

      const validMentors = mentors.filter(
        (a: BackendAlumni) => a && a._id && typeof a._id === "string" && a.name
      );
      const filtered = validMentors.filter(
        (a: BackendAlumni) => a._id !== user?.id
      );

      setAlumni(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alumni");
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  useEffect(() => {
    setPage(1);
  }, [debouncedNameSearch, debouncedSkillSearch, debouncedCompanySearch]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((alumniItem) => {
      const matchesName =
        debouncedNameSearch === "" ||
        (alumniItem.name &&
          alumniItem.name
            .toLowerCase()
            .includes(debouncedNameSearch.toLowerCase()));

      const matchesSkill =
        debouncedSkillSearch === "" ||
        (alumniItem.skills &&
          alumniItem.skills.some((skill) =>
            skill.toLowerCase().includes(debouncedSkillSearch.toLowerCase())
          ));

      const matchesCompany =
        debouncedCompanySearch === "" ||
        (alumniItem.currentEmployer &&
          alumniItem.currentEmployer
            .toLowerCase()
            .includes(debouncedCompanySearch.toLowerCase()));

      return matchesName && matchesSkill && matchesCompany;
    });
  }, [
    alumni,
    debouncedNameSearch,
    debouncedSkillSearch,
    debouncedCompanySearch,
  ]);

  const { paginatedAlumni, pageCount, currentPage } = useMemo(() => {
    const totalItems = filteredAlumni.length;
    const safePageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(Math.max(page, 1), safePageCount);
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return {
      paginatedAlumni: filteredAlumni.slice(start, end),
      pageCount: safePageCount,
      currentPage: safePage,
    };
  }, [filteredAlumni, page]);

  // Keep page in range and avoid empty slices when filters change
  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const transformAlumni = useCallback(
    (backendAlumni: BackendAlumni): Alumni => {
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
          backendAlumni.department as unknown as import("../../types").Department,
        skills: backendAlumni.skills || [],
        mentorshipAvailable: true,
      };
    },
    []
  );

  const handleConnect = useCallback(
    (alumni: Alumni) => {
      const backendAlumni = filteredAlumni.find((a) => a._id === alumni.id);
      if (backendAlumni) {
        setSelectedAlumni(backendAlumni);
        setIsConnectDialogOpen(true);
      }
    },
    [filteredAlumni]
  );

  const handleSubmitConnect = useCallback(async () => {
    if (!selectedAlumni) return;
    try {
      setConnectingId(selectedAlumni._id);
      await connectionsAPI.sendRequest({
        receiverId: selectedAlumni._id,
        receiverType: "Alumni",
      });
      setSentConnectionIds((prev) => {
        const next = new Set(prev);
        next.add(selectedAlumni._id);
        return next;
      });
      setIsConnectDialogOpen(false);
      setSelectedAlumni(null);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to send connection request"
      );
    } finally {
      setConnectingId(null);
    }
  }, [selectedAlumni]);

  const handleClearFilters = useCallback(() => {
    setNameSearch("");
    setSkillSearch("");
    setCompanySearch("");
  }, []);

  if (loading) {
    return <AlumniNetworkSkeleton />;
  }

  return (
    <div className="bg-[#E3F2FD] min-h-screen pt-[10vh]">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
            Alumni Network
          </h1>
          <p className="text-[#333333] mt-2">
            Connect with fellow alumni, find mentors, and expand your
            professional circle.
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
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

          <main className="lg:col-span-3 space-y-4">
            {filteredAlumni.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  {paginatedAlumni.map((backendAlumni) => {
                    const alumni = transformAlumni(backendAlumni);
                    return (
                      <AlumniProfileCard
                        key={backendAlumni._id}
                        alumni={alumni}
                        onConnect={handleConnect}
                        viewerRole={user?.role}
                        connectPending={sentConnectionIds.has(
                          backendAlumni._id
                        )}
                        connectInFlight={connectingId === backendAlumni._id}
                      />
                    );
                  })}
                </motion.div>
                {pageCount > 1 && (
                  <div className="flex justify-center pt-4">
                    <PaginationControls
                      page={currentPage}
                      pageCount={pageCount}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-lg font-medium mb-2">No Alumni Found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search filters.
                </p>
              </div>
            )}
          </main>
        </div>

        <Dialog
          open={isConnectDialogOpen}
          onOpenChange={setIsConnectDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect with {selectedAlumni?.name}</DialogTitle>
              <DialogDescription>
                A connection request will be sent. They will be notified and can
                accept your request.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsConnectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitConnect}>Send Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

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
    <div className="flex items-center justify-center gap-3 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
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

export default AlumniNetworkPage;
