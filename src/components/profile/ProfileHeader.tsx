import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { UserRole } from '../../types';
import { Card, CardHeader } from '../ui/card';

interface ProfileHeaderProps {
  user: { name: string; role: UserRole; avatar?: string; mentorshipAvailable?: boolean };
  isEditing: boolean;
  formData: Record<string, any>;
  onFormDataChange: (data: Record<string, any>) => void;
}

export const ProfileHeader = ({ user, isEditing, formData, onFormDataChange }: ProfileHeaderProps) => {
  return (
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
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                className="text-2xl font-bold mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold">{user.name}</h2>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{user.role}</Badge>
              {user.role === UserRole.Alumni && user.mentorshipAvailable && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Open for Mentorship
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

