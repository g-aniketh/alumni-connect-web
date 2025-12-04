import { useState, useEffect } from "react";
import { UserRole, Department } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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

interface AuthFormProps {
  role: UserRole;
  isLoginDefault?: boolean;
}

// Map frontend degree display to backend enum values
const degreeMap: Record<string, string> = {
  "B.Tech": "bachelors",
  "M.Tech": "masters",
  "B.Sc": "bachelors",
  "M.Sc": "masters",
  MBA: "masters",
  PhD: "phd",
};

const degrees = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "MBA", "PhD"];

// Map frontend department display to backend enum values
const departmentMap: Record<string, string> = {
  "Computer Science": "computer_science",
  "Electrical Engineering": "electrical_engineering",
  "Mechanical Engineering": "mechanical_engineering",
  "Civil Engineering": "civil_engineering",
  Business: "business_administration",
  Arts: "arts",
  Science: "science",
};

export const AuthForm = ({ role, isLoginDefault = true }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(isLoginDefault);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  // Common State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Role Specific State
  const [department, setDepartment] = useState<Department | "">("");
  const [graduationYear, setGraduationYear] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [graduationYearStudent, setGraduationYearStudent] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [collegeOther, setCollegeOther] = useState("");
  const [showCollegeOther, setShowCollegeOther] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);

  // Fetch colleges from backend when component mounts (only for signup)
  useEffect(() => {
    if (!isLogin && (role === UserRole.Alumni || role === UserRole.Student)) {
      loadColleges();
    }
  }, [isLogin, role]);

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      const collegeNames = await collegeAPI.getAllCollegeNames();
      setColleges(collegeNames);
    } catch (err) {
      console.error("Failed to load colleges:", err);
      // Keep empty array if fetch fails - user can still use "Others" option
      setColleges([]);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(role, email, password);
        navigate("/dashboard");
      } else {
        // Signup
        if (role === UserRole.Alumni) {
          if (
            !name ||
            !email ||
            !password ||
            !department ||
            !graduationYear ||
            !degree ||
            !college
          ) {
            throw new Error("Please fill all required fields");
          }
          const signupData = {
            name,
            email,
            password,
            graduationYear: parseInt(graduationYear),
            degree: degreeMap[degree] || degree.toLowerCase(),
            collegeName: college,
            department:
              departmentMap[department] ||
              department.toLowerCase().replace(/\s+/g, "_"),
          };
          await signup(role, signupData);
        } else if (role === UserRole.Student) {
          const finalCollegeName = showCollegeOther ? collegeOther : college;
          if (
            !name ||
            !email ||
            !password ||
            !rollNumber ||
            !finalCollegeName ||
            !enrollmentYear ||
            !department ||
            !degree ||
            !graduationYearStudent
          ) {
            throw new Error("Please fill all required fields");
          }
          const signupData = {
            name,
            email,
            password,
            rollNumber,
            collegeName: finalCollegeName,
            enrollmentYear: parseInt(enrollmentYear),
            department:
              departmentMap[department] ||
              department.toLowerCase().replace(/\s+/g, "_"),
            degree: degreeMap[degree] || degree.toLowerCase(),
            graduationYear: parseInt(graduationYearStudent),
          };
          await signup(role, signupData);
        } else if (role === UserRole.College) {
          if (
            !name ||
            !email ||
            !password ||
            !address ||
            !establishedYear ||
            selectedDepartments.length === 0 ||
            selectedDegrees.length === 0
          ) {
            throw new Error("Please fill all required fields");
          }
          const signupData = {
            name,
            email,
            password,
            address,
            establishedYear: parseInt(establishedYear),
            departments: selectedDepartments.map(
              d => departmentMap[d] || d.toLowerCase().replace(/\s+/g, "_")
            ),
            degreesOffered: selectedDegrees.map(
              d => degreeMap[d] || d.toLowerCase()
            ),
          };
          await signup(role, signupData);
        } else {
          throw new Error("Invalid role");
        }
        // After successful signup, show message and redirect to login
        alert("Account created successfully! Please log in.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const toggleDegree = (deg: string) => {
    setSelectedDegrees(prev =>
      prev.includes(deg) ? prev.filter(d => d !== deg) : [...prev, deg]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? `Welcome back, ${role}!`
            : `Join as a ${role} to get started.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup - Name Field */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">
                {role === UserRole.College ? "College Name" : "Full Name"}
              </Label>
              <Input
                id="name"
                placeholder={
                  role === UserRole.College ? "Tech Institute" : "John Doe"
                }
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Common - Email */}
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

          {/* Common - Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Specific Fields for Signup */}
          {!isLogin && role === UserRole.Alumni && (
            <>
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
                <Label htmlFor="gradYear">Graduation Year</Label>
                <Input
                  id="gradYear"
                  type="number"
                  placeholder="2023"
                  min="1950"
                  max="2100"
                  value={graduationYear}
                  onChange={e => setGraduationYear(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>College</Label>
                <Select
                  onValueChange={setCollege}
                  required
                  disabled={loadingColleges}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingColleges
                          ? "Loading colleges..."
                          : "Select College"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.length === 0 && !loadingColleges ? (
                      <SelectItem value="no-colleges" disabled>
                        No colleges found. Use "Others" option below.
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
              </div>
            </>
          )}

          {!isLogin && role === UserRole.Student && (
            <>
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
                  onValueChange={value => {
                    if (value === "other") {
                      setShowCollegeOther(true);
                      setCollege("");
                    } else {
                      setShowCollegeOther(false);
                      setCollege(value);
                      setCollegeOther("");
                    }
                  }}
                  required
                  disabled={loadingColleges}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingColleges
                          ? "Loading colleges..."
                          : "Select College"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingColleges ? (
                      <SelectItem value="loading" disabled>
                        Loading colleges...
                      </SelectItem>
                    ) : (
                      <>
                        {colleges.length > 0 ? (
                          colleges.map(c => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-colleges" disabled>
                            No colleges registered yet
                          </SelectItem>
                        )}
                        <SelectItem value="other">
                          Others (Enter manually)
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {showCollegeOther && (
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="collegeOther">College Name</Label>
                    <Input
                      id="collegeOther"
                      placeholder="Enter your college name"
                      value={collegeOther}
                      onChange={e => setCollegeOther(e.target.value)}
                      required
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  ⚠️ <strong>Important:</strong> Your college must be registered
                  in the system first. If you select "Others" and enter a
                  college name, make sure the college has already signed up with
                  the exact same name. If you get a "College not found" error,
                  ask your college administrator to sign up first.
                </p>
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
                <Label htmlFor="gradYearStudent">
                  Expected Graduation Year
                </Label>
                <Input
                  id="gradYearStudent"
                  type="number"
                  placeholder="2025"
                  min="1950"
                  max="2100"
                  value={graduationYearStudent}
                  onChange={e => setGraduationYearStudent(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {!isLogin && role === UserRole.College && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 University Ave, City, State 12345"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  placeholder="1990"
                  min="1800"
                  max="2100"
                  value={establishedYear}
                  onChange={e => setEstablishedYear(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Departments Offered</Label>
                <div className="space-y-2 border rounded-md p-3">
                  {Object.values(Department).map(dept => (
                    <div key={dept} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`dept-${dept}`}
                        checked={selectedDepartments.includes(dept)}
                        onChange={() => toggleDepartment(dept)}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`dept-${dept}`}
                        className="font-normal cursor-pointer"
                      >
                        {dept}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedDepartments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Select at least one department
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Degrees Offered</Label>
                <div className="space-y-2 border rounded-md p-3">
                  {degrees.map(deg => (
                    <div key={deg} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`deg-${deg}`}
                        checked={selectedDegrees.includes(deg)}
                        onChange={() => toggleDegree(deg)}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`deg-${deg}`}
                        className="font-normal cursor-pointer"
                      >
                        {deg}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedDegrees.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Select at least one degree
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://college.edu"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            className="underline hover:text-primary"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
