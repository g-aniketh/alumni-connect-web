import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { collegeAPI } from "../../lib/api";
import type {
  BackendCollege,
  EligibleStudent,
  CreditUpdateResult,
  CreditSyncFilters,
} from "../../types/api";
import {
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

const CollegeCreditsSyncPage = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [college, setCollege] = useState<BackendCollege | null>(null);
  const [eligibleStudents, setEligibleStudents] = useState<EligibleStudent[]>(
    []
  );
  const [syncResults, setSyncResults] = useState<CreditUpdateResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Filters
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [rollNumberStart, setRollNumberStart] = useState<string>("");
  const [rollNumberEnd, setRollNumberEnd] = useState<string>("");
  const [enrollmentYear, setEnrollmentYear] = useState<string>("");
  const [graduationYear, setGraduationYear] = useState<string>("");

  useEffect(() => {
    loadCollegeProfile();
    loadEligibleStudents();
  }, []);

  const loadCollegeProfile = async () => {
    try {
      const response = await collegeAPI.getProfile();
      setCollege(response.college);
    } catch (err) {
      console.error("Failed to load college profile:", err);
    }
  };

  const loadEligibleStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await collegeAPI.getEligibleStudents();
      setEligibleStudents(response.eligible);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load eligible students"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCredits = async () => {
    try {
      setSyncing(true);
      setError("");
      setSuccess("");
      setShowResults(false);

      // Build filters
      const filters: CreditSyncFilters = {};
      if (selectedDepartments.length > 0) {
        filters.departments = selectedDepartments;
      }
      if (selectedDegree !== "all") {
        filters.degree = selectedDegree;
      }
      if (rollNumberStart && rollNumberEnd) {
        // Generate roll numbers array from range
        const rollNumbers: string[] = [];
        const startMatch = rollNumberStart.match(/^(.+?)(\d+)$/);
        const endMatch = rollNumberEnd.match(/^(.+?)(\d+)$/);

        if (startMatch && endMatch && startMatch[1] === endMatch[1]) {
          // Same prefix, generate numeric range
          const prefix = startMatch[1];
          const startNum = parseInt(startMatch[2], 10);
          const endNum = parseInt(endMatch[2], 10);
          const paddingLength = startMatch[2].length;

          for (let i = startNum; i <= endNum; i++) {
            rollNumbers.push(
              `${prefix}${i.toString().padStart(paddingLength, "0")}`
            );
          }
        } else {
          // Different pattern or no numeric suffix, just include start and end
          rollNumbers.push(rollNumberStart);
          if (rollNumberStart !== rollNumberEnd) {
            rollNumbers.push(rollNumberEnd);
          }
        }

        if (rollNumbers.length > 0) {
          filters.rollNumbers = rollNumbers;
        }
      } else if (rollNumberStart) {
        // If only start is provided, treat as single roll number
        filters.rollNumbers = [rollNumberStart];
      }
      if (enrollmentYear) {
        filters.enrollmentYear = parseInt(enrollmentYear, 10);
      }
      if (graduationYear) {
        filters.graduationYear = parseInt(graduationYear, 10);
      }

      const response = await collegeAPI.syncCreditsFromDB(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      setSyncResults(response.results || []);
      setShowResults(true);
      setSuccess(
        `Sync completed! Processed: ${response.processed}, Updated: ${response.updated}, Converted: ${response.converted}, Failed: ${response.failed}`
      );

      // Reload eligible students
      await loadEligibleStudents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sync credits. Make sure your college database URL (dbUrl) is configured."
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleProcessGraduations = async () => {
    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const response = await collegeAPI.processEligibleGraduations();

      setSuccess(
        `Graduations processed! Eligible: ${response.eligible}, Converted: ${response.converted}, Failed: ${response.failed || 0}`
      );

      // Reload eligible students
      await loadEligibleStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process graduations"
      );
    } finally {
      setProcessing(false);
    }
  };

  const clearFilters = () => {
    setSelectedDepartments([]);
    setSelectedDegree("all");
    setRollNumberStart("");
    setRollNumberEnd("");
    setEnrollmentYear("");
    setGraduationYear("");
  };

  return (
    <div className="container mx-auto pt-[13vh] pb-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-primary" />
              <CardTitle>Credits Synchronization</CardTitle>
            </div>
            <CardDescription>
              Sync student credits from your college database and automatically
              convert eligible students to alumni
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </p>
                  {error.includes("dbUrl") && (
                    <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                      Please configure your college database URL in your profile
                      settings.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              </motion.div>
            )}

            {/* Filters */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium">Filters (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departments</Label>
                  <div className="space-y-2">
                    {college?.departments && college.departments.length > 0 ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {college.departments.map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => {
                                if (selectedDepartments.includes(dept)) {
                                  setSelectedDepartments(
                                    selectedDepartments.filter(
                                      (d) => d !== dept
                                    )
                                  );
                                } else {
                                  setSelectedDepartments([
                                    ...selectedDepartments,
                                    dept,
                                  ]);
                                }
                              }}
                              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                                selectedDepartments.includes(dept)
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background hover:bg-accent"
                              }`}
                            >
                              {dept
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </button>
                          ))}
                        </div>
                        {selectedDepartments.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {selectedDepartments.length} department(s)
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No departments available. Please configure departments
                        in your college profile.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Select
                    value={selectedDegree}
                    onValueChange={setSelectedDegree}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Degrees</SelectItem>
                      <SelectItem value="bachelors">Bachelors</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Roll Number Range</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={rollNumberStart}
                      onChange={(e) => setRollNumberStart(e.target.value)}
                      placeholder="Start (e.g., CS21B001)"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      value={rollNumberEnd}
                      onChange={(e) => setRollNumberEnd(e.target.value)}
                      placeholder="End (e.g., CS21B050)"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter start and end roll numbers to sync a range
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Enrollment Year</Label>
                  <Input
                    type="number"
                    value={enrollmentYear}
                    onChange={(e) => setEnrollmentYear(e.target.value)}
                    placeholder="2021"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2025"
                  />
                </div>
              </div>
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSyncCredits}
                disabled={syncing}
                className="flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync Credits from Database
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleProcessGraduations}
                disabled={processing || eligibleStudents.length === 0}
                className="flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    Process Eligible Graduations ({eligibleStudents.length})
                  </>
                )}
              </Button>
            </div>

            {/* Sync Results */}
            {showResults && syncResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="font-medium">Sync Results</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Previous Credits</TableHead>
                        <TableHead>New Credits</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncResults.slice(0, 20).map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.rollNumber}
                          </TableCell>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.previousCredits}</TableCell>
                          <TableCell>{result.newCredits ?? "-"}</TableCell>
                          <TableCell>
                            {result.success ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {result.converted ? "Converted" : "Updated"}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {result.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {syncResults.length > 20 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Showing first 20 results of {syncResults.length} total
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Eligible Students */}
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : eligibleStudents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Eligible for Graduation ({eligibleStudents.length})
                  </h3>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Degree</TableHead>
                        <TableHead>Department</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleStudents.map((student) => (
                        <TableRow key={student.rollNumber}>
                          <TableCell className="font-medium">
                            {student.rollNumber}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Badge variant="default">{student.credits}</Badge>
                          </TableCell>
                          <TableCell>{student.requiredCredits}</TableCell>
                          <TableCell>{student.degree}</TableCell>
                          <TableCell>{student.department}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No students eligible for graduation at the moment
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CollegeCreditsSyncPage;
