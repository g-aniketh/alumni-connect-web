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
import { collegeAPI } from "../../lib/api";
import type { BackendAlumni } from "../../types/api";
import { Department } from "../../types";
import { Search, CheckCircle2 } from "lucide-react";

const CollegeAlumniPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);
  const [pendingAlumni, setPendingAlumni] = useState<BackendAlumni[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      // Clear any existing data first - ensure no stale data
      setAlumni([]);
      setPendingAlumni([]);

      // Fetch verified alumni linked to this college - real data only
      const alumniData = await collegeAPI.getAllAlumni();

      // Validate response is an array
      if (!Array.isArray(alumniData)) {
        console.error("Invalid API response:", alumniData);
        throw new Error("Invalid response from server: expected array");
      }

      // Ensure we only use real data - filter out any invalid entries
      const validAlumni = alumniData.filter((a: BackendAlumni) => {
        return a && a._id && typeof a._id === "string" && a.name;
      });

      setAlumni(validAlumni);

      // Fetch pending verifications (alumni + students) - real data only
      const pending = await collegeAPI.getPendingVerifications();

      // Validate pending response
      if (pending && Array.isArray(pending.alumni)) {
        const validPending = pending.alumni.filter((a: BackendAlumni) => {
          return a && a._id && typeof a._id === "string" && a.name;
        });
        setPendingAlumni(validPending);
      } else {
        setPendingAlumni([]);
      }
    } catch (err) {
      console.error("Error loading alumni:", err);
      setError(err instanceof Error ? err.message : "Failed to load alumni");
      // Set empty arrays on error - no mock data, no fallback
      setAlumni([]);
      setPendingAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (alumniId: string) => {
    try {
      await collegeAPI.verifyAlumni(alumniId);
      await loadAlumni(); // Reload to move from pending to verified list
      alert("Alumni verified successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to verify alumni");
    }
  };

  const years = Array.from(
    new Set<number>(alumni.map((a) => a.graduationYear))
  ).sort((a, b) => b - a);

  const filteredAlumni = alumni.filter((alumni) => {
    const matchesSearch =
      search === "" ||
      alumni.name.toLowerCase().includes(search.toLowerCase()) ||
      (alumni.currentEmployer &&
        alumni.currentEmployer.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      departmentFilter === "all" || alumni.department === departmentFilter;
    const matchesYear =
      yearFilter === "all" || alumni.graduationYear.toString() === yearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Management</h1>
        <p className="text-muted-foreground">
          Review pending alumni and manage the verified alumni directory for
          your institution.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Pending Verifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Alumni Verifications</h2>
        <p className="text-sm text-muted-foreground">
          These alumni have signed up but are not yet verified. Verify them to
          grant full access.
        </p>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumni</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Company</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAlumni.map((alumni) => (
                <TableRow key={alumni._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={alumni.profilePictureUrl}
                          alt={alumni.name}
                        />
                        <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{alumni.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {alumni.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alumni.graduationYear}</TableCell>
                  <TableCell>{alumni.department}</TableCell>
                  <TableCell>{alumni.currentEmployer || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(alumni._id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pendingAlumni.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-20 text-center text-sm text-muted-foreground"
                  >
                    No pending alumni verifications.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Verified Alumni Directory */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alumni Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search and manage all alumni associated with your college.
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumni</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Company</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumni.map((alumni) => (
                <TableRow key={alumni._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={alumni.profilePictureUrl}
                          alt={alumni.name}
                        />
                        <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{alumni.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {alumni.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alumni.graduationYear}</TableCell>
                  <TableCell>{alumni.department}</TableCell>
                  <TableCell>{alumni.currentEmployer || "N/A"}</TableCell>
                  <TableCell>{alumni.currentDesignation || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        alumni.isVerified
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100"
                      }
                    >
                      {alumni.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!alumni.isVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerify(alumni._id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAlumni.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No alumni found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CollegeAlumniPage;
