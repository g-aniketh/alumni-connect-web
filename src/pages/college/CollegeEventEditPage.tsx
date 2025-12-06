import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { eventsAPI } from "../../lib/api";
import type { BackendEvent } from "../../types/api";

const CollegeEventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [event, setEvent] = useState<BackendEvent | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    eventBannerUrl: string;
  }>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    eventBannerUrl: "",
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");
      const eventData = await eventsAPI.getById(id!);
      setEvent(eventData);

      // Format date for input (YYYY-MM-DD)
      const eventDate = new Date(eventData.eventDate);
      const formattedDate = eventDate.toISOString().split("T")[0];

      setFormData({
        title: eventData.title,
        description: eventData.description,
        date: formattedDate,
        startTime: eventData.startTime || "",
        endTime: eventData.endTime || "",
        location: eventData.location,
        eventBannerUrl: eventData.eventBannerUrl || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: formData.date,
        startTime: formData.startTime || "00:00",
        endTime: formData.endTime || "23:59",
        location: formData.location,
        eventBannerUrl: formData.eventBannerUrl || undefined,
      };

      await eventsAPI.update(id, eventData);
      alert("Event updated successfully!");
      navigate("/college/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Event not found</p>
          <Button onClick={() => navigate("/college/events")} className="mt-4">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground">
          Update the details of your event.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Update the information about your event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Career Development Workshop"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Event Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the event, agenda, and what attendees can expect..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Main Auditorium, Online (Zoom)"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventBannerUrl">
                Event Banner Image URL (Optional)
              </Label>
              <Input
                id="eventBannerUrl"
                type="url"
                placeholder="https://example.com/event-image.jpg"
                value={formData.eventBannerUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventBannerUrl: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/college/events")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeEventEditPage;
