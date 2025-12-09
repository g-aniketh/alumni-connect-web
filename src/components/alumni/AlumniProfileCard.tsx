import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
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
  mentorshipStatus?: string; // e.g., "pending", "active"
  isRequesting?: boolean;
}

export const AlumniProfileCard = React.memo(
  ({
    alumni,
    onRequestMentorship,
    onConnect,
    viewerRole,
    mentorshipStatus,
    isRequesting = false,
  }: AlumniProfileCardProps) => {
    const isAvailable = alumni.mentorshipAvailable === true;
    const isAlumniViewer = viewerRole === UserRole.Alumni;
    const isStudentViewer = viewerRole === UserRole.Student;
    const status = (mentorshipStatus || "").toLowerCase();
    const isPending = status === "pending";
    const isActive = status === "active";
    const requestDisabled =
      isRequesting || isPending || isActive || !isAvailable;
    const requestLabel = isActive
      ? "Already mentoring you"
      : isPending
        ? "Request pending"
        : isAvailable
          ? "Request Mentorship"
          : "Currently Busy";

    return (
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="h-full"
      >
        <Card className="flex flex-col h-full bg-[#E3F2FD] border-[#1E88E5]/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                <AvatarImage src={alumni.avatar} alt={alumni.name} />
                <AvatarFallback className="text-xl bg-white text-[#1565C0]">
                  {alumni.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-[#1565C0]">
                  {alumni.name}
                </h3>
                <p className="text-sm text-[#333333]">{alumni.designation}</p>
                <p className="text-xs text-[#333333]/80">
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
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-[#F5F5F5] text-[#333333]"
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
              <p className="text-xs font-semibold text-[#1E88E5]">SKILLS</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {alumni.skills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-white border-[#1E88E5]/30 text-[#1565C0]"
                  >
                    {skill}
                  </Badge>
                ))}
                {alumni.skills.length > 3 && (
                  <Badge
                    variant="outline"
                    className="bg-white border-[#1E88E5]/30 text-[#1565C0]"
                  >
                    +{alumni.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-[#1E88E5]/20">
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
                disabled={requestDisabled}
                onClick={() => onRequestMentorship(alumni)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isRequesting ? "Sending..." : requestLabel}
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);
