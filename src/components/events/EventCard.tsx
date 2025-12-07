import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { type AlumniEvent } from "../../types";
import type { BackendEvent } from "../../types/api";
import { MapPin, Clock, Users } from "lucide-react";

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
const getAttendanceCount = (eventId: string): string => {
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
    <Card className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Date Block */}
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center min-w-[60px] p-3 bg-slate-100 dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {month}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {day}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {venue}
            </p>

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
                        ? "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-700"
                        : "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                    }`}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>

            {/* Time & Attendance */}
            <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
              {timeRange && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{timeRange}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{attendance}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {isRegistered ? (
              <Button
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-default"
                disabled
              >
                Registered
              </Button>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
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
