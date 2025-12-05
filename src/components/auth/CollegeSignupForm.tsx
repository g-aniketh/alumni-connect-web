import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Department } from '../../types';
import { degrees } from './formConstants';

export const CollegeSignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password || !address || !establishedYear || selectedDepartments.length === 0 || selectedDegrees.length === 0) {
        throw new Error('Please fill all required fields');
      }
      const signupData = {
        name,
        email,
        password,
        address,
        establishedYear: parseInt(establishedYear),
        departments: selectedDepartments,
        degreesOffered: selectedDegrees,
        website: website.trim() || undefined,
      };
      await signup('College', signupData);
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
        <CardDescription>Join as a College to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">College Name</Label>
            <Input
              id="name"
              placeholder="Tech Institute"
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

