import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { type Alumni, UserRole } from '../../types';
import { UserPlus, CheckCircle2, XCircle } from 'lucide-react';

interface AlumniProfileCardProps {
  alumni: Alumni;
  onRequestMentorship?: (alumni: Alumni) => void;
  onConnect?: (alumni: Alumni) => void;
  viewerRole?: UserRole;
}

export const AlumniProfileCard = ({ 
  alumni, 
  onRequestMentorship, 
  onConnect,
  viewerRole 
}: AlumniProfileCardProps) => {
  const isAvailable = alumni.mentorshipAvailable === true;
  const isAlumniViewer = viewerRole === UserRole.Alumni;
  const isStudentViewer = viewerRole === UserRole.Student;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-3">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={alumni.avatar} alt={alumni.name} />
            <AvatarFallback className="text-lg">
              {alumni.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{alumni.name}</h3>
            <p className="text-sm text-muted-foreground">
              {alumni.designation} @ {alumni.currentEmployer}
            </p>
            <p className="text-xs text-muted-foreground">
              Class of {alumni.graduationYear}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isStudentViewer && (
        <div className="flex justify-center">
          <Badge 
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable 
              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            }
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Open for Mentorship
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Busy
              </>
            )}
          </Badge>
        </div>
        )}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Skills</p>
          <div className="flex flex-wrap gap-1">
            {alumni.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {alumni.skills.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{alumni.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isAlumniViewer && onConnect ? (
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => onConnect(alumni)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        ) : isStudentViewer && onRequestMentorship ? (
        <Button 
          className="w-full" 
          variant={isAvailable ? "default" : "outline"}
          disabled={!isAvailable}
          onClick={() => onRequestMentorship(alumni)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isAvailable ? 'Request Mentorship' : 'Currently Busy'}
        </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

