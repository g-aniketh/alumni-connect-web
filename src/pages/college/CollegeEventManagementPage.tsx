import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Edit, Trash2, Calendar, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import CollegeEventManagementPageSkeleton from "./CollegeEventManagementPageSkeleton";
import type React from "react";

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
    return <CollegeEventManagementPageSkeleton />;
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Event Management
            </h1>
            <p className="text-gray-500 mt-2">
              Create, update, and manage all your institution's events.
            </p>
          </div>
          <Button asChild>
            <Link to="/college/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            {events.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const status = getEventStatus(event.eventDate);
                    return (
                      <TableRow key={event._id}>
                        <TableCell className="font-medium">
                          {event.title}
                        </TableCell>
                        <TableCell>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "Completed" ? "secondary" : "default"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/college/events/edit/${event._id}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(
                                  `/college/events/registrations?eventId=${event._id}`
                                )
                              }
                            >
                              <Users className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEventToDelete(event);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                message="No events created yet."
                cta={{
                  text: "Create Your First Event",
                  link: "/college/events/create",
                }}
                icon={<Calendar className="w-12 h-12 text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the event "{eventToDelete?.title}".
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
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

type EmptyStateProps = {
  message: string;
  cta?: { text: string; link: string };
  icon?: React.ReactNode;
};

const EmptyState = ({ message, cta, icon }: EmptyStateProps) => (
  <div className="text-center py-16 rounded-lg flex flex-col items-center">
    {icon}
    <p className="mt-4 font-medium">{message}</p>
    {cta && (
      <Button asChild className="mt-4">
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

export default CollegeEventManagementPage;
