import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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

const StudentEventRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<BackendEventRegistration[]>([]);
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
        err instanceof Error ? err.message : "Failed to load registrations",
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
        err instanceof Error ? err.message : "Failed to cancel registration",
      );
    }
  };

  const getEvent = (
    registration: BackendEventRegistration,
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

  return (
    <div className="container py-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          My Event Registrations
        </h1>
        <p className="text-muted-foreground">
          View and manage the events you have registered for.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground">Loading registrations...</p>
          ) : registrations.length === 0 ? (
            <p className="text-muted-foreground">
              You have not registered for any events yet.
            </p>
          ) : (
            <div className="rounded-md border">
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
                  {registrations.map((reg) => {
                    const event = getEvent(reg);
                    return (
                      <TableRow key={reg._id}>
                        <TableCell>{event?.title ?? "Event"}</TableCell>
                        <TableCell>
                          {event
                            ? new Date(event.eventDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>{event?.location ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatStatus(reg.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reg.status.toLowerCase() === "cancelled"}
                            onClick={() => void handleCancel(reg._id)}
                          >
                            Cancel
                          </Button>
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
  );
};

export default StudentEventRegistrationsPage;


