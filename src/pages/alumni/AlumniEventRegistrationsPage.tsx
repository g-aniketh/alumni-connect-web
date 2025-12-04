import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import type { BackendEvent } from "../../types/api";
import { eventsAPI } from "../../lib/api";
import { RegistrationManagement } from "../../components/events/RegistrationManagement";

const AlumniEventRegistrationsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await eventsAPI.getMyOrganized();
      setEvents(data);
      setSelectedEvent((prev) => prev ?? data[0] ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your events",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Event Registrations
        </h1>
        <p className="text-muted-foreground">
          View and manage registrations for events you are organizing.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading your events...</p>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground">
          You are not organizing any events yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Your Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {events.map((event) => (
                  <Button
                    key={event._id}
                    variant={
                      selectedEvent?._id === event._id ? "default" : "outline"
                    }
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium truncate">
                        {event.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedEvent ? selectedEvent.title : "Select an event"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RegistrationManagement event={selectedEvent} />
              </CardContent>
            </Card>
          </main>
        </div>
      )}
    </div>
  );
};

export default AlumniEventRegistrationsPage;


