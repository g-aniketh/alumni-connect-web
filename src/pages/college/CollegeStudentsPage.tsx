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
import CollegeStudentsPageSkeleton from "./CollegeStudentsPageSkeleton";

const CollegeStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [students, setStudents] = useState<BackendStudent[]>([]);
  const [pendingStudents, setPendingStudents] = useState<BackendStudent[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    loadStudents();
  }, []);

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

  if (loading) {
    return <CollegeStudentsPageSkeleton />;
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Student Management
          </h1>
          <p className="text-gray-500 mt-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>
                Search and manage all verified students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or roll number..."
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
                    <SelectTrigger className="w-full sm:w-[180px]">
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={student.profilePictureUrl}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>{student.graduationYear}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.isVerified ? "default" : "secondary"
                            }
                            className={
                              student.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {student.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={student.profilePictureUrl} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{student.name}</CardTitle>
          <CardDescription>{student.email}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="text-sm space-y-1">
      <p>
        <strong>Roll No:</strong> {student.rollNumber}
      </p>
      <p>
        <strong>Department:</strong> {student.department}
      </p>
      <p>
        <strong>Batch:</strong> {student.graduationYear}
      </p>
    </CardContent>
    <CardFooter>
      <Button
        size="sm"
        className="w-full"
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
  <div className="text-center py-12 text-gray-500">
    <GraduationCap className="h-10 w-10 mx-auto text-gray-400 mb-2" />
    {message}
  </div>
);

export default CollegeStudentsPage;
