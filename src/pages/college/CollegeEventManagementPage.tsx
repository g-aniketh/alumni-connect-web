import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { eventsAPI } from "../../lib/api";
import type { BackendEvent } from "../../types/api";
import {
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CollegeEventManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [eventToDelete, setEventToDelete] = useState<BackendEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await eventsAPI.getFiltered({ by: "college" });
      const eventsList = Array.isArray(response)
        ? response
        : ((response as { events?: BackendEvent[] }).events ?? []);
      setEvents(eventsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      setDeleting(true);
      await eventsAPI.delete(eventToDelete._id);
      await loadEvents();
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      alert("Event deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const getEventStatus = (eventDate: string): string => {
    const now = new Date();
    const date = new Date(eventDate);
    if (date < now) return "Completed";
    if (date.toDateString() === now.toDateString()) return "Today";
    return "Upcoming";
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">
              Manage your college's events, view registrations, and update event
              details.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <Link to="/college/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/college/events/registrations">View Registrations</Link>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No events organized yet
                </p>
                <p className="text-sm mb-4">
                  Start by creating your first event.
                </p>
                <Button asChild>
                  <Link to="/college/events/create">
                    Create Your First Event
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const organizerName =
                    typeof event.organizedBy.organizerId === "object"
                      ? event.organizedBy.organizerId.name
                      : "Organizer";
                  const status = getEventStatus(event.eventDate);

                  return (
                    <TableRow key={event._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {organizerName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.eventDate).toLocaleDateString()}
                          {event.startTime && (
                            <span className="text-muted-foreground">
                              {" "}
                              at {event.startTime}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "Completed" ? "secondary" : "default"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/college/events/edit/${event._id}`)
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEventToDelete(event);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/college/events/registrations?eventId=${event._id}`
                              )
                            }
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/events?eventId=${event._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{eventToDelete?.title}"? This
                action cannot be undone and will also delete all associated
                registrations.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setEventToDelete(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CollegeEventManagementPage;
