import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type {
  BackendEvent,
  BackendEventRegistration,
  BackendStudent,
} from "../../types/api";
import { eventsAPI } from "../../lib/api";

interface RegistrationManagementProps {
  event: BackendEvent | null;
}

const registrationStatuses = [
  "registered",
  "waitlisted",
  "attended",
  "cancelled",
] as const;

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status.toLowerCase()) {
    case "registered":
      return "secondary";
    case "waitlisted":
      return "outline";
    case "attended":
      return "default";
    case "cancelled":
      return "outline";
    default:
      return "outline";
  }
};

export const RegistrationManagement = ({ event }: RegistrationManagementProps) => {
  const [registrations, setRegistrations] = useState<BackendEventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (event?._id) {
      void loadRegistrations(event._id);
    } else {
      setRegistrations([]);
    }
  }, [event?._id]);

  const loadRegistrations = async (eventId: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await eventsAPI.getEventRegistrations(eventId);
      setRegistrations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    registrationId: string,
    status: (typeof registrationStatuses)[number],
  ) => {
    try {
      setError("");
      await eventsAPI.updateRegistrationStatus(registrationId, status);
      if (event?._id) {
        await loadRegistrations(event._id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

  const getParticipant = (
    registration: BackendEventRegistration,
  ): BackendStudent | null => {
    if (typeof registration.participantId === "object") {
      return registration.participantId as BackendStudent;
    }
    return null;
  };

  if (!event) {
    return (
      <p className="text-sm text-muted-foreground">
        Select an event to view its registrations.
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading registrations...</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {registrations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No registrations for this event yet.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => {
                const participant = getParticipant(reg);
                return (
                  <TableRow key={reg._id}>
                    <TableCell>{participant?.name ?? "Student"}</TableCell>
                    <TableCell>{participant?.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(reg.status)}>
                        {formatStatus(reg.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      {registrationStatuses.map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={
                            reg.status.toLowerCase() === status
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            void handleStatusChange(reg._id, status)
                          }
                        >
                          {formatStatus(status)}
                        </Button>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};


