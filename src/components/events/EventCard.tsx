import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { type AlumniEvent } from "../../types";
import { Calendar, MapPin, Clock, User } from "lucide-react";

interface EventCardProps {
  event: AlumniEvent;
  onRSVP: (event: AlumniEvent) => void;
  isRegistered?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const EventCard = ({
  event,
  onRSVP,
  isRegistered = false,
}: EventCardProps) => {
  // Organizer is now a string (name) from backend, not an ID
  const organizerName =
    typeof event.organizer === "string" ? event.organizer : "Organizer";

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {event.image && (
        <div className="h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge
            variant={event.status === "Upcoming" ? "default" : "secondary"}
          >
            {event.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {event.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {organizerName && (
            <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
              <User className="h-4 w-4" />
              <span className="text-xs">{organizerName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isRegistered ? (
          <div className="w-full text-center">
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
              ✓ Already Registered
            </p>
            <p className="text-xs text-muted-foreground">
              You're all set for this event!
            </p>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => onRSVP(event)}
            disabled={event.status !== "Upcoming"}
          >
            {event.status === "Upcoming" ? "RSVP" : "Event Ended"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
