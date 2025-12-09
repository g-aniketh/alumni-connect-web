import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { type AlumniEvent } from "../../types";
import type { BackendEvent } from "../../types/api";
import { Clock, Users } from "lucide-react";

interface EventCardProps {
  event: AlumniEvent;
  backendEvent?: BackendEvent;
  onRSVP: (event: AlumniEvent) => void;
  isRegistered?: boolean;
}

// Get event tags based on title and description
const getEventTags = (title: string, description: string): string[] => {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const tags: string[] = [];

  if (
    lowerTitle.includes("networking") ||
    lowerDesc.includes("networking") ||
    lowerTitle.includes("meetup")
  ) {
    tags.push("Networking");
  }
  if (
    lowerTitle.includes("career") ||
    lowerDesc.includes("career") ||
    lowerTitle.includes("resume") ||
    lowerTitle.includes("workshop")
  ) {
    tags.push("Career Development");
  }
  if (
    lowerTitle.includes("tech") ||
    lowerDesc.includes("technology") ||
    lowerTitle.includes("ai") ||
    lowerTitle.includes("software")
  ) {
    tags.push("Technology");
  }
  if (
    lowerTitle.includes("lecture") ||
    lowerDesc.includes("lecture") ||
    lowerTitle.includes("talk")
  ) {
    tags.push("Lecture");
  }
  if (
    lowerTitle.includes("homecoming") ||
    lowerTitle.includes("gala") ||
    lowerTitle.includes("social")
  ) {
    tags.push("Social");
  }
  if (lowerTitle.includes("popular") || lowerDesc.includes("popular")) {
    tags.push("Popular");
  }

  // Determine if virtual or in-person
  const location = lowerTitle + " " + lowerDesc;
  if (
    location.includes("online") ||
    location.includes("zoom") ||
    location.includes("virtual") ||
    location.includes("webinar")
  ) {
    tags.push("Virtual");
  } else {
    tags.push("In-person");
  }

  return tags.length > 0 ? tags : ["Event"];
};

// Format date for display
const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = date.getDate();
  return { month, day };
};

// Format time range
const formatTimeRange = (startTime?: string, endTime?: string) => {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  if (startTime) {
    return `${startTime}`;
  }
  return null;
};

// Get attendance count (placeholder - would need API call)
const getAttendanceCount = (_eventId: string): string => {
  // This would ideally come from the backend
  // For now, return a placeholder
  return "120 attending";
};

export const EventCard = ({
  event,
  backendEvent,
  onRSVP,
  isRegistered = false,
}: EventCardProps) => {
  const { month, day } = formatEventDate(event.date);
  const tags = getEventTags(event.title, event.description || "");
  const timeRange = backendEvent
    ? formatTimeRange(backendEvent.startTime, backendEvent.endTime)
    : null;
  const attendance = backendEvent
    ? getAttendanceCount(backendEvent._id)
    : "120 attending";

  // Split location to get venue name
  const locationParts = event.location?.split(" • ") || [event.location || ""];
  const venue = locationParts[0] || event.location || "Location TBD";

  return (
    <Card className="bg-white border-2 border-[#1E88E5]/20 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Date Block */}
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center min-w-[60px] p-3 bg-[#E3F2FD] rounded-lg border border-[#1E88E5]/30">
              <div className="text-xs font-semibold text-[#1E88E5] mb-1">
                {month}
              </div>
              <div className="text-2xl font-bold text-[#1565C0]">{day}</div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#1565C0] mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-[#333333] mb-3">{venue}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 2).map((tag, idx) => {
                const isPopular = tag === "Popular";
                const isSocial = tag === "Social";
                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`text-xs ${
                      isPopular || isSocial
                        ? "bg-[#E3F2FD] text-[#1565C0] border-[#1E88E5]/30"
                        : "bg-[#E3F2FD] text-[#1565C0] border-[#1E88E5]/30"
                    }`}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>

            {/* Time & Attendance */}
            <div className="flex flex-col gap-1 text-sm text-[#333333]/80">
              {timeRange && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-[#1E88E5]" />
                  <span>{timeRange}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-[#1E88E5]" />
                <span>{attendance}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {isRegistered ? (
              <Button
                className="bg-[#F5F5F5] text-[#333333] hover:bg-gray-200 cursor-default"
                disabled
              >
                Registered
              </Button>
            ) : (
              <Button
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white shadow-md"
                onClick={() => onRSVP(event)}
                disabled={event.status !== "Upcoming"}
              >
                Register
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
