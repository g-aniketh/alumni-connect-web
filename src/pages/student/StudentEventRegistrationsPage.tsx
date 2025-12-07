import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { eventsAPI } from "../../lib/api";
import type { BackendEventRegistration, BackendEvent } from "../../types/api";
import {
  Calendar,
  MapPin,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const StudentEventRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<
    BackendEventRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await eventsAPI.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId: string) => {
    if (!window.confirm("Are you sure you want to cancel this registration?")) {
      return;
    }
    try {
      setError("");
      await eventsAPI.cancelRegistration(registrationId);
      await loadRegistrations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel registration"
      );
    }
  };

  const getEvent = (
    registration: BackendEventRegistration
  ): BackendEvent | null => {
    if (typeof registration.eventId === "object") {
      return registration.eventId as BackendEvent;
    }
    return null;
  };

  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "registered":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-200 border">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Registered
          </Badge>
        );
      case "waitlisted":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 border">
            <Clock className="h-3 w-3 mr-1" />
            Waitlisted
          </Badge>
        );
      case "attended":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 border">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Attended
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-200 border">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{formatStatus(status)}</Badge>;
    }
  };

  // Format event date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format event time
  const formatEventTime = (event: BackendEvent) => {
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading registrations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Event Registrations
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View and manage the events you have registered for.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {registrations.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No Event Registrations
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  You have not registered for any events yet.
                </p>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-slate-200 dark:border-slate-700">
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        EVENT
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        DATE
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        LOCATION
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                        STATUS
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-100">
                        ACTIONS
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => {
                      const event = getEvent(reg);
                      if (!event) return null;

                      const locationParts = event.location?.split(" • ") || [];
                      const location =
                        locationParts.length > 1
                          ? locationParts[1]
                          : event.location || "N/A";
                      const time = formatEventTime(event);

                      return (
                        <TableRow
                          key={reg._id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border-b border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <TableCell>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {event.title}
                              </div>
                              {time && (
                                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {time}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                              <Calendar className="h-4 w-4" />
                              {formatEventDate(event.eventDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                              <MapPin className="h-4 w-4" />
                              {location}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(reg.status)}</TableCell>
                          <TableCell className="text-right">
                            {reg.status.toLowerCase() !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-300 dark:border-red-700"
                                onClick={() => void handleCancel(reg._id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentEventRegistrationsPage;
