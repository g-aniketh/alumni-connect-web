import { useState } from "react";
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

interface AuthFormProps {
  role: UserRole;
  isLoginDefault?: boolean;
}

const colleges = [
  "Indian Institute of Technology, Bombay",
  "Indian Institute of Technology, Delhi",
  "National Institute of Technology, Trichy",
  "Delhi Technological University",
  "Anna University",
  "Vellore Institute of Technology",
];

const degrees = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "MBA", "PhD"];

export const AuthForm = ({ role, isLoginDefault = true }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(isLoginDefault);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Common State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Role Specific State
  const [department, setDepartment] = useState<Department | "">("");
  const [graduationYear, setGraduationYear] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      role,
      email,
      password,
      ...(!isLogin && {
        name,
        ...(role === UserRole.Alumni && {
          department,
          graduationYear,
          degree,
          college,
        }),
        ...(role === UserRole.Student && {
          department,
          rollNumber,
          enrollmentYear,
          degree, // Assuming students also declare degree
        }),
        ...(role === UserRole.College && {
          website,
          location,
          collegeName: name, // Use name as college name
        }),
      }),
    };

    console.log("Form Submitted:", formData);

    // Simulate successful auth
    login(role, email);
    navigate("/");
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
                  value={graduationYear}
                  onChange={e => setGraduationYear(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>College</Label>
                <Select onValueChange={setCollege} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
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
                <Label htmlFor="enrollYear">Enrollment Year</Label>
                <Input
                  id="enrollYear"
                  type="number"
                  placeholder="2021"
                  value={enrollmentYear}
                  onChange={e => setEnrollmentYear(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {!isLogin && role === UserRole.College && (
            <>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://college.edu"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full">
              {isLogin ? "Log In" : "Sign Up"}
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
