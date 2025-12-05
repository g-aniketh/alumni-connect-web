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
import { Department, type Student } from '../../types';
import { OnlinePresenceSection } from './OnlinePresenceSection';
import type { StudentFormData } from '../../types/profile';

interface StudentProfileSectionProps {
  user: Student;
  isEditing: boolean;
  formData: StudentFormData;
  onFormDataChange: (data: StudentFormData) => void;
}

export const StudentProfileSection = ({ user, isEditing, formData, onFormDataChange }: StudentProfileSectionProps) => {
  return (
    <>
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
                  value={formData.rollNumber || ''}
                  onChange={(e) => onFormDataChange({ ...formData, rollNumber: e.target.value })}
                />
              ) : (
                <div className="text-sm">{user.rollNumber || 'Not specified'}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentYear">Enrollment Year</Label>
              {isEditing ? (
                <Input
                  id="enrollmentYear"
                  type="number"
                  value={formData.enrollmentYear || ''}
                  onChange={(e) => onFormDataChange({ ...formData, enrollmentYear: e.target.value })}
                />
              ) : (
                <div className="text-sm">{user.enrollmentYear || 'Not specified'}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      <OnlinePresenceSection user={user} isEditing={isEditing} formData={formData} onFormDataChange={onFormDataChange} />
    </>
  );
};

