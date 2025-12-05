import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Building2, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { Department, type Alumni } from '../../types';
import { OnlinePresenceSection } from './OnlinePresenceSection';

import type { AlumniFormData } from '../../types/profile';

interface AlumniProfileSectionProps {
  user: Alumni;
  isEditing: boolean;
  formData: AlumniFormData;
  onFormDataChange: (data: AlumniFormData) => void;
}

export const AlumniProfileSection = ({ user, isEditing, formData, onFormDataChange }: AlumniProfileSectionProps) => {
  return (
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
                  value={formData.currentEmployer || ''}
                  onChange={(e) => onFormDataChange({ ...formData, currentEmployer: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {user.currentEmployer || 'Not specified'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              {isEditing ? (
                <Input
                  id="designation"
                  value={formData.designation || ''}
                  onChange={(e) => onFormDataChange({ ...formData, designation: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {user.designation || 'Not specified'}
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
                  value={formData.graduationYear || ''}
                  onChange={(e) => onFormDataChange({ ...formData, graduationYear: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  {user.graduationYear || 'Not specified'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              {isEditing ? (
                <Input
                  id="degree"
                  value={formData.degree || ''}
                  onChange={(e) => onFormDataChange({ ...formData, degree: e.target.value })}
                />
              ) : (
                <div className="text-sm">{user.degree || 'Not specified'}</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            {isEditing ? (
              <Select
                value={formData.department || ''}
                onValueChange={(value) => onFormDataChange({ ...formData, department: value })}
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
              <div className="text-sm">{user.department || 'Not specified'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            {isEditing ? (
              <Textarea
                id="skills"
                value={formData.skills || ''}
                onChange={(e) => onFormDataChange({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, Node.js, Python"
                rows={3}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(user.skills || []).map((skill: string) => (
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
                value={formData.bio || ''}
                onChange={(e) => onFormDataChange({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <div className="text-sm">{user.bio || 'Not specified'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => onFormDataChange({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {user.location || 'Not specified'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <OnlinePresenceSection user={user} isEditing={isEditing} formData={formData} onFormDataChange={(data) => onFormDataChange(data as AlumniFormData)} />
    </>
  );
};

