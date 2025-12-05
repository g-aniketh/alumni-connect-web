import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Linkedin, Github, Globe, FileText } from 'lucide-react';
import type { Alumni, Student } from '../../types';

interface OnlinePresenceSectionProps {
  user: Alumni | Student;
  isEditing: boolean;
  formData: Record<string, any>;
  onFormDataChange: (data: Record<string, any>) => void;
}

export const OnlinePresenceSection = ({ user, isEditing, formData, onFormDataChange }: OnlinePresenceSectionProps) => {
  return (
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
                value={formData.linkedInProfile || ''}
                onChange={(e) => onFormDataChange({ ...formData, linkedInProfile: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                {user.linkedInProfile ? (
                  <a href={user.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                value={formData.githubProfile || ''}
                onChange={(e) => onFormDataChange({ ...formData, githubProfile: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4 text-muted-foreground" />
                {user.githubProfile ? (
                  <a href={user.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                value={formData.personalWebsite || ''}
                onChange={(e) => onFormDataChange({ ...formData, personalWebsite: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {user.personalWebsite ? (
                  <a href={user.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                value={formData.resumeUrl || ''}
                onChange={(e) => onFormDataChange({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://example.com/resume.pdf"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {user.resumeUrl ? (
                  <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
  );
};

