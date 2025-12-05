import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin } from 'lucide-react';
import type { College } from '../../types';

interface CollegeProfileSectionProps {
  user: College;
  isEditing: boolean;
  formData: Record<string, any>;
  onFormDataChange: (data: Record<string, any>) => void;
}

export const CollegeProfileSection = ({ user, isEditing, formData, onFormDataChange }: CollegeProfileSectionProps) => {
  return (
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
                value={formData.website || ''}
                onChange={(e) => onFormDataChange({ ...formData, website: e.target.value })}
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {user.website || 'Not specified'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => onFormDataChange({ ...formData, location: e.target.value })}
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {user.location || 'Not specified'}
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
              value={formData.establishedYear || ''}
              onChange={(e) => onFormDataChange({ ...formData, establishedYear: e.target.value })}
            />
          ) : (
            <div className="text-sm">{user.establishedYear || 'Not specified'}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

