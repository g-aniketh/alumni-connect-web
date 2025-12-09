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
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { collegeAPI } from "../../lib/api";
import type { BackendAlumni } from "../../types/api";
import { Department } from "../../types";
import { Search, CheckCircle2, Users } from "lucide-react";
import { motion } from "motion/react";
import CollegeAlumniPageSkeleton from "./CollegeAlumniPageSkeleton";
const PAGE_SIZE = 10;

const CollegeAlumniPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);
  const [pendingAlumni, setPendingAlumni] = useState<BackendAlumni[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAlumni();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, departmentFilter, yearFilter]);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError("");
      setAlumni([]);
      setPendingAlumni([]);

      const alumniData = await collegeAPI.getAllAlumni();
      if (!Array.isArray(alumniData))
        throw new Error("Invalid response from server");
      const validAlumni = alumniData.filter(
        (a: BackendAlumni) => a && a._id && a.name
      );
      setAlumni(validAlumni);

      const pending = await collegeAPI.getPendingVerifications();
      if (pending && Array.isArray(pending.alumni)) {
        const validPending = pending.alumni.filter(
          (a: BackendAlumni) => a && a._id && a.name
        );
        setPendingAlumni(validPending);
      } else {
        setPendingAlumni([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alumni");
      setAlumni([]);
      setPendingAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (alumniId: string) => {
    try {
      await collegeAPI.verifyAlumni(alumniId);
      await loadAlumni();
      alert("Alumni verified successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to verify alumni");
    }
  };

  const years = Array.from(
    new Set<number>(alumni.map((a) => a.graduationYear))
  ).sort((a, b) => b - a);

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      search === "" ||
      alumnus.name.toLowerCase().includes(search.toLowerCase()) ||
      (alumnus.currentEmployer &&
        alumnus.currentEmployer.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      departmentFilter === "all" || alumnus.department === departmentFilter;
    const matchesYear =
      yearFilter === "all" || alumnus.graduationYear.toString() === yearFilter;
    return matchesSearch && matchesDept && matchesYear;
  });

  const pageCount = Math.max(1, Math.ceil(filteredAlumni.length / PAGE_SIZE));
  const paginatedAlumni = filteredAlumni.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return <CollegeAlumniPageSkeleton />;
  }

  return (
    <div className="bg-[#E3F2FD] min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
            Alumni Management
          </h1>
          <p className="text-[#333333] mt-2">
            Verify new alumni and manage your institution's directory.
          </p>
        </motion.div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white border-[#1E88E5]/30">
            <CardHeader>
              <CardTitle className="text-[#1565C0]">Pending Verifications</CardTitle>
              <CardDescription className="text-[#333333]/80">
                These alumni are awaiting verification to get full access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAlumni.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingAlumni.map((alumnus) => (
                    <PendingAlumniCard
                      key={alumnus._id}
                      alumnus={alumnus}
                      onVerify={handleVerify}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No pending alumni verifications." />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white border-[#1E88E5]/30">
            <CardHeader>
              <CardTitle className="text-[#1565C0]">Alumni Directory</CardTitle>
              <CardDescription className="text-[#333333]/80">
                Search and manage all verified alumni.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1E88E5]" />
                  <Input
                    placeholder="Search by name or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-[#1E88E5]/30 focus:border-[#1E88E5] focus:ring-[#1E88E5]"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] border-[#1E88E5]/30">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {Object.values(Department).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] border-[#1E88E5]/30">
                      <SelectValue placeholder="Graduation Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border border-[#1E88E5]/20">
                <Table>
                  <TableHeader className="bg-[#E3F2FD]">
                    <TableRow className="border-[#1E88E5]/20 hover:bg-[#E3F2FD]/80">
                      <TableHead className="text-[#1565C0]">Alumni</TableHead>
                      <TableHead className="text-[#1565C0]">Batch</TableHead>
                      <TableHead className="text-[#1565C0]">Department</TableHead>
                      <TableHead className="text-[#1565C0]">Current Role</TableHead>
                      <TableHead className="text-[#1565C0]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAlumni.map((alumnus) => (
                      <TableRow key={alumnus._id} className="border-[#1E88E5]/10 hover:bg-[#E3F2FD]/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-[#E3F2FD]">
                              <AvatarImage
                                src={alumnus.profilePictureUrl}
                                alt={alumnus.name}
                              />
                              <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">
                                {alumnus.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-[#1565C0]">{alumnus.name}</div>
                              <div className="text-sm text-[#333333]/70">
                                {alumnus.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#333333]">{alumnus.graduationYear}</TableCell>
                        <TableCell className="text-[#333333]">{alumnus.department}</TableCell>
                        <TableCell className="text-[#333333]">
                          {alumnus.currentDesignation || "N/A"} @{" "}
                          {alumnus.currentEmployer || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              alumnus.isVerified ? "default" : "secondary"
                            }
                            className={
                              alumnus.isVerified
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {alumnus.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAlumni.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-[#333333]/60">
                          No alumni found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

type PendingAlumniCardProps = {
  alumnus: BackendAlumni;
  onVerify: (id: string) => void;
};

const PendingAlumniCard = ({ alumnus, onVerify }: PendingAlumniCardProps) => (
  <Card className="bg-white border-[#1E88E5]/30 hover:shadow-md transition-all">
    <CardHeader>
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-[#E3F2FD]">
          <AvatarImage src={alumnus.profilePictureUrl} alt={alumnus.name} />
          <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">{alumnus.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base text-[#1565C0]">{alumnus.name}</CardTitle>
          <CardDescription className="text-[#333333]/80">{alumnus.email}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="text-sm space-y-1 text-[#333333]">
      <p>
        <strong className="text-[#1565C0]">Batch:</strong> {alumnus.graduationYear}
      </p>
      <p>
        <strong className="text-[#1565C0]">Department:</strong> {alumnus.department}
      </p>
      <p>
        <strong className="text-[#1565C0]">Company:</strong> {alumnus.currentEmployer || "N/A"}
      </p>
    </CardContent>
    <CardFooter>
      <Button
        size="sm"
        className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white"
        onClick={() => onVerify(alumnus._id)}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Verify
      </Button>
    </CardFooter>
  </Card>
);

type EmptyStateProps = { message: string };

const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="text-center py-12 text-[#333333]/60">
    <Users className="h-10 w-10 mx-auto text-[#1E88E5]/40 mb-2" />
    {message}
  </div>
);

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
    <div className="flex items-center justify-end gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
        className="border-[#1E88E5]/30 text-[#1565C0] hover:bg-[#E3F2FD]"
      >
        Previous
      </Button>
      <span className="text-sm text-[#333333]/80">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(page + 1)}
        className="border-[#1E88E5]/30 text-[#1565C0] hover:bg-[#E3F2FD]"
      >
        Next
      </Button>
    </div>
  );
};

export default CollegeAlumniPage;
