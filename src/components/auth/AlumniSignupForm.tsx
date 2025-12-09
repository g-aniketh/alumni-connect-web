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
import { degreeMap, degrees, departmentMap } from "./formConstants";
import { SuccessModal } from "../ui/SuccessModal";

export const AlumniSignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [degree, setDegree] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [college, setCollege] = useState("");
  const [linkedInProfile, setLinkedInProfile] = useState("");
  const [colleges, setColleges] = useState<string[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        !degree ||
        !department ||
        !graduationYear ||
        !college
      ) {
        throw new Error("Please fill all required fields");
      }
      const graduationYearNum = parseInt(graduationYear, 10);
      if (isNaN(graduationYearNum)) {
        throw new Error("Invalid graduation year");
      }

      const mappedDepartment =
        departmentMap[department] ||
        department.toLowerCase().replace(/\s+/g, "_");

      const signupData: import("../../types/api").AlumniSignupRequest = {
        name,
        email,
        password,
        graduationYear: graduationYearNum,
        degree: degreeMap[degree] || degree.toLowerCase(),
        collegeName: college,
        department: mappedDepartment,
        linkedInProfile: linkedInProfile.trim() || undefined,
      };
      await signup("Alumni", signupData);
      setShowSuccessModal(true);
      // Navigate after a delay to let user see the success message
      setTimeout(() => {
        navigate("/login?role=alumni");
      }, 2500);
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
        <CardDescription>Join as an Alumni to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
            <Label>Degree</Label>
            <Select onValueChange={setDegree} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select onValueChange={setDepartment} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">
                  Computer Science
                </SelectItem>
                <SelectItem value="Electrical Engineering">
                  Electrical Engineering
                </SelectItem>
                <SelectItem value="Mechanical Engineering">
                  Mechanical Engineering
                </SelectItem>
                <SelectItem value="Civil Engineering">
                  Civil Engineering
                </SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
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
              onChange={(e) => setGraduationYear(e.target.value)}
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
                  colleges.map((c) => (
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
            <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedIn"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={linkedInProfile}
              onChange={(e) => setLinkedInProfile(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Add your LinkedIn profile to help others connect with you.
            </p>
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account Created Successfully!"
        message="Your alumni account has been created. Please log in to complete your profile and start connecting with students and fellow alumni."
      />
    </Card>
  );
};
