import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { type Alumni, UserRole } from "../../types";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface AlumniProfileCardProps {
  alumni: Alumni;
  onRequestMentorship?: (alumni: Alumni) => void;
  onConnect?: (alumni: Alumni) => void;
  viewerRole?: UserRole;
}

export const AlumniProfileCard = React.memo(
  ({
    alumni,
    onRequestMentorship,
    onConnect,
    viewerRole,
  }: AlumniProfileCardProps) => {
    const isAvailable = alumni.mentorshipAvailable === true;
    const isAlumniViewer = viewerRole === UserRole.Alumni;
    const isStudentViewer = viewerRole === UserRole.Student;

    return (
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        whileHover={{ scale: 1.03 }}
        className="h-full"
      >
        <Card className="flex flex-col h-full bg-white transition-shadow hover:shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={alumni.avatar} alt={alumni.name} />
                <AvatarFallback className="text-xl">
                  {alumni.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{alumni.name}</h3>
                <p className="text-sm text-gray-500">{alumni.designation}</p>
                <p className="text-xs text-gray-400">
                  @{alumni.currentEmployer} | Class of {alumni.graduationYear}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-2">
            {isStudentViewer && (
              <div className="flex justify-center">
                <Badge
                  variant={isAvailable ? "default" : "secondary"}
                  className={
                    isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-stone-100 text-stone-800"
                  }
                >
                  {isAvailable ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {isAvailable ? "Open for Mentorship" : "Unavailable"}
                </Badge>
              </div>
            )}
            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold text-gray-400">SKILLS</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {alumni.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
                {alumni.skills.length > 3 && (
                  <Badge variant="outline">
                    +{alumni.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t">
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
                {isAvailable ? "Request Mentorship" : "Currently Busy"}
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);
