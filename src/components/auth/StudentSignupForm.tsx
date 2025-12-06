import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collegeAPI } from "../../lib/api";
import { Department } from "../../types";
import { degreeMap, degrees, departmentMap } from "./formConstants";

export const StudentSignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [degree, setDegree] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [colleges, setColleges] = useState<string[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      const response = await collegeAPI.getAllCollegeNames();
      const collegeNames = response;
      setColleges(collegeNames);
    } catch (err) {
      console.error("Failed to load colleges:", err);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !name ||
        !email ||
        !password ||
        !rollNumber ||
        !college ||
        !department ||
        !degree ||
        !enrollmentYear ||
        !graduationYear
      ) {
        throw new Error("Please fill all required fields");
      }
      const enrollmentYearNum = parseInt(enrollmentYear, 10);
      const graduationYearNum = parseInt(graduationYear, 10);

      if (isNaN(enrollmentYearNum)) {
        throw new Error("Invalid enrollment year");
      }
      if (isNaN(graduationYearNum)) {
        throw new Error("Invalid graduation year");
      }
      if (!department) {
        throw new Error("Department is required");
      }

      // Map frontend Department enum (e.g., "Computer Science") to backend format (e.g., "computer_science")
      const mappedDepartment =
        departmentMap[department] ||
        department.toLowerCase().replace(/\s+/g, "_");

      const signupData: import("../../types/api").StudentSignupRequest = {
        name,
        email,
        password,
        rollNumber,
        collegeName: college,
        department: mappedDepartment,
        degree: degreeMap[degree] || degree.toLowerCase(),
        enrollmentYear: enrollmentYearNum,
        graduationYear: graduationYearNum,
      };
      await signup("Student", signupData);
      alert(
        "Account created successfully! Please check your email and verify your account before logging in."
      );
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join as a Student to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
            <Input
              id="password"
                type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              placeholder="CS21B001"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>College</Label>
            <Select
              onValueChange={setCollege}
              required
              disabled={loadingColleges || colleges.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingColleges
                      ? "Loading colleges..."
                      : colleges.length === 0
                      ? "No colleges registered yet"
                      : "Select College"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {loadingColleges ? (
                  <SelectItem value="loading" disabled>
                    Loading colleges...
                  </SelectItem>
                ) : colleges.length === 0 ? (
                  <SelectItem value="no-colleges" disabled>
                    No colleges registered yet. Please ask your college to sign
                    up first.
                  </SelectItem>
                ) : (
                      colleges.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))
                )}
              </SelectContent>
            </Select>
            {colleges.length === 0 && !loadingColleges && (
            <p className="text-xs text-muted-foreground">
              ⚠️ <strong>Important:</strong> Your college must be registered
                in the system first. Please ask your college administrator to
                sign up before you can create your account.
            </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              onValueChange={v => setDepartment(v as Department)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Department).map(d => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Degree</Label>
            <Select onValueChange={setDegree} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map(d => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollYear">Enrollment Year</Label>
            <Input
              id="enrollYear"
              type="number"
              placeholder="2021"
              min="1950"
              max="2100"
              value={enrollmentYear}
              onChange={e => setEnrollmentYear(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradYearStudent">Expected Graduation Year</Label>
            <Input
              id="gradYearStudent"
              type="number"
              placeholder="2025"
              min="1950"
              max="2100"
              value={graduationYear}
              onChange={e => setGraduationYear(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
