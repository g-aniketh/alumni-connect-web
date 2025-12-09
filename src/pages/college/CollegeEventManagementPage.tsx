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
    <div className="bg-[#E3F2FD] min-h-screen">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
              Event Management
            </h1>
            <p className="text-[#333333] mt-2">
              Create, update, and manage all your institution's events.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
          >
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

        <Card className="bg-white border-[#1E88E5]/30">
          <CardContent className="pt-6">
            {events.length > 0 ? (
              <Table>
                <TableHeader className="bg-[#E3F2FD]">
                  <TableRow className="border-[#1E88E5]/20 hover:bg-[#E3F2FD]/80">
                    <TableHead className="text-[#1565C0]">Event</TableHead>
                    <TableHead className="text-[#1565C0]">Date</TableHead>
                    <TableHead className="text-[#1565C0]">Location</TableHead>
                    <TableHead className="text-[#1565C0]">Status</TableHead>
                    <TableHead className="text-right text-[#1565C0]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const status = getEventStatus(event.eventDate);
                    return (
                      <TableRow
                        key={event._id}
                        className="border-[#1E88E5]/10 hover:bg-[#E3F2FD]/30"
                      >
                        <TableCell className="font-medium text-[#1565C0]">
                          {event.title}
                        </TableCell>
                        <TableCell className="text-[#333333]">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-[#333333]">
                          {event.location}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "Completed" ? "secondary" : "default"
                            }
                            className={
                              status === "Completed"
                                ? "bg-gray-100 text-gray-600"
                                : status === "Today"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-[#E3F2FD] text-[#1565C0] border-[#1E88E5]/30"
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
                              className="text-[#1E88E5] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                              onClick={() =>
                                navigate(`/college/events/edit/${event._id}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#1E88E5] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
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
                icon={<Calendar />}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="border-[#1E88E5]/20">
            <DialogHeader>
              <DialogTitle className="text-[#1565C0]">
                Are you sure?
              </DialogTitle>
              <DialogDescription className="text-[#333333]/80">
                This will permanently delete the event "{eventToDelete?.title}".
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleting}
                className="border-[#1E88E5]/30 text-[#1E88E5] hover:bg-[#E3F2FD]"
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
  <div className="text-center py-16 rounded-lg flex flex-col items-center text-[#333333]/60">
    <div className="text-[#1E88E5]/40 mb-4 [&>svg]:w-12 [&>svg]:h-12">
      {icon}
    </div>
    <p className="font-medium">{message}</p>
    {cta && (
      <Button
        asChild
        className="mt-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white"
      >
        <Link to={cta.link}>{cta.text}</Link>
      </Button>
    )}
  </div>
);

export default CollegeEventManagementPage;
