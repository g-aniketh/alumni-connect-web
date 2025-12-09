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
import type { BackendStudent } from "../../types/api";
import { Department } from "../../types";
import { Search, CheckCircle2, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import CollegeStudentsPageSkeleton from "./CollegeStudentsPageSkeleton";
const PAGE_SIZE = 10;

const CollegeStudentsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [students, setStudents] = useState<BackendStudent[]>([]);
  const [pendingStudents, setPendingStudents] = useState<BackendStudent[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, departmentFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const studentsData = await collegeAPI.getAllStudents();
      setStudents(studentsData);

      const pending = await collegeAPI.getPendingVerifications();
      setPendingStudents(pending.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (studentId: string) => {
    try {
      await collegeAPI.verifyStudent(studentId);
      await loadStudents();
      alert("Student verified successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to verify student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      search === "" ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || student.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return <CollegeStudentsPageSkeleton />;
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
            Student Management
          </h1>
          <p className="text-[#333333] mt-2">
            Verify new students and manage your institution's directory.
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
              <CardTitle className="text-[#1565C0]">
                Pending Verifications
              </CardTitle>
              <CardDescription className="text-[#333333]/80">
                These students are awaiting verification to get full access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingStudents.map((student) => (
                    <PendingStudentCard
                      key={student._id}
                      student={student}
                      onVerify={handleVerify}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No pending student verifications." />
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
              <CardTitle className="text-[#1565C0]">
                Student Directory
              </CardTitle>
              <CardDescription className="text-[#333333]/80">
                Search and manage all verified students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1E88E5]" />
                  <Input
                    placeholder="Search by name or roll number..."
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
                </div>
              </div>
              <div className="rounded-md border border-[#1E88E5]/20">
                <Table>
                  <TableHeader className="bg-[#E3F2FD]">
                    <TableRow className="border-[#1E88E5]/20 hover:bg-[#E3F2FD]/80">
                      <TableHead className="text-[#1565C0]">Student</TableHead>
                      <TableHead className="text-[#1565C0]">
                        Roll Number
                      </TableHead>
                      <TableHead className="text-[#1565C0]">
                        Department
                      </TableHead>
                      <TableHead className="text-[#1565C0]">Batch</TableHead>
                      <TableHead className="text-[#1565C0]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student) => (
                      <TableRow
                        key={student._id}
                        className="border-[#1E88E5]/10 hover:bg-[#E3F2FD]/30 cursor-pointer"
                        onClick={() => {
                          if (student._id) {
                            navigate(`/college/students/${student._id}`);
                          }
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-[#E3F2FD]">
                              <AvatarImage
                                src={student.profilePictureUrl}
                                alt={student.name}
                              />
                              <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-[#1565C0]">
                                {student.name}
                              </div>
                              <div className="text-sm text-[#333333]/70">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#333333]">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="text-[#333333]">
                          {student.department}
                        </TableCell>
                        <TableCell className="text-[#333333]">
                          {student.graduationYear}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.isVerified ? "default" : "secondary"
                            }
                            className={
                              student.isVerified
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {student.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-[#333333]/60"
                        >
                          No students found.
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

type PendingStudentCardProps = {
  student: BackendStudent;
  onVerify: (id: string) => void;
};

const PendingStudentCard = ({ student, onVerify }: PendingStudentCardProps) => (
  <Card className="bg-white border-[#1E88E5]/30 hover:shadow-md transition-all">
    <CardHeader>
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-[#E3F2FD]">
          <AvatarImage src={student.profilePictureUrl} alt={student.name} />
          <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">
            {student.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base text-[#1565C0]">
            {student.name}
          </CardTitle>
          <CardDescription className="text-[#333333]/80">
            {student.email}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="text-sm space-y-1 text-[#333333]">
      <p>
        <strong className="text-[#1565C0]">Roll No:</strong>{" "}
        {student.rollNumber}
      </p>
      <p>
        <strong className="text-[#1565C0]">Department:</strong>{" "}
        {student.department}
      </p>
      <p>
        <strong className="text-[#1565C0]">Batch:</strong>{" "}
        {student.graduationYear}
      </p>
    </CardContent>
    <CardFooter>
      <Button
        size="sm"
        className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white"
        disabled={!student._id}
        onClick={() => {
          if (student._id) {
            onVerify(student._id);
          }
        }}
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
    <GraduationCap className="h-10 w-10 mx-auto text-[#1E88E5]/40 mb-2" />
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

export default CollegeStudentsPage;
