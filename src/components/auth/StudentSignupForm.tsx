import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collegeAPI } from '../../lib/api';
import { Department } from '../../types';
import { degreeMap, degrees } from './formConstants';

export const StudentSignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [college, setCollege] = useState('');
  const [collegeOther, setCollegeOther] = useState('');
  const [showCollegeOther, setShowCollegeOther] = useState(false);
  const [department, setDepartment] = useState<Department | ''>('');
  const [degree, setDegree] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [colleges, setColleges] = useState<string[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
      console.error('Failed to load colleges:', err);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalCollegeName = showCollegeOther ? collegeOther : college;
      if (!name || !email || !password || !rollNumber || !finalCollegeName || !department || !degree || !enrollmentYear || !graduationYear) {
        throw new Error('Please fill all required fields');
      }
      const signupData = {
        name,
        email,
        password,
        rollNumber,
        collegeName: finalCollegeName,
        department: department as Department,
        degree: degreeMap[degree] || degree.toLowerCase(),
        enrollmentYear: parseInt(enrollmentYear),
        graduationYear: parseInt(graduationYear),
      };
      await signup('Student', signupData);
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
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
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

