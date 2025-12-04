import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { UserRole, Department, type Alumni, type Student, type College } from '../types';
import { User, Mail, Building2, GraduationCap, MapPin, Briefcase, Save, Edit2, X, Linkedin, Github, Globe, FileText } from 'lucide-react';
import { alumniAPI, studentAPI, collegeAPI } from '../lib/api';
import { ChangePasswordForm } from '../components/auth/ChangePasswordForm';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const getInitialFormData = () => {
    if (!user) return { name: '', email: '' };
    
    const base = { name: user.name || '', email: user.email || '' };
    
    if (user.role === UserRole.Alumni) {
      const alumni = user as Alumni;
      return {
        ...base,
        currentEmployer: alumni.currentEmployer || '',
        designation: alumni.designation || '',
        graduationYear: alumni.graduationYear?.toString() || '',
        degree: alumni.degree || '',
        department: alumni.department || '',
        skills: alumni.skills?.join(', ') || '',
        mentorshipAvailable: alumni.mentorshipAvailable || false,
        linkedInProfile: alumni.linkedInProfile || '',
        githubProfile: alumni.githubProfile || '',
        personalWebsite: alumni.personalWebsite || '',
        resumeUrl: alumni.resumeUrl || '',
        bio: alumni.bio || '',
        location: alumni.location || '',
      };
    } else if (user.role === UserRole.Student) {
      const student = user as Student;
      return {
        ...base,
        rollNumber: student.rollNumber || '',
        enrollmentYear: student.enrollmentYear?.toString() || '',
        degree: student.degree || '',
        department: student.department || '',
        skills: student.skills?.join(', ') || '',
        linkedInProfile: student.linkedInProfile || '',
        githubProfile: student.githubProfile || '',
        personalWebsite: student.personalWebsite || '',
        resumeUrl: student.resumeUrl || '',
        bio: student.bio || '',
      };
    } else {
      const college = user as College;
      return {
        ...base,
        website: college.website || '',
        location: college.location || '',
        establishedYear: college.establishedYear?.toString() || '',
      };
    }
  };

  const [formData, setFormData] = useState(getInitialFormData());

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <a href="/login">Log In</a>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setError('');
      setLoading(true);
      
      // Prepare update data based on user role
      let updateData: Record<string, unknown> = {};
      
      if (user.role === UserRole.Alumni) {
        const alumni = user as Alumni;
        updateData = {
          name: formData.name,
          email: formData.email,
          currentDesignation: formData.designation,
          currentEmployer: formData.currentEmployer,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : alumni.graduationYear,
          degree: formData.degree,
          department: formData.department,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          mentorshipAvailable: formData.mentorshipAvailable,
          linkedInProfile: formData.linkedInProfile?.trim() || undefined,
          githubProfile: formData.githubProfile?.trim() || undefined,
          personalWebsite: formData.personalWebsite?.trim() || undefined,
          resumeUrl: formData.resumeUrl?.trim() || undefined,
          bio: formData.bio?.trim() || undefined,
          location: formData.location?.trim() || undefined,
        };
        await alumniAPI.updateProfile(user.id, updateData);
      } else if (user.role === UserRole.Student) {
        const student = user as Student;
        updateData = {
          name: formData.name,
          email: formData.email,
          rollNumber: formData.rollNumber,
          enrollmentYear: formData.enrollmentYear ? parseInt(formData.enrollmentYear) : student.enrollmentYear,
          degree: formData.degree,
          department: formData.department,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          linkedInProfile: formData.linkedInProfile?.trim() || undefined,
          githubProfile: formData.githubProfile?.trim() || undefined,
          personalWebsite: formData.personalWebsite?.trim() || undefined,
          resumeUrl: formData.resumeUrl?.trim() || undefined,
          bio: formData.bio?.trim() || undefined,
        };
        await studentAPI.updateProfile(user.id, updateData);
      } else if (user.role === UserRole.College) {
        const college = user as College;
        updateData = {
          name: formData.name,
          email: formData.email,
          website: formData.website,
          address: formData.location, // Backend uses 'address' not 'location'
          establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : college.establishedYear,
        };
        await collegeAPI.updateProfile(updateData);
      }
      
      // Refresh user data
      await refreshUser();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData(getInitialFormData());
    setIsEditing(false);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{user.role}</Badge>
                  {user.role === UserRole.Alumni && (user as Alumni).mentorshipAvailable && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Open for Mentorship
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your account and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {user.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Information */}
        {user.role === UserRole.Alumni && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Your career and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentEmployer">Current Company</Label>
                    {isEditing ? (
                      <Input
                        id="currentEmployer"
                        value={formData.currentEmployer}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentEmployer: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).currentEmployer || 'Not specified'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    {isEditing ? (
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).designation || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    {isEditing ? (
                      <Input
                        id="graduationYear"
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).graduationYear || 'Not specified'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    {isEditing ? (
                      <Input
                        id="degree"
                        value={formData.degree}
                        onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                      />
                    ) : (
                      <div className="text-sm">{(user as Alumni).degree || 'Not specified'}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Department).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm">{(user as Alumni).department || 'Not specified'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  {isEditing ? (
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="e.g., React, Node.js, Python"
                      rows={3}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {((user as Alumni).skills || []).map((skill: string) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  ) : (
                    <div className="text-sm">{(user as Alumni).bio || 'Not specified'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., San Francisco, CA"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {(user as Alumni).location || 'Not specified'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Presence</CardTitle>
                <CardDescription>Your professional links and portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    {isEditing ? (
                      <Input
                        id="linkedIn"
                        type="url"
                        value={formData.linkedInProfile}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedInProfile: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).linkedInProfile ? (
                          <a href={(user as Alumni).linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Profile
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    {isEditing ? (
                      <Input
                        id="github"
                        type="url"
                        value={formData.githubProfile}
                        onChange={(e) => setFormData(prev => ({ ...prev, githubProfile: e.target.value }))}
                        placeholder="https://github.com/yourusername"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).githubProfile ? (
                          <a href={(user as Alumni).githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Profile
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        type="url"
                        value={formData.personalWebsite}
                        onChange={(e) => setFormData(prev => ({ ...prev, personalWebsite: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).personalWebsite ? (
                          <a href={(user as Alumni).personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume URL</Label>
                    {isEditing ? (
                      <Input
                        id="resume"
                        type="url"
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                        placeholder="https://example.com/resume.pdf"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {(user as Alumni).resumeUrl ? (
                          <a href={(user as Alumni).resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Resume
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === UserRole.Student && (
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your academic and enrollment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  {isEditing ? (
                    <Input
                      id="rollNumber"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    />
                  ) : (
                    <div className="text-sm">{(user as Student).rollNumber || 'Not specified'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                  {isEditing ? (
                    <Input
                      id="enrollmentYear"
                      type="number"
                      value={formData.enrollmentYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, enrollmentYear: e.target.value }))}
                    />
                  ) : (
                    <div className="text-sm">{(user as Student).enrollmentYear || 'Not specified'}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  {isEditing ? (
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                    />
                  ) : (
                    <div className="text-sm">{(user as Student).degree || 'Not specified'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Department).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm">{(user as Student).department || 'Not specified'}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                {isEditing ? (
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g., React, Node.js, Python"
                    rows={3}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {((user as Student).skills || []).map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                ) : (
                  <div className="text-sm">{(user as Student).bio || 'Not specified'}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Online Presence</CardTitle>
              <CardDescription>Your professional links and portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  {isEditing ? (
                    <Input
                      id="linkedIn"
                      type="url"
                      value={formData.linkedInProfile}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedInProfile: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      {(user as Student).linkedInProfile ? (
                        <a href={(user as Student).linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Profile
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  {isEditing ? (
                    <Input
                      id="github"
                      type="url"
                      value={formData.githubProfile}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubProfile: e.target.value }))}
                      placeholder="https://github.com/yourusername"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      {(user as Student).githubProfile ? (
                        <a href={(user as Student).githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Profile
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      type="url"
                      value={formData.personalWebsite}
                      onChange={(e) => setFormData(prev => ({ ...prev, personalWebsite: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {(user as Student).personalWebsite ? (
                        <a href={(user as Student).personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume URL</Label>
                  {isEditing ? (
                    <Input
                      id="resume"
                      type="url"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                      placeholder="https://example.com/resume.pdf"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {(user as Student).resumeUrl ? (
                        <a href={(user as Student).resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Resume
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === UserRole.College && (
          <Card>
            <CardHeader>
              <CardTitle>Institution Information</CardTitle>
              <CardDescription>Your college or university details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {(user as College).website || 'Not specified'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {(user as College).location || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                {isEditing ? (
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm">{(user as College).establishedYear || 'Not specified'}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <ChangePasswordForm onSuccess={() => {
          // Optionally refresh user data or show success message
        }} />
      </div>
    </div>
  );
};

export default ProfilePage;

