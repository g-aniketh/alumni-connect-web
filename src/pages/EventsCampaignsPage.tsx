import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { EventCard } from "../components/events/EventCard";
import { CampaignCard } from "../components/events/CampaignCard";
import { DonationModal } from "../components/events/DonationModal";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { type AlumniEvent } from "../types";
import { campaignsAPI, eventsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import type {
  BackendCampaign,
  BackendEvent,
  BackendEventRegistration,
} from "../types/api";
import { Plus } from "lucide-react";

const EventsCampaignsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] =
    useState<BackendCampaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState<string[]>([]); // Array of event IDs the user is registered for
  const [myEvents, setMyEvents] = useState<BackendEvent[]>([]);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);

  useEffect(() => {
    loadEvents();
    loadCampaigns();
    if (user?.role === UserRole.Student) {
      loadMyRegistrations();
    }
    if (
      user &&
      (user.role === UserRole.Alumni || user.role === UserRole.College)
    ) {
      loadMyEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      // Get filtered events (college context if authenticated, or all if not)
      if (user) {
        const response = await eventsAPI.getFiltered({ upcoming: true });
        const eventsList = Array.isArray(response)
          ? response
          : response.events || [];
        setEvents(eventsList);
      } else {
        const allEvents = await eventsAPI.getAll();
        // Filter for upcoming events
        const now = new Date();
        const upcoming = allEvents.filter(e => new Date(e.eventDate) >= now);
        setEvents(upcoming);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      // Get all campaigns (not just active ones) so newly created campaigns are visible
      // We'll filter them on the frontend to show active and upcoming
      const allCampaigns = await campaignsAPI.getAll();

      // Sort by endDate (upcoming/active first)
      const sortedCampaigns = allCampaigns.sort((a, b) => {
        const dateA = new Date(a.endDate).getTime();
        const dateB = new Date(b.endDate).getTime();
        return dateA - dateB;
      });

      setCampaigns(sortedCampaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      console.error("Failed to load campaigns:", err);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const loadMyRegistrations = async () => {
    try {
      if (user?.role === UserRole.Student) {
        const registrations = await eventsAPI.getMyRegistrations();
        // Extract event IDs from registrations
        const eventIds = registrations.map((reg: BackendEventRegistration) => {
          // Handle both populated and non-populated eventId
          if (
            typeof reg.eventId === "object" &&
            reg.eventId &&
            "_id" in reg.eventId
          ) {
            return reg.eventId._id;
          }
          return typeof reg.eventId === "string"
            ? reg.eventId
            : String(reg.eventId);
        });
        setMyRegistrations(eventIds);
      }
    } catch (err) {
      // Silently fail - registrations are optional
      console.error("Failed to load registrations:", err);
    }
  };

  const loadMyEvents = async () => {
    try {
      setLoadingMyEvents(true);
      const myOrganizedEvents = await eventsAPI.getMyOrganized();
      setMyEvents(myOrganizedEvents);
    } catch (err) {
      console.error("Failed to load my events:", err);
    } finally {
      setLoadingMyEvents(false);
    }
  };

  // Transform BackendEvent to AlumniEvent for components
  const transformEvent = (backendEvent: BackendEvent): AlumniEvent => {
    const organizerName =
      typeof backendEvent.organizedBy.organizerId === "object"
        ? backendEvent.organizedBy.organizerId.name
        : "Organizer";

    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      date: backendEvent.eventDate,
      location: backendEvent.location,
      organizer: organizerName,
      status: "Upcoming",
      image: backendEvent.eventBannerUrl || "",
    };
  };

  const handleRSVP = (backendEvent: BackendEvent) => {
    setSelectedEvent(backendEvent);
    setIsRSVPDialogOpen(true);
  };

  const handleDonate = (campaign: BackendCampaign) => {
    setSelectedCampaign(campaign);
    setIsDonationModalOpen(true);
  };

  // Transform BackendCampaign to Campaign for components
  const transformCampaign = (backendCampaign: BackendCampaign) => {
    const now = new Date();
    const startDate = new Date(backendCampaign.startDate);
    const endDate = new Date(backendCampaign.endDate);

    // Determine status: Upcoming (not started), Ongoing (active), or Completed (ended)
    let status: "Ongoing" | "Completed" | "Upcoming";
    if (now < startDate) {
      status = "Upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "Ongoing";
    } else {
      status = "Completed";
    }

    const organizerName =
      typeof backendCampaign.createdBy === "object"
        ? backendCampaign.createdBy.name
        : "College";

    return {
      id: backendCampaign._id,
      title: backendCampaign.title,
      description: backendCampaign.description,
      organizer: organizerName,
      targetAmount: backendCampaign.targetAmount || 0,
      totalRaised: backendCampaign.totalRaised || 0,
      status,
      deadline: backendCampaign.endDate,
      image: undefined, // Backend doesn't have image field
    };
  };

  const handleRSVPSubmit = async () => {
    if (!selectedEvent || !user) return;

    try {
      setError("");
      const eventId = selectedEvent._id;
      await eventsAPI.register({ eventId });
      setIsRSVPDialogOpen(false);
      setSelectedEvent(null);
      alert("Successfully registered for the event!");
      // Reload events and registrations to update registration status
      await loadEvents();
      if (user?.role === UserRole.Student) {
        await loadMyRegistrations();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register for event"
      );
    }
  };

  const canCreateEvents =
    user && (user.role === UserRole.Alumni || user.role === UserRole.College);
  const canCreateCampaigns = user && user.role === UserRole.College;
  const createEventPath =
    user?.role === UserRole.Alumni
      ? "/alumni/events/create"
      : "/college/events/create";

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
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Events & Campaigns
            </h1>
            <p className="text-muted-foreground">
              Stay connected through events and support fundraising initiatives.
            </p>
          </div>
          <div className="flex gap-2">
            {canCreateEvents && (
              <Button asChild>
                <Link to={createEventPath}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            )}
            {canCreateCampaigns && (
              <Button asChild>
                <Link to="/college/campaigns/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Tabs defaultValue="events" className="w-full">
        <TabsList
          className={`grid w-full ${
            canCreateEvents ? "max-w-2xl grid-cols-3" : "max-w-md grid-cols-2"
          }`}
        >
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          {canCreateEvents && (
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          )}
          <TabsTrigger value="campaigns">Fundraising Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(backendEvent => {
                const event = transformEvent(backendEvent);
                const isRegistered =
                  user?.role === UserRole.Student &&
                  myRegistrations.includes(backendEvent._id);
                return (
                  <EventCard
                    key={backendEvent._id}
                    event={event}
                    onRSVP={() => handleRSVP(backendEvent)}
                    isRegistered={isRegistered}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No upcoming events</p>
              <p className="text-sm">Check back later for new events.</p>
            </div>
          )}
        </TabsContent>

        {canCreateEvents && (
          <TabsContent value="my-events" className="mt-6">
            {loadingMyEvents ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading your events...
              </div>
            ) : myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map(backendEvent => {
                  const event = transformEvent(backendEvent);
                  return (
                    <div
                      key={backendEvent._id}
                      className="border rounded-lg p-4"
                    >
                      <EventCard
                        event={event}
                        onRSVP={() => handleRSVP(backendEvent)}
                        isRegistered={false}
                      />
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" asChild className="flex-1">
                          <Link
                            to={
                              user?.role === UserRole.Alumni
                                ? `/alumni/events/edit/${backendEvent._id}`
                                : `/college/events/edit/${backendEvent._id}`
                            }
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                          <Link
                            to={
                              user?.role === UserRole.Alumni
                                ? `/alumni/events/registrations?eventId=${backendEvent._id}`
                                : `/college/events/registrations?eventId=${backendEvent._id}`
                            }
                          >
                            View Registrations
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium mb-2">
                  No events organized yet
                </p>
                <p className="text-sm mb-4">
                  Start by creating your first event
                </p>
                <Button asChild>
                  <Link to={createEventPath}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="campaigns" className="mt-6">
          {campaignsLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading campaigns...</p>
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(backendCampaign => {
                  const campaign = transformCampaign(backendCampaign);
                  // Show all campaigns (upcoming, active, and recently completed)
                  return (
                    <CampaignCard
                      key={backendCampaign._id}
                      campaign={campaign}
                      onDonate={() => handleDonate(backendCampaign)}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No campaigns found</p>
              <p className="text-sm">
                Check back later for new fundraising initiatives.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* RSVP Dialog */}
      <Dialog open={isRSVPDialogOpen} onOpenChange={setIsRSVPDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP to Event</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <>
                  Confirm your attendance for{" "}
                  <strong>{selectedEvent.title || "this event"}</strong>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="mb-4 p-3 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            {!user ? (
              <p className="text-sm text-muted-foreground">
                Please log in as a student to register for events.
              </p>
            ) : user.role !== UserRole.Student ? (
              <p className="text-sm text-muted-foreground">
                Only students can register for events.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your registration will be recorded. You will receive a
                confirmation email shortly.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRSVPDialogOpen(false);
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRSVPSubmit}
              disabled={!user || user.role !== UserRole.Student}
            >
              Confirm Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donation Modal */}
      <DonationModal
        campaign={selectedCampaign}
        open={isDonationModalOpen}
        onOpenChange={setIsDonationModalOpen}
      />
    </div>
  );
};

export default EventsCampaignsPage;
