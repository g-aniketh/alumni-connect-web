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
import { UserRole, Department } from '../types';
import { User, Mail, Building2, GraduationCap, MapPin, Briefcase, Save, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    ...(user?.role === UserRole.Alumni && {
      currentEmployer: (user as any).currentEmployer || '',
      designation: (user as any).designation || '',
      graduationYear: (user as any).graduationYear?.toString() || '',
      degree: (user as any).degree || '',
      department: (user as any).department || '',
      skills: (user as any).skills?.join(', ') || '',
      mentorshipAvailable: (user as any).mentorshipAvailable || false,
    }),
    ...(user?.role === UserRole.Student && {
      rollNumber: (user as any).rollNumber || '',
      enrollmentYear: (user as any).enrollmentYear?.toString() || '',
      degree: (user as any).degree || '',
      department: (user as any).department || '',
      skills: (user as any).skills?.join(', ') || '',
    }),
    ...(user?.role === UserRole.College && {
      website: (user as any).website || '',
      location: (user as any).location || '',
      establishedYear: (user as any).establishedYear?.toString() || '',
    }),
  });

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

  const handleSave = () => {
    // In real app, would submit to API
    console.log('Profile Updated:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      ...(user?.role === UserRole.Alumni && {
        currentEmployer: (user as any).currentEmployer || '',
        designation: (user as any).designation || '',
        graduationYear: (user as any).graduationYear?.toString() || '',
        degree: (user as any).degree || '',
        department: (user as any).department || '',
        skills: (user as any).skills?.join(', ') || '',
        mentorshipAvailable: (user as any).mentorshipAvailable || false,
      }),
      ...(user?.role === UserRole.Student && {
        rollNumber: (user as any).rollNumber || '',
        enrollmentYear: (user as any).enrollmentYear?.toString() || '',
        degree: (user as any).degree || '',
        department: (user as any).department || '',
        skills: (user as any).skills?.join(', ') || '',
      }),
      ...(user?.role === UserRole.College && {
        website: (user as any).website || '',
        location: (user as any).location || '',
        establishedYear: (user as any).establishedYear?.toString() || '',
      }),
    });
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
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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
                  {user.role === UserRole.Alumni && (user as any).mentorshipAvailable && (
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
                        {(user as any).currentEmployer || 'Not specified'}
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
                        {(user as any).designation || 'Not specified'}
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
                        {(user as any).graduationYear || 'Not specified'}
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
                      <div className="text-sm">{(user as any).degree || 'Not specified'}</div>
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
                    <div className="text-sm">{(user as any).department || 'Not specified'}</div>
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
                      {((user as any).skills || []).map((skill: string) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  )}
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
                    <div className="text-sm">{(user as any).rollNumber || 'Not specified'}</div>
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
                    <div className="text-sm">{(user as any).enrollmentYear || 'Not specified'}</div>
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
                    <div className="text-sm">{(user as any).degree || 'Not specified'}</div>
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
                    <div className="text-sm">{(user as any).department || 'Not specified'}</div>
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
                    {((user as any).skills || []).map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                )}
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
                      {(user as any).website || 'Not specified'}
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
                      {(user as any).location || 'Not specified'}
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
                  <div className="text-sm">{(user as any).establishedYear || 'Not specified'}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

