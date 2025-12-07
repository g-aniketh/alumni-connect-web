import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { type Alumni, UserRole } from "../../types";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";

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
  viewerRole,
}: AlumniProfileCardProps) => {
  const isAvailable = alumni.mentorshipAvailable === true;
  const isAlumniViewer = viewerRole === UserRole.Alumni;
  const isStudentViewer = viewerRole === UserRole.Student;

  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900 border-2 border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center pb-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-700 ring-2 ring-blue-200 dark:ring-blue-800">
            <AvatarImage src={alumni.avatar} alt={alumni.name} />
            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {alumni.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {alumni.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {alumni.designation} @ {alumni.currentEmployer}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Class of {alumni.graduationYear}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-4">
        {isStudentViewer && (
          <div className="flex justify-center">
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className={
                isAvailable
                  ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:border-green-700 border"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 border"
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
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {alumni.skills.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs font-normal bg-white/50 dark:bg-gray-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                {skill}
              </Badge>
            ))}
            {alumni.skills.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs font-normal bg-white/50 dark:bg-gray-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                +{alumni.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-slate-200 dark:border-slate-700">
        {isAlumniViewer && onConnect ? (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            style={
              isAvailable ? { backgroundColor: "#2563eb", color: "white" } : {}
            }
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isAvailable ? "Request Mentorship" : "Currently Busy"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};
